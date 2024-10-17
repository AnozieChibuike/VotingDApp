import React from "react";
import "./Whitelist.css";

const WhiteList = () => {
  return (
    <div classname="root">
      <p>Join the whitelist</p>
      <div className="join">
        <input
          className="reg"
          type="text"
          name="whitelist"
          id="whitelist"
          placeholder="Registration Number"
        />
        <button>Join</button>
      </div>
    </div>
  );
};

export default WhiteList;
