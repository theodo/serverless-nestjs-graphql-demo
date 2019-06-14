import {Inject, Injectable} from "@nestjs/common";
import {State} from "./state.entity";

@Injectable()
export class StateService {
  constructor(
    @Inject("StateRepository") private readonly stateRepository: typeof State
  ) {}

  create = async (state: State): Promise<State> => {
    const res = await this.stateRepository.create(state);
    return res['dataValues'] as State;
  };

  update = async (state: State): Promise<State> => {
    const res = await this.stateRepository.update(state, {returning: true, where: {id: state.id}});
    return res[1][0]['dataValues'] as State;
  };

  delete = async (id: number): Promise<void> => {
    await this.stateRepository.destroy({where: {id}});
  };

  findAll = async (): Promise<State[]> => {
    return this.stateRepository.findAll({order: [[ 'id', 'ASC']]});
  };
}
