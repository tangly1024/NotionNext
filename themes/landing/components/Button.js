import React from "react";

function Button({ className, onClick, text, icon, type = "normal" }) {
  switch (type) {
    case "normal":
      return (
        <div
          onClick={onClick}
          className={
            "flex items-center rounded-full gap-1 justify-center px-7 py-2 brand-button text-white cursor-pointer transition-all drop-shadow-md  hover:shadow-md font-semibold" +
            " " +
            className
          }
        >
          <div>{text}</div>
          <div className="font-medium text-xl ">{icon}</div>
        </div>
      );
    case "white":
      return (
        <div
          onClick={onClick}
          className={
            "flex items-center rounded-full gap-1 justify-center px-7 py-2 bg-white text-green/300 cursor-pointer transition-all hover:shadow-md font-semibold" +
            " " +
            className
          }
        >
          <div>{text}</div>
          <div className="font-medium text-xl ">{icon}</div>
        </div>
      );
  }
}

export default Button;
