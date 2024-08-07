import React from "react";
import "./index.css";

const Ball = ({ num, className, ...props }) => {
  return (
    <div className={`ball-container ${className}`} {...props}>
      {num}
    </div>
  );
};

export default Ball;
