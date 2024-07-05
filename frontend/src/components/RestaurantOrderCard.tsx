import { Order } from "@/types";
import React, { SetStateAction, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { backendUrl } from "@/App";
import { Button } from "./ui/button";

type RestaurantOrderCardProps = {
  order: Order;
  restaurantOrders: Order[];
  setRestaurantOrders: React.Dispatch<SetStateAction<Order[]>>;
};

const RestaurantOrderCard = ({
  order,
  restaurantOrders,
  setRestaurantOrders,
}: RestaurantOrderCardProps) => {
  const [orderStatus, setOrderStatus] = useState<
    "PLACED" | "PAID" | "IN PROGRESS" | "DELIVERED" | "OUT FOR DELIVERY"
  >(order.orderStatus);
  const statuses = [
    "PLACED",
    "PAID",
    "IN PROGRESS",
    "DELIVERED",
    "OUT FOR DELIVERY",
  ];

  const updateOrderStatus = async () => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/order/updateStatus`,
        {
          id: order._id,
          status: orderStatus,
        },
        { withCredentials: true }
      );
      console.log(response);
      const newOrders = restaurantOrders.map((restaurantOrder) => {
        if (restaurantOrder._id === order._id) {
          return {
            ...restaurantOrder,
            orderStatus: orderStatus,
          };
        } else {
          return restaurantOrder;
        }
      });
      setRestaurantOrders(newOrders);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col border rounded-lg shadow-md p-4">
        {order.orderItems.map((orderItem) => {
          return (
            <div key={orderItem._id} className="flex justify-between">
              <div className="font-semibold flex flex-wrap">
                {orderItem.itemName}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">₹</span>
                <span>{orderItem.itemPrice}</span>
              </div>
              <div className="flex items-centerr gap-1">
                <span className="font-semibold">Qty</span>
                <span>{orderItem.itemQty}</span>
              </div>
            </div>
          );
        })}
        <div className="flex items-center gap-2 my-2">
          <span className="text-xl font-semibold">Total:</span>
          <span>₹{order.orderTotal / 100}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="font-semibold">Shipping address:</span>
          <span>
            {order.shipping_address.cityId.cityName[0].toUpperCase() +
              order.shipping_address.cityId.cityName.slice(1)}
            ,
          </span>
          <span>{order.shipping_address.addressLine1},</span>
          <span>{order.shipping_address.addressLine2}</span>
        </div>
        <div className="flex items-center gap-2 my-2">
          <span>Change status</span>
          <Select
            value={orderStatus}
            onValueChange={(
              value:
                | "PLACED"
                | "PAID"
                | "IN PROGRESS"
                | "DELIVERED"
                | "OUT FOR DELIVERY"
            ) => setOrderStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status, i) => {
                return (
                  <SelectItem key={i} value={status}>
                    {status}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {order.orderStatus!==orderStatus && (
          <Button onClick={updateOrderStatus}>Save changes</Button>
        )}
      </div>
    </>
  );
};

export default RestaurantOrderCard;
