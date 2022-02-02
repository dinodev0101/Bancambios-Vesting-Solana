import { Typography } from "@mui/material";
import { SxProps } from "@mui/material/styles";
import React from "react";

interface TitleProps {
  text: string;
  sx?: SxProps;
}

const Heading: React.FC<TitleProps> = ({ text, sx }) => {
  return <Typography variant={"h3"} align={"center"}>{text.toUpperCase()}</Typography>;
};

export default Heading;
