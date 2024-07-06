import { Request, Response } from "express";
import mongoose, { Mongoose } from "mongoose";
import { User } from "../models/users.model.js";
import bcrypt from "bcrypt";
import { Address } from "../models/addresses.model.js";
import { City } from "../models/cities.model.js";

const checkPassword = async (req: Request, res: Response) => {
  try {
    const { currPassword }: { currPassword: string } = req.body;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid userid",
      });
      return;
    }
    const isCorrect = await bcrypt.compare(currPassword, user.password);
    if (!isCorrect) {
      res.status(400).json({
        success: false,
        message: "incorrect password",
      });
      return;
    }
    res.status(200).json({
      success: true,
      isCorrect,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { newPassword }: { newPassword: string } = req.body;
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid userid",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );
    const newLoggedInUser = await User.findOne({ _id: user._id });
    res.status(200).json({
      success: true,
      newLoggedInUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid userId",
      });
      return;
    }
    const addresses = await Address.find({ userId: user._id }).populate(
      "cityId"
    );
    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log(error);
  }
};

const addAddress = async (req: Request, res: Response) => {
  try {
    const { cityName, addressLine1, addressLine2, pinCode } = req.body;
    const userId = req.userId;
    const city = await City.findOne({ cityName });
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "invalid userId",
      });
      return;
    }
    if (!city) {
      res.status(400).json({
        success: false,
        message: "Invalid city name",
      });
      return;
    }

    const address = await Address.create({
      addressLine1,
      addressLine2,
      cityId: city?._id,
      pin_code: parseInt(pinCode),
      userId: user?._id,
    });
    const newAddress = await Address.findOne({ _id: address._id }).populate(
      "cityId"
    );
    res.status(200).json({
      success: true,
      newAddress,
    });
  } catch (error) {
    console.log(error);
  }
};

const removeAddress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);
    if (!address) {
      res.status(400).json({
        success: false,
        message: "invalid address id",
      });
      return;
    }
    await Address.deleteOne({ _id: address._id });
    res.status(200).json({
      success: true,
      message: "Successfully deleted address",
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  checkPassword,
  updatePassword,
  getUserAddresses,
  addAddress,
  removeAddress,
};
