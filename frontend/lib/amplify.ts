'use client';

import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-1_Li2BuvdHV',
            userPoolClientId: '4ecl360fb62jfbdnnhcm7mm335',
        }
    }
});
