import React, { FC } from "react";
import styles from "./Button.module.css";
import PhantomIcon from "../../assets/Rectangle.svg";
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';

export interface ButtonProps {
    type: string;
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    isIconVisible?: boolean;
    disable?: boolean;
}

const ConnectButton = styled(Button)(({ theme }) => ({
    height: "64px",
    width: "100%",
    maxHeight: "64px",
    maxWidth: "434px",
    color: "#FFFFFF",
    background: "rgba(1, 86, 255, 0.3)",
    borderRadius: "36px",
    border: "3px solid rgb(102, 73, 243)",
    textTransform: "none",
    '&:hover': {
        border: "none",
        borderColor: "rgb(102, 73, 243)",
        background: "linear-gradient(257.52deg, #0156FF -5.37%, #9F5AE5 84.69%)",
        boxShadow: "0px 0px 16px #0156FF",
    },
}));

const DisconnectButton = styled(Button)(({ theme }) => ({
    height: "50px",
    width: "100%",
    maxHeight: "50px",
    maxWidth: "297px",
    color: "#FFFFFF",
    background: "#5a5b62",
    borderRadius: "36px",
    textTransform: "none",
    fontFamily: '"Spy Agency", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '17.5px',
    letterSpacing: '-0.01em',
    textAlign: 'center',
    '&:hover': {
        background: "linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%)",
        boxShadow: "0px 0px 16px #9F5AE5",
    },
}));

const ClaimButton = styled(Button)(({ theme }) => ({
    height: "64px",
    width: "100%",
    maxHeight: "64px",
    maxWidth: "434px",
    color: "#FFFFFF",
    background: "rgba(159, 90, 229, 0.3)",
    borderRadius: "36px",
    border: "3px solid",
    borderColor: "rgb(183,82,230)",
    pointerEvents: "none",
    "&:hover": {
        border: "none",
        borderColor: "rgb(183,82,230)",
        background: "linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%)",
        boxShadow: "0px 0px 16px #9F5AE5",
    },
    "&:disabled": {
        color: "#FFFFFF",
        opacity: "0.5",
    },
}));

const DoneButton = styled(Button)(({ theme }) => ({
    height: "100%",
    width: "100%",
    maxHeight: "64px",
    maxWidth: "434px",
    color: "#FFFFFF",
    background: "rgba(159, 90, 229, 0.3)",
    borderRadius: "36px",
    border: "3px solid",
    borderColor: "rgb(183,82,230)",
    "&:hover": {
        border: "none",
        borderColor: "rgb(183,82,230)",
        background: "linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%)",
        boxShadow: "0px 0px 16px #9F5AE5",
    },
}));

const ButtonComponent: FC<ButtonProps> = ({
    type,
  title,
  onClick,
  isIconVisible = true,
  disable = false,
}) => {
    let StyledButton: any;

    if (type === "connect") {
        StyledButton = ConnectButton;
    } else if (type === "disconnect") {
        StyledButton = DisconnectButton;
    } else if (type === "claim") {
        StyledButton = ClaimButton;
    }
    else {
        StyledButton = DoneButton;
    }

  return (
      <div className={disable ? styles.button_disable_container : styles.button_container}>
        <StyledButton onClick={onClick} disabled={disable}>
            {isIconVisible && (
                <img alt={"icon"} src={PhantomIcon} className={styles.icon} />
            )}
            {title}
        </StyledButton>
      </div>
  );
};

export default ButtonComponent;
