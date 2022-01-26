import { field, generateSchemas, variant } from "@solvei/borsh/schema";
import BN from "bn.js";
import {VestingsCreator, LinearVesting} from "./models"

class Super {}

@variant(0)
export class CreateVestingTypeInstruction extends Super {
  @field({ type: "u64" })
  public token_count: number;

  @field({ type: "u8" })
  public vesting_count: number;

  @field(VestingsCreator)
  public vestings: Array<[BN, LinearVesting]>; // 25 * 16 = 400

  constructor(
    token_count: number,
    vesting_count: number,
    vestings: Array<[BN, LinearVesting]>,
  ) {
    super();
    this.token_count = token_count;
    this.vesting_count = vesting_count;
    this.vestings = vestings;
  }
}

@variant(1)
export class CreateVestingAccountInstruction extends Super {
  @field({ type: "u64" })
  public amount: BN;

  constructor(amount: BN) {
    super();
    this.amount = amount;
  }
}
@variant(2)
export class WithdrawFromVestingInstruction extends Super {
  @field({ type: "u64" })
  public amount: BN;

  constructor(amount: BN) {
    super();
    this.amount = amount;
  }
}

@variant(3)
export class WithdrawExcessiveFromPoolInstruction extends Super {
  @field({ type: "u64" })
  public amount: BN;

  constructor(amount: BN) {
    super();
    this.amount = amount;
  }
}

@variant(4)
export class ChangeVestingTypeScheduleInstruction extends Super {
  @field({ type: "u64" })
  public token_count: number;

  @field({ type: "u8" })
  public vesting_count: number;

  @field(VestingsCreator)
  public vestings: Array<[BN, LinearVesting]>; // 25 * 16 = 400

  constructor(
    token_count: number,
    vesting_count: number,
    vestings: Array<[BN, LinearVesting]>,
  ) {
    super();
    this.token_count = token_count;
    this.vesting_count = vesting_count;
    this.vestings = vestings;
  }
}

export class Instruction {
  @field({ type: Super })
  public enum: Super;

  constructor(value: Super) {
    this.enum = value;
  }
}

export const schemas = generateSchemas([
  CreateVestingTypeInstruction,
  CreateVestingAccountInstruction,
  WithdrawFromVestingInstruction,
  WithdrawExcessiveFromPoolInstruction,
  ChangeVestingTypeScheduleInstruction,
  Instruction,
]);
