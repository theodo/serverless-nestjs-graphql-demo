import { Controller, Get } from "@nestjs/common";
import { StateService } from "./state.service";
import { State } from "./state.entity";

@Controller("state")
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  findAll(): Promise<State[]> {
    return this.stateService.findAll();
  }
}
