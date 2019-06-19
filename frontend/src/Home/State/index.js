import { Card } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { DELETE_STATE, SAVE_STATE } from 'Queries/States';
import React, { useEffect, useState } from 'react';
import { gqlClient } from 'PubSubConfig';
import './state.css';

const StateComponent = ({ selectedState }) => {
  const [stateText, setStateText] = useState(selectedState.state);
  const saveState = async () => {
    const newState = {
      id: selectedState.id,
      state: stateText,
    };
    try {
      await gqlClient.mutate({
        mutation: SAVE_STATE,
        variables: {
          state: newState,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const deleteState = async () => {
    try {
      await gqlClient.mutate({
        mutation: DELETE_STATE,
        variables: {
          id: selectedState.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    setStateText(selectedState.state);
  }, [selectedState.state]);
  return (
    <Card className="card">
      <CardContent>
        <h3>State {selectedState.id}</h3>
        <TextField
          value={stateText}
          onChange={event => setStateText(event.target.value)}
          margin="normal"
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => saveState()}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={() => deleteState()}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default StateComponent;
