import React from "react";
import { Link } from "react-router-dom";
import "./css/Landing.css";

const Landing = () => {
  return (
    <main id="landingPage" className="column center">
      <h1>Welcome to Quick Cards!</h1>
      <section id="landingPageLinks" className="row">
        <Link to="/signup" className="landingPageLink button">
          SignUp
        </Link>
        <Link to="/login" className="landingPageLink button">
          Login
        </Link>
      </section>
    </main>
  );
};

export default Landing;
