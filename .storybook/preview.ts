import type { Preview } from '@storybook/nextjs-vite';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/iu, date: /Date$/iu },
    },
    a11y: {
      // Surface violations in the panel without failing the story render.
      test: 'todo',
    },
  },
  // Renders each story twice, once per colour scheme class.
  globalTypes: {
    theme: {
      description: 'Colour scheme',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      document.documentElement.classList.toggle('dark', context.globals.theme === 'dark');
      return Story();
    },
  ],
};

export default preview;
