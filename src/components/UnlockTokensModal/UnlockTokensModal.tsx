import {Box, Typography} from "@mui/material";
import * as React from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import moment from "moment";

interface CongratulationsModalProps {
  isOpen: boolean;
  handleUnlocksModal: () => void;
  allUnlocks: Array<{date: string, tokens: string}>;
}

const UnlockTokensModal: React.FC<CongratulationsModalProps> = ({
  isOpen,
  handleUnlocksModal,
  allUnlocks,
}) => {
  return (
    <ModalWrapper
      open={isOpen}
      handleClose={handleUnlocksModal}
      title={"Tokens unlocking info"}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "stretch", md: "center" },
          flexDirection: "column",
          width: "100%",
        }}
      >
          <Box sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: "row",
              width: "100%",
              margin: "8px 0 8px 0"
          }}>
              {/*<Typography*/}
              {/*    variant={"h3"}*/}
              {/*    textAlign={"center"}*/}
              {/*    sx={{ width: '24px' }}*/}
              {/*>*/}
              {/*    №*/}
              {/*</Typography>*/}
              <Typography
                  variant={"h3"}
                  textAlign={"center"}
                  sx={{ width: '144px' }}
              >
                  Date
              </Typography>
              <Typography
                  variant={"h3"}
                  textAlign={"center"}
                  sx={{ width: '144px' }}
              >
                  Tokens
              </Typography>
          </Box>
          <Box sx={{
              display: "flex",
              alignItems: { xs: "stretch", md: "center" },
              flexDirection: "column",
              width: "100%",
          }}>
              {allUnlocks.map((unlock, index) => (
                  <Box key={index} sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: { xs: "stretch", md: "center" },
                      flexDirection: "row",
                      width: "100%",
                  }}>
                    {/*<Typography*/}
                    {/*    variant={"body1"}*/}
                    {/*    textAlign={"center"}*/}
                    {/*    sx={{ width: '24px' }}*/}
                    {/*>*/}
                    {/*    {index}*/}
                    {/*</Typography>*/}
                    <Typography
                        variant={"body1"}
                        textAlign={"center"}
                        sx={{ width: '144px' }}
                    >
                        {moment.unix(+unlock.date).format("L")}
                    </Typography>
                    <Typography
                        variant={"body1"}
                        textAlign={"center"}
                        sx={{ width: '144px' }}
                    >
                        {unlock.tokens}
                    </Typography>
                  </Box>
              ))}
          </Box>
      </Box>
    </ModalWrapper>
  );
};

export default UnlockTokensModal;
