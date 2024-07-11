import { Cuisine, MenuItem } from "@/types";
import React, { SetStateAction, useState } from "react";
import { BiDish } from "react-icons/bi";
import { RxArrowDown, RxArrowUp } from "react-icons/rx";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { backendUrl } from "@/App";

type ManageMenuItemCardProps = {
  item: MenuItem;
  deleteMenuItem: (id: string) => Promise<void>;
  restaurantCuisines: Cuisine[];
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<SetStateAction<MenuItem[]>>;
};

const ManageMenuItemCard = ({
  item,
  deleteMenuItem,
  restaurantCuisines,
  menuItems,
  setMenuItems,
}: ManageMenuItemCardProps) => {
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);
  const [isMenuItemEdit, setIsMenuItemEdit] = useState<boolean>(false);
  const [newMenuItemName, setNewMenuItemName] = useState<string>("");
  const [newMenuItemDescription, setNewMenuItemDescription] =
    useState<string>("");
  const [newMenuItemCuisine, setNewMenuItemCuisine] = useState<string>("");
  const [newMenuItemPrice, setNewMenuItemPrice] = useState<number | "">("");
  const [editErrorMsg, setEditErrorMsg] = useState<string>("");

  const editMenuItem = async () => {
    try {
      if (
        newMenuItemName.trim() === "" ||
        newMenuItemDescription.trim() === "" ||
        newMenuItemCuisine.trim() === ""
      ) {
        setEditErrorMsg("Please enter all fields");
        setTimeout(() => {
          setEditErrorMsg("");
        }, 4000);
        return;
      }

      const response = await axios.put(
        `${backendUrl}/api/restaurant/editMenuItem`,
        {
          newMenuItemName,
          newMenuItemDescription,
          newMenuItemCuisine,
          newMenuItemPrice,
          id: item._id,
        },
        { withCredentials: true }
      );
      console.log(response);
      const newMenuItems = menuItems.map((menuItem) => {
        if (menuItem._id === item._id) {
          return response.data.updatedItem;
        } else {
          return menuItem;
        }
      });
      setMenuItems(newMenuItems);
      setIsMenuItemEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleEdit = () => {
    if (isMenuItemEdit === false) {
      setIsMenuItemEdit(true);
      setNewMenuItemName(item.item_name);
      setNewMenuItemDescription(item.item_description);
      setNewMenuItemCuisine(item.item_cuisine.cuisineName);
      setNewMenuItemPrice(item.item_price);
    } else {
      setIsMenuItemEdit(false);
    }
  };

  return (
    <div className="flex items-center gap-4 border-b p-2 justify-between">
      <div className="flex flex-col gap-1">
        {isMenuItemEdit ? (
          <>
            <Input
              value={newMenuItemName}
              onChange={(e) => setNewMenuItemName(e.target.value)}
              type="text"
              placeholder="Enter item name"
            />
            <Input
              value={newMenuItemDescription}
              onChange={(e) => setNewMenuItemDescription(e.target.value)}
              type="text"
              placeholder="Enter item description"
            />
            <Select
              value={newMenuItemCuisine}
              onValueChange={(value) => setNewMenuItemCuisine(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {restaurantCuisines.map((cuisine) => {
                  return (
                    <SelectItem key={cuisine._id} value={cuisine.cuisineName}>
                      {cuisine.cuisineName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Input
              value={newMenuItemPrice}
              onChange={(e) => setNewMenuItemPrice(Number(e.target.value))}
              type="number"
              placeholder="Enter price"
            />
            {editErrorMsg!=="" && <div className="text-red-500 my-2">{editErrorMsg}</div>}
          </>
        ) : (
          <>
            <div className="font-sembold flex items-center gap-2">
              <span>{item.item_name}</span>
              {!isShowDescription ? (
                <RxArrowDown onClick={() => setIsShowDescription(true)} />
              ) : (
                <RxArrowUp onClick={() => setIsShowDescription(false)} />
              )}
            </div>
            {isShowDescription && (
              <>
                <div className="text-gray-500 text-sm">
                  {item.item_description}
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <BiDish />
              <span>{item.item_cuisine.cuisineName}</span>
            </div>
            <div className="font-semibold">Rs {item.item_price}</div>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isMenuItemEdit && <Button onClick={editMenuItem}>Edit</Button>}
        {!isMenuItemEdit && (
          <Button
            onClick={() => deleteMenuItem(item._id)}
            variant="destructive"
          >
            Remove
          </Button>
        )}
        <Button onClick={toggleEdit} variant="outline">
          {isMenuItemEdit ? "Cancel" : "Edit"}
        </Button>
      </div>
    </div>
  );
};

export default ManageMenuItemCard;
