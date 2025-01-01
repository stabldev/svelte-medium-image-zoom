/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  core: {
    disableTelemetry: true
  }
};
export default config;
