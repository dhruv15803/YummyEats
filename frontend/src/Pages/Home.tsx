import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { City, GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/hero (1).png";
import landingImage from "../assets/landing (1).png";
import appDownloadImage from "../assets/appDownload (1).png";

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
        <div className="flex flex-col border-2">
          <div>
            <img
              src={heroImg}
              className="w-full max-h-[600px] object-cover"
              alt=""
            />
          </div>
          <div className="flex flex-col items-center justify-center my-2">
                    <h1 className="text-5xl font-semibold tracking-tight text-orange-600">
             Tuck into a takeway today
          </h1>
          <span className="text-xl">Food is just a click away!</span>
          </div>
          <form
            onSubmit={(e) => handleSearch(e)}
            className="flex items-center justify-center gap-4 mx-20  mt-4 mb-2"
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
            <div className="flex flex-col border rounded-md z-10 mx-20 mb-6 bg-white">
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
          <div className="grid md:grid-cols-2 gap-5">
            <img src={landingImage} />
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <span className="font-bold text-3xl tracking-tighter">
                Order takeaway even faster!
              </span>
              <span>
                Download the MernEats App for faster ordering and personalised
                recommendations
              </span>
              <img src={appDownloadImage} />
            </div>
          </div>
        </div>
    </>
  );
};

export default Home;
