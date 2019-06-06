import { Context, Handler } from "aws-lambda";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Server } from "http";
import { ExpressAdapter } from "@nestjs/platform-express";
import * as serverlessExpress from "aws-serverless-express";
import * as express from "express";

let cachedServer: Server;

function bootstrapServer(): Promise<Server> {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  return NestFactory.create(AppModule, adapter)
      .then(app => app.enableCors())
      .then(app => app.init())
      .then(() => serverlessExpress.createServer(expressApp));
}

export const handler: Handler = (event: any, context: Context) => {
  if (!cachedServer) {
    bootstrapServer().then(server => {
      cachedServer = server;
      return serverlessExpress.proxy(server, event, context);
    });
  } else {
    return serverlessExpress.proxy(cachedServer, event, context);
  }
};
