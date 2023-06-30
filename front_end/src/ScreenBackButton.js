import { React, useState } from "react";
import { BsFillArrowLeftSquareFill, BsArrowLeftSquare } from "react-icons/bs";

const ScreenBackButton = ({ onClick }) => {
  const [hover, setHover] = useState(false);

  return (
    <>
      {!hover && (
        <button
          type="button"
          className="screenBackButton"
          onClick={() => onClick()}
          onMouseOver={() => {
            setHover(true);
          }}
        >
          <BsFillArrowLeftSquareFill size={30} />
        </button>
      )}
      {hover && (
        <button
          type="button"
          className="screenBackButton"
          onClick={() => onClick()}
          onMouseOut={() => {
            setHover(false);
          }}
        >
          <BsArrowLeftSquare size={30} />
        </button>
      )}
    </>
  );
};

export { ScreenBackButton };
