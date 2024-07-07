import { backendUrl, GlobalContext } from "@/App";
import CartItemCard from "@/components/CartItemCard";
import Loader from "@/components/Loader";
import MenuItemCard from "@/components/MenuItemCard";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Address,
  CartItem,
  GlobalContextType,
  MenuItem,
  Restaurant,
} from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";

const RestaurantMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let cartItems = JSON.parse(localStorage.getItem(`cartItems-${id}`)!);
  if (cartItems === undefined || cartItems === null) {
    cartItems = [];
  }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(cartItems);
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isNewAddress, setIsNewAddress] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const {
    loggedInUser,
    isLoggedIn,
    setIsUserFromCart,
    setRedirectRestaurantId,
  } = useContext(GlobalContext) as GlobalContextType;

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

  console.log(cart);

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

  const checkoutOrder = async () => {
    try {
      let response;
      if (isNewAddress) {
        response = await axios.post(
          `${backendUrl}/api/order/checkout`,
          {
            cart,
            restaurantId: restaurant?._id,
            addressLine1,
            addressLine2,
            cityName: restaurant?.cityId.cityName,
            pin_code: parseInt(pinCode),
            shipping_id: "",
          },
          { withCredentials: true }
        );
      } else {
        if (shippingAddress === null) return;
        if (shippingAddress.cityId.cityName !== restaurant?.cityId.cityName) {
          return;
        }
        response = await axios.post(
          `${backendUrl}/api/order/checkout`,
          {
            cart,
            restaurantId: restaurant?._id,
            shipping_id: shippingAddress._id,
            addressLine1,
            addressLine2,
            cityName: restaurant?.cityId.cityName,
            pin_code: parseInt(pinCode),
          },
          { withCredentials: true }
        );
      }
      console.log(response);
      window.location.href = response.data.url;
      setCart([]);
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

  useEffect(() => {
    if (restaurant === null) return;
    localStorage.setItem(`cartItems-${restaurant?._id}`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/addresses`, {
          withCredentials: true,
        });
        console.log(response);
        setAddresses(response.data.addresses);
        if (response.data.addresses.length !== 0) {
          setShippingAddress(response.data.addresses[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserAddresses();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center my-16 gap-4">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          if (!isLoggedIn) {
                            setIsUserFromCart(true);
                            navigate("/login");
                            setRedirectRestaurantId(restaurant?._id!);
                          }
                        }}
                      >
                        {isLoggedIn ? "Checkout" : "Login before checkout"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order details</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      {!isNewAddress && (
                        <>
                          <div className="flex flex-col gap-2">
                            <div className="text-xl font-semibold">
                              Choose shipping address
                            </div>
                            {addresses.length === 0 && (
                              <>
                                <div className="text-gray-500">
                                  You have no addresses
                                </div>
                              </>
                            )}
                            {addresses?.map((address) => {
                              return (
                                <div
                                  key={address._id}
                                  onClick={() => setShippingAddress(address)}
                                  className={`flex flex-col gap-2 border-b cursor-pointer p-2 hover:bg-gray-100 hover:bg-gray-100 hover:duration-300 ${
                                    shippingAddress?._id === address._id
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-1">
                                    <CiLocationOn />
                                    <span>{address.cityId.cityName}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>{address.addressLine1},</span>
                                    <span>{address.addressLine2}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span>PIN:</span>
                                    <span>{address.pin_code}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                      {addresses.length < 4 && (
                        <Button
                          onClick={() => setIsNewAddress(!isNewAddress)}
                          variant="link"
                        >
                          {isNewAddress ? "Cancel" : "New address"}
                        </Button>
                      )}
                      {isNewAddress && (
                        <>
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <Input
                                readOnly
                                type="email"
                                value={loggedInUser?.email}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>Address Line 1</Label>
                              <Input
                                value={addressLine1}
                                onChange={(e) =>
                                  setAddressLine1(e.target.value)
                                }
                                type="text"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>Address Line 2</Label>
                              <Input
                                value={addressLine2}
                                onChange={(e) =>
                                  setAddressLine2(e.target.value)
                                }
                                type="text"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>City</Label>
                              <Input
                                readOnly
                                value={restaurant?.cityId.cityName}
                                type="text"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label>Pin code</Label>
                              <Input
                                type="text"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                maxLength={6}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <DialogFooter>
                        <DialogClose>Cancel</DialogClose>
                        {shippingAddress !== null && (
                          <Button onClick={checkoutOrder}>Checkout</Button>
                        )}
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
