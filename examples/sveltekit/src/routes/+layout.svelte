<script>
  import { links } from 'unplugin-fonts/head'
  import 'unfonts.css'
</script>

<svelte:head>
	{#each links as link}
    <link {...link?.attrs || {}} />
	{/each}
</svelte:head>

<main>
  <slot />
</main>
