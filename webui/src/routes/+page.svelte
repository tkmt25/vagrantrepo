<script lang="ts">
    import vagrantrepo from "$lib/common/repo";
    import ListBox from "$lib/components/ListBox.svelte";
    import { onMount } from "svelte";

    let boxes:any[] = [];
    onMount(async () => {
        boxes = await vagrantrepo.search();
    });
</script>

<ListBox boxes={boxes}/>

