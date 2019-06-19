import { gqlClient } from 'PubSubConfig';
import HomeComponent from 'Home';
import { ApolloProvider } from 'react-apollo';
import React from 'react';
import 'App.css';

function App() {
  return (
    <ApolloProvider client={gqlClient}>
      <HomeComponent />
    </ApolloProvider>
  );
}

export default App;
