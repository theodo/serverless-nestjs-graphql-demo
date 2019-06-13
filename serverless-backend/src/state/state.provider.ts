import { State } from "./state.entity";

export const stateProvider = [
  {
    provide: "StateRepository",
    useValue: State
  }
];
