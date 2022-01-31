import {VestingSchedule} from "token-vesting-api/src/models";
import BN from "bn.js";
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import {TokenVesting} from "token-vesting-api";

const bigNumber = require("bignumber.js");

const network: string = "https://api.testnet.solana.com";
const pubKey: string = "Fjbh45ZhxH93z84uAqNgQ6T12LeBCiC4djfjzuKRXbms";
const mint: string = "5cVJ6GDRsu6kmcMbRbzPUPyBvmooZ3aUHnGDPjhm5T5U";
const owner: string = "ATT9No3J4ajyMENTHPc9dJywWHe7Hq6kmqefA3WVuRMp";

export const getNetwork = (): string => {
    return network;
}

export const getPubKey = (): string => {
    return pubKey;
}

export const getCreator = (): string => {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse("[40,225,84,232,113,229,199,127,142,96,106,220,125,95,137,75,42,190,17,243,60,205,140,156,241,79,59,104,170,28,5,133,140,127,216,78,185,223,72,145,121,235,20,75,48,239,171,82,154,153,136,126,157,2,213,251,180,207,250,2,45,121,84,23]"))).publicKey.toString();
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

// export const sendTransaction = (token: TokenVesting, receiver: PublicKey, instruction: CreateVestingAccountInstruction) => {
//     token
//         .createVestingAccount(
//             receiver,
//             instruction
//         )
//         .then((transaction)  => {
//             console.log("withdrawFromVesting", transaction);
//             connection
//                 .getRecentBlockhash("confirmed")
//                 .then(({ blockhash }) => {
//                     transaction.recentBlockhash = blockhash;
//                     transaction.feePayer = newWalletKey;
//
//                     window.solana
//                         .signAndSendTransaction(transaction)
//                         .then((sign: { signature: string }) => {
//                             console.log("sign === ", sign);
//
//                             connection
//                                 .confirmTransaction(sign.signature)
//                                 .then((signature) => {
//                                     console.log("signature", signature);
//                                     handleClose();
//                                     handleOpen();
//                                 })
//                                 .catch((e) => {
//                                     console.log("signature", e);
//                                     setIsError(!isError);
//                                 });
//                         })
//                         .catch((e: any) => {
//                             console.log("test == ", e);
//                             setIsError(!isError);
//                         });
//                 })
//                 .catch((e) => {
//                     console.log("hash", e);
//                     setIsError(!isError);
//                 });
//         });
//     // sendAndConfirmTransaction(new Connection(network), )
// }

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

