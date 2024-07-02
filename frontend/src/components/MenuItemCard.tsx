import { CartItem, MenuItem } from "@/types";
import React, { SetStateAction } from "react";
import { BiDish } from "react-icons/bi";
import { Button } from "./ui/button";

type MenuItemCardProps = {
  item: MenuItem;
  cart: CartItem[];
  setCart: React.Dispatch<SetStateAction<CartItem[]>>;
};

const MenuItemCard = ({ item, cart, setCart }: MenuItemCardProps) => {
  const addToCart = () => {
    // use the setCart function to append item to cart
    // if item already in cart , increase the qty.
    let isItemInCart = false;
    const newCart = cart.map((cartItem) => {
      if (cartItem.itemId === item._id) {
        isItemInCart = true;
        return {
          ...cartItem,
          itemQty: cartItem.itemQty + 1,
        };
      } else {
        return cartItem;
      }
    });
    setCart(newCart);
    if (!isItemInCart) {
      setCart((prev) => [
        ...prev,
        {
          itemId: item._id,
          itemName: item.item_name,
          itemPrice: item.item_price,
          itemQty: 1,
        },
      ]);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex-col gap-2">
          <div className="text-xl font-semibold">{item.item_name}</div>
          <div className=" flex flex-wrap text-gray-500 text-md">
            {item.item_description}
          </div>
          <div className="flex items-center gap-1">
            <BiDish />
            <span>{item.item_cuisine.cuisineName}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>₹</span>
            <span>{item.item_price}</span>
          </div>
        </div>
        <div>
          <Button onClick={addToCart}>Add to cart</Button>
        </div>
      </div>
    </>
  );
};

export default MenuItemCard;
