import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {StateModule} from "./state/state.module";
import {DatabaseModule} from "./database/database.module";
import {GraphQLModule} from "@nestjs/graphql";

@Module({
  imports: [StateModule,
    DatabaseModule,
    GraphQLModule.forRoot({
      typePaths: ["./**/*.graphql", "/var/task/src/**/*.graphql"],
      context: ({ req }) => ({ req })
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor() {}
}
