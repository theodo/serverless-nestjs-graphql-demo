import { Container } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LoadingSpinner from 'Components/LoadingSpinner';
import NewStateComponent from 'Home/NewState';
import StateComponent from 'Home/State';
import { GET_STATES } from 'Queries/States';
import React from 'react';
import { Query } from 'react-apollo';
import './home.css';

const HomeComponent = () => {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            POC NestJs GraphQl
          </Typography>
        </Toolbar>
      </AppBar>
      <Query query={GET_STATES} fetchPolicy="cache-and-network">
        {({ loading, error, data }) => {
          if (loading) return <LoadingSpinner size={50} />;
          if (error) return 'Unexpected error';
          if (!data.states) return 'Unexpected error';
          return (
            <Container className="container">
              {data.states.map(state => (
                <StateComponent key={state.id} selectedState={state} />
              ))}
              <NewStateComponent />
            </Container>
          );
        }}
      </Query>
    </>
  );
};

export default HomeComponent;
