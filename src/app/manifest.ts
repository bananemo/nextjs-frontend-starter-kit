import type { MetadataRoute } from 'next';
import { AppConfig } from '@/config/app';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: AppConfig.name,
    short_name: 'Starter Kit',
    description: AppConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
