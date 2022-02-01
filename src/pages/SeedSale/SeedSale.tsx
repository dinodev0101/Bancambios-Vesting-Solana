import React, { useEffect, useState} from "react";
import { Box } from "@mui/system";
import {CircularProgress, Typography, IconButton} from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import { VestingTypeAccount } from "token-vesting-api/dist/models";
import Container from "../../components/Container/Container";
import LinearProgressWithLabel from "../../components/Progress/Progress";
import BlueTitle from "../../components/Title/BlueTitle";
import Caption from "../../components/Title/Caption";
import Heading from "../../components/Title/Heading";
import moment from "moment";
import { Connection, PublicKey } from "@solana/web3.js";
import { TokenVesting } from "token-vesting-api";
import { VestingStatistic } from "token-vesting-api/dist/query";
import ClaimModal from "../../components/ClaimModal/ClaimModal";
import {converterBN, getNextUnlockDate, getAllUnlocks} from "../../utils";
import CongratulationsModal from "../../components/CongratulationsModal/CongratulationsModal";
import { WithdrawFromVestingInstruction } from "token-vesting-api/dist/schema";
import BN from "bn.js";
import ButtonComponent from "../../components/Button/Button";
import UnlockTokensModal from "../../components/UnlockTokensModal/UnlockTokensModal";

interface SeedSaleProps {
  name: string;
}

interface IValues {
  total: string;
  released: string;
  available: string;
  claimed: string;
}

const network: string = "https://api.testnet.solana.com";
const pubKey: string = "gFMPmX4ZLTPHLQEs2Y5VLo4LozHshqY3MVDC4d5oR8Z";
const mint: string = "sd8doDLRpq9Yn4CB8Cbx2hnonUoTWycgWHBZ9ALRr6Z";
const creator: string = "E4jis7AHiMxdgMsvK7S5YmHf4y4Kqneh9XY3VokRZdPV";

