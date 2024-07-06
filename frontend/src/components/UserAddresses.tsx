import { backendUrl, GlobalContext } from "@/App";
import { Address, City, GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import UserAddressCard from "./UserAddressCard";

const UserAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { loggedInUser, cities } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [addressErrorMsg, setAddressErrorMsg] = useState<string>("");
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);

  const addAddress = async () => {
    try {
      // if addresses is equal to 4 , no adding more
      if (addresses.length >= 4) {
        setAddressErrorMsg("You can have only 4 active addresses");
        setTimeout(() => {
          setAddressErrorMsg("");
        }, 4000);
        return;
      }
      if (
        cityName.trim() === "" ||
        addressLine1.trim() === "" ||
        addressLine2.trim() === "" ||
        pinCode.trim().length !== 6
      ) {
        setAddressErrorMsg("Please enter valid inputs");
        setTimeout(() => {
          setAddressErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/user/addAddress`,
        {
          cityName,
          addressLine1,
          addressLine2,
          pinCode,
        },
        { withCredentials: true }
      );
      console.log(response);
      setAddresses((prev) => [...prev, response.data.newAddress]);
      setCityName("");
      setAddressLine1("");
      setAddressLine2("");
      setPinCode("");
    } catch (error: any) {
      console.log(error);
      setAddressErrorMsg(error.response.data.message);
      setTimeout(() => {
        setAddressErrorMsg("");
      }, 4000);
    }
  };

  const removeAddress = async (id: string) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/user/deleteAddress/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      const newAddresses = addresses.filter((address) => address._id !== id);
      setAddresses(newAddresses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/user/addresses`, {
          withCredentials: true,
        });
        console.log(response);
        setAddresses(response.data.addresses);
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserAddresses();
  }, []);

  useEffect(() => {
    const suggestCities = () => {
      if (cityName.trim() === "") {
        setSuggestedCities([]);
        return;
      }
      if (cityName.length < 2) return;
      let temp = [];
      for (let i = 0; i < cities.length; i++) {
        if (cityName.trim().toLowerCase() === cities[i].cityName) {
          temp = [];
          break;
        }
        if (cities[i].cityName.includes(cityName.trim().toLowerCase())) {
          temp.push(cities[i]);
        }
      }
      setSuggestedCities(temp);
    };
    suggestCities();
  }, [cityName]);

  return (
    <>
      <div className="flex flex-col border rounded-lg shadow-md p-4">
        <div className="text-xl font-semibold mb-4">User addresses</div>
        {addresses.map((address) => {
          return (
            <UserAddressCard
              key={address._id}
              address={address}
              removeAddress={removeAddress}
              addresses={addresses}
              setAddresses={setAddresses}
            />
          );
        })}
        <div className="flex justify-end my-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add address</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add address</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Input
                    className="bg-gray-100"
                    readOnly
                    type="email"
                    value={loggedInUser?.email}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Address Line 1</Label>
                  <Input
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Address Line 2</Label>
                  <Input
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>City</Label>
                  <Input
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    type="text"
                  />
                  {suggestedCities.map((city) => {
                    return (
                      <div
                        onClick={() => setCityName(city.cityName)}
                        className="border p-2 rounded-lg hover:bg-gray-100 hover:duration-300"
                        key={city._id}
                      >
                        {city.cityName}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Pin code</Label>
                  <Input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    minLength={6}
                    maxLength={6}
                  />
                </div>
              </div>
              {addressErrorMsg !== "" && (
                <div className="text-red-500">{addressErrorMsg}</div>
              )}
              <DialogFooter>
                <DialogClose>Cancel</DialogClose>
                <Button onClick={addAddress}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default UserAddresses;
