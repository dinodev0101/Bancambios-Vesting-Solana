import React, { useEffect, useState } from "react";
import { Box, InputLabel, MenuItem, FormControl, Typography, TextField, FormHelperText } from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import NumberFormat from 'react-number-format';
import { styled } from "@mui/material/styles";
import ButtonComponent from "../../components/Button/Button";
import { PublicKey, Connection } from "@solana/web3.js";
import { getNetwork, getTokenVesting} from "../../utils";
import { TokenVesting } from "token-vesting-api";
import { CreateVestingAccountInstruction } from "token-vesting-api/dist/schema";
import BN from "bn.js";
import CreateInvestorAccountModal from "../../components/CreateInvestorAccountModal/CreateInvestorAccountModal";
// import {CreateVestingAccountInstruction} from "../../../token-vesting-api/src/schema";

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const vestingTypes = [
  {
    label: "Strategic",
    name: "strategic-partners",
  },
  {
    label: "Pre-Sale",
    name: "pre-sale",
  },
  {
    label: "IDO",
    name: "ido",
  },
  {
    label: "Community",
    name: "community-dev-marketing",
  },
  {
    label: "Liquidity",
    name: "liquidity-mining",
  },
  {
    label: "Advisors",
    name: "advisors-partners",
  },
  {
    label: "Team",
    name: "team-operations-developers",
  },
]

const BootstrapFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-root': {
    borderColor: 'rgb(183,82,230)',
    color: '#FFFFFF !important',
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 800,
    letterSpacing: '0em',
    textAlign: 'center',
    zIndex: 1,
  },
  '& .MuiFormHelperText-root': {
    color: '#FFFFFF',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    color: '#FFFFFF',
    '& fieldset': {
      color: '#FFFFFF',
      borderColor: 'transparent',
      background: "#1E2022",
    },
    '&:hover fieldset': {
      color: '#FFFFFF',
      borderColor: 'rgb(183,82,230)',
    },
    '&.Mui-focused fieldset': {
      color: '#FFFFFF',
      borderColor: 'rgb(183,82,230)',
    },
  },
}));

const BootstrapTextField = styled(TextField)({
  '& label': {
    color: '#FFFFFF',
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 800,
    letterSpacing: '0em',
    textAlign: 'center',
  },
  '& label.Mui-focused': {
    color: '#FFFFFF',
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 800,
    letterSpacing: '0em',
    textAlign: 'center',
  },
  '& .MuiFormHelperText-root': {
    color: '#FFFFFF',
  },
  '& .MuiOutlinedInput-input': {
    zIndex: 1,
    color: "#FFFFFF",
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '29px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'rgb(183,82,230)',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    '& fieldset': {
      zIndex: 0,
      borderColor: 'transparent',
      backgroundColor: "#1E2022",
    },
    '&:hover fieldset': {
      borderColor: 'rgb(183,82,230)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgb(183,82,230)',
    },
  },
});

const MenuProps = {
  PaperProps: {
    style: {
      color: '#FFFFFF',
      backgroundColor: '#1E2022',
      borderRadius: '18px',
    },
  },
};

// const BootstrapMenuItem = styled(MenuItem)({
//   '& .MuiMenuItem-root': {
//     color: '#FFFFFF',
//     backgroundColor: "#1E2022",
//   },
// });


const NumberFormatCustom = React.forwardRef<NumberFormat<CustomProps>, CustomProps>(
    function NumberFormatCustom(props, ref) {
      const { onChange, ...other } = props;

      return (
          <NumberFormat
              {...other}
              getInputRef={ref}
              onValueChange={(values) => {
                onChange({
                  target: {
                    name: props.name,
                    value: values.value,
                  },
                });
              }}
              isNumericString
              allowNegative={false}
              decimalScale={0}
              suffix=" BX"
          />
      );
    })

