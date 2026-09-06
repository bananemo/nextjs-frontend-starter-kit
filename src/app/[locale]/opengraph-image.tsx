import { ImageResponse } from 'next/og';
import { AppConfig } from '@/config/app';

export const alt = AppConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/*
 * Do not add `export const runtime = 'edge'` — the edge runtime is deprecated
 * in Next.js 16 and ImageResponse runs on Node.js.
 *
 * Only flexbox and a subset of CSS are supported here; `display: grid` and most
 * layout shorthands silently do nothing.
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: 'flex-start',
        background: '#0a0a0a',
        color: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: '80px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
        {AppConfig.name}
      </div>
      <div style={{ display: 'flex', fontSize: 30, marginTop: 24, opacity: 0.7 }}>
        {AppConfig.description}
      </div>
    </div>,
    size,
  );
}
