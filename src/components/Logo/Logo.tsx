import React from "react";
import styles from "./Login.module.css";
import LogoImage from "../../assets/bancambiosLogo.svg";

const sxStyles = {
  logo: {
    height: "56px",
    width: "204px",
    // left: 93px;
    // top: 29px;
    // border-radius: 0px;
// maxHight: 150px;
//     maxWidth: 200px;
  },
} as const;

const Logo = () => {

  return (
    <div style={{width: "100%", display: "flex", justifyContent: "center", margin: "0 0 5px 0"}}>
      <img alt={"logo"} src={LogoImage} style={{ height: "56px", width: "204px"}}/>
    </div>
  );
};

export default Logo;
