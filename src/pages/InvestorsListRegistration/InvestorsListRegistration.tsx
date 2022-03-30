import React, {BaseSyntheticEvent, useCallback, useEffect, useState} from "react";
import {Box, TextField, Typography} from "@mui/material";
import {styled} from "@mui/material/styles";
import ButtonComponent from "../../components/Button/Button";
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import {
  availableTokenAmount,
  checkingVestingAccountExistence,
  checkingWalletExistence,
  checkSizeAndConcatTransactions,
  createVestingAccountTransactionsArray,
  getNetwork,
  sleep
} from "../../utils";
import InvestorsListRegistrationModal
  from "../../components/InvestorsListRegistrationModal/InvestorsListRegistrationModal";
import {ActionType} from "../../types";

const vestingTypes = [
  {
    name: "strategic-partners",
    availableTokens: 0,
  },
  {
    name: "pre-sale",
    availableTokens: 0,
  },
  {
    name: "ido",
    availableTokens: 0,
  },
  {
    name: "community-dev-marketing",
    availableTokens: 0,
  },
  {
    name: "liquidity-mining",
    availableTokens: 0,
  },
  {
    name: "advisors-partners",
    availableTokens: 0,
  },
  {
    name: "team-operations-developers",
    availableTokens: 0,
  },
]

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

