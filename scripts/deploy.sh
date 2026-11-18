#!/usr/bin/env bash
# Build, deploy to Cloudflare, purge the cache, then check the live site.
#
# Needs: `npx wrangler login`, plus these environment variables:
#   CLOUDFLARE_ACCOUNT_ID  only if your login can see more than one Cloudflare account
#   CLOUDFLARE_API_TOKEN   token with the "Zone > Cache Purge > Purge" permission
#   CLOUDFLARE_ZONE_ID     zone ID of the domain
set -euo pipefail

# The live site ships from `production` (work happens on `main`; fast-forward
# `production` to publish). Deploy only code that is committed and pushed there.
require_production() {
  local branch
  branch="$(git branch --show-current)"
  if [ "$branch" != "production" ]; then
    echo "Refusing to deploy: on branch '$branch', not production." >&2
    exit 1
  fi
}

# This folder can be shared with other tools that switch branches, so check again
# after the build.
require_production
git fetch --quiet origin production
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/production)" ]; then
  echo "Refusing to deploy: local production is not the same commit as origin/production." >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "Refusing to deploy: the working tree has uncommitted changes." >&2
  exit 1
fi

npm run build
require_production

npx wrangler deploy
npx tsx scripts/purge-cache.ts
npx tsx scripts/verify-live.ts
echo "Deployed, cache purged, live site checked."
