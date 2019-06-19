import { Injectable } from '@nestjs/common';
const uuid = require('uuid');
const awsIot = require('aws-iot-device-sdk');


@Injectable()
export class PubsubService {
    pubSub;

    constructor() {
        const src_path = __dirname.split('/').reduce((path, pathBit) => {
            if (pathBit && pathBit !== 'shared') {
                return path + '/' + pathBit;
            }
            return path;
        }, '');
        console.log(src_path);
        this.pubSub = awsIot.device({
            keyPath: src_path + '/certs/3498f6e2f1-private.pem.key',
            certPath: src_path + '/certs/3498f6e2f1-certificate.pem.crt',
            caPath: src_path + '/certs/root-CA.crt',
            clientId: uuid(),
            host: 'afkk7oiafedph-ats.iot.eu-west-1.amazonaws.com'
        });
        this.pubSub.on('connect', () => {
            console.log('mqtt connected');
        });
    }
}
