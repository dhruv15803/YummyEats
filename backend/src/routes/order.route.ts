import express from "express";
import { authenticatedUser } from "../middlewares/user.middleware.js";
import {
  getMyOrders,
  getRestaurantOrders,
  orderCheckout,
  updateOrderStatus,
  webHookHandler,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/checkout", authenticatedUser, orderCheckout);
router.post("/webhook", webHookHandler);
router.get("/getOrders/:sortByOrder", authenticatedUser, getMyOrders);
router.get("/getRestaurantOrders/:id", authenticatedUser, getRestaurantOrders);
router.put('/updateStatus',authenticatedUser,updateOrderStatus);

export default router;
