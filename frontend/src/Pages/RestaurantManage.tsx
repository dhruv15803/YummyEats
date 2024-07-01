import { GlobalContext, backendUrl } from "@/App";
import Loader from "@/components/Loader";
import ManageMenuItemCard from "@/components/ManageMenuItemCard";
import SelectCuisineCard from "@/components/SelectCuisineCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Cuisine, GlobalContextType, MenuItem, Restaurant } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { BiDish } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantManage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { cuisines, cities } = useContext(GlobalContext) as GlobalContextType;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string>("");
  const [itemDescription, setItemDescription] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<number | "">("");
  const [itemCuisine, setItemCuisine] = useState<string>("");
  const [addItemErrorMsg, setAddItemErrorMsg] = useState<string>("");
  const [addItemSuccessMsg, setAddItemSuccessMsg] = useState<string>("");
  const [isEditRestaurant, setIsEditRestaurant] = useState<boolean>(false);
  const [newRestaurantName, setNewRestaurantName] = useState<string>("");
  const [newRestaurantCity, setNewRestaurantCity] = useState<string>("");
  const [newAddressLine1, setNewAddressLine1] = useState<string>("");
  const [newAddressLine2, setNewAddressLine2] = useState<string>("");
  const [newRestaurantCuisines, setNewRestaurantCuisines] = useState<Cuisine[]>(
    []
  );
  const [editRestaurantErrorMsg, setEditRestaurantErrorMsg] =
    useState<string>("");

  const toggleEditRestaurant = () => {
    if (isEditRestaurant === false) {
      setIsEditRestaurant(true);
      setNewRestaurantName(restaurant?.restaurantName!);
      setNewRestaurantCity(restaurant?.cityId.cityName!);
      setNewAddressLine1(restaurant?.addressLine1!);
      setNewAddressLine2(restaurant?.addressLine2!);
      setNewRestaurantCuisines((prev) => [
        ...prev,
        ...restaurant?.restaurantCuisines!,
      ]);
    } else {
      setIsEditRestaurant(false);
    }
  };

  const editRestaurant = async () => {
    try {
      if (
        newRestaurantName.trim() === "" ||
        newRestaurantCity.trim() === "" ||
        newAddressLine1.trim() === "" ||
        newAddressLine2.trim() === "" ||
        newRestaurantCuisines.length < 1
      ) {
        setEditRestaurantErrorMsg("Please enter all fields");
        setTimeout(() => {
          setEditRestaurantErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.put(
        `${backendUrl}/api/restaurant/edit`,
        {
          newRestaurantName,
          newRestaurantCity,
          newAddressLine1,
          newAddressLine2,
          newRestaurantCuisines,
          id: restaurant?._id,
        },
        { withCredentials: true }
      );
      console.log(response);
      setRestaurant(response.data.updatedRestaurant);
      setIsEditRestaurant(false);
    } catch (error: any) {
      console.log(error);
      setEditRestaurantErrorMsg(error.response.data.message);
      setTimeout(() => {
        setEditRestaurantErrorMsg("");
      }, 4000);
    }
  };

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
        setAddItemSuccessMsg("");
      }, 4000);
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
          {isEditRestaurant ? (
            <>
              <div>
                <Input
                  value={newRestaurantName}
                  onChange={(e) => setNewRestaurantName(e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={newRestaurantCity}
                  onValueChange={(value) => setNewRestaurantCity(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities?.map((city) => {
                      return (
                        <SelectItem key={city._id} value={city.cityName}>
                          {city.cityName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Input
                  value={newAddressLine1}
                  onChange={(e) => setNewAddressLine1(e.target.value)}
                  type="text"
                />
                <Input
                  value={newAddressLine2}
                  onChange={(e) => setNewAddressLine2(e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {cuisines.map((cuisine) => {
                  return (
                    <SelectCuisineCard
                      key={cuisine._id}
                      cuisine={cuisine}
                      restaurantCuisines={newRestaurantCuisines}
                      setRestaurantCuisines={setNewRestaurantCuisines}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
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
                      <span className="font-semibold">
                        {cuisine.cuisineName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span> {menuItems.length} menu items</span>
                {menuItems.length < 5 && (
                  <span className="text-red-500">Add atleast 5 items</span>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end gap-4">
            {isEditRestaurant && <Button onClick={editRestaurant}>Edit</Button>}
            <Button onClick={toggleEditRestaurant} variant="outline">
              {isEditRestaurant ? "Cancel" : "Edit restaurant details"}
            </Button>
          </div>
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
                {addItemSuccessMsg !== "" && (
                  <>
                    <div className="text-blue-500">{addItemSuccessMsg}</div>
                  </>
                )}
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
        {menuItems.length >= 5 && (
          <div className="flex justify-end my-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Complete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Restaurant creation complete
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Your restaurant is now available to users
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Stay on this page</AlertDialogCancel>
                  <AlertDialogAction onClick={() => navigate("/")}>
                    Home
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantManage;
