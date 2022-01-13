import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface TitleProps {
  text: string;
  isUpperCase?: boolean;
}

const Title: React.FC<TitleProps> = ({ text, isUpperCase = true }) => {
  // return <BlueTitle>{isUpperCase ? text.toUpperCase() : text}</BlueTitle>;
  return <Typography variant={"h3"} align={"center"}>{isUpperCase ? text.toUpperCase() : text}</Typography>;
};

const BlueTitle = styled(Typography)(() => ({
  // color: "#1395FF",
  color: "rgba(236, 38, 245, 1)",
  fontFamily: "Poppins",
  fontSize: "24px",
  fontWeight: "500",
  lineHeight: "35px",
  letterSpacing: "0.03em",
  textAlign: "center",
}));

export default Title;
