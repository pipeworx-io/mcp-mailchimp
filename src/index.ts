interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Mailchimp MCP Pack — manage audiences, campaigns, and members via Mailchimp Marketing API.
 *
 * BYO key: pass _apiKey (Mailchimp API key).
 * Auth: HTTP Basic with "anystring" as username and API key as password.
 * Data center is extracted from API key suffix (e.g., key ending in -us21 means dc=us21).
 */


function extractDc(apiKey: string): string {
  const parts = apiKey.split('-');
  if (parts.length < 2) throw new Error('Invalid Mailchimp API key format — expected key to end with -dc (e.g., -us21)');
  return parts[parts.length - 1];
}

function mcHeaders(apiKey: string) {
  const encoded = btoa(`anystring:${apiKey}`);
  return {
    Authorization: `Basic ${encoded}`,
    'Content-Type': 'application/json',
  };
}

async function mcFetch(apiKey: string, path: string) {
  const dc = extractDc(apiKey);
  const res = await fetch(`https://${dc}.api.mailchimp.com/3.0${path}`, {
    headers: mcHeaders(apiKey),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mailchimp API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'mailchimp_list_audiences',
    description: 'List all audiences (lists) in your Mailchimp account. Returns audience name, member count, and stats.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Mailchimp API key (ends with -dc, e.g., abc123-us21)' },
        count: { type: 'number', description: 'Number of audiences to return (default 10, max 1000)' },
        offset: { type: 'number', description: 'Offset for pagination (default 0)' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'mailchimp_get_audience',
    description: 'Get details of a specific Mailchimp audience (list) by ID. Returns name, stats, and settings.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Mailchimp API key' },
        list_id: { type: 'string', description: 'Audience/list ID' },
      },
      required: ['_apiKey', 'list_id'],
    },
  },
  {
    name: 'mailchimp_list_campaigns',
    description: 'List email campaigns from your Mailchimp account. Returns campaign title, type, status, and send time.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Mailchimp API key' },
        count: { type: 'number', description: 'Number of campaigns to return (default 10, max 1000)' },
        offset: { type: 'number', description: 'Offset for pagination (default 0)' },
        status: { type: 'string', description: 'Filter by status: save, paused, schedule, sending, sent' },
      },
      required: ['_apiKey'],
    },
  },
  {
    name: 'mailchimp_get_campaign',
    description: 'Get details of a specific Mailchimp campaign by ID. Returns campaign settings, tracking, and report summary.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Mailchimp API key' },
        campaign_id: { type: 'string', description: 'Campaign ID' },
      },
      required: ['_apiKey', 'campaign_id'],
    },
  },
  {
    name: 'mailchimp_list_members',
    description: 'List members (subscribers) of a specific Mailchimp audience. Returns email, status, and merge fields.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Mailchimp API key' },
        list_id: { type: 'string', description: 'Audience/list ID' },
        count: { type: 'number', description: 'Number of members to return (default 10, max 1000)' },
        offset: { type: 'number', description: 'Offset for pagination (default 0)' },
        status: { type: 'string', description: 'Filter by status: subscribed, unsubscribed, cleaned, pending, transactional' },
      },
      required: ['_apiKey', 'list_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string | undefined;
  delete args._context;
  delete args._apiKey;

  if (!apiKey) throw new Error('_apiKey is required for Mailchimp API access');

  switch (name) {
    case 'mailchimp_list_audiences': {
      const params = new URLSearchParams();
      params.set('count', String(Math.min(1000, (args.count as number) ?? 10)));
      if (args.offset) params.set('offset', String(args.offset));
      return mcFetch(apiKey, `/lists?${params}`);
    }
    case 'mailchimp_get_audience':
      return mcFetch(apiKey, `/lists/${args.list_id}`);
    case 'mailchimp_list_campaigns': {
      const params = new URLSearchParams();
      params.set('count', String(Math.min(1000, (args.count as number) ?? 10)));
      if (args.offset) params.set('offset', String(args.offset));
      if (args.status) params.set('status', args.status as string);
      return mcFetch(apiKey, `/campaigns?${params}`);
    }
    case 'mailchimp_get_campaign':
      return mcFetch(apiKey, `/campaigns/${args.campaign_id}`);
    case 'mailchimp_list_members': {
      const params = new URLSearchParams();
      params.set('count', String(Math.min(1000, (args.count as number) ?? 10)));
      if (args.offset) params.set('offset', String(args.offset));
      if (args.status) params.set('status', args.status as string);
      return mcFetch(apiKey, `/lists/${args.list_id}/members?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
