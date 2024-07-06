import express from "express";
import { authenticatedUser } from "../middlewares/user.middleware.js";
import {
  addAddress,
  checkPassword,
  editAddress,
  getUserAddresses,
  removeAddress,
  updatePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/checkPassword", authenticatedUser, checkPassword);
router.put("/updatePassword", authenticatedUser, updatePassword);
router.get("/addresses", authenticatedUser, getUserAddresses);
router.post("/addAddress", authenticatedUser, addAddress);
router.delete('/deleteAddress/:id',authenticatedUser,removeAddress);
router.put('/editAddress',authenticatedUser,editAddress);

export default router;
