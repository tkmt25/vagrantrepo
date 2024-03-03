<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    export let label:string = "default";
    export let active:boolean = false;

    $:visible = active ? 'block' : 'hidden';

    const dispatch = createEventDispatcher();
    onMount(() => {
        console.log("onMount")
        dispatch('message', {label, active});
    });
</script>

{#if active}
<div>
    <slot/>
</div>
{/if}