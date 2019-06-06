import { Inject, Injectable } from "@nestjs/common";
import { State } from "./state.entity";

@Injectable()
export class StateService {
  constructor(
    @Inject("StateRepository") private readonly stateRepository: typeof State
  ) {}

  create = async (state: State): Promise<State> => {
    return await this.stateRepository.create(state);
  };

  update = async (state: State): Promise<State> => {
    const res = await this.stateRepository.update(state, {returning: true, where: {id: state.id}});
    return res[0][0];
  };

  findAll = async (): Promise<State[]> => {
    return this.stateRepository.findAll({order: [[ 'id', 'ASC']]});
  };
}
