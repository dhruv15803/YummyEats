import { backendUrl, GlobalContext } from "@/App";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import UserAddresses from "@/components/UserAddresses";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";

const Profile = () => {
  const { loggedInUser, setLoggedInUser } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [newFirstName, setNewFirstName] = useState<string>(
    loggedInUser?.firstName || ""
  );
  const [newLastName, setNewLastName] = useState<string>(
    loggedInUser?.lastName || ""
  );
  const [currPassword, setCurrPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState<boolean>(false);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string>("");
  const [passwordValidations, setPasswordValidations] = useState<string[]>([]);
  const [isShowPasswords, setIsShowPasswords] = useState<boolean>(false);
  const { toast } = useToast();

  const hasSpecialChar = () => {
    const specialChars = "@#$%&";
    let isSpecial = false;
    for (let i = 0; i < newPassword.length; i++) {
      if (specialChars.includes(newPassword.charAt(i))) {
        isSpecial = true;
        break;
      }
    }
    return isSpecial;
  };

  const hasNumericalChar = () => {
    const numericalChars = "0123456789";
    let isNum = false;
    for (let i = 0; i < newPassword.length; i++) {
      if (numericalChars.includes(newPassword.charAt(i))) {
        isNum = true;
        break;
      }
    }
    return isNum;
  };

  const hasUpperCase = () => {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let isUppercase = false;
    for (let i = 0; i < newPassword.length; i++) {
      if (upperCaseChars.includes(newPassword.charAt(i))) {
        isUppercase = true;
        break;
      }
    }
    return isUppercase;
  };

  const checkPassword = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/checkPassword`,
        {
          currPassword,
        },
        { withCredentials: true }
      );
      console.log(response);
      setIsPasswordCorrect(response.data.isCorrect);
    } catch (error: any) {
      console.log(error);
      setIsPasswordCorrect(error.response.data.success);
      setPasswordErrorMsg(error.response.data.message);
      setTimeout(() => {
        setPasswordErrorMsg("");
      }, 4000);
    }
  };

  const updateUserPassword = async () => {
    try {
      // password validation checks before update
      let isPasswordValid = true;
      let temp = [];
      if (newPassword.length < 6) {
        temp.push("password should have minimum length of 6");
        isPasswordValid = false;
      }
      if (!hasSpecialChar()) {
        temp.push("password should include atleast 1 special char");
        isPasswordValid = false;
      }
      if (!hasNumericalChar()) {
        temp.push("password should include atleast 1 numerical char");
        isPasswordValid = false;
      }
      if (!hasUpperCase()) {
        temp.push("password should include atleast 1 uppercase char");
        isPasswordValid = false;
      }
      if (!isPasswordValid) {
        setPasswordValidations(temp);
        setTimeout(() => {
          setPasswordValidations([]);
        }, 4000);
        return;
      }
      const response = await axios.put(
        `${backendUrl}/api/user/updatePassword`,
        {
          newPassword,
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.newLoggedInUser);
      setCurrPassword("");
      setNewPassword("");
      setIsPasswordCorrect(false);
      toast({
        title: "password updated",
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (loggedInUser === null) {
    return (
      <>
        <div className="flex items-center gap-2">
          <Loader width="80" height="80" color="black" />
          <span className="text-xl font-semibold">Loading user details...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col  mx-10 my-16">
        <div className="text-2xl font-semibold mb-4">User profile</div>
        <div className="flex flex-col border rounded-lg p-4 shadow-md gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-lg">Email</Label>
            <Input
              className="bg-gray-100 cursor-pointer"
              readOnly
              value={loggedInUser.email}
              type="email"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 md:w-1/2">
              <Label>First Name</Label>
              <Input
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2 md:w-1/2">
              <Label>Last Name</Label>
              <Input
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                type="text"
              />
            </div>
          </div>
          <div className="flex justify-end">
            {(loggedInUser.firstName !== newFirstName ||
              loggedInUser.lastName !== newLastName) && (
              <Button>Save changes</Button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 border rounded-lg shadow-md my-6 p-4">
          <div className="text-xl font-semibold my-2">Change password</div>
          <div className="flex items-center gap-2">
            <Input
              value={currPassword}
              onChange={(e) => setCurrPassword(e.target.value)}
              type={isShowPasswords ? "text" : "password"}
              placeholder="Current password"
            />
            <Button onClick={checkPassword}>Submit password</Button>
          </div>
          {passwordErrorMsg !== "" && (
            <div className="text-red-500">{passwordErrorMsg}</div>
          )}
          {isPasswordCorrect && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={isShowPasswords ? "text" : "password"}
                  placeholder="New password"
                />
                <Button onClick={updateUserPassword}>Update password</Button>
              </div>
              <ul className="flex flex-col gap-2">
                {passwordValidations.map((validationMsg, i) => {
                  return (
                    <li className="text-red-500" key={i}>
                      {validationMsg}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <div className="flex items-center gap-2">
            <Checkbox
              onClick={() => setIsShowPasswords(!isShowPasswords)}
              checked={isShowPasswords}
            />
            <span className="font-semibold">Show passwords</span>
          </div>
        </div>
        <UserAddresses />
      </div>
    </>
  );
};

export default Profile;
