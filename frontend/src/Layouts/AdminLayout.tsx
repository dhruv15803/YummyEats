import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <div className="flex items-center gap-4 my-16 mx-10">
        <NavLink
          end
          to="."
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-8 font-semibold text-lg"
              : " font-semibold text-lg"
          }
        >
          Manage cuisines
        </NavLink>
        <NavLink
          to="city"
          className={({ isActive }) =>
            isActive
              ? "underline underline-offset-8 font-semibold text-lg"
              : " font-semibold text-lg"
          }
        >
          Manage cities
        </NavLink>
      </div>
      <Outlet />
    </>
  );
};

export default AdminLayout;
