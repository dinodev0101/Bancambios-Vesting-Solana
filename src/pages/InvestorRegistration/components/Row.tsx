import * as React from "react";
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TableRowProps {
    listName: string;
    listLength: number;
    investorsList: {vestingType: string, wallet: string, tokens: number}[];
}

const Row: React.FC<TableRowProps> = ({ listName, listLength, investorsList}) => {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        sx={{color: '#FFFFFF'}}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="center" component="th" scope="row" sx={{color: '#FFFFFF'}}>
                    <Typography variant="body2" align="center">
                        {listName}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography variant="body2" align="center">
                        {listLength}
                    </Typography>
                </TableCell>
            </TableRow>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell style={{ padding: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            <Table size="small" aria-label="purchases">
                                <TableHead sx={{backgroundColor: '#0C0C0D'}}>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Typography variant="subtitle2" align="center">
                                                Vesting type
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="subtitle2" align="center">
                                                Investor wallet
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="subtitle2" align="center">
                                                Tokens amount
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {investorsList.map((investor) => (
                                        <TableRow key={investor.vestingType}>
                                            <TableCell align="center" component="th" scope="row">
                                                <Typography variant="body2" align="center">
                                                    {investor.vestingType}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" align="center">
                                                    {investor.wallet}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" align="center">
                                                    {investor.tokens}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default Row;
