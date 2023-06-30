import React from "react";
import "./css/ErrorMessage.css";

const ErrorMessage = ({ errors }) => {
  return (
    <ul id="errorMessage">
      {errors.map((error) => {
        {
          /* React requires list items to have unique keys 
            That is why there is the key attribute within the li element
        */
        }
        return <li key={error.toString()}>{error}</li>;
      })}
    </ul>
  );
};

export default ErrorMessage;
