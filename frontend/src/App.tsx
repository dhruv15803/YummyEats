import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./Layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { createContext, useEffect, useState } from "react";
import { Cuisine, GlobalContextType, User } from "./types";
import axios from "axios";
import AdminLayout from "./Layouts/AdminLayout";
import AdminCuisine from "./Pages/AdminCuisine";
import AdminCity from "./Pages/AdminCity";
export const backendUrl = "http://localhost:5000";
export const GlobalContext = createContext<GlobalContextType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cuisines,setCuisines] = useState<Cuisine[]>([]);

  const getLoggedInUser = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/auth/getLoggedInUser`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      setIsLoggedIn(true);
      setIsAdmin(response.data.user.isAdmin);
    } catch (error) {
      console.log(error);
    }
  };

  const getCuisines = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/getCuisines`);
      console.log(response);
      setCuisines(response.data.cuisines);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getLoggedInUser();
    getCuisines();
  }, []);
  return (
    <>
      <GlobalContext.Provider
        value={{
          isLoggedIn,
          setIsLoggedIn,
          loggedInUser,
          setLoggedInUser,
          isAdmin,
          setIsAdmin,
          cuisines,
          setCuisines,
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<>Home</>} />
              <Route
                path="login"
                element={isLoggedIn ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="register"
                element={isLoggedIn ? <Navigate to="/" /> : <Register />}
              />
              <Route path="admin" element={isAdmin ? <AdminLayout/>:<Navigate to="/"/>}>
                <Route index element={<AdminCuisine/>}/>
                <Route path="city" element={<AdminCity/>}/>
              </Route>
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
