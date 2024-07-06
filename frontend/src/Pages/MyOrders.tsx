import { backendUrl } from "@/App";
import MyOrderCard from "@/components/MyOrderCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

type SortByType = "1" | "-1";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortByOrder, setSortByOrder] = useState<SortByType>("-1");

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/order/getOrders/${sortByOrder}`,
          {
            withCredentials: true,
          }
        );
        console.log(response);
        setOrders(response.data.orders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyOrders();
  }, [sortByOrder]);

  return (
    <>
      <div className="flex flex-col mx-10 my-16">
        <div className="flex items-center justify-between my-4">
          <span className="text-xl font-semibold">Your orders</span>
          <span>
            <Select
              value={sortByOrder}
              onValueChange={(value: SortByType) => setSortByOrder(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-1">Newest to Oldest</SelectItem>
                <SelectItem value="1">Oldest to Newest</SelectItem>
              </SelectContent>
            </Select>
          </span>
        </div>
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            return <MyOrderCard key={order._id} order={order}/>;
          })}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
