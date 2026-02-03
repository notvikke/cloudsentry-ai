'use client';

import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_Us8h3nB9q',
            userPoolClientId: '4ukbepn8u9tcio912lrabv6vf0',
            identityPoolId: 'us-east-1:d930a49c-60b7-4192-8197-8011ce5994f6',
        }
    }
});
