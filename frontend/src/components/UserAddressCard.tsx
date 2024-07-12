import { Address } from "@/types";
import React, { SetStateAction, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";
import { backendUrl } from "@/App";

type UserAddressCardProps = {
  address: Address;
  addresses: Address[];
  setAddresses: React.Dispatch<SetStateAction<Address[]>>;
};

const UserAddressCard = ({
  address,
  addresses,
  setAddresses,
}: UserAddressCardProps) => {
  const [isEditAddress, setIsEditAddress] = useState<boolean>(false);
  const [newCityName, setNewCityName] = useState<string>("");
  const [newAddressLine1, setNewAddressLine1] = useState<string>("");
  const [newAddressLine2, setNewAddressLine2] = useState<string>("");
  const [newPinCode, setNewPinCode] = useState<string>("");
  const [addressEditErrMsg, setAddressEditErrMsg] = useState<string>("");

  const editAddress = async () => {
    try {
      if (
        newCityName.trim() === "" ||
        newAddressLine1.trim() === "" ||
        newAddressLine2.trim() === "" ||
        newPinCode.length !== 6
      ) {
        setAddressEditErrMsg("Please enter all fields");
        setTimeout(() => {
          setAddressEditErrMsg("");
        }, 4000);
        return;
      }

      const response = await axios.put(
        `${backendUrl}/api/user/editAddress`,
        {
          newCityName,
          newAddressLine1,
          newAddressLine2,
          newPinCode,
          id: address._id,
        },
        { withCredentials: true }
      );
      console.log(response);

      const newAddresses = addresses.map((a) => {
        if (a._id === address._id) {
          return response.data.updatedAddress;
        } else {
          return a;
        }
      });
      setAddresses(newAddresses);
      setIsEditAddress(false);
    } catch (error: any) {
      console.log(error);
      setAddressEditErrMsg(error.response.data.message);
      setTimeout(() => {
        setAddressEditErrMsg("");
      }, 4000);
    }
  };

  const toggleEdit = () => {
    if (isEditAddress === false) {
      setIsEditAddress(true);
      setNewCityName(address.cityId.cityName);
      setNewAddressLine1(address.addressLine1);
      setNewAddressLine2(address.addressLine2);
      setNewPinCode(String(address.pin_code));
    } else {
      setIsEditAddress(false);
    }
  };

  return (
    <>
      <div
        key={address._id}
        className="flex flex-col md:flex-row md:items-center gap-4 justify-between border-b p-2"
      >
        {isEditAddress ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  <CiLocationOn />
                </span>
                <Input
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  type="text"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
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
              <div className="flex items-center gap-2">
                <span>PIN:</span>
                <Input
                  value={newPinCode}
                  onChange={(e) => setNewPinCode(e.target.value)}
                  type="text"
                  minLength={6}
                  maxLength={6}
                />
              </div>
              {addressEditErrMsg !== "" && (
                <div className="text-red-500">{addressEditErrMsg}</div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-2">
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
          </>
        )}
        <div className="flex items-center gap-2">
          {isEditAddress && <Button onClick={editAddress}>Save changes</Button>}
          <Button onClick={toggleEdit} variant="outline">
            {isEditAddress ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserAddressCard;
