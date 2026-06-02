# mcp-mailchimp

Mailchimp MCP Pack — manage audiences, campaigns, and members via Mailchimp Marketing API.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `mailchimp_list_audiences` | View all audiences in your account. Returns audience names, member counts, and engagement stats. Use mailchimp_get_audience for detailed settings. |
| `mailchimp_get_audience` | Get detailed settings and stats for a specific audience. Pass the audience ID (e.g., "abc123def456"). Returns name, member count, engagement metrics, and configuration. |
| `mailchimp_list_campaigns` | View all email campaigns. Returns title, type (e.g., "regular", "automation"), status, and send timestamps. Use mailchimp_get_campaign for full details. |
| `mailchimp_get_campaign` | Get full details of a campaign by ID (e.g., "abc123def456"). Returns settings, tracking configuration, performance stats, and send history. |
| `mailchimp_list_members` | Get subscribers in an audience by ID (e.g., "abc123def456"). Returns email addresses, subscription status, and custom merge fields. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "mailchimp": {
      "url": "https://gateway.pipeworx.io/mailchimp/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Mailchimp data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
