import React from "react";
import { Outlet } from "react-router-dom";
import "./css/Screen.css";

const Screen = () => {
  return (
    <main id="screen" className="column">
      <Outlet />
    </main>
  );
};

export default Screen;
