import React from "react";
import LogoImage from "../../assets/bancambiosLogo.svg";

const Logo = () => {

  return (
    <div style={{width: "100%", display: "flex", justifyContent: "center", margin: "0 0 5px 0"}}>
      <img alt={"logo"} src={LogoImage} style={{ height: "56px", width: "204px"}}/>
    </div>
  );
};

export default Logo;
