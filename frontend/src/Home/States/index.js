import { Container } from '@material-ui/core';
import { pubsubClient } from 'ApolloConfig';
import NewStateComponent from 'Home/NewState';
import StateComponent from 'Home/State';
import { SUBSCRIBE_DELETED_STATES, SUBSCRIBE_STATES } from 'Queries/States';
import React, { Component } from 'react';
import 'Home/States/states.css';

class StatesComponent extends Component {
  state = {
    states: this.props.states,
  };

  updateStates = async result => {
    console.log('sub', result);
    if (result.data && result.data.subscribeStates) {
      const newState = result.data.subscribeStates;
      const { found, newStates } = this.state.states.reduce(
        ({ found, newStates }, state) => {
          found = found || state.id === newState.id;
          newStates.push(state.id === newState.id ? newState : state);
          return { found, newStates };
        },
        { found: false, newStates: [] },
      );
      await this.setState({ states: found ? newStates : [...newStates, newState] });
    }
  };

  deleteState = async result => {
    console.log('delete sub', result);
    if (result.data && result.data.subscribeDeletedStates) {
      const id = result.data.subscribeDeletedStates;
      this.setState({ states: this.state.states.filter(state => state.id !== id) });
    }
  };

  componentDidMount = () => {
    pubsubClient
      .subscribe({
        query: SUBSCRIBE_STATES,
        variables: {},
      })
      .subscribe(
        {
          next: data => {
            this.updateStates(data);
          },
        },
        () => console.log('error'),
      );

    pubsubClient
      .subscribe({
        query: SUBSCRIBE_DELETED_STATES,
        variables: {},
      })
      .subscribe(
        {
          next: data => {
            this.deleteState(data);
          },
        },
        () => console.log('error'),
      );
  };
  render() {
    const { states } = this.state;
    console.log('state changed');
    return (
      <Container className="container">
        {states.map(state => (
          <StateComponent key={state.id} selectedState={state} />
        ))}
        <NewStateComponent />
      </Container>
    );
  }
}

export default StatesComponent;
