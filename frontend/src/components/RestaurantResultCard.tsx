import { Restaurant } from "@/types";
import React from "react";
import { BiDish } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type RestaurantResultCardProps = {
  restaurant: Restaurant;
};

const RestaurantResultCard = ({ restaurant }: RestaurantResultCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 border rounded-lg shadow-md">
      <div className="w-[30%]">
        <img className="h-48" src={restaurant.restaurantThumbnail} alt="" />
      </div>
      <div className="flex flex-col w-[70%] gap-2">
        <div className="text-xl font-semibold">{restaurant.restaurantName}</div>
        <div className="flex items-center gap-1">
          <CiLocationOn />
          <span>{restaurant.cityId.cityName}, </span>
          <span>{restaurant.addressLine1}, </span>
          <span>{restaurant.addressLine2}</span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
          <div className="text-2xl">
            <BiDish />
          </div>
          {restaurant.restaurantCuisines.map((cuisine) => {
            return (
              <div key={cuisine._id} className="flex gap-1">
                <span>•</span>
                <span>{cuisine.cuisineName}</span>
              </div>
            );
          })}
        </div>
        <div>
          <Button
            onClick={() => navigate(`/restaurants/menu/${restaurant._id}`)}
          >
            Menu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantResultCard;
