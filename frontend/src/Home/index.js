import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LoadingSpinner from 'Components/LoadingSpinner';
import StatesComponent from 'Home/States';
import { GET_STATES } from 'Queries/States';
import React from 'react';
import { Query } from 'react-apollo';

const HomeComponent = () => (
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
        return <StatesComponent states={data.states} />;
      }}
    </Query>
  </>
);

export default HomeComponent;
