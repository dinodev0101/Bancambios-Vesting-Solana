import {Box, CircularProgress, Typography} from "@mui/material";
import React from "react";
import Button from "../Button/Button";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Caption from "../Title/Caption";
import Heading from "../Title/Heading";
import FmdBadIcon from "@mui/icons-material/FmdBad";

interface ClaimModalProps {
  handleClose: () => void;
  handleClaim: () => void;
  isLoading: boolean;
  open: boolean;
  isError: boolean;
  errorMessage: string;
  available: string;
}

const ClaimModal: React.FC<ClaimModalProps> = ({
  open,
  isLoading,
  isError,
  errorMessage,
  available,
  handleClose,
  handleClaim,
}) => {
  return (
    <ModalWrapper
      open={open}
      handleClose={handleClose}
      title={"Claim BX tokens"}
    >
      {isError ? (
          <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "70px",
              }}
          >
            <FmdBadIcon sx={{ color: "rgb(183,82,230)", fontSize: 90, marginBottom: "10px", }} />
            <Typography variant={"subtitle1"} align={"center"}>
              Sorry, {errorMessage.toLowerCase()} Try again later.
            </Typography>
          </Box>
        ) : isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress
            style={{ color: "rgb(183,82,230)" }}
            thickness={6}
            size={50}
          />
          <Caption sx={{ p: 2 }} text={"Processing"} />
        </Box>
      ) : (
        <Box
          px={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Caption text={"Tokens Available to Claim"} />
          <Heading
            sx={{
              textAlign: "center",
              fontSize: { xs: "48px", lg: "64px" },
              padding: 0,
              wordWrap: "break-word",
              lineHeight: { xs: "50px" },
            }}
            text={available + " bx"}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pb: 4,
              flexDirection: "column",
            }}
          >
            <Caption
              sx={{ padding: 2, color: "#808080" }}
              text={
                "After you claim the tokens, they will be sent to your wallet address"
              }
            />
            <Box sx={{ width: "75%" }}>
              <Button
                  type={"claim"}
                title={"claim ALL!"}
                isIconVisible={false}
                onClick={handleClaim}
              />
            </Box>
          </Box>
        </Box>
      )}
    </ModalWrapper>
  );
};

export default ClaimModal;
