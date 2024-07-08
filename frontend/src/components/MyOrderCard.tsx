import { Order } from "@/types";
import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type MyOrderCardProps = {
  order: Order;
};

const MyOrderCard = ({ order }: MyOrderCardProps) => {
  const [isShowItems, setIsShowItems] = useState<boolean>(false);

  const convertToDate = (timestamp: Date) => {
    const date = new Date(timestamp).toLocaleDateString();
    const time = new Date(timestamp).toLocaleTimeString();
    return `${date} ${time}`;
  };

  return (
    <>
      <div className="flex flex-col border rounded-lg shadow-md p-4 gap-2">
        <div className="flex justify-between">
          <Link
            className=" text-2xl font-semibold hover:underline hover:underline-offset-4"
            to={`/restaurants/menu/${order.restaurant_id._id}`}
          >
            {order.restaurant_id.restaurantName}
          </Link>
          <span>{convertToDate(order.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              <CiLocationOn />
              <span className="font-semibold">Shipping address:</span>
            </div>
            <span className="text-lg">
              {order.shipping_address.cityId.cityName[0].toUpperCase() +
                order.shipping_address.cityId.cityName.slice(1)}
            </span>
          </div>
          <div>{order.shipping_address.addressLine1}</div>
          <div>{order.shipping_address.addressLine2}</div>
        </div>
        <div className="flex items-center gap-2">
          <span>STATUS: </span>
          <span>{order.orderStatus}</span>
        </div>
        <Button onClick={() => setIsShowItems(!isShowItems)} variant="link">
          {isShowItems ? "Hide order items" : "Show order items"}
        </Button>
        {isShowItems && (
          <>
            {order.orderItems.map((item) => {
              return (
                <div
                  key={item._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-wrap font-semibold">
                    {item.itemName}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>₹</span>
                    <span>{item.itemPrice}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Qty</span>
                    <span>{item.itemQty}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold">Order total</span>
          <span>₹{order.orderTotal / 100}</span>
        </div>
      </div>
    </>
  );
};

export default MyOrderCard;
