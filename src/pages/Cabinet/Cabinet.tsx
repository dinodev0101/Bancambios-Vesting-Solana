import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
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
    localStorage.removeItem("publicKey");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            justifyContent: { xs: "center", md: "center" },
            display: "flex",
            margin: "10px 0"
          }}
        >
          <ButtonComponent
              type={"disconnect"}
              title={"Disconnect wallet"}
              onClick={handleDisconnectWallet}
              isIconVisible={false}
          />
        </Box>
      </Box>
      <Box sx={{ width: "100%", padding: { xs: 0, md: 0 } }}>
        <Box
          sx={{
            width: "100%",
            height: "40px",
            maxHeight: "40px",
            paddingX: { xs: 0, lg: 8 },
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
            indicatorColor={"secondary"}
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
            // sx={sxStyles.tabsContainer}
          >
            <Tab disableRipple sx={sxStyles.tab} label="Seed Sale" />
            <Tab disableRipple sx={sxStyles.tab} label="Strategic" />
            <Tab disableRipple sx={sxStyles.tab} label="Private" />
            <Tab disableRipple sx={sxStyles.tab} label="Public" />
            <Tab disableRipple sx={sxStyles.tab} label="Seed Sale" />
            <Tab disableRipple sx={sxStyles.tab} label="Seed Sale" />
            <Tab disableRipple sx={sxStyles.tab} label="Seed Sale" />
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
  );
};

const sxStyles = {
  tab: {
    color: "#FFFFFF",
    maxHeight: "40px",
    textTransform: "none",
    border: "1px solid #D3D3D3",
    boxSizing: "border-box",
    borderRadius: "4px 4px 0px 0px",
    margin: "0 4px",
    padding: 1,
    fontSize: { xs: 14, md: 16 },
    height: 40,
    minHeight: 40,
    minWidth: "auto",
    "&.Mui-selected": {
      borderColor: "rgb(183,82,230)",
      color: "rgb(183,82,230)",
      fontWeight: "bold",
      height: 40,
      minHeight: 40,
    },
  },
  // tabsContainer: {
    // borderBottom: 1,
    // borderColor: "divider",
    // borderColor: "#FFFFFF",
    // width: "fit-content",
    // height: "45px",
    // minHeight: "45px",
    // display: "flex",
    // flexDirection: "column",
  // },
} as const;

export default Cabinet;
