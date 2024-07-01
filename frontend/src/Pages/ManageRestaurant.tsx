import { backendUrl } from "@/App";
import ManageRestaurantCard from "@/components/ManageRestaurantCard";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ManageRestaurant = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  const removeRestaurant = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/restaurant/removeRestaurant/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newRestaurants = restaurants.filter(
        (restaurant) => restaurant._id !== id
      );
      setRestaurants(newRestaurants);
    } catch (error) {
      console.log(error);
    }
  };

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
          <>
            <div className="flex flex-col gap-2 border rounded-lg p-4 shadow-md">
              {restaurants?.map((restaurant) => {
                return (
                  <ManageRestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    removeRestaurant={removeRestaurant}
                  />
                );
              })}
            </div>
            <div className="flex justify-end my-4">
              <Button onClick={() => navigate("/register/restaurant")}>
                New restaurant
              </Button>
            </div>
          </>
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
