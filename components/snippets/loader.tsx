import React from "react";

const Loader = () => {
  return (
    <div>
      <div className="animate-pulse space-y-2">
        <div className="bg-gamma opacity-20 h-8"></div>
        <div className="h-8 bg-gamma opacity-20 w-full"></div>
        <div className="h-8 bg-gamma opacity-20 w-full"></div>
      </div>
    </div>
  );
};

export default Loader;
