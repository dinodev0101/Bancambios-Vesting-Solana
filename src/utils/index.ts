import {VestingSchedule} from "token-vesting-api/src/models";
import {Connection, PublicKey, Transaction, SerializeConfig} from "@solana/web3.js";
import {TokenVesting} from "token-vesting-api";
import { CreateVestingAccountInstruction } from "token-vesting-api/dist/schema";
import React from "react";
const bigNumber = require("bignumber.js");
const BN = require('bn.js');

const network: string = process.env.REACT_APP_NETWORK as string;
const pubKey: string = process.env.REACT_APP_VESTING_PROGRAM_ID as string;
const mint: string = process.env.REACT_APP_MINT as string;
const owner: string = process.env.REACT_APP_OWNER as string;

export const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export const getNetwork = (): string => {
    return network;
}

export const getPubKey = (): string => {
    return pubKey;
}

export const getTokenVesting = (
    type: string
): TokenVesting => {
    return new TokenVesting(
        new Connection(network),
        new PublicKey(pubKey),
        new PublicKey(mint),
        new PublicKey(owner),
        type
    );
}

export const converterBN = (number: { toString: () => string; }): string => (new bigNumber(number.toString())
        .toString()
);

export const getNextUnlockDate = (now: typeof BN, schedule: VestingSchedule): string => {
    let i = 0;

    for (; i < schedule.vesting_count!; i+=1) {
        if (schedule.vestings![i][1].last() > now) break;
    }

    if (i === schedule.vesting_count!) return schedule.last().toString()

    let j = 0;

    while(schedule.vestings![i][1].start_time.add(schedule.vestings![i][1].unlock_period.muln(j)).lt(now)) j+=1;

    return schedule.vestings![i][1].start_time.add(schedule.vestings![i][1].unlock_period.muln(j)).toString();
}

export const getAllUnlocks = (schedule: VestingSchedule, investor_tokens: typeof BN): Array<{ date: string, tokens: string }> => {
    let result: any[] = [];

    for (let i = 0; i < schedule.vesting_count!; i += 1) {
        let [ vesting_tokens, vesting ] = schedule.vestings![i];
        let investorVestingTokens = vesting_tokens.mul(investor_tokens).divRound(schedule.token_count!);
        let tokens_per_unlock = investorVestingTokens.muln(vesting.part());
        let buffer = new BN(0);
        for (let j = 0; j < vesting.unlock_count - 1; j += 1) {
            buffer = buffer.add(tokens_per_unlock);
            result.push({
                date: vesting.start_time.add(vesting.unlock_period.muln(j)).toString(),
                tokens: tokens_per_unlock.toString()
            });
        }
        result.push({
            date: vesting.last().toString(),
            tokens: investorVestingTokens.sub(buffer).toString()
        });
    }
    return result;
}

export const availableTokenAmount = async (vestingTypeName: string): Promise<number> => {
    const vestingTypeAccount = await getTokenVesting(vestingTypeName).getVestingType();
    let total = new BN(0);
    for (let i = 0; i < vestingTypeAccount.vesting_schedule?.vesting_count!; i++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        // @ts-ignore
        total.iadd(vestingTypeAccount.vesting_schedule?.vestings[i][0]);
    }
    return total.sub(vestingTypeAccount?.locked_tokens_amount!).toNumber();
}

export const checkingVestingAccountExistence = async (vestingTypeName: string, investorWallet: string): Promise<boolean> => {
    const vestingType = getTokenVesting(vestingTypeName.toLowerCase());
    const {pubkey} = await vestingType.getTokenPoolAccountContext(null);
    try {
        await vestingType.getVesting(pubkey, new PublicKey(investorWallet));
        return true;
    }
    catch (e) {
        return false;
    }
}

export const checkingWalletExistence = async (connection: Connection, wallet: string): Promise<boolean> => {
    try {
        const pubKey = new PublicKey(wallet);
        const walletCheckWeb3 = await connection?.getAccountInfo(pubKey);
        return !!walletCheckWeb3;
    } catch (err) {
        return false;
    }
}

export const createVestingAccountTransactionsArray =
    async (investors: {
        vestingType: string,
        wallet: string,
        tokens: number
    }[], setActualIndex:  React.Dispatch<React.SetStateAction<number>>): Promise<Transaction[]> => {
        let transactions: Transaction[] = [];
        for (const [index, investor] of investors.entries()) {
            setActualIndex(index + 1);
            const vestingToken = getTokenVesting(investor.vestingType.toLowerCase());
            vestingToken.createVestingAccount(
                new PublicKey(investor.wallet),
                new CreateVestingAccountInstruction(new BN(investor.tokens))
            ).then((transaction) => {
                transactions.push(transaction);
            }).catch((e) => {
                console.error("createVestingAccount", e);
            });
            await sleep(2000);
        }
        return transactions;
    };

export const checkSizeAndConcatTransactions = async (transactions: Transaction[]): Promise<Transaction[]> => {
    let result: Transaction[] = [];

    const blockHash = await new Connection(getNetwork()).getRecentBlockhash("confirmed");
    let t: Transaction = new Transaction();
    t.recentBlockhash = blockHash.blockhash;
    t.feePayer = new PublicKey(owner);
    let first = 0, last = 0;

    for (const transaction of transactions) {
        let bufferTransaction: Transaction = transaction;
        const buffer: SerializeConfig = {
            requireAllSignatures: false,
            verifySignatures: false,
        };

        try {
            t.add(bufferTransaction)
            // throws exception if the size of the transaction is bigger than MAX_TRANSACTION_SIZE
            t.serialize(buffer);
        } catch (error: any) {
            if (error.message.startsWith('Transaction too large')) {
                let concatTransaction = new Transaction();
                for (let i = first; i < last; i += 1) {
                    concatTransaction.add(transactions[i])
                }
                result.push(concatTransaction);
                t = new Transaction();
                t.recentBlockhash = blockHash.blockhash;
                t.feePayer = new PublicKey(owner);
                first = last;
            } else {
                throw error;
            }
        }
        last += 1;
    }
    let concatTransaction: Transaction = new Transaction();
    for (let i = first; i < last; i++) {
        concatTransaction.add(transactions[i])
    }
    result.push(concatTransaction);
    return result;
}

