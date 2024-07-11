import { GlobalContext, backendUrl } from "@/App";
import AdminCuisineCard from "@/components/AdminCuisineCard";
import Paginate from "@/components/Paginate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";

const AdminCuisine = () => {
  const [cuisineName, setCuisineName] = useState<string>("");
  const { cuisines, setCuisines } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [addCuisineErrorMsg, setAddCuisineErrorMsg] = useState<string>("");
  const [currPage, setCurrPage] = useState<number>(1);
  const noOfCuisinesPerPage = 5;
  const noOfPages = Math.ceil(cuisines.length / noOfCuisinesPerPage);
  const indexOfLast = currPage * noOfCuisinesPerPage;
  const indexOfFirst = indexOfLast - noOfCuisinesPerPage;
  const cuisinesPerPage = cuisines.slice(indexOfFirst, indexOfLast);

  const addCuisine = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (cuisineName.trim() === "") {
        setAddCuisineErrorMsg("Please enter a cuisine");
        setTimeout(() => {
          setAddCuisineErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/admin/addCuisine`,
        {
          cuisineName,
        },
        { withCredentials: true }
      );
      console.log(response);
      setCuisines((prev) => [...prev, response.data.newCuisine]);
      setCuisineName("");
    } catch (error: any) {
      console.log(error);
      setAddCuisineErrorMsg(error.response.data.message);
      setTimeout(() => {
        setAddCuisineErrorMsg("");
      }, 4000);
    }
  };

  const deleteCuisine = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/admin/deleteCuisine/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newCuisines = cuisines.filter((cuisine) => cuisine._id !== id);
      setCuisines(newCuisines);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 border rounded-lg shadow-md mx-10">
        <form
          onSubmit={(e) => addCuisine(e)}
          className="flex items-center gap-2 mb-4"
        >
          <Input
            value={cuisineName}
            onChange={(e) => setCuisineName(e.target.value)}
            type="text"
            name="cuisineName"
            id="cuisineName"
            placeholder="eg: indian"
          />
          <Button>Add cuisine</Button>
        </form>
        {addCuisineErrorMsg !== "" && (
          <div className="text-red-500">{addCuisineErrorMsg}</div>
        )}
        <div className="flex flex-col gap-2">
          {cuisinesPerPage.length !== 0 ? (
            <>
              {cuisinesPerPage.map((cuisine) => {
                return (
                  <AdminCuisineCard
                    key={cuisine._id}
                    cuisine={cuisine}
                    deleteCuisine={deleteCuisine}
                  />
                );
              })}
              <Paginate
                currPage={currPage}
                setCurrPage={setCurrPage}
                noOfPages={noOfPages}
              />
            </>
          ) : (
            <div className="text-gray-500">
              Website has no supported cuisine options for restaurants
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCuisine;
