import { Request, Response } from 'express';

const health = async (req: Request, res: Response) => {
  return res
    .status(200)
    .json({ status: true, data: { message: 'health OK!' } });
};

export default health;
