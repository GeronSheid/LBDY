import React, { useState } from "react";
import "./filterIndicator.scss";

export const FilterIndicator = ({ label, onClick }) => {
  const [isActive, setIsActive] = useState("notSorted");
  const indicatorClass = {
    notSorted: "indicator",
    false: "indicator indicator_down",
    true: "indicator indicator_up",
  };
  
  return (
    <label className="indicator__label">
      <button
        className={indicatorClass[isActive]}
        onClick={() => onClick(label, setIsActive, !isActive)}
      >
        <span className="indicator__row"></span>
        <span className="indicator__row"></span>
        <span className="indicator__row"></span>
      </button>
      <span>{label}</span>
    </label>
  );
};
