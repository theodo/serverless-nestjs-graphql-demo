import { Container } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { gqlClient, pubsubClient } from 'ApolloConfig';
import NewStateComponent from 'Home/NewState';
import StateComponent from 'Home/State';
import {
  DELETE_STATE,
  SAVE_STATE,
  SUBSCRIBE_DELETED_STATES,
  SUBSCRIBE_STATES,
} from 'Queries/States';
import React, { Component } from 'react';
import 'Home/States/states.css';

class StatesComponent extends Component {
  state = {
    states: this.props.states,
    startTime: new Date().getTime(),
    perf: {
      newState: [],
      updateState: [],
      deleteState: [],
    },
    perfState: 'no',
    count: 0,
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

  testPerf = async () => {
    if (this.state.perfState === 'no') {
      await this.setState({ perfState: 'new', count: 0 });
    }
    const currentTime = new Date().getTime();
    if (this.state.perfState === 'new') {
      try {
        gqlClient.mutate({
          mutation: SAVE_STATE,
          variables: {
            state: { state: 'newState' },
          },
        });
      } catch (e) {
        console.log(e);
      }
    } else if (this.state.perfState === 'update') {
      try {
        gqlClient.mutate({
          mutation: SAVE_STATE,
          variables: {
            state: { id: this.state.states[0].id, state: 'updatedState' },
          },
        });
      } catch (e) {
        console.log(e);
      }
    } else if (this.state.perfState === 'delete') {
      try {
        gqlClient.mutate({
          mutation: DELETE_STATE,
          variables: {
            id: this.state.states[0].id,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
    this.setState({ startTime: currentTime });
  };

  computePerf = endTime => {
    if (this.state.perfState === 'new') {
      this.setState({
        perf: {
          ...this.state.perf,
          newState: [...this.state.perf.newState, endTime - this.state.startTime],
        },
        perfState: 'update',
      });
    } else if (this.state.perfState === 'update') {
      this.setState({
        perf: {
          ...this.state.perf,
          updateState: [...this.state.perf.updateState, endTime - this.state.startTime],
        },
        perfState: 'delete',
      });
    } else if (this.state.perfState === 'delete') {
      this.setState({
        perf: {
          ...this.state.perf,
          deleteState: [...this.state.perf.deleteState, endTime - this.state.startTime],
        },
        perfState: 'new',
        count: this.state.count + 1,
      });
    }
    if (this.state.count > 9) {
      this.setState({
        perfState: 'no',
      });
    } else {
      this.testPerf();
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
            const currentTime = new Date().getTime();
            this.updateStates(data);
            if (this.state.perfState !== 'no') {
              this.computePerf(currentTime);
            }
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
            const currentTime = new Date().getTime();
            this.deleteState(data);
            if (this.state.perfState !== 'no') {
              this.computePerf(currentTime);
            }
          },
        },
        () => console.log('error'),
      );
  };
  render() {
    const { states } = this.state;
    console.log('state changed');
    return (
      <>
        <Container className="container">
          {states.map(state => (
            <StateComponent id={`state` + state.id} key={state.id} selectedState={state} />
          ))}
          <NewStateComponent id="new_state" />
        </Container>
        <Container className="container">
          <Button variant="contained" color="secondary" onClick={() => this.testPerf()}>
            Test Perf
          </Button>
        </Container>
        <div>
          {this.state.perf.newState.length && (
            <p>
              Mean delay (ms) to create a state over {this.state.perf.newState.length} repeat :{' '}
              {this.state.perf.newState.reduce((sum, time) => sum + time, 0) /
                this.state.perf.newState.length}{' '}
              ms, min :{' '}
              {this.state.perf.newState.reduce(
                (min, time) => (time < min ? time : min),
                100000000000000000,
              )}{' '}
              ms, max :{' '}
              {this.state.perf.newState.reduce((max, time) => (time > max ? time : max), 0)} ms
            </p>
          )}
          {this.state.perf.updateState.length && (
            <p>
              Mean delay (ms) to modify a state over {this.state.perf.updateState.length} repeat :{' '}
              {this.state.perf.updateState.reduce((sum, time) => sum + time, 0) /
                this.state.perf.updateState.length}{' '}
              ms, min :{' '}
              {this.state.perf.updateState.reduce(
                (min, time) => (time < min ? time : min),
                100000000000000000,
              )}{' '}
              ms, max :{' '}
              {this.state.perf.updateState.reduce((max, time) => (time > max ? time : max), 0)}{' '}
            </p>
          )}
          {this.state.perf.deleteState.length && (
            <p>
              Mean delay (ms) to delete a state over {this.state.perf.deleteState.length} repeat :{' '}
              {this.state.perf.deleteState.reduce((sum, time) => sum + time, 0) /
                this.state.perf.deleteState.length}{' '}
              ms, min :{' '}
              {this.state.perf.deleteState.reduce(
                (min, time) => (time < min ? time : min),
                100000000000000000,
              )}{' '}
              ms, max :{' '}
              {this.state.perf.deleteState.reduce((max, time) => (time > max ? time : max), 0)}{' '}
            </p>
          )}
        </div>
      </>
    );
  }
}

export default StatesComponent;
