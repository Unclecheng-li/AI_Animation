# Publishing @ui2v/cli (token route)

Workflow: **Publish to npm** (`.github/workflows/publish-npm.yml`).

The release version must match both `package.json` files and be higher than the
latest version already published for `@ui2v/cli`.

## GitHub secret

Set `NPM_TOKEN` on the repo or on the `npm-publish` environment.

## Create a working npm token

The previous E404 on `PUT @ui2v/cli` with a token almost always means **auth/permission**, not “package missing”:

1. npmjs.com → Access Tokens → **Granular Access Token**
2. Permissions: **Read and write**
3. Select package **`@ui2v/cli`** (or all `@ui2v/*`)
4. Allow publishing / automation (2FA bypass for publish if prompted)
5. Token owner must be an **owner/publisher** of `@ui2v/cli`

## Package publishing access

On https://www.npmjs.com/package/@ui2v/cli → Settings → Publishing access:

- Must **allow tokens** (do **not** choose “Require two-factor authentication and disallow tokens”)

## Run

Actions → Publish to npm → enter the next release version, for example `2.0.2`

The workflow prints `npm whoami` before publish so you can confirm the token identity.