const InvestorsListRegistration = () => {
  const [investorsString, setInvestorsString] = useState<string>('');
  const [totalInvestors, setTotalInvestors] = useState<number>(0);
  const [checkedInvestorList, setCheckedInvestorsList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [vestingAccountExistList, setVestingAccountExistList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [walletErrorList, setWalletErrorList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [notEnoughTokensList, setNotEnoughTokensList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminWalletKey, setAdminWalletKey] = useState<string>('');
  const [connection, setConnection] = useState<Connection>(new Connection(getNetwork()));
  const [open, setOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<ActionType>(ActionType.verification);
  const [actualIndex, setActualIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChangeInvestorsList = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestorsString(event.target.value);
  };

  useEffect(() => {
    const adminWalletKey = localStorage.getItem("publicKey");
    if (adminWalletKey) {
      setAdminWalletKey(adminWalletKey);
    } else {
      connectSolana().then(() => {});
    }
  }, []);

  const connectSolana = async () => {
    try {
      if (window.solana && !window.solana.isConnected) {
          const key = await window.solana.connect();
          localStorage.setItem("publicKey", key.publicKey.toString());
          setAdminWalletKey(key.publicKey.toString());
      }
    } catch (error) {
      console.error("connectSolana error === ", error);
    }
  };

  const sendTransactions = useCallback(
      async () => {
        if (transactions) {
          await connectSolana();
          for (const [index, transaction] of transactions.entries()) {
            setActualIndex(index + 1);
            try {
              const {blockhash} = await connection.getRecentBlockhash("confirmed");
              transaction.recentBlockhash = blockhash;
              transaction.feePayer = new PublicKey(adminWalletKey);

              const txHash = await window.solana.signAndSendTransaction(transaction);

              await connection.confirmTransaction(txHash.signature, "confirmed");

              if (index === (transactions.length - 1)) {
                setIsError(false);
                setIsLoading(false);
              }
            } catch (e:any) {
              setIsError(true);
              setErrorMessage(e.message);
              break;
            }
          }
        }
    }, [transactions, adminWalletKey, connection]);

  const investorsListParsing = async (list: string) => {
    setConnection(new Connection(getNetwork()));

    const parsedList: {vestingType: string, wallet: string, tokens: number}[] =
        list.split(/\r?\n/)
            .reduce<{vestingType: string, wallet: string, tokens: number}[]>((acc, line) => {
      const comaSeparationList = line.split(',', 3);

      if (comaSeparationList.length < 3) return acc;

      for (const element of comaSeparationList) {
        if (!element) {
          return acc;
        }
      }

      const investor: { vestingType: string, wallet: string, tokens: number } =
          {
            vestingType: comaSeparationList[0],
            wallet: comaSeparationList[1],
            tokens: Number(comaSeparationList[2])
          };
      acc.push(investor);
      return acc;
    }, []);

    if (parsedList.length > 0) {
      setActionType(ActionType.verification);
      setTotalInvestors(parsedList.length);
      setOpen(true);
      setIsLoading(true);

      for (const type of vestingTypes) {
        type.availableTokens = await availableTokenAmount(type.name);
      }

      for (const [index, investor] of parsedList.entries()) {
        setActualIndex(index + 1);
        checkingVestingAccountExistence(investor.vestingType, investor.wallet).then(isAccountExist => {
          if (isAccountExist) {
            setVestingAccountExistList((prev) => {
              return [...prev, investor];
            });
          } else {
            checkingWalletExistence(connection, investor.wallet).then(isWalletActive => {
              if (!isWalletActive) {
                setWalletErrorList((prev) => {
                  return [...prev, investor];
                });
              } else {
                for (const type of vestingTypes) {
                  if (investor.vestingType.toLowerCase() === type.name) {
                    if (investor.tokens > type.availableTokens) {
                      setNotEnoughTokensList((prev) => {
                        return [...prev, investor];
                      });
                    } else {
                      type.availableTokens -= investor.tokens;
                      setCheckedInvestorsList((prev) => {
                        return [...prev, investor];
                      });
                    }
                  }
                }
              }
            })
          }
        })
        await sleep(1500);
      }
    }
  };

  useEffect(() => {
    if (totalInvestors > 0 && (checkedInvestorList.length + walletErrorList.length +
            vestingAccountExistList.length) === totalInvestors) {
      if (checkedInvestorList.length === 0) {
        setIsLoading(false);
        setIsError(false);
      } else {
        setActionType(ActionType.createTransactions)
        setActualIndex(1);
        createVestingAccountTransactionsArray(checkedInvestorList, setActualIndex).then(async transactions => {
          const concatTransactions = await checkSizeAndConcatTransactions(transactions);
          setTransactions(concatTransactions);
        });
      }
    }
  }, [checkedInvestorList, walletErrorList, vestingAccountExistList, notEnoughTokensList, totalInvestors])

  useEffect(() => {
   if (transactions.length > 0) {
     setActionType(ActionType.sendTransactions);
     setActualIndex( 1);
     sendTransactions().then(() => {});
   }
  }, [transactions, sendTransactions])

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    await investorsListParsing(investorsString);
  };

  const handleClose = () => {
    if (!isLoading || isError) {
      setOpen(false);
      setIsLoading(false);
      setIsError(false);
      setErrorMessage('');
      setCheckedInvestorsList([]);
      setVestingAccountExistList([]);
      setWalletErrorList([]);
      setNotEnoughTokensList([]);
      setTotalInvestors(0);
      setTransactions([]);
    }
  };

  return (
      <>
        <InvestorsListRegistrationModal
            {...{
              actualIndex, open, isError, errorMessage, isLoading, handleClose, checkedInvestorList,
              vestingAccountExistList, walletErrorList, notEnoughTokensList
            }}
            action={actionType}
            totalAmount={
              actionType === ActionType.verification
                ? totalInvestors
                : actionType === ActionType.createTransactions
                ? checkedInvestorList.length
                : transactions.length
            }
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
            maxWidth: "675px",
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
                <BootstrapTextField
                    required
                    fullWidth
                    label="Investors list"
                    name="investors-list-input"
                    id="investors-list-multiline-static-input"
                    placeholder="Enter the list of investors"
                    multiline
                    focused={true}
                    rows={8}
                    helperText="Enter the list of investors"
                    onChange={handleChangeInvestorsList}
                />
            </Box>
            <Box sx={sxStyles.buttonContainer}>
              <ButtonComponent
                  type="claim"
                  title="Submit"
                  onClick={handleSubmit}
                  isIconVisible={false}
                  disable={!investorsString}
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

export default InvestorsListRegistration;