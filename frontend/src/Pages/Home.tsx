import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { City, GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState<string>("");
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);
  const [formErrorMsg, setFormErrorMsg] = useState<string>("");
  const { cities } = useContext(GlobalContext) as GlobalContextType;

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchCity.trim() === "") {
      setFormErrorMsg("Please enter a city");
      setTimeout(() => {
        setFormErrorMsg("");
      }, 4000);
      return;
    }
    let isValid = false;
    // checking if it is a valid supported city
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].cityName === searchCity.trim().toLowerCase()) {
        isValid = true;
        break;
      }
    }
    if (!isValid) {
      setFormErrorMsg("Please enter a supported city");
      setTimeout(() => {
        setFormErrorMsg("");
      }, 4000);
      return;
    }
    navigate(`/restaurants/${searchCity}`);
  };

  useEffect(() => {
    const suggestCities = () => {
      if (searchCity.trim() === "") {
        setSuggestedCities([]);
        return;
      }
      if (searchCity.length < 2) return;
      let temp = [];
      for (let i = 0; i < cities.length; i++) {
        if (searchCity.trim().toLowerCase() === cities[i].cityName) {
          temp = [];
          break;
        }
        if (cities[i].cityName.includes(searchCity.trim().toLowerCase())) {
          temp.push(cities[i]);
        }
      }
      setSuggestedCities(temp);
    };
    suggestCities();
  }, [searchCity]);

  return (
    <>
      <div className="flex flex-col items-center my-16 mx-10 p-4 border rounded-lg shadow-md">
        <form
          onSubmit={(e) => handleSearch(e)}
          className="flex items-center justify-center gap-4 w-full"
        >
          <Input
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            type="text"
            name="searchCity"
            id="searchCity"
            placeholder="Search for restaurants in your city"
          />
          <Button>Search</Button>
        </form>
        {formErrorMsg !== "" && (
          <div className="text-red-500">{formErrorMsg}</div>
        )}
        {suggestedCities.length !== 0 && (
          <div className="flex flex-col border rounded-md z-10 w-full my-2 bg-white">
            {suggestedCities?.map((suggestion) => {
              return (
                <span
                  key={suggestion._id}
                  className="cursor-pointer hover:bg-gray-300 p-2 hover:duration-300"
                  onClick={() => setSearchCity(suggestion.cityName)}
                >
                  {suggestion.cityName}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
