import {VestingSchedule} from "token-vesting-api/src/models";
import BN from "bn.js";
import {Connection, PublicKey} from "@solana/web3.js";
import {TokenVesting} from "token-vesting-api";
const bigNumber = require("bignumber.js");

const network: string = "https://api.testnet.solana.com";
const pubKey: string = "HLCCyk6MwqdgJcAgkK5FJGxbgY6CHUQTJAdKDn1wwEVw";
const mint: string = "BGYjzXh6nkZgoTFyfqgY5KTZYFJLVTD5sZnzegUwnCLu";
const owner: string = "FeoRru9dKQzpctSZUkqnqn8UtkkyqPkUkMXzdBNTEQh";

export const getNetwork = (): string => {
    return network;
}

export const getPubKey = (): string => {
    return pubKey;
}

export const getTokenVesting = (
    type: string,
    creator: string = owner
): TokenVesting => {
    return new TokenVesting(
        new Connection(network),
        new PublicKey(pubKey),
        new PublicKey(mint),
        new PublicKey(creator),
        type
    );
}

export const converterBN = (number: { toString: () => string; }): string => (new bigNumber(number.toString())
        // .dividedBy(LAMPORTS_PER_SOL)
        .toString()
);

export const getNextUnlockDate = (now: BN, schedule: VestingSchedule): string => {
    let i = 0;

    for (; i < schedule.vesting_count!; i+=1) {
        if (schedule.vestings![i][1].last() > now) break;
    }

    if (i === schedule.vesting_count!) return schedule.last().toString()

    let j = 0;

    while(schedule.vestings![i][1].start_time.add(schedule.vestings![i][1].unlock_period.muln(j)).lt(now)) j+=1;

    return schedule.vestings![i][1].start_time.add(schedule.vestings![i][1].unlock_period.muln(j)).toString();
}

export const getAllUnlocks = (schedule: VestingSchedule, investor_tokens: BN): Array<{ date: string, tokens: string }> => {
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