const InvestorRegistration = () => {
  const [vestingType, setVestingType] = useState('');
  const [wallet, setWallet] = useState('');
  const [tokens, setTokens] = useState('');
  const [vestingToken, setVestingToken] = useState<TokenVesting>();
  const [newWalletKey, setNewWalletKey] = useState<PublicKey>();
  const [connection, setConnection] = useState<Connection>(new Connection(getNetwork()));
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);

  const checkWallet = async (wallet: string) => {
    try {
      const pubKey = new PublicKey(wallet)
      const walletCheckWeb3 = await connection?.getAccountInfo(pubKey)
      console.log('walletCheckWeb3 = ', walletCheckWeb3)
      return walletCheckWeb3;
    } catch (err) {
      console.log('Checking wallet error: ', err)
      return null;
    }
  }

  const handleChangeVestingTypeSelect = (event: SelectChangeEvent) => {
    console.log("Change event value =", event.target.value as string)
    setVestingType(event.target.value as string);
  };

  const handleChangeInvestorWallet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(event.target.value);
  };

  const handleFocusRemoving = async () => {
    const checkedWallet = await checkWallet(wallet);
    if (!checkedWallet) {
      console.log('checkedWallet error = true')
      setError(true)
    } else {
      console.log('checkedWallet error = false')
      setError(false)
    }
  }

  const handleChangeAmountOfTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokens(event.target.value);
    console.log('Amount of BX tokens = ', event.target.value);
  };

  useEffect(() => {
    if (!vestingType) return;
    const bufferWalletKey = localStorage.getItem("publicKey");
    console.log("bufferWalletKey = ", bufferWalletKey)
    if (bufferWalletKey) {
      setNewWalletKey(new PublicKey(bufferWalletKey));
      setVestingToken(getTokenVesting(vestingType, bufferWalletKey!));
    }
    setConnection(new Connection(getNetwork()));
  }, [vestingType]);


  const sendTransaction = () => {
    console.log('sendTransaction func!')
    console.log('createVestingAccount wallet = ', wallet)
    console.log('tokens  = ', tokens)

    wallet &&
    newWalletKey &&
    connection &&
    vestingToken &&
    vestingToken
        .createVestingAccount(
            new PublicKey(wallet),
            new CreateVestingAccountInstruction(new BN(tokens))
        )
        .then((transaction) => {
          console.log("createVestingAccount", transaction);
          connection
              .getRecentBlockhash("confirmed")
              .then(({ blockhash }) => {
                console.log('blockhash = ', blockhash)
                const adminWalletKey = localStorage.getItem("publicKey");
                console.log('adminWalletKey transaction = ', adminWalletKey)
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = new PublicKey(adminWalletKey!);

                window.solana
                    .signAndSendTransaction(transaction)
                    .then((sign: { signature: string }) => {
                      console.log("sign === ", sign);

                      connection
                          .confirmTransaction(sign.signature)
                          .then((signature) => {
                            console.log("signature", signature);
                            // handleClose();
                            // handleOpen();
                          })
                          .catch((e) => {
                            console.log("signature", e);
                            setIsError(true);
                          });
                    })
                    .catch((e: any) => {
                      console.log("test == ", e);
                      setIsError(true);
                    });
              })
              .catch((e) => {
                console.log("hash", e);
                setIsError(true);
              });
        })
        .catch((e) => {
          console.log("createVestingAccount", e);
          setIsError(true);
        });
  }

  const handleClose = () => {
    setOpen(false);
    setIsError(false);
    setIsLoading(false);
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    if (!vestingType || !wallet || !tokens) return;
    setIsLoading(true);
    setOpen(true);
    sendTransaction();

    console.log("Clicked submit button")
    event.preventDefault();
  };

  return (
      <>
        <CreateInvestorAccountModal
            {...{ open, isError, isLoading, handleClose, wallet }}
        />
        <Box sx={{
          width: "100%",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "16px" }}>
            <Typography variant={"h2"} align={"center"}>
              BX investor registration
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "450px",
            height: "100%",
            paddingBottom: "16px"
          }}>
            {/*<Box sx={{*/}
            {/*  display: "flex",*/}
            {/*  flexDirection: "column",*/}
            {/*  justifyContent: "space-between",*/}
            {/*  alignItems: "center",*/}
            {/*  width: "100%",*/}
            {/*  maxWidth: "450px",*/}
            {/*  height: "100%",*/}
            {/*  paddingBottom: "16px"*/}
            {/*}}>*/}
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginBottom: "16px",
              }}>
                <BootstrapFormControl
                    fullWidth
                    // variant={"standard"}
                    // sx={{  background: "#1E2022", borderRadius: "18px", }}
                >
                  <InputLabel id="vesting-type-select-label">Vesting type</InputLabel>
                  {/*<BootstrapInputBase>Vesting type</BootstrapInputBase>*/}
                  {/*<InputLabel id="vesting-type-select-label">Vesting type</InputLabel>*/}
                  <Select
                      required
                      labelId="vesting-type-select-label"
                      id="vesting-type-select"
                      value={vestingType}
                      label="Vesting type"
                      onChange={handleChangeVestingTypeSelect}
                      sx={sxStyles.selectInput}
                      MenuProps={MenuProps}
                  >
                    {vestingTypes.map((type, index) =>
                        <MenuItem key={index} value={type.name}>{type.label}</MenuItem>
                    )}
                  </Select>
                  <FormHelperText>Select vesting type</FormHelperText>
                </BootstrapFormControl>
              </Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginBottom: "16px",
              }}>
                <BootstrapTextField
                    required
                    fullWidth
                    label="Investor wallet"
                    id="investor-wallet-input"
                    helperText={error ? "Incorrect wallet" : "Enter the investor's wallet"}
                    error={error}
                    onChange={handleChangeInvestorWallet}
                    onBlur={handleFocusRemoving}
                />
              </Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}>
                <BootstrapTextField
                    required
                    fullWidth
                    label="Amount of BX tokens"
                    name="amount-of-bx-tokens-input-number-format"
                    id="amount-of-bx-tokens-input"
                    helperText="Enter the amount of BX tokens you want to send to the investor"
                    onChange={handleChangeAmountOfTokens}
                    InputProps={{
                      inputComponent: NumberFormatCustom as any,
                    }}
                />
              </Box>
            </Box>
            <Box sx={sxStyles.buttonContainer}>
              <ButtonComponent
                  type={"claim"}
                  title={"Submit"}
                  onClick={handleSubmit}
                  // disable={available === "0"}
                  isIconVisible={false}
              />
            </Box>
            {/*</Box>*/}
          </form>
        </Box>
      </>
  );
};

const sxStyles = {
  buttonContainer: {
    height: "fit-content",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mb: { xs: 0, md: 1 },
  },
  selectInput: {
    '& .MuiInputBase-input': {
      zIndex: 1,
      color: "#FFFFFF",
      fontFamily: '"Saira", sans-serif',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '29px',
      letterSpacing: '0em',
      textAlign: 'left',
    },
  },
} as const;

export default InvestorRegistration;
