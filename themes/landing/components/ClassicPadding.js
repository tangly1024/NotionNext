import React from "react";

function ClassicPadding({ children, className }) {
  return (
    <div className={"px-4 md:px-56 2xl:px-96" + " " + className}>
      {children}
    </div>
  );
}

export default ClassicPadding;