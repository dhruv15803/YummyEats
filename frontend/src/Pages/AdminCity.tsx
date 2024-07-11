import { GlobalContext, backendUrl } from "@/App";
import AdminCityCard from "@/components/AdminCityCard";
import Paginate from "@/components/Paginate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";

const AdminCity = () => {
  const { cities, setCities } = useContext(GlobalContext) as GlobalContextType;
  const [cityName, setCityName] = useState<string>("");
  const [addCityErrorMsg, setAddCityErrorMsg] = useState<string>("");
  const [currPage, setCurrPage] = useState<number>(1);
  const noOfCitiesPerPage = 5;
  const noOfPages = Math.ceil(cities.length / noOfCitiesPerPage);
  const indexOfLastPost = currPage * noOfCitiesPerPage;
  const indexOfFirstPost = indexOfLastPost - noOfCitiesPerPage;
  const citiesPerPage = cities.slice(indexOfFirstPost, indexOfLastPost);

  const addCity = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (cityName.trim() === "") {
        setAddCityErrorMsg("Please enter a city");
        setTimeout(() => {
          setAddCityErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/admin/addCity`,
        {
          cityName,
        },
        { withCredentials: true }
      );
      setCities((prev) => [...prev, response.data.newCity]);
      setCityName("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCity = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteCity/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newCities = cities.filter((city) => city._id !== id);
      setCities(newCities);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 border rounded-lg shadow-md mx-10">
        <form
          onSubmit={(e) => addCity(e)}
          className="flex items-center gap-2 mb-4"
        >
          <Input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            type="text"
            name="cityName"
            id="cityName"
            placeholder="eg:Mumbai"
          />
          <Button>Add city</Button>
        </form>
        {addCityErrorMsg !== "" && (
          <div className="text-red-500">{addCityErrorMsg}</div>
        )}
        <div className="flex flex-col gap-2">
          {citiesPerPage.length !== 0 ? (
            <>
              {citiesPerPage.map((city) => {
                return (
                  <AdminCityCard
                    key={city._id}
                    city={city}
                    deleteCity={deleteCity}
                    cities={cities}
                    setCities={setCities}
                  />
                );
              })}
              <Paginate
                noOfPages={noOfPages}
                currPage={currPage}
                setCurrPage={setCurrPage}
              />
            </>
          ) : (
            <div className="text-gray-500">Website has no supported cities</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCity;
