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
      await this.pubsubService.pubSub.publish('NEW_STATE', newState);
      return newState;
    } else {
      const newState = await this.stateService.create(state);
      await this.pubsubService.pubSub.publish('NEW_STATE', newState);
      return newState;
    }
  }

  @Mutation()
  async deleteState(@Args("id") id) {
      await this.stateService.delete(id);
      await this.pubsubService.pubSub.publish('DELETED_STATE', id);
      return id;
  }
}
