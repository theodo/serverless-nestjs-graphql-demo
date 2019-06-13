import { Module } from "@nestjs/common";
import {PubsubService} from "./pubsub.service";


@Module({
  imports: [],
  controllers: [],
  providers: [PubsubService],
  exports: [PubsubService]
})
export class SharedModule {
  constructor() {}
}
