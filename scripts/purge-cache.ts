/**
 * Purges Cloudflare's cache for the site's zone. Run after `wrangler deploy` so no
 * edge location keeps serving the previous version.
 *
 * Needs two environment variables:
 *   CLOUDFLARE_API_TOKEN  an API token with the "Zone > Cache Purge > Purge" permission
 *   CLOUDFLARE_ZONE_ID    the zone ID of the domain (Cloudflare dashboard > Overview)
 */
async function main() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zone = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zone) {
    console.error(
      "Cannot purge the cache: set CLOUDFLARE_API_TOKEN (Cache Purge permission) and CLOUDFLARE_ZONE_ID.",
    );
    process.exit(1);
  }

  const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${zone}/purge_cache`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ purge_everything: true }),
  });
  const body = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    errors?: { code: number; message: string }[];
  };

  if (!res.ok || !body.success) {
    const why = (body.errors ?? []).map((e) => `${e.code}: ${e.message}`).join("; ") || `HTTP ${res.status}`;
    console.error(`Cache purge failed: ${why}`);
    process.exit(1);
  }
  console.log("Cache purged.");
}

main().catch((e) => {
  console.error(`Cache purge failed: ${(e as Error).message}`);
  process.exit(1);
});
