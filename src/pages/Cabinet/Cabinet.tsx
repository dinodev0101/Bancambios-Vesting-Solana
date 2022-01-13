import React, { useState } from "react";
import { Box, Button as MuiButton, Tab, Tabs, Divider } from "@mui/material";
// import Logo from "../../assets/logo.svg";
import Logo from "../../assets/bancambiosLogo.svg";
import styles from "./Cabinet.module.css";
import SeedSale from "../SeedSale/SeedSale";
import { useNavigate } from "react-router";
import ButtonComponent from "../../components/Button/Button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Cabinet = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleChange = (_: any, newValue: number) => {
    setValue(newValue);
  };

  const handleDisconnectWallet = () => {
    window.solana.disconnect();
    navigate("/");
  };

  return (
      // <div style={{color: "white"}}>
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
          // justifyItems: "flex-end",
          // pb: 2,
          // position: { xs: "static", md: "absolute" },
          // margin: { xs: "0 auto" },
          // right: { md: "15%", lg: "15%" },
          // top: { md: "10%", lg: "15%" },
        }}
      >
        {/*<Box sx={{ flex: 1 }} />*/}
        {/* <div className={styles.logo_container} /> */}
        {/*<div className={styles.logo_container}>*/}
        {/*  <img alt={"logo"} src={Logo} className={styles.logo} />*/}
        {/*</div>*/}
        <Box
          sx={{
            flex: 1,
            justifyContent: { xs: "center", md: "center" },
            display: "flex",
            margin: "10px 0"
          }}
        >
          <ButtonComponent type={"disconnect"} title={"Disconnect wallet"} onClick={handleDisconnectWallet} isIconVisible={false}/>
          {/*<MuiButton*/}
          {/*  onClick={handleDisconnectWallet}*/}
          {/*  sx={{*/}
          {/*    textTransform: "none",*/}
          {/*    m: 2,*/}
          {/*    height: "40px",*/}
          {/*  }}*/}
          {/*  size="large"*/}
          {/*  variant="outlined"*/}
          {/*>*/}
          {/*  Disconnect wallet*/}
          {/*</MuiButton>*/}
        </Box>
      </Box>
      <Box sx={{ width: "100%", padding: { xs: 0, md: 0 } }}>
        <Box
          sx={{
            width: "100%",
            height: "40px",
            maxHeight: "40px",
            paddingX: { xs: 0, lg: 10 },
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            // borderBottom: 1, borderColor: 'divider',
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor={"secondary"}
            variant="scrollable"
            scrollButtons="auto"
            // visibleScrollbar={true}
            // allowScrollButtonsMobile={true}
            aria-label="basic tabs example"
            // TabIndicatorProps={{
            //   style: {
            //     display: "none",
            //   },
            // }}
            sx={sxStyles.tabsContainer}
          >
            <Tab disableRipple sx={sxStyles.tab} label="Seed Sale" />
            <Tab disableRipple sx={sxStyles.tab} label="Strategic" />
            <Tab disableRipple sx={sxStyles.tab} label="Private" />
            <Tab disableRipple sx={sxStyles.tab} label="Public" />
            <Tab disableRipple sx={sxStyles.tab} label="Public" />
            <Tab disableRipple sx={sxStyles.tab} label="Public" />
            <Tab disableRipple sx={sxStyles.tab} label="Public" />
          </Tabs>
          {/*<Divider />*/}
        </Box>
        <Box sx={{ minHeight: "300px", paddingX: { xs: 1, lg: 0 } }}>
          <TabPanel index={0} value={value}>
            <SeedSale name={"seed"} />
          </TabPanel>
          <TabPanel index={1} value={value}>
            <SeedSale name={"strategic"} />
          </TabPanel>
          <TabPanel index={2} value={value}>
            <SeedSale name={"private"} />
          </TabPanel>
          <TabPanel index={3} value={value}>
            <SeedSale name={"public"} />
          </TabPanel>
          <TabPanel index={4} value={value}>
            <SeedSale name={"public"} />
          </TabPanel>
          <TabPanel index={5} value={value}>
            <SeedSale name={"public"} />
          </TabPanel>
          <TabPanel index={6} value={value}>
            <SeedSale name={"public"} />
          </TabPanel>
        </Box>
      </Box>
    </Box>
        // </div>
  );
};

const sxStyles = {
  tab: {
    color: "#FFFFFF",
    maxHeight: "40px",
    textTransform: "none",
    border: "1px solid #D3D3D3",
    // borderBottom: 0,
    boxSizing: "border-box",
    borderRadius: "4px 4px 0px 0px",
    margin: "0 4px",
    padding: 1,
    fontSize: { xs: 14, md: 16 },
    height: 40,
    minHeight: 40,
    minWidth: "auto",
    "&.Mui-selected": {
      // backgroundColor: "#1395ff",
      // background: "#04030A",
      borderColor: "rgb(183,82,230)",
      color: "rgb(183,82,230)",
      fontWeight: "bold",
      height: 40,
      minHeight: 40,
    },
  },
  tabsContainer: {
    // borderBottom: 1,
    // borderColor: "divider",
    // borderColor: "#FFFFFF",
    width: "fit-content",
    height: "40px",
    minHeight: "40px",
    display: "flex",
    flexDirection: "column",
  },
} as const;

export default Cabinet;
