import React from "react";
import styles from "./Login.module.css";
import Logo from "../../assets/bancambiosLogo.svg";
import { useNavigate } from "react-router-dom";
import {Typography} from "@mui/material";
import ButtonComponent from "../../components/Button/Button";

declare global {
  interface Window {
    solana: any;
  }
}

const Login = () => {
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    const isPhantomInstalled: boolean | undefined =
      window?.solana && window?.solana?.isPhantom;

    if (isPhantomInstalled) {
      console.log(isPhantomInstalled, "isPhantomInstalled");
      try {
        const resp = await window.solana.connect();
        const publicKey = resp.publicKey.toString();
        if (publicKey) {
          localStorage.setItem("publicKey", publicKey);
          navigate("/cabinet", { state: { publicKey } });
          console.log(window.solana.isConnected);
        }
      } catch (err) {
        handleConnectWallet();
        console.log("isPhantomInstalled === e ===", err);
      }
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  return (
    <>
      {/*<img alt={"logo"} src={Logo} className={styles.logo} />*/}
      <div className={styles.text_container}>
        <Typography variant="h2" align="center">Are you an Bancambios investor?</Typography>
        {/*<p className={styles.text}>Are you an Bancambios investor? </p>*/}
        <Typography variant="subtitle1" align="center">Connect a wallet to see your vested tokens</Typography>
        {/*<p className={styles.text_black}>*/}
        {/*  Connect a wallet to see your vested tokens*/}
        {/*</p>*/}
        <div className={styles.button_container}>
          <ButtonComponent
              type={"connect"}
            isIconVisible={true}
            onClick={handleConnectWallet}
            title={"Connect Wallet"}
          />
        </div>
      </div>
    </>
  );
};

export default Login;
