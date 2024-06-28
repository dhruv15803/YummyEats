import { City } from "@/types";
import React, { SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { backendUrl } from "@/App";

type AdminCityCardProps = {
  city: City;
  deleteCity: (id: string) => Promise<void>;
  cities:City[];
  setCities:React.Dispatch<SetStateAction<City[]>>;
};

const AdminCityCard = ({ city, deleteCity,cities,setCities}: AdminCityCardProps) => {
  const [newCityName, setNewCityName] = useState<string>("");
  const [isCityEdit, setIsCityEdit] = useState<boolean>(false);
  const [editErrorMsg,setEditErrorMsg] = useState<string>("");

  const toggleEdit = () => {
    if (isCityEdit === false) {
      setIsCityEdit(true);
      setNewCityName(city.cityName);
    } else {
      setIsCityEdit(false);
      setNewCityName("");
    }
  };

  const editCity = async () => {
    try {
        if(newCityName.trim()==="") {
            setEditErrorMsg("Please enter a city");
            setTimeout(() => {
                setEditErrorMsg("");
            },4000)
            return;
        }
        if(newCityName.trim().toLowerCase()===city.cityName) {
            setIsCityEdit(false);
            setNewCityName("");
            return;
        }
    
        const response = await axios.put(`${backendUrl}/api/admin/editCity`,{
            newCityName,
            "id":city._id,
        },{withCredentials:true});
        console.log(response);
    
        const newCities = cities.map((c) => {
            if(c._id===city._id) {
                return response.data.updatedCity;
            } else {
                return c;
            }
        });
        setCities(newCities);
        setIsCityEdit(false);
        setNewCityName("");
    } catch (error:any) {
        console.log(error);
        setEditErrorMsg(error.response.data.message);
        setTimeout(() => {
            setEditErrorMsg("");
        },4000)
    }
  }


  return (
    <>
      <div className="flex items-center border-b p-2">
        <div className="font-semibold text-lg w-[60%] mx-2">
          {isCityEdit ? (
            <div className="flex flex-col gap-2">
              <Input
                value={newCityName}
                onChange={(e) => setNewCityName(e.target.value)}
                type="text"
                name="newCityName"
                id="newCityName"
              />
              {editErrorMsg!=="" && <span className="text-red-500">{editErrorMsg}</span>}
            </div>
          ) : (
            <>{city.cityName}</>
          )}
        </div>
        <div className="flex itesm-center gap-2">
          {isCityEdit ? (
            <>
                <Button onClick={editCity}>Edit</Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => deleteCity(city._id)}
                variant="destructive"
              >
                Delete
              </Button>
            </>
          )}
          <Button onClick={toggleEdit} variant="outline">
            {isCityEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminCityCard;
