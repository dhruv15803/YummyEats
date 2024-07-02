import { CartItem } from "@/types";
import React from "react";

type CartItemCardProps = {
  cartItem: CartItem;
  decrementQty: (itemId: string) => void;
  incrementQty: (itemId: string) => void;
};

const CartItemCard = ({
  cartItem,
  incrementQty,
  decrementQty,
}: CartItemCardProps) => {
    
  return (
    <div className="flex flex-col gap-2 border-b p-2">
      <div>{cartItem.itemName}</div>
      <div className="flex items-center gap-1">
        <span>₹</span>
        <span>{cartItem.itemPrice} x {cartItem.itemQty} = {cartItem.itemPrice * cartItem.itemQty}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => decrementQty(cartItem.itemId)}
          className="border rounded-full p-2 border-blue-300 hover:bg-blue-300 hover:duration-300 hover:text-white"
        >
          -
        </button>
        <span>{cartItem.itemQty}</span>
        <button
          onClick={() => incrementQty(cartItem.itemId)}
          className="border rounded-full p-2 border-blue-300 hover:bg-blue-300 hover:duration-300 hover:text-white"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
