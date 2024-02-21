import React from "react";

function BulletPoint({ icon, header, subtitle }) {
  return (
    <div className="flex flex-row gap-4">
      <div className="hidden md:flex items-center justify-center py-1 border border-gray/300 drop-shadow-lg bg-white rounded-lg px-4 w-[50px] h-[50px] flex items-center justify-center">
        {icon}
      </div>
      <div className="">
        <div className="font-semibold md:font-bold text-xl tracking-tighter text-left">
          {header}
        </div>
        <div className="text-default text-base mt-1 text-left ">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default BulletPoint;
