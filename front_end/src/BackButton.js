import React from "react";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

const BackButton = ({ onClick }) => {
  return (
    <button type="button" className="backButton" onClick={() => onClick()}>
      <BsFillArrowLeftSquareFill size={30} />
    </button>
  );
};

export { BackButton };
