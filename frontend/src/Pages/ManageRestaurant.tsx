import { backendUrl } from "@/App";
import ManageRestaurantCard from "@/components/ManageRestaurantCard";
import { Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ManageRestaurant = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchMyRestaurants = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getMyRestaurants`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyRestaurants();
  }, []);
  return (
    <>
      <div className="flex flex-col mx-10 my-16">
        <div className="text-xl font-semibold mb-4">Your restaurants</div>
        {restaurants.length !== 0 ? (
          <div className="flex flex-col gap-2 border rounded-lg p-4 shadow-md">
            {restaurants?.map((restaurant) => {
              return (
                <ManageRestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              );
            })}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1">
              <span className="text-gray-500">
                You have no registered restaurants with us.
              </span>
              <Link
                to="/register/restaurant"
                className="font-semibold text-gray-600 hover:text-black hover:duration-300"
              >
                Click here to register
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ManageRestaurant;