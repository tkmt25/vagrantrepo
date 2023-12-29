<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Code from "$lib/components/Code.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import TabItem from "$lib/components/TabItem.svelte";
    
    onMount(async () => {
        apiUrl = config.apiUrl;

        const baseUrl = new URL('/api/v1/box/', apiUrl)
        const url = new URL(`${data.org}/${data.box}`, baseUrl)
        const response = await fetch(url);
        const json = await response.json();
        box = json;
        console.log("boxr ", json);
        
    });

    let apiUrl:string = "";
    let box: any = null;
    export let data;
</script>

<div>
    <p>Organization: {box?.username}</p>
    <p>BoxName: {box?.name}</p>

    <!--
    <Code>
ENV["VAGRANT_SERVER_URL"] = "{apiUrl}"
Vagrant.configure("2") do |config|
  config.vm.box = "{box?.tag}"
end
    </Code>
    -->
    <Tab>
        <TabItem label="Overview" active={true}>
            <h1>hello,world</h1>
        </TabItem>
    </Tab>
</div>

