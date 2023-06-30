import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import "./css/LoadingMessage.css";

const LoadingMessage = ({ message }) => {
  return (
    <section className="loadingMessageBorder">
      <section className="loadingMessageContent">
        <AiOutlineClockCircle size={75} />
        <h1>Please wait</h1>
        <p>{message}</p>
      </section>
    </section>
  );
};

export default LoadingMessage;
