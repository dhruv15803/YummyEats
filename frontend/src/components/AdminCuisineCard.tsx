import { Cuisine, GlobalContextType } from "@/types";
import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GlobalContext, backendUrl } from "@/App";
import axios from "axios";

type AdminCuisineCardProps = {
  cuisine: Cuisine;
  deleteCuisine: (id: string) => void;
};

const AdminCuisineCard = ({
  cuisine,
  deleteCuisine,
}: AdminCuisineCardProps) => {
  const [isCuisineEdit, setIsCuisineEdit] = useState<boolean>(false);
  const [newCuisineName, setNewCuisineName] = useState<string>("");
  const { cuisines, setCuisines } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [editErrorMsg, setEditErrorMsg] = useState<string>("");

  const toggleEdit = () => {
    if (isCuisineEdit === false) {
      setIsCuisineEdit(true);
      setNewCuisineName(cuisine.cuisineName);
    } else {
      setIsCuisineEdit(false);
      setNewCuisineName("");
    }
  };

  const editCuisine = async () => {
    try {
      if (newCuisineName.trim() === "") {
        setEditErrorMsg("Please enter a cuisine");
        setTimeout(() => {
          setEditErrorMsg("");
        }, 4000);
        return;
      }
      if (newCuisineName.trim().toLowerCase() === cuisine.cuisineName) {
        setIsCuisineEdit(false);
        setNewCuisineName("");
        return;
      }
      const response = await axios.put(
        `${backendUrl}/api/admin/editCuisine`,
        {
          newCuisineName,
          id: cuisine._id,
        },
        { withCredentials: true }
      );
      console.log(response);
      const newCuisines = cuisines.map((c) => {
        if (c._id === cuisine._id) {
          return response.data.updatedCuisine;
        } else {
          return c;
        }
      });
      setCuisines(newCuisines);
      setIsCuisineEdit(false);
      setNewCuisineName("");
    } catch (error: any) {
      console.log(error);
      setEditErrorMsg(error.response.data.message);
      setTimeout(() => {
        setEditErrorMsg("");
      }, 4000);
    }
  };

  return (
    <>
      <div className="flex items-center border-b p-2">
        <div className="font-semibold text-lg w-[60%] mx-2">
          {isCuisineEdit ? (
            <>
              <div className="flex flex-col gap-2">
                <Input
                  value={newCuisineName}
                  onChange={(e) => setNewCuisineName(e.target.value)}
                  type="text"
                  name="newCuisineName"
                  id="newCuisineName"
                />
                {editErrorMsg !== "" && (
                  <span className="text-red-500">{editErrorMsg}</span>
                )}
              </div>
            </>
          ) : (
            <>{cuisine.cuisineName}</>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCuisineEdit ? (
            <>
              <Button onClick={editCuisine}>Edit</Button>
            </>
          ) : (
            <>
              {" "}
              <Button
                onClick={() => deleteCuisine(cuisine._id)}
                variant="destructive"
              >
                Delete
              </Button>
            </>
          )}
          <Button onClick={toggleEdit} variant="outline">
            {isCuisineEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminCuisineCard;
