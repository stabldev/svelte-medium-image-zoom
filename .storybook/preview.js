/** @type { import('@storybook/svelte').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  }
};

export default preview;
