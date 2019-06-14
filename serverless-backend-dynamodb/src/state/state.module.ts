import { Module } from "@nestjs/common";
import { StateService } from "./state.service";
import { StateResolver } from "./state.resolver";
import { stateProvider } from "./state.provider";
import {SharedModule} from "../shared/shared.module";

@Module({
  imports: [SharedModule],
  providers: [StateService, StateResolver, ...stateProvider],
})
export class StateModule {}
