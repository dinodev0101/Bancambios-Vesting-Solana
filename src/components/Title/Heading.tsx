import { Typography } from "@mui/material";
import { styled, SxProps } from "@mui/material/styles";

interface TitleProps {
  text: string;
  sx?: SxProps;
}

const Heading: React.FC<TitleProps> = ({ text, sx }) => {
  return <HeadingStyled sx={sx}>{text.toUpperCase()}</HeadingStyled>;
};

const HeadingStyled = styled(Typography)(() => ({
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: "500",
  fontSize: "24px",
  lineHeight: "35px",
  letterSpacing: "0.03em",
  color: "#FFFFFF",
}));

export default Heading;
