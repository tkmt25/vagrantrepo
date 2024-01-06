<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    
    let boxes:any[] = [];
    async function search(q:string) {
        const response = await fetch(
            `${config.apiUrl}api/v1/search?q=${q}`
        );
        boxes = await response.json();
        console.log("response", boxes);
    }

    $: query = $page.url.searchParams.get('q') || "";
    $: search(query)

    onMount(async () => {
        //search(query)
    });
</script>

<div class="w-full max-w-md p-4">
    {#each boxes as box}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div 
        class="p-4 min-w-lm mx-auto rounded-lg border shadow-md hover:shadow-lg hover:border-gray-400 cursor-pointer"
        on:click={()=> goto(box.tag)}
    >
        <div class="flex">
            <div class="flex-shrink-0">
                <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="image">
            </div>
            <h5 class="mb-2 font-bold text-gray-900 ms-4">
                {box.tag}
            </h5>
            <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white ms-4">
                <div class="material-symbols-outlined">download</div>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                    {box.downloads}
                </p>
            </div>
        </div>
        <p class="mb-3 font-normal text-gray-700">{box.short_description || ""}</p>
    </div>    
    {/each}
</div>
<!--
<div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center justify-between mb-4">
        <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Boxes
        </h5>
   </div>
   <div class="flow-root">
        <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-700">
            {#each boxes as box}
            
            <div class="p-4 max-w-sm mx-auto bg-white rounded-lg border shadow-md hover:shadow-lg hover:border-gray-400 cursor-pointer">
                <a href={box.tag}>
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{box.tag}</h5>
                    <p class="mb-3 font-normal text-gray-700">{box.short_description || ""}</p>
                </a>
            </div>
            <li class="py-3 sm:py-4 hover:shadow-lg hover:border-gray-400 cursor-pointer">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <img class="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image">
                    </div>
                    <div class="flex-1 min-w-0 ms-4">
                        <p class="text-lm font-medium text-gray-900 dark:text-white">
                            {box.username}/{box.name}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            {box.description_html || ""}
                        </p>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            {box.updated_at}
                        </p>
                    </div>
                    <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        <div class="material-symbols-outlined">download</div>
                        <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                            {box.downloads}
                        </p>
                    </div>
                </div>
            </li>    
            {/each}
        </ul>
   </div>
</div>

-->