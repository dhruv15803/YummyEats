import { backendUrl } from "@/App";
import CartItemCard from "@/components/CartItemCard";
import Loader from "@/components/Loader";
import MenuItemCard from "@/components/MenuItemCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartItem, MenuItem, Restaurant } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RestaurantMenu = () => {
  const { id } = useParams();
  let cartItems = JSON.parse(localStorage.getItem(`cartItems-${id}`)!);
  if (cartItems === undefined || cartItems === null) {
    cartItems = [];
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(cartItems);

  const incrementQty = (itemId: string) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.itemId === itemId) {
        return {
          ...cartItem,
          itemQty: cartItem.itemQty + 1,
        };
      } else {
        return cartItem;
      }
    });
    setCart(newCart);
  };

  const decrementQty = (itemId: string) => {
    const newCart = cart.map((cartItem) => {
      if (cartItem.itemId === itemId && cartItem.itemQty > 1) {
        return {
          ...cartItem,
          itemQty: cartItem.itemQty - 1,
        };
      } else {
        return cartItem;
      }
    });
    setCart(newCart);
  };

  const totalPrice = () => {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].itemPrice * cart[i].itemQty;
    }
    return total;
  };

  const removeCartItem = (itemId: string) => {
    const newCartItems = cart.filter((cartItem) => cartItem.itemId !== itemId);
    setCart(newCartItems);
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

  useEffect(() => {
    if (restaurant === null) return;
    localStorage.setItem(`cartItems-${restaurant?._id}`, JSON.stringify(cart));
  }, [cart]);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center my-16">
          <Loader height="80" width="80" color="black" />
          <span className="text-xl font-semibold">Loading...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col border rounded-lg shadow-md mx-10 my-16 p-4">
        <div className="text-xl flex items-center justify-between">
          <span className="text-xl  font-semibold">
            {restaurant?.restaurantName} Menu
          </span>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">View cart ({cart.length})</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Cart</SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
              {cart.length !== 0 ? (
                <>
                  {cart.map((cartItem) => {
                    return (
                      <CartItemCard
                        key={cartItem.itemId}
                        cartItem={cartItem}
                        decrementQty={decrementQty}
                        incrementQty={incrementQty}
                        removeCartItem={removeCartItem}
                      />
                    );
                  })}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold">Total - </span>
                    <span>₹ {totalPrice()}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-500">Cart has no items</div>
                </>
              )}
              {cart.length !== 0 && (
                <SheetFooter className="my-4">
                  <Button>Checkout</Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-col gap-2 my-4">
          {menuItems.map((item) => {
            return (
              <MenuItemCard
                key={item._id}
                item={item}
                cart={cart}
                setCart={setCart}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RestaurantMenu;
