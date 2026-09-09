import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class HookpostApi implements ICredentialType {
  name = 'hookpostApi';
  displayName = 'Hookpost API';
  documentationUrl = 'https://hookpost.hookstep.in/docs/public-api';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'Found in Hookpost under Settings → Public API. An OAuth access token (pos_…) works here too.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://hookpost.hookstep.in/api',
      required: true,
      description:
        'Change this only if you self-host Hookpost. Include /api, and no trailing slash.',
    },
  ];

  // Hookpost expects the key as a bare Authorization header - no "Bearer"
  // prefix. Sending one is rejected with 401.
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{$credentials.apiKey}}',
      },
    },
  };

  // Lets n8n's "Test" button verify the key without creating anything.
  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/public/v1/is-connected',
      method: 'GET',
    },
  };
}
