import { backendUrl } from "@/App";
import RestaurantOrderCard from "@/components/RestaurantOrderCard";
import { Order } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const RestaurantOrders = () => {
  const { id } = useParams();
  const [restaurantOrders, setRestaurantOrders] = useState<Order[]>([]);
  useEffect(() => {
    const fetchRestaurantOrders = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/getRestaurantOrders/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setRestaurantOrders(response.data.orders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRestaurantOrders();
  }, [id]);
  console.log(restaurantOrders);
  return (
    <>
      <div className="flex flex-col mx-10 my-16">
        <div className="text-xl font-semibold mb-4">Restaurant orders</div>
        <div className="flex flex-col gap-4">
          {restaurantOrders.map((order) => {
            return (
              <RestaurantOrderCard
                key={order._id}
                order={order}
                restaurantOrders={restaurantOrders}
                setRestaurantOrders={setRestaurantOrders}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};
