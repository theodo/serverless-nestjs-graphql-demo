import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {StateModule} from "./state/state.module";

@Module({
  imports: [StateModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor() {}
}
