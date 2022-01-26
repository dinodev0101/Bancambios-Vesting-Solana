import React from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
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
      try {
        const resp = await window.solana.connect();
        const publicKey = resp.publicKey.toString();
        if (publicKey) {
          localStorage.setItem("publicKey", publicKey);
          navigate("/cabinet", { state: { publicKey } });
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
      <div className={styles.text_container}>
        <Typography variant="h2" align="center">Are you an Bancambios investor?</Typography>
        <Typography variant="subtitle1" align="center">Connect a wallet to see your vested tokens</Typography>
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
