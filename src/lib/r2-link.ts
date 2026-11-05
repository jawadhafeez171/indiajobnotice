import "server-only";
import { createHash, createHmac } from "node:crypto";

// A link to one stored PDF in the agent's private R2 bucket, valid for a short time. The bucket stays
// private; only a notice's own file is ever signed (src/app/pdf). Signature V4, query string form.
const EXPIRES_S = 3600;

const hmac = (key: Buffer | string, text: string) => createHmac("sha256", key).update(text).digest();
const encode = (s: string) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

/** The signed address of a stored file, or null when R2 is not set up here. */
export function signedPdfUrl(key: string, now = new Date()): string | null {
  const { R2_ACCOUNT_ID: account, R2_ACCESS_KEY_ID: id, R2_SECRET_ACCESS_KEY: secret, R2_BUCKET: bucket } = process.env;
  if (!account || !id || !secret || !bucket) return null;
  const host = `${account}.r2.cloudflarestorage.com`;
  const stamp = now.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const day = stamp.slice(0, 8);
  const scope = `${day}/auto/s3/aws4_request`;
  const path = `/${bucket}/${key.split("/").map(encode).join("/")}`;
  const query = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${id}/${scope}`],
    ["X-Amz-Date", stamp],
    ["X-Amz-Expires", String(EXPIRES_S)],
    ["X-Amz-SignedHeaders", "host"],
    ["response-content-disposition", "inline"],
    ["response-content-type", "application/pdf"],
  ].map(([k, v]) => `${encode(k)}=${encode(v)}`).sort().join("&");
  const request = ["GET", path, query, `host:${host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const toSign = ["AWS4-HMAC-SHA256", stamp, scope, createHash("sha256").update(request).digest("hex")].join("\n");
  const signing = hmac(hmac(hmac(hmac(`AWS4${secret}`, day), "auto"), "s3"), "aws4_request");
  return `https://${host}${path}?${query}&X-Amz-Signature=${hmac(signing, toSign).toString("hex")}`;
}
