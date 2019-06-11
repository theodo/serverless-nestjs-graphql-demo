import gql from 'graphql-tag';

export const GET_STATES = gql`
  {
    states {
      id
      state
    }
  }
`;

export const SAVE_STATE = gql`
  mutation SaveState($state: StateInput) {
    saveState(state: $state) {
      id
      state
    }
  }
`;

export const DELETE_STATE = gql`
  mutation DeleteState($id: Int) {
    deleteState(id: $id)
  }
`;

export const SUBSCRIBE_STATES = gql`
  subscription SubscribeStates {
    subscribeStates {
      id
      state
    }
  }
`;

export const SUBSCRIBE_DELETED_STATES = gql`
  subscription SubscribeDeletedStates {
    subscribeDeletedStates
  }
`;
