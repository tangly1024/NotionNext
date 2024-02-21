import React from "react";

function ButtonField({ isActive, onClick, text, className, customStyle }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: '11rem'
      }}
      className={
        "flex items-center tracking-tight rounded-full gap-1 justify-center px-3 py-2 cursor-pointer transition-all hover:shadow-md font-semibold" +
        " " +
        (isActive ? "bg-white text-dark/500 " : "bg-gray-200 text-gray/400") +
        className +
        " buttonfield-shadow"
      }
    >
      <div
        className={
          "rounded-full w-[10px] h-[10px] mr-2 " +
          (isActive ? customStyle || "bg-green-400" : "bg-gray-600")
        }
      />
      <div>{text}</div>
    </div>
  );
}

export default ButtonField;
