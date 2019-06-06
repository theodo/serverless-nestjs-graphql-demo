import { Module } from "@nestjs/common";
import { StateService } from "./state.service";
import { StateResolver } from "./state.resolver";
import { stateProvider } from "./state.provider";

@Module({
  imports: [],
  providers: [StateService, StateResolver, ...stateProvider]
})
export class StateModule {}
