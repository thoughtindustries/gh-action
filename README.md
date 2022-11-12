# Wait for commit status action

This actions waits until a context from commit status to fail or succeed.

## Inputs

### `sha`

**Required** The sha to check commit status on.

### `context`

**Required** The context name to check the status for.

### `token`

**Required** The Github token to use to make the check.

### `repository`

**Required** The OWNER/REPOSITORY to make the check against.

### `sleep`

The amount of time, in seconds, to sleep between checks. Default: 10.

### `repeat`

The amount of times to repeat the check before quitting. Default: 20.

## Example usage

```yaml
uses: thoughtindustries/wait-for-commit-status@v1.1
with:
  sha: ${{ github.sha }}
  context: 'Context #1'
  token: ${{ secrets.MY_REPO_PAT }}
  repository: 'my/repo'
  sleep: '10'
  repeat: '20'
```

## Development

Make you sure you install vercel/ncc globally (`npm i -g @vercel/ncc`).

After making changes in `index.js`, run `npm run build`.

Create a new tag (`git tag -a -m "Description" v?`).

Then `git push --follow-tags`.
