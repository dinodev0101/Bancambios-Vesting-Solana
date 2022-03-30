import * as React from "react";
import {Box, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import FmdBadIcon from "@mui/icons-material/FmdBad";
import CloseIcon from "@mui/icons-material/Close";
import {ActionType} from "../../types";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Row from "../../pages/InvestorRegistration/components/Row";

interface CreateInvestorAccountModalProps {
    action: ActionType;
    actualIndex: number;
    totalAmount: number;
    handleClose: () => void;
    isLoading: boolean;
    open: boolean;
    isError: boolean;
    errorMessage: string;
    checkedInvestorList: {vestingType: string, wallet: string, tokens: number}[];
    vestingAccountExistList: {vestingType: string, wallet: string, tokens: number}[];
    walletErrorList: {vestingType: string, wallet: string, tokens: number}[];
    notEnoughTokensList: {vestingType: string, wallet: string, tokens: number}[];
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    background: "#35363A",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose } = props;

  return (
      <DialogTitle
          sx={{
            m: 0,
            padding: "16px 16px 16px 16px",
            alignItems: "center",
            background: "#35363A",
          }}
      >
        {children}
        {onClose ? (
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  color: "#FFFFFF",
                }}
            >
              <CloseIcon />
            </IconButton>
        ) : null}
      </DialogTitle>
  );
};

const InvestorsListRegistrationModal: React.FC<CreateInvestorAccountModalProps> = ({
  action,
  actualIndex,
  totalAmount,
  open,
  isLoading,
  isError,
  errorMessage,
  handleClose,
  checkedInvestorList,
  vestingAccountExistList,
  walletErrorList,
  notEnoughTokensList,
}) => {
  return (
      <div>
        <BootstrapDialog
            PaperProps={{
              sx: {
                  height: { xs: "55%", md: isLoading && !isError ? 400 : isLoading && isError ? 435 : 500 },
                  width: { xs: "none", md: !isLoading && !isError ? 800 : 600 }
              },
            }}
            fullWidth
            maxWidth="md"
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
          <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
          >
            <div>
              <Typography variant={"h2"} align={"center"}>Investors list registration</Typography>
            </div>
          </BootstrapDialogTitle>
          <DialogContent
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
          >
            {isError ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            marginBottom: "20px",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginBottom: "10px",
                            }}
                        >
                            <Typography variant="h3" align="center">
                                {action} ERROR
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                {actualIndex} of {totalAmount}
                            </Typography>
                        </Box>
                        <FmdBadIcon sx={{ color: "rgb(183,82,230)", fontSize: 90, marginBottom: "10px", }} />
                        <Typography variant="subtitle1" align="center">
                            Sorry, {errorMessage.toLowerCase()}
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            Close the modal window and re-submit.
                        </Typography>
                    </Box>
            ) : isLoading ? (
                <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      paddingBottom: "40px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            marginBottom: "20px",
                        }}
                    >
                        <Typography variant="h3" align="center">
                            {action}
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            {actualIndex} of {totalAmount}
                        </Typography>
                    </Box>
                    <CircularProgress
                      style={{ color: "rgb(183,82,230)" }}
                      thickness={6}
                      size={50}
                    />
                    <Typography sx={{marginTop: "20px"}} variant="subtitle1" align="center">
                        Processing
                    </Typography>
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
                    {/*<Typography variant="subtitle1" align="center">*/}
                    {/*    Report*/}
                    {/*</Typography>*/}
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table" sx={{backgroundColor: 'rgba(32, 33, 36, 1)'}}>
                            <TableHead sx={{backgroundColor: '#0C0C0D'}}>
                                <TableRow>
                                    <TableCell />
                                    <TableCell align="center">
                                        <Typography variant="subtitle2" align="center">
                                            Status
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle2" align="center">
                                            Investors amount
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Row
                                    listName="Successfully created investor account"
                                    listLength={checkedInvestorList.length}
                                    investorsList={checkedInvestorList}
                                />
                            </TableBody>
                            <TableBody>
                                <Row
                                    listName="Investor account already exist"
                                    listLength={vestingAccountExistList.length}
                                    investorsList={vestingAccountExistList}
                                />
                            </TableBody>
                            <TableBody>
                                <Row
                                    listName="Investor wallet doesn't exist or activated"
                                    listLength={walletErrorList.length}
                                    investorsList={walletErrorList}
                                />
                            </TableBody>
                            <TableBody>
                                <Row
                                    listName="Not enough available tokens of this vesting type"
                                    listLength={notEnoughTokensList.length}
                                    investorsList={notEnoughTokensList}
                                />
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}
          </DialogContent>
        </BootstrapDialog>
      </div>
  );
};

export default InvestorsListRegistrationModal;
