import { Restaurant } from "@/types";
import React from "react";
import { BiDish } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

type ManageRestaurantCardProps = {
  restaurant: Restaurant;
};

const ManageRestaurantCard = ({ restaurant }: ManageRestaurantCardProps) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex items-center border-b p-2 gap-4">
        <div className="w-[20%]">
          <img src={restaurant.restaurantThumbnail} alt="" />
        </div>
        <div className="flex flex-col w-[80%]">
          <div className="text-xl font-semibold">
            {restaurant.restaurantName}
          </div>
          <div className="flex items-center gap-1">
            <CiLocationOn />
            <span>{restaurant.cityId.cityName}, </span>
            <span>{restaurant.addressLine1}, </span>
            <span>{restaurant.addressLine2}</span>
          </div>
          <div className="flex items-center gap-1">
            <BiDish />
            {restaurant.restaurantCuisines.map((cuisine, i) => {
              return <span key={cuisine._id}>{cuisine.cuisineName}</span>;
            })}
          </div>
          <Button onClick={() => navigate(`/manage/restaurant/${restaurant._id}`)} className="my-2" variant="outline">
            Manage
          </Button>
        </div>
      </div>
    </>
  );
};

export default ManageRestaurantCard;
