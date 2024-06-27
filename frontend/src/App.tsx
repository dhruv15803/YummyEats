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
import { GlobalContextType, User } from "./types";
import axios from "axios";
export const backendUrl = "http://localhost:5000";
export const GlobalContext = createContext<GlobalContextType | null>(null);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
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
    getLoggedInUser();
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
            </Route>
          </Routes>
        </Router>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
