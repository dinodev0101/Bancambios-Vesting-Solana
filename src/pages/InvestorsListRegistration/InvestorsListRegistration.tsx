import React, {BaseSyntheticEvent, useCallback, useEffect, useState} from "react";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ButtonComponent from "../../components/Button/Button";
import {PublicKey, Connection, Transaction} from "@solana/web3.js";
import {
  availableTokenAmount,
  checkingVestingAccountExistence,
  checkingWalletExistence, checkSizeAndConcatTransactions,
  createVestingAccountTransactionsArray,
  getNetwork, sleep
} from "../../utils";
import CreateInvestorAccountModal from "../../components/CreateInvestorAccountModal/CreateInvestorAccountModal";

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
  const [wallet, setWallet] = useState<string>('');
  const [investorsList, setInvestorsList] = useState<string>('');
  const [investorsListLength, setInvestorsListLength] = useState<number>(0);
  const [checkedInvestorList, setCheckedInvestorsList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [vestingAccountExistList, setVestingAccountExistList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [walletErrorList, setWalletErrorList] = useState<{vestingType: string, wallet: string, tokens: number}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [adminWalletKey, setAdminWalletKey] = useState<string>('');
  const [connection, setConnection] = useState<Connection>(new Connection(getNetwork()));
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleChangeInvestorsList = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvestorsList(event.target.value);
  };

  useEffect(() => {
    const adminWalletKey = localStorage.getItem("publicKey");
    if (adminWalletKey) {
      setAdminWalletKey(adminWalletKey);
    } else {
      connectSolana().then(() => {});
    }
  }, []);

  // useEffect(() => {
  //   if (!vestingType || !adminWalletKey) return;
  //
  //   setVestingToken(getTokenVesting(vestingType));
  //   setConnection(new Connection(getNetwork()));
  // }, [vestingType, adminWalletKey]);

  const connectSolana = async () => {
    console.log('1')
    try {
      console.log('2')
      if (window.solana && !window.solana.isConnected) {
        console.log('3')
          const key = await window.solana.connect();
          localStorage.setItem("publicKey", key.publicKey.toString());
          setAdminWalletKey(key.publicKey.toString());
        console.log('4')
      }
    } catch (error) {
      console.log("connectSolana error === ", error);
    }
  };

  const sendTransactions = useCallback(
      async () => {
        if (transactions) {
          console.log('send Transaction transactions array =', transactions)
          await connectSolana();
          for (const [index, transaction] of transactions.entries()) {
            try {
              console.log('send Transaction index =', index)

              const {blockhash} = await connection.getRecentBlockhash("confirmed");
              console.log('blockhash = ', blockhash)
              console.log('adminWalletKey = ', adminWalletKey)
              transaction.recentBlockhash = blockhash;
              transaction.feePayer = new PublicKey(adminWalletKey);

              console.log('send Transaction transaction =', transaction)

              const txHash = await window.solana.signAndSendTransaction(transaction);

              console.log('Sign =', txHash)

              const signature = await connection.confirmTransaction(txHash.signature, "confirmed");
              console.log(`Transaction №${index} DONE!`)
              if (index === (transactions.length - 1)) {
                console.log("signature = ", signature);
                setIsError(false);
                setIsLoading(false);
              }
            } catch (e:any) {
              console.log("Transaction ERROR:", e);
              setErrorMessage(e.message);
              setIsError(true);
            }
          }
        }
    }, [transactions]);

  const handleClose = () => {
    if (!isLoading || isError) {
      setOpen(false);
      setIsError(false);
      setIsLoading(false);
    }
  };

  const investorsListParsing = async (list: string) => {
    setConnection(new Connection(getNetwork()));

    const parsedList: {vestingType: string, wallet: string, tokens: number}[] = list.split(/\r?\n/).reduce<{vestingType: string, wallet: string, tokens: number}[]>((acc, line) => {
      const comaSeparationList = line.split(',', 3);
      const investor: { vestingType: string, wallet: string, tokens: number } =
          {
            vestingType: comaSeparationList[0],
            wallet: comaSeparationList[1],
            tokens: Number(comaSeparationList[2])
          };
      acc.push(investor);
      return acc;
    }, []);

    console.log(parsedList.length);
    setInvestorsListLength(parsedList.length);

    // for (const type of vestingTypes) {
    //   type.availableTokens = availableTokenAmount(type.name);
    // }

    for (const investor of parsedList) {
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
              setCheckedInvestorsList((prev) => {
                return [...prev, investor];
              });
            }
          })
        }
      })
      await sleep(1500);
    }
  };

  useEffect(() => {
    console.log('useEffect.length = ', (checkedInvestorList.length + walletErrorList.length + vestingAccountExistList.length))
    console.log('needed length = ', investorsListLength)
    if (investorsListLength &&
        (checkedInvestorList.length + walletErrorList.length +
            vestingAccountExistList.length) === investorsListLength) {
    console.log('checkedInvestorList.length = ', checkedInvestorList.length)
    console.log('checkedInvestorList = ', checkedInvestorList)
    console.log('walletErrorList = ', walletErrorList)
    console.log('vestingAccountExistList = ', vestingAccountExistList)
      createVestingAccountTransactionsArray(checkedInvestorList).then(async transactions => {
        console.log('createVestingAccountTransactionsArray done = ', transactions);
        const concatTransactions = await checkSizeAndConcatTransactions(transactions);
        setTransactions(concatTransactions);
      });
    }
  }, [checkedInvestorList, walletErrorList, vestingAccountExistList, investorsListLength])

  useEffect(() => {
   if (transactions.length > 0) {
     console.log('Send transactions ...')
     sendTransactions().then(() => {});
   }
  }, [transactions])

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    console.log(investorsList)
    await investorsListParsing(investorsList);
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

export default InvestorsListRegistration;