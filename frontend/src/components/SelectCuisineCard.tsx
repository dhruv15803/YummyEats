import { Cuisine } from "@/types";
import React, { SetStateAction, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

type SelectCuisineCardProps = {
  cuisine: Cuisine;
  restaurantCuisines:Cuisine[];
  setRestaurantCuisines:React.Dispatch<SetStateAction<Cuisine[]>>;
};

const SelectCuisineCard = ({ cuisine,restaurantCuisines,setRestaurantCuisines}: SelectCuisineCardProps) => {
  const [isCuisineChecked, setIsCuisineChecked] = useState<boolean>(false);

  const addCuisine = () => {
    setRestaurantCuisines((prev) => [...prev,cuisine]);
  };

  const deleteCuisine = () => {
    const newCuisines = restaurantCuisines.filter((r) => r._id!==cuisine._id);
    setRestaurantCuisines(newCuisines);
  };

  useEffect(() => {
    isCuisineChecked ? addCuisine() : deleteCuisine();
  },[isCuisineChecked])

  return (
    <>
      <div className="flex items-center gap-1">
        <Checkbox
          checked={isCuisineChecked}
          onClick={() => setIsCuisineChecked(!isCuisineChecked)}
        />
        <span className="font-semibold">
          {cuisine.cuisineName[0].toUpperCase() + cuisine.cuisineName.slice(1)}
        </span>
      </div>
    </>
  );
};

export default SelectCuisineCard;
