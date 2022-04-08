import React, { useState} from "react";
import { Box, Tab, Tabs } from "@mui/material";
import SeedSale from "../SeedSale/SeedSale";
import { useNavigate } from "react-router";
import ButtonComponent from "../../components/Button/Button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const vestingTypes = [
  {
    label: "Seed",
    name: "seed",
  },
  {
    label: "BocaChica",
    name: "boca-chica",
  },
  {
    label: "BocaChica-2",
    name: "boca-chica-2",
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

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: "100%" }}
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
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%", }}>
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
      <Box sx={{ width: "100%", padding: { xs: 0, md: 0 }, minHeight: "454px" }}>
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
            indicatorColor={"secondary"}
            variant="scrollable"
            allowScrollButtonsMobile
            scrollButtons="auto"
          >
            {vestingTypes.map((type,index) => (
              <Tab key={index} disableRipple sx={sxStyles.tab} label={type.label} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ minHeight: "414px", paddingX: { xs: 1, lg: 0 } }}>
          {vestingTypes.map((type,index) => (
              <TabPanel key={index} index={index} value={value}>
                <SeedSale name={type.name} />
              </TabPanel>
          ))}
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
} as const;

export default Cabinet;
