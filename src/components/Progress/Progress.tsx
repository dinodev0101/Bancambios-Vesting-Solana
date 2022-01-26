import * as React from "react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

interface LinearProgressWithLabelProps {
  value: string;
  topText: string;
  topStickyText: string;
  bottomText: string;
  bottomStickyText: string;
}

const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = ({
  value,
  topText,
  topStickyText,
  bottomStickyText,
  bottomText,
}) => {
  return (
    <Box sx={{ width: "100%", paddingY: 2 }}>
      <Box sx={{ width: "100%", position: "relative" }}>
        <RelativeTopText
          sx={{
            left: `0`,
          }}
        >
          {topText}
        </RelativeTopText>
        <RelativeTopText sx={{ right: 0 }}>{topStickyText}</RelativeTopText>
        <BorderLinearProgress
          variant="determinate"
          value={+value}
          sx={{ height: "15px", borderRadius: "25px" }}
        />
        <RelativeBottomText
          sx={{
            left: `0`,
          }}
        >
          {bottomText}
        </RelativeBottomText>
        <RelativeBottomText sx={{ right: 0 }}>
          {bottomStickyText}
        </RelativeBottomText>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;

const BorderLinearProgress = styled(LinearProgress)(() => ({
  width: "100%",
  height: 15,
  borderRadius: 25,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    background: "rgb(183,82,230)",
    boxShadow: "inset 0px 4px 4px #BAE0FF",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 25,
    background: "#0056FD",
    border: "1px solid",
    borderColor: "rgb(183,82,230)",
  },
}));

const RelativeTopText = styled(Typography)(() => ({
  display: "inline-block",
  margin: 0,
  fontFamily: "Saira",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "21px",
  letterSpacing: "0em",
  position: "absolute",
  color: "#FFFFFF",
  bottom: 15,
}));

const RelativeBottomText = styled(Typography)(() => ({
  display: "inline-block",
  fontFamily: "Saira",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: "600",
  lineHeight: "21px",
  letterSpacing: "0em",
  position: "absolute",
  color: "#FFFFFF",
  textAlign: "right",
  top: 15,
}));
