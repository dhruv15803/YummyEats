import { backendUrl } from "@/App";
import Loader from "@/components/Loader";
import ManageMenuItemCard from "@/components/ManageMenuItemCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuItem, Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiDish } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { useParams } from "react-router-dom";

const RestaurantManage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<number | "">("");
  const [itemCuisine, setItemCuisine] = useState<string>("");
  const [addItemErrorMsg, setAddItemErrorMsg] = useState<string>("");
  const [addItemSuccessMsg,setAddItemSuccessMsg] = useState<string>("");

  const addMenuItem = async () => {
    try {
      if (
        itemName.trim() === "" ||
        itemDescription.trim() === "" ||
        itemPrice === "" ||
        itemCuisine === ""
      ) {
        setAddItemErrorMsg("Please enter all fields");
        setTimeout(() => {
          setAddItemErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/restaurant/addMenuItem`,
        {
          itemName,
          itemDescription,
          itemPrice,
          itemCuisine,
          restaurantId: id,
        },
        { withCredentials: true }
      );
      console.log(response);
      setMenuItems((prev) => [...prev, response.data.newMenuItem]);
      setAddItemSuccessMsg("Item added");
      setTimeout(() => {
        setAddItemErrorMsg("");
      },4000)
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemCuisine("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/restaurant/deleteMenuItem/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newMenuItems = menuItems.filter((item) => item._id !== id);
      setMenuItems(newMenuItems);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getRestaurantById = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getRestaurantById/${id}`
        );
        setRestaurant(response.data.restaurant);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    const getMenuItems = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/restaurant/getMenuItems/${id}`
        );
        console.log(response);
        setMenuItems(response.data.menuItems);
      } catch (error) {
        console.log(error);
      }
    };
    getRestaurantById();
    getMenuItems();
  }, [id]);

  console.log(menuItems);

  if (isLoading) {
    return (
      <>
        <div className="flex my-16 items-center justify-center gap-2">
          <Loader width="80" height="80" color="black" />
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      </>
    );
  }

  if (restaurant === null) {
    return (
      <>
        <div className="flex my-16 items-center justify-center text-xl font-semibold">
          Something went wrong. Restaurant not found
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col mx-10 my-16 gap-16">
        <div className="flex flex-col gap-2 p-4 border rounded-lg shadow-md">
          <div className="text-xl font-semibold">Restaurant details</div>
          <div className="text-xl">{restaurant.restaurantName}</div>
          <div className="flex items-center gap-1">
            <CiLocationOn />
            <span>{restaurant.cityId.cityName},</span>
            <span>{restaurant.addressLine1},</span>
            <span>{restaurant.addressLine2}</span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <BiDish />
            {restaurant.restaurantCuisines.map((cuisine) => {
              return (
                <div key={cuisine._id} className="flex items-center gap-1">
                  <span>•</span>
                  <span className="font-semibold">{cuisine.cuisineName}</span>
                </div>
              );
            })}
          </div>
          <div>{menuItems.length} menu items</div>
        </div>

        <div className="flex flex-col border rounded-lg shadow-md p-4">
          <div className="text-xl font-semibold">Menu items</div>
          {menuItems.length !== 0 ? (
            <>
              {menuItems.map((item) => {
                return (
                  <ManageMenuItemCard
                    key={item._id}
                    item={item}
                    deleteMenuItem={deleteMenuItem}
                    restaurantCuisines={restaurant.restaurantCuisines}
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                  />
                );
              })}
            </>
          ) : (
            <>
              <div className="text-gray-500">You have no menu items</div>
            </>
          )}
          <div className="flex justify-end items-center my-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add item</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add menu item</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Item Name</Label>
                    <Input
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Item Description</Label>
                    <Input
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Item Price</Label>
                    <Input
                      value={itemPrice}
                      onChange={(e) => setItemPrice(Number(e.target.value))}
                      type="number"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Select cuisine</Label>
                    <Select
                      value={itemCuisine}
                      onValueChange={(value) => setItemCuisine(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="select cuisine" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurant.restaurantCuisines.map((cuisine) => {
                          return (
                            <SelectItem
                              key={cuisine._id}
                              value={cuisine.cuisineName}
                            >
                              {cuisine.cuisineName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {addItemSuccessMsg!=="" && <>
                  <div className="text-blue-500">{addItemSuccessMsg}</div>
                </>}
                {addItemErrorMsg !== "" && (
                  <div className="text-red-500">{addItemErrorMsg}</div>
                )}
                <DialogFooter>
                  <Button onClick={addMenuItem}>Add item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantManage;
