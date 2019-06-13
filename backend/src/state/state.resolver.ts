import { StateService } from "./state.service";
import {Resolver, Query, Mutation, Args, Subscription} from "@nestjs/graphql";
import {PubSub} from "graphql-subscriptions";

const pubSub = new PubSub();

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
      const newState = await this.stateService.update(state);
      await pubSub.publish('NEW_STATE', {subscribeStates: newState});
      return newState;
    } else {
      const newState = await this.stateService.create(state);
      await pubSub.publish('NEW_STATE', {subscribeStates: newState});
      return newState;
    }
  }

  @Mutation()
  async deleteState(@Args("id") id) {
      await this.stateService.delete(id);
      await pubSub.publish('DELETED_STATE', {subscribeDeletedStates: id});
      return id;
  }

  @Subscription()
  subscribeStates() {
    console.log('subscribe');
    return pubSub.asyncIterator('NEW_STATE');
  }

  @Subscription()
  subscribeDeletedStates() {
    console.log('subscribe');
    return pubSub.asyncIterator('DELETED_STATE');
  }
}
