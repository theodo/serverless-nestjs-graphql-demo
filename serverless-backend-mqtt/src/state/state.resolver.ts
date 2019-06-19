import { StateService } from "./state.service";
import {Resolver, Query, Mutation, Args} from "@nestjs/graphql";
import {PubsubService} from "../shared/pubsub.service";

@Resolver()
export class StateResolver {
  constructor(private stateService: StateService, private pubsubService: PubsubService) {}

  @Query()
  async states() {
    return this.stateService.findAll();
  }

  @Mutation()
  async saveState(@Args("state") state) {
    if (state.id) {
      const newState = await this.stateService.update(state);
      this.pubsubService.pubSub.publish('NEW_STATE', JSON.stringify(state));
      return newState;
    } else {
      const newState = await this.stateService.create(state);
      this.pubsubService.pubSub.publish('NEW_STATE', JSON.stringify(newState));
      return newState;
    }
  }

  @Mutation()
  async deleteState(@Args("id") id) {
      await this.stateService.delete(id);
      await this.pubsubService.pubSub.publish('DELETED_STATE', JSON.stringify(id));
      return id;
  }
}
