import React from "react";
import "./css/FormInput.css";

const FormInput = ({ name, value, setValue }) => {
  return (
    <>
      <label id="formInputLabel" htmlFor={name}>
        {name}
      </label>
      {!(name === "Password" || name === "Confirm Password") && (
        <input
          className="formInputInput"
          id={name}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.trim());
          }}
        ></input>
      )}
      {(name === "Password" || name === "Confirm Password") && (
        <input
          className="formInputInput"
          id={name}
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value.trim());
          }}
        ></input>
      )}
    </>
  );
};

export default FormInput;
