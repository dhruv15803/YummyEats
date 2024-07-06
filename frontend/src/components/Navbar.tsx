import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext } from "react";
import { GlobalContext, backendUrl } from "@/App";
import { GlobalContextType } from "@/types";
import { RxAvatar } from "react-icons/rx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    setLoggedInUser,
    loggedInUser,
    isAdmin,
    setIsAdmin,
  } = useContext(GlobalContext) as GlobalContextType;

  const logoutUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      console.log(response);
      setIsLoggedIn(false);
      setLoggedInUser(null);
      setIsAdmin(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <nav className="flex items-center p-4 justify-between border-b">
        <div className="text-2xl font-semibold">
          <Link to="/"> YummyEats</Link>
        </div>
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <div className="text-4xl">
                      <RxAvatar />
                    </div>
                    <span className="font-semibold text-lg">
                      {loggedInUser?.email}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/manage/restaurant")}
                  >
                    Manage restaurant
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      Admin panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/orders")}>
                    Your orders
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Logout</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logoutUser}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <>
            <div className="mx-10">
              <Button onClick={() => navigate("/login")} variant="outline">
                Login
              </Button>
            </div>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
