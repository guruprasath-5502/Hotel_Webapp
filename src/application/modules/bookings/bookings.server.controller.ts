import { NextFunction, Request, Response } from 'express';
import Stripe from 'stripe';
import Hotel from '../../database/models/hotel';
import mongoose from 'mongoose';

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const paymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      const err = new Error('Hotel Not Found');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await STRIPE.paymentIntents.create({
      amount: totalCost * 100,
      currency: 'inr',
      metadata: { hotelId, userId: req.user._id.toString() },
    });

    if (!paymentIntent.client_secret) {
      const err = new Error('Error Creating Payment Intent');
      Object.assign(err, { statusCode: 500 });
      return next(err);
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };
    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    next(new Error('Something Went Wrong!'));
  }
};

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paymentIntentId = req.body.paymentIntentId;

    const paymentIntent = await STRIPE.paymentIntents.retrieve(
      paymentIntentId as string
    );

    if (!paymentIntent) {
      const err = new Error('Payment Intent Not Found');
      Object.assign(err, { statusCode: 500 });
      return next(err);
    }

    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.user._id.toString()
    ) {
      const err = new Error('Payment Intent Miss Match');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }
    if (paymentIntent.status !== 'succeeded') {
      const err = new Error(
        `Payment Intent not succeeded. Status : ${paymentIntent.status}`
      );
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    const newBooking = {
      ...req.body,
      userId: req.user._id,
    };

    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      {
        $push: { bookings: newBooking },
      },
      { new: true }
    );

    if (!hotel) {
      const err = new Error('Hotel Not Found');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    await hotel.save();

    return res.status(200).json({ status: true, data: hotel });
  } catch (error) {
    console.log(error);

    next(new Error('Something Went Wrong!'));
  }
};

const bookingsController = { paymentIntent, createBooking };

export default bookingsController;
