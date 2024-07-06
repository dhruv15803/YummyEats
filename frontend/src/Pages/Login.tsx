import { GlobalContext, backendUrl } from "@/App";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalContextType } from "@/types";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [validFieldsErrorMsg, setValidFieldsErrorMsg] = useState<string>("");
  const [formErrorMsg, setFormErrorMsg] = useState<string>("");
  const {
    setLoggedInUser,
    setIsLoggedIn,
    setIsAdmin,
    isUserFromCart,
    redirectRestaurantId,
    setIsUserFromCart,
    setRedirectRestaurantId,
  } = useContext(GlobalContext) as GlobalContextType;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setFormErrorMsg("");
      setValidFieldsErrorMsg("");
      if (email.trim() === "" || password.trim() === "") {
        setValidFieldsErrorMsg("Please enter all fields");
        setTimeout(() => {
          setValidFieldsErrorMsg("");
        }, 4000);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response);
      setIsLoggedIn(true);
      setLoggedInUser(response.data.user);
      setIsAdmin(response.data.user.isAdmin);
      if (isUserFromCart) {
        navigate(`/restaurants/menu/${redirectRestaurantId}`);
        setIsUserFromCart(false);
        setRedirectRestaurantId("");
      } else {
        navigate("/");
      }
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
      <div className="flex flex-col justify-center sm:w-[60%] md:w-[50%] lg:w-[40%] mx-auto border my-16 p-4 rounded-lg shadow-md">
        <div className="text-xl font-semibold mb-4">User Login</div>
        <form onSubmit={(e) => handleLogin(e)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="eg: example@example.com"
            />
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
          <div className="flex items-center gap-1">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
              id="showPassword"
            />
            <Label htmlFor="showPassword">Show password</Label>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Don't have an account?</span>
            <Link
              className="text-md text-gray-600 font-semibold hover:text-black hover:duration-300"
              to="/register"
            >
              Click here to register
            </Link>
          </div>
          {validFieldsErrorMsg !== "" && (
            <div className="text-red-500">{validFieldsErrorMsg}</div>
          )}
          {formErrorMsg !== "" && (
            <div className="text-red-500">{formErrorMsg}</div>
          )}
          <Button>Login</Button>
        </form>
      </div>
    </>
  );
};

export default Login;
