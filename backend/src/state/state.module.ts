import { Module } from "@nestjs/common";
import { StateService } from "./state.service";
import { StateController } from "./state.controller";

@Module({
  imports: [],
  providers: [StateService],
  controllers: [StateController]
})
export class StateModule {}
