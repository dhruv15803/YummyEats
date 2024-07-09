import { GlobalContext, backendUrl } from "@/App";
import Loader from "@/components/Loader";
import Paginate from "@/components/Paginate";
import RestaurantResultCard from "@/components/RestaurantResultCard";
import SelectCuisineCard from "@/components/SelectCuisineCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Cuisine, GlobalContextType, Restaurant } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantResults = () => {
  const { city } = useParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const { cuisines } = useContext(GlobalContext) as GlobalContextType;
  const [filterByCuisines, setFilterByCuisines] = useState<Cuisine[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const [isRestaurantsLoading, setIsRestaurantsLoading] =
    useState<boolean>(false);
  const [currPage, setCurrPage] = useState<number>(1);
  const noOfRestaurantsPerPage = 5;
  const noOfPages = Math.ceil(
    filteredRestaurants.length / noOfRestaurantsPerPage
  );
  const indexOfLast = currPage * noOfRestaurantsPerPage;
  const indexOfFirst = indexOfLast - noOfRestaurantsPerPage;
  const restaurantsPerPage = filteredRestaurants.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    const fetchRestaurantsByCity = async () => {
      try {
        setIsRestaurantsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getByCity/${city}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.log(error);
      } finally {
        setIsRestaurantsLoading(false);
      }
    };
    fetchRestaurantsByCity();
  }, [city]);

  useEffect(() => {
    if (filterByCuisines.length === 0) {
      setFilteredRestaurants(restaurants);
      return;
    }
    const filtered = restaurants.filter((r) => {
      let isFilter = false;
      for (let i = 0; i < filterByCuisines.length; i++) {
        isFilter = false;
        for (let j = 0; j < r.restaurantCuisines.length; j++) {
          if (r.restaurantCuisines[j]._id === filterByCuisines[i]._id) {
            isFilter = true;
            break;
          }
        }
        if (isFilter === false) break;
      }
      if (isFilter) return r;
    });
    setFilteredRestaurants(filtered);
    setCurrPage(1);
  }, [filterByCuisines, restaurants]);

  if (isRestaurantsLoading) {
    return (
      <>
        <div className="flex items-center justify-center my-16 gap-2">
          <Loader height="80" width="80" color="black" />
          <span className="font-semibold">Loading restaurants</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="my-8 flex items-center mx-10  gap-2">
        <span className="text-2xl">Restaurant results in {city} </span>
        <span>({restaurants.length} results)</span>
      </div>
      <div className="flex  gap-4 mx-10 my-16">
        <div className="flex flex-col w-[20%] border p-2 shadow-md rounded-lg gap-1">
          {filterByCuisines.length !== 0 && (
            <Button onClick={() => setFilterByCuisines([])}>
              Clear filters
            </Button>
          )}
          <div className="text-lg font-semibold">Filter by cuisine</div>
          {cuisines.map((cuisine) => {
            return (
              <SelectCuisineCard
                key={cuisine._id}
                cuisine={cuisine}
                restaurantCuisines={filterByCuisines}
                setRestaurantCuisines={setFilterByCuisines}
              />
            );
          })}
        </div>
        <div className="flex flex-col w-[80%] p-2 gap-4">
          {restaurantsPerPage.map((restaurant) => {
            return (
              <RestaurantResultCard
                key={restaurant._id}
                restaurant={restaurant}
              />
            );
          })}
          {noOfPages > 1 && (
            <Paginate
              noOfPages={noOfPages}
              currPage={currPage}
              setCurrPage={setCurrPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantResults;
