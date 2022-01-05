import React, { useEffect, useState } from "react";
import styles from "./Logout.module.css";
import Logo from "../../assets/logo.svg";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router";

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
      <img alt={"logo"} src={Logo} className={styles.logo} />
      <div className={styles.text_container}>
        <p className={styles.text_black}>
          Sorry, it looks like you’re not an Elumia investor.
          <br />
          Try to connect another wallet to see your vested tokens
        </p>
        <div className={styles.wallet_container}>
          <div className={styles.wallet_address}>
            <p className={styles.address}>
              {newWalletKey}
            </p>
          </div>
        </div>
        <div className={styles.button_container}>
          <Button
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
