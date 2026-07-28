# Setting Up the YiFortune MCP Connection

This reference guides the user through claiming an API key and configuring their AI client to reach the YiFortune MCP server. Load it only when the MCP connection check fails (see `SKILL.md` startup flow).

## Step 1 — Claim an API Key

1. Open **https://yifortune.pages.dev** in a browser.
2. Enter the user's email and submit.
3. The API key (`yfk_...`) is sent to that email via Resend — check the inbox **and the spam folder**.
   - Already-registered emails are not re-sent; the page says "use the key you received before".
4. Quota: 100 calls/month for regular users (resets on the 1st of each month). The site admin gets 10000/month.

## Step 2 — Configure the AI Client

The MCP server is a **Streamable HTTP** endpoint. Point the client at it with the API key in the `X-API-Key` header.

- **Endpoint**: `https://mcp.yifortune.workers.dev/mcp`
- **Auth header**: `X-API-Key: yfk_xxxxxxxxxxxxxxxxxxxxxxxx`

### Claude Desktop (macOS)

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "yifortune": {
      "type": "streamable-http",
      "url": "https://mcp.yifortune.workers.dev/mcp",
      "headers": {
        "X-API-Key": "yfk_xxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

### Cursor

`Settings → MCP → Add new MCP Server`:

- **Type**: `streamable-http` (or `url`)
- **URL**: `https://mcp.yifortune.workers.dev/mcp`
- **Headers**: `X-API-Key: yfk_xxxxxxxxxxxxxxxxxxxxxxxx`

### ZCode

Edit `~/.zcode/config.json` and add the same `mcpServers.yifortune` block as above. Reload the config (or restart) to activate.

### Other Streamable-HTTP clients

Any client supporting the MCP Streamable HTTP transport works. The two required pieces are the URL above and the `X-API-Key` header.

## Step 3 — Verify

After configuring, ask the user to retry, then re-run the startup MCP check from `SKILL.md` (call `get_bazi` with any test birth data). A successful chart confirms the connection is live.

## Troubleshooting

| Symptom | Cause / Fix |
| ------- | ----------- |
| `tools/list` returns nothing or errors | Client not restarted after config edit, or the `mcpServers` block is malformed JSON. Re-check syntax and restart. |
| 401 "Invalid or disabled API key" | Key is wrong/typo'd/disabled. Re-verify the key from the email; if lost, re-register at https://yifortune.pages.dev (existing emails won't be re-sent — use the previous key). |
| "Monthly quota exhausted" | User hit 100/month. Resets on the 1st of next month. Tell the user to wait, or contact the admin for a higher quota. |
| Connection timeout / network error | The Worker may be cold-starting (first request after deploy). Wait a few seconds and retry. If persistent, verify the endpoint URL has no trailing slash. |
