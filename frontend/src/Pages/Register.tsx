import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [validFieldsErrorMsg, setValidFieldsErrorMsg] = useState<string>("");
  const [passwordValidations, setPasswordValidations] = useState<string[]>([]);
  const { setLoggedInUser, setIsLoggedIn, setIsAdmin } = useContext(
    GlobalContext
  ) as GlobalContextType;
  const [formErrorMsg, setFormErrorMsg] = useState<string>("");

  const hasSpecialChar = () => {
    const specialChars = "@#$%&";
    let isSpecial = false;
    for (let i = 0; i < password.length; i++) {
      if (specialChars.includes(password.charAt(i))) {
        isSpecial = true;
        break;
      }
    }
    return isSpecial;
  };

  const hasNumericalChar = () => {
    const numericalChars = "0123456789";
    let isNum = false;
    for (let i = 0; i < password.length; i++) {
      if (numericalChars.includes(password.charAt(i))) {
        isNum = true;
        break;
      }
    }
    return isNum;
  };

  const hasUpperCase = () => {
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let isUppercase = false;
    for (let i = 0; i < password.length; i++) {
      if (upperCaseChars.includes(password.charAt(i))) {
        isUppercase = true;
        break;
      }
    }
    return isUppercase;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setPasswordValidations([]);
      const inputFields = [
        email,
        password,
        firstName,
        lastName,
        confirmPassword,
      ];
      for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].trim() === "") {
          setValidFieldsErrorMsg("Please enter all fields");
          setTimeout(() => {
            setValidFieldsErrorMsg("");
          }, 4000);
          return;
        }
      }
      // check if password===confirmpassword
      if (password !== confirmPassword) {
        setValidFieldsErrorMsg("passwords do not match");
        setTimeout(() => {
          setValidFieldsErrorMsg("");
        }, 4000);
        return;
      }
      // password validation:-
      // password should have length of 6
      // password should include atleast 1 special char
      // password shoult include atleast 1 numerical char
      // password should include atleast 1 uppercase char.
      let isPasswordValid = true;
      let temp = [];
      if (password.length < 6) {
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
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          email,
          firstName,
          lastName,
          password,
        },
        { withCredentials: true }
      );
      console.log(response);
      setIsLoggedIn(true);
      setLoggedInUser(response.data.newUser);
      setIsAdmin(response.data.newUser.isAdmin);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setFormErrorMsg(error.response.data.message);
      setTimeout(() => {
        setFormErrorMsg("");
      }, 4000);
    }
  };

  return (
    <>
      <div className="flex flex-col border p-4 rounded-lg shadow-md sm:w-[60%] md:w-[50%] lg:w-[40%] mx-auto my-16">
        <div className="text-xl font-semibold mb-4">User register</div>
        <form
          onSubmit={(e) => handleRegister(e)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="eg:example@example.com"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2 w-[50%]">
              <Label htmlFor="firstName">First name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                name="firstName"
                id="firstName"
              />
            </div>
            <div className="flex flex-col gap-2 w-[50%]">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                name="lastName"
                id="lastName"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              name="password"
              id="password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">confirm password</Label>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
            />
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
              id="showPassword"
            />
            <Label htmlFor="showPassword">show password</Label>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Already have an account?</span>
            <Link
              to="/login"
              className="text-gray-600 font-semibold hover:text-black hover:duration-300"
            >
              Click here to login
            </Link>
          </div>
          {validFieldsErrorMsg !== "" && (
            <div className="text-red-500">{validFieldsErrorMsg}</div>
          )}
          {formErrorMsg !== "" && (
            <div className="text-red-500">{formErrorMsg}</div>
          )}
          {passwordValidations.length !== 0 && (
            <div className="flex flex-col gap-1">
              {passwordValidations.map((item, i) => {
                return (
                  <span className="text-red-500" key={i}>
                    {item}
                  </span>
                );
              })}
            </div>
          )}
          <Button>Register</Button>
        </form>
      </div>
    </>
  );
};

export default Register;
