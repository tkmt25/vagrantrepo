<script lang="ts">
    import vagrantrepo from "$lib/common/repo.js";
    import ListBox from "$lib/components/ListBox.svelte";
    import { onMount } from "svelte";

    onMount(async () => {
        org = await vagrantrepo.getOrganization(data.org);
        boxes = org.boxes;
    });
    export let data;
    export let org:any;

    let boxes:any[];
</script>

<ListBox boxes={boxes}/>