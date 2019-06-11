import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Client, WebSocketLink } from 'aws-lambda-ws-link';

const link = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});

export const gqlClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

const wsClient = new Client({
  uri: process.env.REACT_APP_WS_PUBSUB_URL,
});
const wslink = new WebSocketLink(wsClient);

export const pubsubClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: wslink,
});
