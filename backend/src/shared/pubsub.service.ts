import { Injectable } from '@nestjs/common';
import {
    PubSub,
    DynamoDBEventStore,
} from 'aws-lambda-graphql';

@Injectable()
export class PubsubService {
    pubSub;

    constructor() {
        const eventStore = new DynamoDBEventStore({eventsTable: 'NestPOCEvents'});
        this.pubSub = new PubSub({ eventStore });
    }
}
