import React, { useEffect, useState } from "react";
import "./chekmark.scss";
export const Checkmark = ({ option, setOption }) => {
  // const handleDelete = (option) => {
  //   if (choosedOptions.includes(option)) {
  //     setChoosedOptions(
  //       choosedOptions.filter((selected) => selected !== option)
  //     );
  //   }
  // };
  return (
    <>
      {
        <div className="checkmark">
          <img
            className="checkmark__img"
            src={option.value.src}
            alt={option.value.src}
          />
          <span className="checkmark__label">{option.label}</span>
          <button className="checkmark__btn" onClick={() => setOption(option)}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.76339 6.71802C4.16287 6.32603 4.16287 5.68251 3.7634 5.29051L0.303506 1.89532C-0.0933214 1.50592 -0.0963338 0.867601 0.2968 0.474468L0.474468 0.2968C0.867603 -0.096335 1.50592 -0.0933211 1.89533 0.303508L5.29049 3.76341C5.68249 4.16289 6.32602 4.16288 6.71801 3.7634L10.113 0.303532C10.5024 -0.0933089 11.1408 -0.0963276 11.5339 0.296812L11.7116 0.47448C12.1047 0.867609 12.1017 1.50592 11.7049 1.89533L8.24508 5.29052C7.84562 5.68252 7.84563 6.32602 8.2451 6.71801L11.7048 10.113C12.1017 10.5024 12.1047 11.1407 11.7116 11.5339L11.5339 11.7116C11.1408 12.1047 10.5024 12.1017 10.113 11.7048L6.718 8.24511C6.32601 7.84564 5.6825 7.84564 5.29051 8.24509L1.89533 11.7049C1.50592 12.1017 0.867611 12.1047 0.474482 11.7116L0.296814 11.5339C-0.0963248 11.1408 -0.0933057 10.5024 0.303535 10.113L3.76339 6.71802Z"
              />
            </svg>
          </button>
        </div>
      }
    </>
  );
};
