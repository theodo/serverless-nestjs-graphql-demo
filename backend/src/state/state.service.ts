import { Injectable } from "@nestjs/common";
import { State } from "./state.entity";
import { Client } from "pg";

@Injectable()
export class StateService {
  client: Client;

  constructor() {
    console.log("init client ", process.env.DB_HOST);
    this.client = new Client({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    this.client.connect();
  }

  async findAll(): Promise<State[]> {
    console.log("client : ", this.client);
    console.log("querying state");
    const res = await this.client
      .query("SELECT id, state FROM state")
      .catch(e => console.error(e.stack));
    if (res) {
      console.log(res);
      return res.rows;
    } else {
      return [{ id: 1, state: "my state" }];
    }
  }
}
