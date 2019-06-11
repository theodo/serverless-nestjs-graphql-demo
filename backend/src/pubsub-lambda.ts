import { DynamoDBStreamEvent, Handler} from 'aws-lambda';
import {
  PubSub,
  DynamoDBEventStore,
  APIGatewayWebSocketEvent,
  createWsHandler,
  createDynamoDBEventProcessor,
  DynamoDBConnectionManager,
  DynamoDBSubscriptionManager,
} from 'aws-lambda-graphql';
import {makeExecutableSchema} from "graphql-tools";



const eventStore = new DynamoDBEventStore();
const pubSub = new PubSub({ eventStore });

interface State {
  id: number,
  state: string,
}

const schema = makeExecutableSchema({
  typeDefs: /* GraphQL */ `
    type State {
      id: Int
      state: String
    }

    type Query {
      serverTime: Float!
    }

    type Subscription {
       subscribeStates: State
       subscribeDeletedStates: Int
    }
  `,
  resolvers: {
    Query: {
      serverTime: () => Date.now(),
    },
    Subscription: {
      subscribeStates: {
        resolve: (payload: State) => {
          // resolve is call by the eventProcessor for each subscribers when a state is publish
          return payload;
        },
        subscribe: pubSub.subscribe('NEW_STATE'),
      },
      subscribeDeletedStates: {
        resolve: (payload: State) => {
          // resolve is call by the eventProcessor for each subscribers when a state is publish
          return payload;
        },
        subscribe: pubSub.subscribe('DELETED_STATE'),
      },
    },
  } as any,
});


const subscriptionManager = new DynamoDBSubscriptionManager(
    {subscriptionsTableName: 'NestPOCSubscriptions'}
);
const connectionManager = new DynamoDBConnectionManager({
  subscriptions: subscriptionManager,
  connectionsTable: 'NestPOCConnections'
});

const eventProcessor = createDynamoDBEventProcessor({
  connectionManager,
  schema,
  subscriptionManager,
});
const wsHandler = createWsHandler({
  connectionManager,
  schema,
  subscriptionManager,
});

export const handler: Handler = (
  event: APIGatewayWebSocketEvent | DynamoDBStreamEvent,
  context,
) => {
  // detect event type
  if ((event as DynamoDBStreamEvent).Records != null) {
    // event is DynamoDB stream event
    return eventProcessor(event as DynamoDBStreamEvent, context, null as any);
  }
  if (
    (event as APIGatewayWebSocketEvent).requestContext != null &&
    (event as APIGatewayWebSocketEvent).requestContext.routeKey != null
  ) {
    // event is web socket event from api gateway v2
    return wsHandler(event as APIGatewayWebSocketEvent, context);
  }
  throw new Error('Invalid event');
};
