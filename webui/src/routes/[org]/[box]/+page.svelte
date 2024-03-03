<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Code from "$lib/components/Code.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import TabItem from "$lib/components/TabItem.svelte";
    import vagrantrepo from "$lib/common/repo.js";
    import config from "../../../config";
    
    onMount(async () => {
        apiUrl = config.apiUrl;

        box = await vagrantrepo.getBox(data.org, data.box);
        console.log(box);
    });

    let apiUrl:string = "";
    let box: any = null;
    export let data;
</script>

<div>
    <p>Organization: {box?.username}</p>
    <p>BoxName: {box?.name}</p>

    <Code>
ENV["VAGRANT_SERVER_URL"] = "{apiUrl}"
Vagrant.configure("2") do |config|
  config.vm.box = "{box?.tag}"
end
    </Code>
    <Tab>
        <TabItem label="Overview" active={true}>
            <h1>hello,world</h1>
        </TabItem>
    </Tab>
</div>

