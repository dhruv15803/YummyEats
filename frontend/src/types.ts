import React, { SetStateAction } from "react";

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type GlobalContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  loggedInUser: User | null;
  setLoggedInUser: React.Dispatch<SetStateAction<User | null>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<SetStateAction<boolean>>;
  cuisines: Cuisine[];
  setCuisines: React.Dispatch<SetStateAction<Cuisine[]>>;
  cities: City[];
  setCities: React.Dispatch<SetStateAction<City[]>>;
  isUserFromCart:boolean;
  setIsUserFromCart:React.Dispatch<SetStateAction<boolean>>;
  redirectRestaurantId:string;
  setRedirectRestaurantId:React.Dispatch<SetStateAction<string>>;
  defaultAddress:Address | null;
  setDefaultAddress:React.Dispatch<SetStateAction<Address | null>>
};

export type Cuisine = {
  _id: string;
  cuisineName: string;
};

export type Restaurant = {
  _id: string;
  restaurantName: string;
  cityId: City;
  addressLine1: string;
  addressLine2: string;
  restaurantThumbnail: string;
  restaurantImages?: string[];
  restaurantCuisines: Cuisine[];
  restaurantOwner: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type City = {
  _id: string;
  cityName: string;
};

export type MenuItem = {
  _id: string;
  item_name: string;
  item_description: string;
  item_price: number;
  item_cuisine: Cuisine;
  restaurant_id: string;
};

export type CartItem = {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQty: number;
};

export type OrderItem = {
  _id:string;
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemQty: number;
}

export type Address = {
  _id:string;
  addressLine1:string;
  addressLine2:string;
  pin_code:number;
  cityId:City;
  userId:string;
}


export type Order = {
  _id:string;
  user_id:string;
  shipping_address:Address;
  orderItems:OrderItem[];
  orderStatus:"PLACED" | "PAID" | "IN PROGRESS" | "DELIVERED" | "OUT FOR DELIVERY"
  orderTotal:number;
  restaurant_id:Restaurant;
  createdAt:Date,
  updatedAt:Date,
}