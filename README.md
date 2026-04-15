# mcp-mailchimp

Mailchimp MCP Pack — manage audiences, campaigns, and members via Mailchimp Marketing API.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `mailchimp_list_audiences` | List all audiences (lists) in your Mailchimp account. Returns audience name, member count, and stats. |
| `mailchimp_get_audience` | Get details of a specific Mailchimp audience (list) by ID. Returns name, stats, and settings. |
| `mailchimp_list_campaigns` | List email campaigns from your Mailchimp account. Returns campaign title, type, status, and send time. |
| `mailchimp_get_campaign` | Get details of a specific Mailchimp campaign by ID. Returns campaign settings, tracking, and report summary. |
| `mailchimp_list_members` | List members (subscribers) of a specific Mailchimp audience. Returns email, status, and merge fields. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "mailchimp": {
      "url": "https://gateway.pipeworx.io/mailchimp/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use mailchimp
```

## License

MIT
