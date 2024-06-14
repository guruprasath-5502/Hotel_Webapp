import { NextFunction, Request, Response } from 'express';
import uploadImage from '../../utils/uploadImage';
import Hotel, { HotelType } from '../../database/models/hotel';

const createHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    const uploadPromises = imageFiles.map(
      async (image) => await uploadImage(image)
    );

    const imageUrls = await Promise.all(uploadPromises);

    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.user._id.toString();

    const hotel = new Hotel(newHotel);
    await hotel.save();

    return res
      .status(201)
      .json({ status: true, data: { hotel: hotel.toObject() } });
  } catch (error) {
    next(new Error('Error creating hotel'));
  }
};

const getHotel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await Hotel.find({ userId: req.user._id.toString() });

    return res.status(201).json({ status: true, data: hotels });
  } catch (error) {
    next(new Error('Error fetching hotel'));
  }
};

const hotelController = { createHotel, getHotel };

export default hotelController;
