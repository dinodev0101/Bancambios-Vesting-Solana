import React, {BaseSyntheticEvent, useCallback, useEffect, useState} from "react";
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

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const vestingTypes = [
  {
    label: "Strategic",
    name: "strategic",
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
  const [vestingType, setVestingType] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');
  const [tokens, setTokens] = useState<string>('');
  const [vestingToken, setVestingToken] = useState<TokenVesting>();
  const [adminWalletKey, setAdminWalletKey] = useState<string>('');
  const [connection, setConnection] = useState<Connection>(new Connection(getNetwork()));
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const checkWallet = async (wallet: string) => {
    try {
      const pubKey = new PublicKey(wallet)
      const walletCheckWeb3 = await connection?.getAccountInfo(pubKey)
      if (walletCheckWeb3) {
        return walletCheckWeb3;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  const handleChangeVestingTypeSelect = (event: SelectChangeEvent) => {
    setVestingType(event.target.value as string);
  };

  const handleChangeInvestorWallet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(event.target.value);
  };

  const handleFocusRemoving = async () => {
    if (wallet) {
      const checkedWallet = await checkWallet(wallet);
      if (!checkedWallet) {
        setError(true)
      } else {
        setError(false)
      }
    } else {
      setError(false);
    }
  }

  const handleChangeAmountOfTokens = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokens(event.target.value);
  };

  useEffect(() => {
    const adminWalletKey = localStorage.getItem("publicKey");
    if (adminWalletKey) {
      setAdminWalletKey(adminWalletKey);
    } else {
      connectSolana().then(() => {});
    }
  }, []);

  useEffect(() => {
    if (!vestingType || !adminWalletKey) return;

    setVestingToken(getTokenVesting(vestingType));
    setConnection(new Connection(getNetwork()));
  }, [vestingType, adminWalletKey]);

  const connectSolana = async () => {
    try {
      if (window.solana && !window.solana.isConnected) {
          const key = await window.solana.connect();
          localStorage.setItem("publicKey", key.publicKey.toString());
          setAdminWalletKey(key.publicKey.toString());
      }
    } catch (error) {
      console.log("connectSolana error === ", error);
    }
  };

    const sendTransaction = useCallback(
    async () => {
      await connectSolana();

      wallet &&
      adminWalletKey &&
      connection &&
      vestingToken &&
      vestingToken
          .createVestingAccount(
              new PublicKey(wallet),
              new CreateVestingAccountInstruction(new BN(tokens))
          )
          .then((transaction) => {
            connection
                .getRecentBlockhash("confirmed")
                .then(({ blockhash }) => {
                  transaction.recentBlockhash = blockhash;
                  transaction.feePayer = new PublicKey(adminWalletKey);

                  window.solana
                      .signAndSendTransaction(transaction)
                      .then((sign: { signature: string }) => {
                        connection
                            .confirmTransaction(sign.signature, "confirmed")
                            .then((signature) => {
                              setIsError(false);
                              setIsLoading(false);
                            })
                            .catch((e) => {
                              console.log("signature", e);
                              setErrorMessage(e.message);
                              setIsError(true);
                            });
                      })
                      .catch((e: any) => {
                        console.log("test == ", e);
                        setErrorMessage(e.message);
                        setIsError(true);
                      });
                })
                .catch((e) => {
                  console.log("hash", e);
                  setErrorMessage(e.message);
                  setIsError(true);
                });
          })
          .catch((e) => {
            console.log("createVestingAccount", e);
            setErrorMessage(e.message);
            setIsError(true);
          });
    },
    [connection, adminWalletKey, tokens, vestingToken, wallet]
);

  const handleClose = () => {
    if (!isLoading || isError) {
      setOpen(false);
      setIsError(false);
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: BaseSyntheticEvent) => {
    if (!vestingType || !wallet || !tokens) return;
    setIsLoading(true);
    setOpen(true);
    sendTransaction().then(() => {});
    e.preventDefault();
  };

  return (
      <>
        <CreateInvestorAccountModal
            {...{ open, isError, errorMessage, isLoading, handleClose, wallet }}
        />
        <Box sx={{
          width: "100%",
          height: "100%",
          minHeight: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "16px" }}>
            <Typography variant="h2" align="center">
              BX investor registration
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "466px",
            height: "100%",
            padding: "0 16px 16px 16px",
            boxSizing: "border-box",
          }}>
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
                >
                  <InputLabel id="vesting-type-select-label">Vesting type</InputLabel>
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
                    helperText={
                      error
                          ? "Wallet does not exist or activated"
                          : "Enter the investor's wallet"
                    }
                    error={error}
                    onChange={handleChangeInvestorWallet}
                    onBlur={handleFocusRemoving}
                    sx={error ? {
                      '& .MuiFormHelperText-root': {
                        color: 'rgb(210, 48, 47)',
                      },
                    } : {}}
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
                  type="claim"
                  title="Submit"
                  onClick={handleSubmit}
                  isIconVisible={false}
                  disable={error}
              />
            </Box>
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
