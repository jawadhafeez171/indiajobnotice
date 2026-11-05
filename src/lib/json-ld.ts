/**
 * Data for a <script type="application/ld+json">: "<" is escaped, so text from outside (a notice's
 * title) cannot close the tag and run as code. Same JSON to Google.
 */
export function safeJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
