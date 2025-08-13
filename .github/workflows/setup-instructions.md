# GitHub Workflow Setup Instructions

## Setting Up the Claude Code OAuth Token

### Step 1: Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CLAUDE_CODE_OAUTH_TOKEN`
5. Value: [Paste your token here]
6. Click "Add secret"

### Step 2: Test the Workflow

1. Go to Actions tab in your repository
2. Find "Update CLAUDE.md Documentation" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Security Best Practices

- **NEVER** commit tokens to your repository
- **NEVER** share tokens in public forums or chat
- Rotate tokens regularly
- Use repository secrets for all sensitive data
- Consider using environment-specific tokens

### Troubleshooting

If the workflow fails:
1. Check that the secret name matches exactly: `CLAUDE_CODE_OAUTH_TOKEN`
2. Ensure the token hasn't expired
3. Verify GitHub Actions is enabled for your repository
4. Check the workflow logs for specific error messages

### Manual Token Generation

If you need to generate a new token:
```bash
claude setup-token
```

This will create a new OAuth token for use with GitHub Actions.

### Alternative: Using API Key

If you prefer using an API key instead:
1. Add `ANTHROPIC_API_KEY` as a repository secret
2. Update the workflow to use `anthropic_api_key` instead of `claude_code_oauth_token`

## Important Security Notes

- Tokens are sensitive credentials that provide access to your Claude account
- Always use GitHub Secrets for storing tokens
- Never expose tokens in logs, code, or chat messages
- Regularly audit and rotate your tokens
- Use the principle of least privilege for token permissions