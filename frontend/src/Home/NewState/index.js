import { Card } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { SAVE_STATE } from 'Queries/States';
import React, { useState } from 'react';
import { gqlClient } from 'PubSubConfig';
import '../State/state.css';

const NewStateComponent = () => {
  const [stateText, setStateText] = useState('');
  const createState = async () => {
    const newState = {
      state: stateText,
    };
    try {
      await gqlClient.mutate({
        mutation: SAVE_STATE,
        variables: {
          state: newState,
        },
      });
      setStateText('');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Card className="card">
      <CardContent>
        <h3>New State</h3>
        <TextField
          value={stateText}
          onChange={event => setStateText(event.target.value)}
          margin="normal"
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={() => createState()}>
          Create
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewStateComponent;
