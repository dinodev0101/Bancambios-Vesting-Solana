import {Box, CircularProgress, Typography} from "@mui/material";
import React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Caption from "../Title/Caption";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import ButtonComponent from "../Button/Button";

interface CreateInvestorAccountModalProps {
  handleClose: () => void;
  isLoading: boolean;
  open: boolean;
  isError: boolean;
  wallet: string;
}

const CreateInvestorAccountModal: React.FC<CreateInvestorAccountModalProps> = ({
  open,
  isLoading,
  isError,
  handleClose,
  wallet,
}) => {
  return (
    <ModalWrapper
      open={open}
      handleClose={handleClose}
      title={"Creating new BX investor account"}
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
              Sorry, investor's vesting account was not created. Try again later.
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
              sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: { xs: "stretch", md: "center" },
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
          >
            <Box sx={{ p: { xs: 1, md: 3 } }}>
              <Typography variant={"subtitle1"} align={"center"}>Investor's vesting account successfully created:</Typography>
              <Caption
                  sx={{
                    p: 1,
                    backgroundColor: "#202124",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  text={wallet}
              />
            </Box>
            <Box
                sx={{
                  width: "100%",
                  display: { xs: "flex" },
                  justifyContent: "center",
                }}
            >
              <Box sx={{ width: "75%" }}>
                <ButtonComponent
                    type={"done"}
                    isIconVisible={false}
                    onClick={handleClose}
                    title={"Done"}
                />
              </Box>
            </Box>
          </Box>
      )}
    </ModalWrapper>
  );
};

export default CreateInvestorAccountModal;
