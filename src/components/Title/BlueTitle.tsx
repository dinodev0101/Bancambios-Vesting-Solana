import { Typography } from "@mui/material";
import React from "react";

interface TitleProps {
  text: string;
  isUpperCase?: boolean;
}

const Title: React.FC<TitleProps> = ({ text, isUpperCase = true }) => {
  return <Typography variant={"h3"} align={"center"}>{isUpperCase ? text.toUpperCase() : text}</Typography>;
};

export default Title;
