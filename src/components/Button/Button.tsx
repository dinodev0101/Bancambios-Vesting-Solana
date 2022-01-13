import React, {FC, JSXElementConstructor, useEffect} from "react";
import styles from "./Button.module.css";
import PhantomIcon from "../../assets/Rectangle.svg";
import {Typography, Button} from "@mui/material";
import { styled } from '@mui/material/styles';
import {ExtendButtonBase} from "@mui/material/ButtonBase";
import {ButtonTypeMap} from "@mui/material/Button/Button";
import {CreateStyledComponent} from "@emotion/styled";

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
    // opacity: 0.5,
    height: "50px",
    width: "100%",
    maxHeight: "50px",
    maxWidth: "297px",
    color: "#FFFFFF",
    // border: "1px solid rgb(183,82,230)",
    background: "#5a5b62",
    // background: "#202124",
    borderRadius: "36px",
    textTransform: "none",
    fontFamily: '"Spy Agency", sans-serif',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '17.5px',
    letterSpacing: '-0.01em',
    textAlign: 'center',
    // border: "none",
    '&:hover': {
        // background: "linear-gradient(250.38deg, #EC26F5 -1.07%, #9F5AE5 92.17%)",
        background: "linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%)",
        boxShadow: "0px 0px 16px #9F5AE5",
        // border: "none",
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
    // borderImage: "linear-gradient(180deg, #b3f000, #00ed20, #09ff80, #00d5aa)",
    // borderImageSlice: "1",
    // "&:before":{},
    "&:hover": {
        border: "none",
        borderColor: "rgb(183,82,230)",
        background: "linear-gradient(266.19deg, #EC26F5 -9.56%, #9F5AE5 102.3%)",
        boxShadow: "0px 0px 16px #9F5AE5",
    },
}));

// const DisabledClaimButton = styled(Button)(({ theme }) => ({
//     opacity: "0.5",
//     cursor: "non-allowed",
//     height: "64px",
//     width: "100%",
//     maxHeight: "64px",
//     maxWidth: "434px",
//     color: "#FFFFFF",
//     background: "rgba(159, 90, 229, 0.3)",
//     borderRadius: "36px",
//     border: "3px solid",
//     borderColor: "rgb(183,82,230)",
//     // borderImage: "linear-gradient(180deg, #b3f000, #00ed20, #09ff80, #00d5aa)",
//     // borderImageSlice: "1",
//     // "&:before":{},
//     "&:hover": {
//         cursor: "non-allowed",
//         border: "none",
//         background: "rgba(159, 90, 229, 0.3)",
//         boxShadow: "0px 0px 16px #9F5AE5",
//     },
// }));

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
    // borderImage: "linear-gradient(180deg, #b3f000, #00ed20, #09ff80, #00d5aa)",
    // borderImageSlice: "1",
    // "&:before":{},
//     &.${buttonUnstyledClasses.disabled} {
//     opacity: 0.5;
//     cursor: not-allowed;
// }
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

    // console.log('Type = ')

    if (type === "connect") {
        StyledButton = ConnectButton;
    } else if (type === "disconnect") {
        StyledButton = DisconnectButton;
    } else if (type === "claim") {
        StyledButton = ClaimButton;
    }
    // else if (type === "claim" && disable) {
    //     StyledButton = DisabledClaimButton;
    // }
    else {
        StyledButton = DoneButton;
    }

    // useEffect(() => {
    //     if (type === "connect") {
    //         StyledButton = ConnectButton;
    //     } else if (type === "disconnect") {
    //         StyledButton = DisconnectButton;
    //     } else if (type === "claim") {
    //         StyledButton = ClaimButton;
    //     } else {
    //         StyledButton = DoneButton;
    //     }
    // }, [type])

  return (
      // <div className={
      //     disable ? styles.button_disable_container : styles.button_container
      // }>
      <div className={styles.button_container}>
        <StyledButton onClick={onClick} disabled={disable}>
            {isIconVisible && (
                <img alt={"icon"} src={PhantomIcon} className={styles.icon} />
            )}
            {/*<Typography variant="button">{title}</Typography>*/}
            {title}
        </StyledButton>
      </div>
    // <div
    //   aria-disabled={disable}
    //   onClick={onClick}
    //   className={
    //     disable ? styles.button_disable_container : styles.button_container
    //   }
    // >
    //   {isIconVisible && (
    //     <img alt={"icon"} src={PhantomIcon} className={styles.icon} />
    //   )}
    //   <Typography variant="button">{title}</Typography>
    //   {/*<p className={styles.button_text}>{title.toUpperCase()}</p>*/}
    // </div>
  );
};

export default ButtonComponent;
