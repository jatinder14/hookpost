import {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

async function hookpostRequest(
  this: IExecuteFunctions | ILoadOptionsFunctions,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  path: string,
  body?: object,
  qs?: object
) {
  const credentials = await this.getCredentials('hookpostApi');
  const baseUrl = String(credentials.baseUrl || '').replace(/\/+$/, '');

  return this.helpers.httpRequestWithAuthentication.call(this, 'hookpostApi', {
    method,
    url: `${baseUrl}/public/v1${path}`,
    body,
    qs,
    json: true,
  });
}

export class Hookpost implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Hookpost',
    name: 'hookpost',
    icon: 'file:hookpost.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Schedule and publish social media posts with Hookpost',
    defaults: { name: 'Hookpost' },
    inputs: ['main'] as any,
    outputs: ['main'] as any,
    credentials: [{ name: 'hookpostApi', required: true }],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Create Post', value: 'createPost', description: 'Schedule, publish now, or save a draft', action: 'Create a post' },
          { name: 'List Posts', value: 'listPosts', description: 'List posts in a date range', action: 'List posts' },
          { name: 'Delete Post', value: 'deletePost', description: 'Delete a post by id', action: 'Delete a post' },
          { name: 'List Channels', value: 'listChannels', description: 'List connected channels', action: 'List channels' },
          { name: 'Find Free Slot', value: 'findSlot', description: 'Next free slot in your posting schedule', action: 'Find a free slot' },
          { name: 'Upload From URL', value: 'uploadFromUrl', description: 'Add media from a remote URL', action: 'Upload media from a URL' },
        ],
        default: 'createPost',
      },

      // ---- Create Post ----
      {
        displayName: 'Channel Name or ID',
        name: 'integrationId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getChannels' },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['createPost'] } },
        description:
          'The connected channel to post to. Choose from the list, or specify an ID using an expression.',
      },
      {
        displayName: 'Content',
        name: 'content',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['createPost'] } },
        description: 'The post text',
      },
      {
        displayName: 'When',
        name: 'type',
        type: 'options',
        options: [
          { name: 'Schedule', value: 'schedule', description: 'Queue it for the date below' },
          { name: 'Publish Now', value: 'now', description: 'Publish immediately' },
          { name: 'Save as Draft', value: 'draft', description: 'Save without publishing' },
        ],
        default: 'schedule',
        displayOptions: { show: { operation: ['createPost'] } },
      },
      {
        displayName: 'Date',
        name: 'date',
        type: 'dateTime',
        default: '',
        displayOptions: { show: { operation: ['createPost'], type: ['schedule'] } },
        description: 'When to publish. Leave empty to use the next free slot in your schedule.',
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: { show: { operation: ['createPost'] } },
        options: [
          {
            displayName: 'Image URLs',
            name: 'imageUrls',
            type: 'string',
            default: '',
            description: 'Comma-separated media URLs already uploaded to Hookpost',
          },
          {
            displayName: 'Channel Settings (JSON)',
            name: 'settings',
            type: 'json',
            default: '',
            description:
              'Per-channel settings. Some channels require these - YouTube needs a title and visibility, Pinterest needs a board. Call integration-settings for the channel to see its schema.',
          },
        ],
      },

      // ---- List Posts ----
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['listPosts'] } },
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['listPosts'] } },
      },

      // ---- Delete Post ----
      {
        displayName: 'Post ID',
        name: 'postId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['deletePost'] } },
      },

      // ---- Find Free Slot ----
      {
        displayName: 'Channel Name or ID',
        name: 'slotIntegrationId',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getChannels' },
        default: '',
        required: true,
        displayOptions: { show: { operation: ['findSlot'] } },
        description:
          'Choose from the list, or specify an ID using an expression',
      },

      // ---- Upload From URL ----
      {
        displayName: 'File URL',
        name: 'fileUrl',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['uploadFromUrl'] } },
        description: 'Publicly reachable URL of the image or video to add',
      },
    ],
  };

  methods = {
    loadOptions: {
      async getChannels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const channels = await hookpostRequest.call(this, 'GET', '/integrations');
        const list = Array.isArray(channels) ? channels : [];
        return list.map((c: any) => ({
          name: `${c.name} (${c.identifier || c.providerIdentifier})`,
          value: c.id,
        }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let result: any;

        if (operation === 'createPost') {
          const integrationId = this.getNodeParameter('integrationId', i) as string;
          const content = this.getNodeParameter('content', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const extra = this.getNodeParameter('additionalFields', i, {}) as {
            imageUrls?: string;
            settings?: string | object;
          };

          // A schedule with no date would otherwise be rejected, so fall back to
          // the next free slot - the same default the app itself uses.
          let date = this.getNodeParameter('date', i, '') as string;
          if (type === 'schedule' && !date) {
            const slot = await hookpostRequest.call(this, 'GET', `/find-slot/${integrationId}`);
            date = slot?.date;
          }

          const image = (extra.imageUrls || '')
            .split(',')
            .map((u) => u.trim())
            .filter(Boolean)
            .map((path) => ({ id: path, path }));

          let settings: any = undefined;
          if (extra.settings) {
            settings =
              typeof extra.settings === 'string'
                ? JSON.parse(extra.settings)
                : extra.settings;
          }

          result = await hookpostRequest.call(this, 'POST', '/posts', {
            type,
            date: date || new Date().toISOString(),
            shortLink: false,
            tags: [],
            posts: [
              {
                integration: { id: integrationId },
                value: [{ content, image }],
                ...(settings ? { settings } : {}),
              },
            ],
          });
        } else if (operation === 'listPosts') {
          result = await hookpostRequest.call(this, 'GET', '/posts', undefined, {
            startDate: this.getNodeParameter('startDate', i) as string,
            endDate: this.getNodeParameter('endDate', i) as string,
          });
        } else if (operation === 'deletePost') {
          const postId = this.getNodeParameter('postId', i) as string;
          result = await hookpostRequest.call(this, 'DELETE', `/posts/${postId}`);
        } else if (operation === 'listChannels') {
          result = await hookpostRequest.call(this, 'GET', '/integrations');
        } else if (operation === 'findSlot') {
          const id = this.getNodeParameter('slotIntegrationId', i) as string;
          result = await hookpostRequest.call(this, 'GET', `/find-slot/${id}`);
        } else if (operation === 'uploadFromUrl') {
          result = await hookpostRequest.call(this, 'POST', '/upload-from-url', {
            url: this.getNodeParameter('fileUrl', i) as string,
          });
        } else {
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
        }

        if (Array.isArray(result)) {
          out.push(...result.map((r) => ({ json: r, pairedItem: { item: i } })));
        } else {
          out.push({ json: result ?? {}, pairedItem: { item: i } });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          out.push({
            json: { error: (error as Error).message },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [out];
  }
}
