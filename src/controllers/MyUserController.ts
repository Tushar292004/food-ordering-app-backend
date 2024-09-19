import {Request, Response} from 'express';
import User from '../models/user';


const createCurrentUser = async (req: Request, res: Response) => {
    //1. check if the user exist
    //2. Create the user if not exist
    //3. Return the user object to the calling client

    try {
        const { auth0Id } = req.body;
        // will try to find a user with auth0Id in database
        const existingUser = await User.findOne({auth0Id});

        if(existingUser){
            return res.status(200).send();
        }

        // creating user if doesnot exist
        const newUser = new User(req.body);
        await newUser.save();

        // returning new user as object creation success status
        res.status(201).json(newUser.toObject());

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Creating User"})
    }
};

const updateCurrentUser = async(req: Request, res: Response) => {
    try {
        const {name, addressLine1, country, city} = req.body;
        //finding user with userId
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city  = city;
        user.country  = country;

        await user.save();
        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error updating user"})
    }
}

const getCurrentUser = async(req: Request, res: Response) => {
    try {
        const currentUser = await User.findOne({_id: req.userId})

        if(!currentUser){
            return res.status(404).json({message: "User not found"})
        }

        res.json(currentUser);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong"})
    }
}

export default {
    createCurrentUser,
    updateCurrentUser,
    getCurrentUser,
}