import { GlobalContext, backendUrl } from "@/App";
import Loader from "@/components/Loader";
import SelectCuisineCard from "@/components/SelectCuisineCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { City, Cuisine, GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

const RestaurantRegister = () => {
  const { cities, cuisines } = useContext(GlobalContext) as GlobalContextType;
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantCity, setRestaurantCity] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
  const [restaurantCuisines, setRestaurantCuisines] = useState<Cuisine[]>([]);
  const [restaurantThumbnailFile, setRestaurantThumbnailFile] =
    useState<File | null>(null);
  const [restaurantThumbnailUrl, setRestaurantThumbnailUrl] =
    useState<string>("");
  const [isThumbnailLoading, setIsThumbnailLoading] = useState<boolean>(false);
  const [registerRestaurantErrorMsg, setRegisterRestaurantErrorMsg] =
    useState<string>("");

  const registerRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${backendUrl}/api/restaurant/register`,
        {
          restaurantThumbnailUrl,
          restaurantName,
          restaurantCity,
          addressLine1,
          addressLine2,
          restaurantCuisines,
        },
        { withCredentials: true }
      );
      console.log(response);
    } catch (error: any) {
      console.log(error);
      setRegisterRestaurantErrorMsg(error.response.data.message);
      setTimeout(() => {
        setRegisterRestaurantErrorMsg("");
      }, 4000);
    }
  };

  useEffect(() => {
    const suggestCities = () => {
      if (restaurantCity.trim() === "") {
        setSuggestedCities([]);
        return;
      }
      if (restaurantCity.length < 2) return;
      let temp = [];
      for (let i = 0; i < cities.length; i++) {
        if (restaurantCity.trim().toLowerCase() === cities[i].cityName) {
          temp = [];
          break;
        }
        if (cities[i].cityName.includes(restaurantCity)) {
          temp.push(cities[i]);
        }
      }
      setSuggestedCities(temp);
    };
    suggestCities();
  }, [restaurantCity]);

  useEffect(() => {
    const getRestaurantThumbnailUrl = async () => {
      try {
        if (restaurantThumbnailFile === null) return;
        setIsThumbnailLoading(true);
        const response = await axios.post(
          `${backendUrl}/api/restaurant/getFileUrl`,
          {
            restaurantThumbnailFile,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        setRestaurantThumbnailUrl(response.data.url);
      } catch (error) {
        console.log(error);
      } finally {
        setIsThumbnailLoading(false);
      }
    };
    getRestaurantThumbnailUrl();
  }, [restaurantThumbnailFile]);

  console.log(restaurantThumbnailFile);
  return (
    <>
      <div className="flex flex-col mx-10 my-16">
        <div className="text-xl font-semibold mb-8">
          Register your restaurant
        </div>
        <div className="flex flex-col border rounded-lg shadow-md p-4">
          <div>
            {isThumbnailLoading && (
              <div className="flex items-center gap-2 my-2">
                <Loader height="80" width="80" color="black" />
                <span className="text-black">Loading...</span>
              </div>
            )}
            {restaurantThumbnailUrl !== "" && isThumbnailLoading === false ? (
              <>
                <img
                  className="w-auto aspect-auto rounded-lg"
                  src={restaurantThumbnailUrl}
                  alt=""
                />
                <Button
                  variant="destructive"
                  className="my-2"
                  onClick={() => {
                    setRestaurantThumbnailFile(null);
                    setRestaurantThumbnailUrl("");
                  }}
                >
                  Remove thumbnail
                </Button>
              </>
            ) : (
              <>
                <Label htmlFor="restaurantThumbnailFile">
                  Upload restaurant thumbnail
                </Label>
                <Input
                  onChange={(e) =>
                    setRestaurantThumbnailFile(e.target.files![0])
                  }
                  type="file"
                  name="restaurantThumbnailFile"
                  id="restaurantThumbnailFile"
                />
              </>
            )}
          </div>
          <form
            onSubmit={(e) => registerRestaurant(e)}
            className="flex flex-col gap-4 my-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="restaurantName">Restaurant Name</Label>
              <Input
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                type="text"
                name="restaurantName"
                id="restaurantName"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="restaurantCity">Restaurant City</Label>
              <Input
                className="my-2"
                value={restaurantCity}
                onChange={(e) => setRestaurantCity(e.target.value)}
                type="text"
                name="restaurantCity"
                id="restaurantCity"
              />
              {suggestedCities.length !== 0 && (
                <div className="flex flex-col border rounded-md z-10 bg-white">
                  {suggestedCities?.map((suggestion) => {
                    return (
                      <span
                        key={suggestion._id}
                        className="cursor-pointer hover:bg-gray-300 p-2 hover:duration-300"
                        onClick={() => setRestaurantCity(suggestion.cityName)}
                      >
                        {suggestion.cityName}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                type="text"
                name="addressLine1"
                id="addressLine1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                type="text"
                name="addressLine2"
                id="addressLine2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Select cuisines for your restaurant</Label>
              <div className="flex items-center flex-wrap gap-4">
                {cuisines?.map((cuisine) => {
                  return (
                    <SelectCuisineCard
                      key={cuisine._id}
                      cuisine={cuisine}
                      restaurantCuisines={restaurantCuisines}
                      setRestaurantCuisines={setRestaurantCuisines}
                    />
                  );
                })}
              </div>
            </div>
            <Button
              disabled={
                restaurantCuisines.length < 1 ||
                restaurantThumbnailUrl === "" ||
                restaurantName.trim() === "" ||
                restaurantCity.trim() === "" ||
                addressLine1.trim() === "" ||
                addressLine2.trim() === ""
              }
            >
              Create restaurant
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RestaurantRegister;
