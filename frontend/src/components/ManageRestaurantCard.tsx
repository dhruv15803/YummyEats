import { Restaurant } from "@/types";
import React, { useEffect, useState } from "react";
import { BiDish } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { backendUrl } from "@/App";
import axios from "axios";

type ManageRestaurantCardProps = {
  restaurant: Restaurant;
  removeRestaurant: (id: string) => Promise<void>;
};

const ManageRestaurantCard = ({
  restaurant,
  removeRestaurant,
}: ManageRestaurantCardProps) => {
  const [confirmName, setConfirmName] = useState<string>("");
  const [isComplete, setIsComplete] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getMenuItems/${restaurant._id}`
        );
        console.log(response);
        setIsComplete(response.data.menuItems.length >= 5);
      } catch (error) {
        console.log(error);
      }
    };
    getMenuItems();
  }, []);

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
          <div className="flex items-center">
            {isComplete === false && (
              <span className="text-red-500">incomplete</span>
            )}
          </div>
          <div className="flex justify-between mt-2">
            <Button
              onClick={() => navigate(`/manage/restaurant/${restaurant._id}`)}
              className="my-2"
              variant="outline"
            >
              Manage
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Remove</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Removing Restaurant</AlertDialogTitle>
                  <AlertDialogDescription>
                    Please type "{restaurant.restaurantName}" in the given input
                    box
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  type="text"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={confirmName !== restaurant.restaurantName}
                    onClick={() => removeRestaurant(restaurant._id)}
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRestaurantCard;
