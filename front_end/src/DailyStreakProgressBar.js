import React from "react";
import "./css/DailyStreakProgressBar.css";

const DailyStreakProgressBar = ({ completed }) => {
  return (
    <div id="container">
      <div id="filler" style={{ width: `${completed * 0.99}%` }}>
        <span id="label">
          {completed < 100
            ? completed > 25
              ? `${completed}% daily goal`
              : ""
            : "Daily goal completed"}
        </span>
      </div>
    </div>
  );
};

export default DailyStreakProgressBar;
