import {Box, Typography} from "@mui/material";
import * as React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import Caption from "../Title/Caption";
import ButtonComponent from "../Button/Button";

interface CongratulationsModalProps {
  isOpen: boolean;
  wallet: string;
  handleClose: () => void;
}

const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  isOpen,
  wallet,
  handleClose,
}) => {
  return (
    <ModalWrapper
      open={isOpen}
      handleClose={handleClose}
      title={"Claim BX tokens"}
    >
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
          <Typography variant={"subtitle1"} align={"center"}>
              Claimed tokens have been sent to you wallet:
          </Typography>
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
    </ModalWrapper>
  );
};

export default CongratulationsModal;
