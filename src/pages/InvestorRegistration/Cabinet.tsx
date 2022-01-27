import React, { useState } from "react";
import {Box, InputLabel, MenuItem, FormControl, Typography, InputBase, TextField} from "@mui/material";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from "react-router";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import ButtonComponent from "../../components/Button/Button";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

// const BootstrapInput = styled(InputBase)(({ theme }) => ({
//   'label + &': {
//     marginTop: theme.spacing(5),
//     // color: "#FFFFFF",
//   },
//   '& .MuiInputBase-input': {
//     borderRadius: "18px",
//     // position: 'relative',
//     background: "#1E2022",
//     border: '3px solid rgb(183,82,230)',
//     fontSize: 16,
//     padding: '10px 26px 10px 12px',
//     transition: theme.transitions.create(['border-color', 'box-shadow']),
//     '&:focus': {
//       borderRadius: 4,
//       borderColor: '#80bdff',
//       boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
//     },
//   },
// }));

const BootstrapFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-root': {
    borderColor: 'rgb(183,82,230)',
    color: '#FFFFFF',
    fontFamily: '"Saira", sans-serif',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 800,
    letterSpacing: '0em',
    textAlign: 'center',
    zIndex: 1,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '18px',
    '& fieldset': {
      // zIndex: 1,
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

const InvestorRegistration = () => {
  const [vestingType, setVestingType] = React.useState('');
  const [textFieldValue, setTextFieldValue] = React.useState('');

  const handleChangeVestingTypeSelect = (event: SelectChangeEvent) => {
    console.log("Change event value =", event.target.value as string)
    setVestingType(event.target.value as string);
  };

  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };

  const handleSubmit = () => {
    // setOpen(true);
    console.log("Clicked submit button")
  };

  return (
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
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        maxWidth: "432px",
        height: "100%",
        padding: "24px"
      }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
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
          </BootstrapFormControl>
        </Box>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}>
          <BootstrapTextField
              fullWidth
              label="Investor wallet"
              id="investor-wallet-input"
              onChange={handleChangeTextField}
          />
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
      </Box>
    </Box>
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
