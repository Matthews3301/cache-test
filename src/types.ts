export type Order = {
  value: number;
  expirationTime: number;
};

export enum InputSteps {
  COMMANDS,
  ARGS,
  DELAYS,
}