const SeedSale: React.FC<SeedSaleProps> = ({ name }) => {
  const [values, setValues] = useState<IValues>({
    total: "0",
    released: "0",
    available: "0",
    claimed: "0",
  });
  const [newWalletKey, setNewWalletKey] = useState<PublicKey>();
  const [connection, setConnection] = useState<Connection>();
  const [token, setToken] = useState<TokenVesting>();
  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenUnlocks, setIsOpenUnlocks] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [data, setData] = useState<VestingStatistic>();
  const [vestingType, setVestingType] = useState<VestingTypeAccount>();
  const [nextUnlockDate, setNextUnlockDate] = useState<string>("0");
  const [allUnlocks, setAllUnlocks] = useState<Array<{date: string, tokens: string}>>([{date: "", tokens: ""}]);


  useEffect(() => {
      if (vestingType && data) {
          setNextUnlockDate(moment
              .unix(+getNextUnlockDate(
                  new BN(new Date().getTime() / 1000), vestingType?.vesting_schedule!)
              )
              .format("L"));
          setAllUnlocks(getAllUnlocks(vestingType?.vesting_schedule!, data.allTokens!))
      }
  }, [vestingType, data])


  useEffect(() => {
    const newWalletKey = localStorage.getItem("publicKey");
    newWalletKey && setNewWalletKey(new PublicKey(newWalletKey));
    setConnection(new Connection(network));
    setToken(
      new TokenVesting(
        new Connection(network),
        new PublicKey(pubKey),
        new PublicKey(mint),
        new PublicKey(creator),
        name
      )
    );
    return () => {};
  }, [name]);

  const connectSolana = async () => {
    try {
      if (window.solana) {
        const key = await window.solana.connect();
        setNewWalletKey(new PublicKey(key.publicKey.toString()));
      }
    } catch (error) {
      console.log("connectSolana error === ", error);
    }
  };

  const claimTransaction = () => {
      newWalletKey &&
      connection &&
      token &&
      data &&
      data.availableToWithdrawTokens &&
      token
          .withdrawFromVesting(
              newWalletKey,
              new WithdrawFromVestingInstruction(data.availableToWithdrawTokens)
          )
          .then((transaction) => {
              console.log("withdrawFromVesting", transaction);
              connection
                  .getRecentBlockhash("confirmed")
                  .then(({ blockhash }) => {
                      transaction.recentBlockhash = blockhash;
                      transaction.feePayer = newWalletKey;

                      window.solana
                          .signAndSendTransaction(transaction)
                          .then((sign: { signature: string }) => {
                              console.log("sign === ", sign);

                              connection
                                  .confirmTransaction(sign.signature)
                                  .then((signature) => {
                                      console.log("signature", signature);
                                      setIsClaimed(true);
                                      handleClose();
                                      handleOpen();
                                  })
                                  .catch((e) => {
                                      console.log("signature", e);
                                      setIsError(!isError);
                                  });
                          })
                          .catch((e: any) => {
                              console.log("test == ", e);
                              setIsError(!isError);
                          });
                  })
                  .catch((e) => {
                      console.log("hash", e);
                      setIsError(!isError);
                  });
          })
          .catch((e) => {
              console.log("withdrawFromVesting", e);
              setIsError(!isError);
          });
  }

  useEffect(() => {
    const newWalletKey = localStorage.getItem("publicKey");
    if (newWalletKey) {
      setNewWalletKey(new PublicKey(newWalletKey));
    } else {
      connectSolana().then(() => {});
    }
  }, []);

  useEffect(() => {
    if (token) {
      token
        .getVestingType()
        .then((data) => {
          setVestingType(data);
          setLoading(false);
        })
        .catch((e) => {
          console.log("getVestingType error === ", e);
        });
      newWalletKey &&
        token
          .getVestingStatistic(newWalletKey)
          .then((data) => {
            setData(data);
            setValues({
              total: converterBN(data.allTokens),
              released: converterBN(data.unlockedTokens),
              available: converterBN(data.availableToWithdrawTokens),
              claimed: converterBN(data.withdrawn_tokens),
            });
          })
          .catch((error: Error) => {
            if (error.message.includes("Vesting Account does not exist")) {
              setError(true);
            }
            console.log("getVestingStatistic error === ", error);
          });
    }
  }, [newWalletKey, token]);


  const handleClaim = async () => {
    if (!isLoading) setIsLoading(true);

    if (!window.solana?.isConnected) {
        connectSolana().then(() => {
            claimTransaction();
        })
    } else {
        claimTransaction();
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    if (!isLoading) {
        setOpen(false);
        setIsError(false);
        setIsLoading(false);
    }
  };

  const handleExit = () => {
    setIsOpen(false);
  };

  const handleUnlocksModal = () => {
    setIsOpenUnlocks(!isOpenUnlocks);
  };

  const { total, available, claimed, released } = values;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "414px",
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
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "414px",
        }}
      >
        <BlueTitle
          text={"You are not in this investor group."}
          isUpperCase={false}
        />
      </Box>
    );
  }

  return (
    <>
      <ClaimModal
        available={data ? converterBN(data.availableToWithdrawTokens) : ""}
        {...{ open, isError, isLoading, handleClose, handleClaim }}
      />
      <CongratulationsModal {...{ isOpen }} handleClose={handleExit} />
      <UnlockTokensModal {...{ allUnlocks }} isOpen={isOpenUnlocks} handleUnlocksModal={handleUnlocksModal} />
      <Box
        sx={{
          width: "100%",
          paddingX: { xs: 0, lg: 10 },
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "space-around" },
            alignItems: "center",
            py: "20px",
            flexDirection: { xs: "column", md: "column", lg: "row" },
          }}
        >
          <Box sx={{ paddingY: { xs: 1, md: 0 } }}>
            <BlueTitle
              text={
                vestingType &&
                vestingType.vesting_schedule &&
                vestingType.vesting_schedule.start_time()
                  ? moment
                      .unix(
                        +vestingType?.vesting_schedule?.start_time().toString()
                      )
                      .format("L")
                  : ""
              }
            />
            <Caption text={"First tokens unlocking date"} />
          </Box>
          <Box sx={{ paddingY: { xs: 1, md: 0 } }}>
              <Box sx={{display: "flex", flexDirection: "row", marginLeft: "40px", }}>
                  <BlueTitle
                      text={nextUnlockDate}
                  />
                  <IconButton sx={{'&:hover': {background: "grey"}}} onClick={handleUnlocksModal}>
                      <HelpIcon fontSize={"medium"} sx={{ color: "#FFFFFF" }}/>
                  </IconButton>
              </Box>
              {new Date(nextUnlockDate) > new Date() ? (
                  <Caption text={"Next tokens unlocking date"} />
              ) : (
                  <Caption text={"Last tokens unlocking date"} />
              )}
          </Box>
        </Box>
        <LinearProgressWithLabel
          value={String(Math.round(Number(released) / Number(total) * 100))}
          // value={50}
          topText={released + " BX"}
          topStickyText={total + " BX"}
          bottomText={moment(new Date()).format("L")} //current time
          bottomStickyText={
            vestingType &&
            vestingType.vesting_schedule &&
            vestingType.vesting_schedule.last()
              ? moment
                  .unix(+vestingType?.vesting_schedule?.last().toString())
                  .format("L")
              : ""
          }
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            py: "20px",
            flexDirection: { xs: "column", md: "column", lg: "row" },
          }}
        >
          <Box
            sx={{
              display: { xs: "flex", md: "flex" },
              flexDirection: { xs: "row" },
              justifyContent: { xs: "space-around" },
              width: { xs: "100%", lg: "50%" },
              paddingY: 1,
            }}
          >
            <Container
              sx={{
                flex: 1,
                marginX: { xs: "4px", md: 1 },
                width: { xs: 130, md: 160 },
              }}
            >
              <Caption text={"Total Tokens Vested"} />
              <Heading
                sx={{ textAlign: { xs: "center" } }}
                text={total + " BX"}
              />
            </Container>
            <Container
              sx={{
                flex: 1,
                marginX: { xs: "4px", md: 1 },
                width: { xs: 130, md: 160 },
              }}
            >
              <Caption text={"Tokens Released"} />
              <Heading
                text={released + " BX"}
                sx={{ textAlign: { xs: "center" } }}
              />
            </Container>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "flex" },
              flexDirection: { xs: "row" },
              justifyContent: { xs: "space-around" },
              width: { xs: "100%", lg: "50%" },
              paddingY: 1,
            }}
          >
            <Container
              sx={{
                flex: 1,
                marginX: { xs: "4px", md: 1 },
                width: { xs: 130, md: 160 },
              }}
            >
              <Caption text={"Tokens Claimed"} />
              <Heading
                sx={{ textAlign: { xs: "center" } }}
                text={claimed + " BX"}
              />
            </Container>
            <Container
              sx={{
                flex: 1,
                marginX: { xs: "4px", md: 1 },
                width: { xs: 130, md: 160 },
              }}
            >
              <Caption text={"Tokens Available to Claim"} />
              <Heading
                sx={{ textAlign: { xs: "center" } }}
                text={available + " BX"}
              />
            </Container>
          </Box>
        </Box>
        <Box sx={sxStyles.buttonContainer}>
            <ButtonComponent
                type={"claim"}
                title={"Claim!"}
                onClick={handleClickOpen}
                disable={available === "0" || isClaimed}
                isIconVisible={false}
            />
        </Box>
      </Box>
      <Box
        sx={{
          color: "#FFFFFF",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "space-around", md: "space-between" },
          flexDirection: { xs: "column", lg: "row" },
          p: { xs: 2 },
          paddingX: { md: 10, xs: 0 },
          boxSizing: "border-box",
          mt: { xs: 6, md: 0 },
          cursor: "default",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
            <Typography
                variant={"body2"}
                textAlign={"center"}
            >
                Program address:
            </Typography>
            <Typography
                variant={"body2"}
                textAlign={"center"}
                sx={{marginLeft: "8px", opacity: "0.75"}}
            >
                {pubKey}
            </Typography>
        </Box>
        <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
        }}>
            <Typography
                variant={"body2"}
                textAlign={"center"}
            >
                Tokens are vested to:
            </Typography>
            <Typography
                variant={"body2"}
                textAlign={"center"}
                sx={{marginLeft: "8px", opacity: "0.75" }}
            >
                {newWalletKey?.toString() ?? ""}
            </Typography>
        </Box>
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
} as const;

export default SeedSale;
