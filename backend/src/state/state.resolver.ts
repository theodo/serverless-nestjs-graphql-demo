import { StateService } from "./state.service";
import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

@Resolver()
export class StateResolver {
  constructor(private stateService: StateService) {}

  @Query()
  async states() {
    return this.stateService.findAll();
  }

  @Mutation()
  async saveState(@Args("state") state) {
    if (state.id) {
      return this.stateService.update(state);
    } else {
      return this.stateService.create(state);
    }
  }
}
