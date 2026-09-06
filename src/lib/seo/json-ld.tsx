// oxlint-disable react/no-danger -- JSON-LD must be inlined as raw text inside
// a <script> tag; there is no alternative to dangerouslySetInnerHTML here. The
// value is escaped below.
import type { Thing, WithContext } from 'schema-dts';

/**
 * Renders JSON-LD structured data.
 *
 * Uses a native `<script>` rather than `next/script`: JSON-LD is data, not
 * executable code, and `next/script` exists to schedule script execution.
 *
 * The `<` escape is load-bearing. `JSON.stringify` does not sanitise strings,
 * so a value containing `</script>` would otherwise break out of the tag and
 * become an XSS vector.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inlined as text
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll('<', '\\u003c'),
      }}
      type="application/ld+json"
    />
  );
}
