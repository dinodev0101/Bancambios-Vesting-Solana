import React, { useEffect, useState } from "react";
import styles from "./Logout.module.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router";
import {Typography} from "@mui/material";
import Caption from "../../components/Title/Caption";

const Logout = () => {
  const navigate = useNavigate();
  const handleDisconnectWallet = () => {
    window.solana.disconnect();
    navigate("/");
  };
  const [newWalletKey, setNewWalletKey] = useState<string | null>();

  useEffect(() => {
    const newWalletKey = localStorage.getItem("publicKey");
    setNewWalletKey(newWalletKey);
    return () => {
      setNewWalletKey("");
    };
  }, []);

  return (
    <>
      <div className={styles.text_container}>
        <Typography variant="h2" align="center">Sorry, it looks like you’re not an Bancambios investor.</Typography>
        <Typography variant="subtitle1" align="center"> Try to connect another wallet to see your vested tokens</Typography>
        <div className={styles.wallet_container}>
            <Caption
                sx={{
                  p: 1,
                  backgroundColor: "#202124",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                text={newWalletKey!}
            />
        </div>
        <div className={styles.button_container}>
          <Button
              type={"disconnect"}
            isIconVisible={false}
            onClick={handleDisconnectWallet}
            title={"Disconnect wallet"}
          />
        </div>
      </div>
    </>
  );
};

export default Logout;
