import { Typography } from "@mui/material";
import { styled, SxProps } from "@mui/material/styles";
import React from "react";

interface TitleProps {
  text: string;
  sx?: SxProps;
}

const Caption: React.FC<TitleProps> = ({ text, sx }) => {
  return <CaptionStyled sx={sx}>{text}</CaptionStyled>;
  // return <Typography variant={"body2"} align={"center"}>{text}</Typography>
};

const CaptionStyled = styled(Typography)(() => ({
  fontFamily: '"Saira", sans-serif',
  fontSize: '12px',
  fontStyle: 'normal',
  fontWeight: 600,
  lineHeight: '19px',
  letterSpacing: '0em',
  textAlign: 'center',
}));

export default Caption;
