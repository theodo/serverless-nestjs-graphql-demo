import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Client, WebSocketLink } from 'aws-lambda-ws-link';
import { WebSocketLink as ApolloWebSocketLink } from 'apollo-link-ws';
import configObject from './config/config.json';
import Amplify from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';

export const backend = process.env.REACT_APP_BACKEND;
const devMode = process.env.REACT_APP_MODE;
console.log('devMode', devMode);
console.log('backend', backend);
export const config = configObject[devMode][backend];

const link = createHttpLink({
  uri: config.apiUrl,
});

export const gqlClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

let wslink;
if (backend === 'elasticbeanstalk') {
  wslink = new ApolloWebSocketLink({
    uri: config.webSocketUrl,
  });
} else if (backend === 'serverless-dynamodb') {
  const wsClient = new Client({
    uri: config.webSocketUrl,
  });

  wslink = new WebSocketLink(wsClient);
}

export const pubsubClient =
  backend !== 'serverless-mqtt'
    ? new ApolloClient({
        cache: new InMemoryCache(),
        link: wslink,
      })
    : null;

if (backend === 'serverless-mqtt') {
  Amplify.configure({
    Auth: {
      identityPoolId: config.identityPoolId,
      region: config.region,
      userPoolId: config.userPoolId,
      userPoolWebClientId: config.userPoolWebClientId,
    },
  });
  Amplify.addPluggable(
    new AWSIoTProvider({
      aws_pubsub_region: config.region,
      aws_pubsub_endpoint: `wss://${config.mqttId}.iot.${config.region}.amazonaws.com/mqtt`,
    }),
  );
}
