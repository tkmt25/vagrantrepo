<script lang="ts">
    import ListBox from "$lib/components/ListBox.svelte";

    export let data;
</script>

<ListBox boxes={data.boxes}/>
