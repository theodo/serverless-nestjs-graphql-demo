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
