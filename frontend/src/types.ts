import React, { SetStateAction } from "react";

export type User = {
    _id:string;
    email:string;
    firstName:string;
    lastName:string;
    password:string;
    isAdmin:boolean;
    createdAt:Date,
    updatedAt:Date,
}

export type GlobalContextType = {
    isLoggedIn:boolean;
    setIsLoggedIn:React.Dispatch<SetStateAction<boolean>>;
    loggedInUser:User | null,
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
    isAdmin:boolean;
    setIsAdmin:React.Dispatch<SetStateAction<boolean>>;
    cuisines:Cuisine[];
    setCuisines:React.Dispatch<SetStateAction<Cuisine[]>>;
    cities:City[];
    setCities:React.Dispatch<SetStateAction<City[]>>;
}

export type Cuisine = {
    _id:string;
    cuisineName:string;
}

export type Restaurant = {
    _id:string;
    restaurantName:string;
    cityId:City;
    addressLine1:string;
    addressLine2:string;
    restaurantThumbnail:string;
    restaurantImages?:string[];
    restaurantCuisines:Cuisine[];
    restaurantOwner:string;
    createdAt?:Date;
    updatedAt?:Date;
}

export type City = {
    _id:string;
    cityName:string;
}

export type MenuItem = {
    _id:string;
    item_name:string;
    item_description:string;
    item_price:number;
    item_cuisine:Cuisine;
    restaurant_id:string;
}