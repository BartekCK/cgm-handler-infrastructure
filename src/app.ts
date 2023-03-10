#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CgmHandlerLambdaStack } from './cgm-handler-lambda-stack/cgm-handler-lambda-stack';
import * as dotenv from 'dotenv';
import { CgmHandlerEcrStack } from './cgm-handler-ecr-stack/cgm-handler-ecr-stack';
import { EnvConfig } from './common/envConfig';
dotenv.config();
const app = new cdk.App();

const env: EnvConfig = {
    account: process.env['AWS_ACCOUNT_ID'] as string,
    region: process.env['AWS_DEFAULT_REGION'] as string,
    imageTag: process.env['IMAGE_TAG'] as string,

    dexcomUsername: process.env['DEXCOM_USERNAME'] as string,
    dexcomPassword: process.env['DEXCOM_PASSWORD'] as string,
    dexcomApplicationId: process.env['DEXCOM_APPLICATION_ID'] as string,
    dexcomUserLocation: process.env['DEXCOM_USER_LOCATION'] as string,

    defaultMaxCount: process.env['DEFAULT_MAX_COUNT'] as string,

    databaseHost: process.env['DATABASE_HOST'] as string,
    databasePort: process.env['DATABASE_PORT'] as string,
    databaseUser: process.env['DATABASE_USER'] as string,
    databasePassword: process.env['DATABASE_PASSWORD'] as string,
    databaseName: process.env['DATABASE_NAME'] as string,
};

const cgmHandlerEcrStack = new CgmHandlerEcrStack(app, 'CgmHandlerEcrStack', {
    env,
    tags: {
        app: 'cgm-handler',
    },
});

new CgmHandlerLambdaStack(app, 'CgmHandlerLambdaStack', {
    ecrRepository: cgmHandlerEcrStack.cgmHandlerRepository,
    env,
    stackName: 'CgmHandlerInfrastructure',
    tags: {
        app: 'cgm-handler',
    },
});
