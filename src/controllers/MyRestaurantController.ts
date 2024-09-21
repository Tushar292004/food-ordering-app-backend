import { Request, Response } from "express";
import Restaurant from '../models/restaurant';
import cloudinary from "cloudinary";
import mongoose from "mongoose";

const createMyRestaurant = async (req: Request, res: Response) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });

        if (existingRestaurant) {
            return res
                .status(409)
                .json({ message: "User restaurant already exists." });
        }

        const image = req.file as Express.Multer.File;
        //coneverting image to base64 string
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        // uploading image to cloudinary
        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        // adding new restaurant in databse
        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        //linkling current loged in user with reastaurant record
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date();
        await restaurant.save();

        res.status(201).send(restaurant);

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Somethimg went wrong" });
    }
}

export default {
    createMyRestaurant,
};