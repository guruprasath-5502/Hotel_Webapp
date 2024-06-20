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

    return res.status(200).json({ status: true, data: hotels });
  } catch (error) {
    next(new Error('Error fetching hotel'));
  }
};

const getSingleHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.user._id.toString(),
    });

    return res.status(200).json({ status: true, data: hotel });
  } catch (error) {
    next(new Error('Error fetching hotel'));
  }
};

const updateHotel = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.hotelId.toString();
  try {
    const updatedHotel: HotelType = req.body;

    const imageFiles = req.files as Express.Multer.File[];

    const uploadPromises = imageFiles.map(
      async (image) => await uploadImage(image)
    );

    const imageUrls = await Promise.all(uploadPromises);

    updatedHotel.lastUpdated = new Date();

    updatedHotel.imageUrls = [...(updatedHotel.imageUrls || []), ...imageUrls];

    const hotel = await Hotel.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id.toString(),
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      const err = new Error('Hotel Not Found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    return res.status(201).json({ status: true, data: hotel });
  } catch (error) {
    next(new Error('Error updating hotel'));
  }
};

const allHotels = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hotels = await Hotel.find().sort('-lastUpdated');

    return res.status(201).json({ status: true, data: hotels });
  } catch (error) {
    next(new Error('Oops! Something went wrong'));
  }
};

const hotelController = {
  createHotel,
  getHotel,
  getSingleHotel,
  updateHotel,
  allHotels,
};

export default hotelController;
