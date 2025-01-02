# svelte-medium-image-zoom

![NPM Version](https://img.shields.io/npm/v/svelte-medium-image-zoom)
![NPM License](https://img.shields.io/npm/l/svelte-medium-image-zoom)

The original [medium.com-inspired image zooming](https://medium.design/image-zoom-on-medium-24d146fc0c20) library for [Svelte](https://svelte.dev/).  
[View the storybook examples](https://moonlitgrace.github.io/svelte-medium-image-zoom/)
to see various usages.

> status: alpha

## Quickstart

```bash
npm install --save svelte-medium-image-zoom
```

```svelte
<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';
  import 'svelte-medium-image-zoom/dist/styles.css';
</script>

<Zoom>
  <img
    alt="That Wanaka Tree, New Zealand by Laura Smetsers"
    src="/media/andres-iga.jpg"
    width="500"
  />
</Zoom>
```
