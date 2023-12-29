<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { writable } from "svelte/store";

    interface RegisterEventDetail {
        label: string;
        active: boolean;
    }

    interface RegisterEvent extends CustomEvent<RegisterEventDetail> {
        target: HTMLDivElement;
    }

    export let selected = writable(0);
    const dispatch = createEventDispatcher();

    let tabs: { label: string; active: boolean }[] = [];

    function selectTab(index: number) {
        selected.set(index); // 選択されたタブのインデックスを更新
        dispatch("change", { index }); // 'change' イベントを発行
    }

    function registerTab(tab: { label: string; active: boolean }): void {
        console.log("on register " + tab.label);
        tabs = [...tabs, tab];
    }
    function test(event:CustomEvent<RegisterEventDetail>) {
        registerTab(event.detail);
    }

    onMount(() => {
        selected.subscribe((value) => {
            tabs.forEach((tab, index) => {
                tab.active = index === value;
            });
        });
    });
</script>

<div
    class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
    on:message={(event) => registerTab(event.detail)}
>
    <ul class="flex flex-wrap -mb-px">
        {#each tabs as tab, i}
            <li class="me-2">
                <a
                    href="#"
                    class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                >
                    {tab.label}
                </a>
            </li>
        {/each}

        <!--
        <li class="me-2">
            <a
                href="#"
                class="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
            >
                Versions
            </a>
        </li>
        -->
    </ul>
    <div>
        <slot />
    </div>
</div>
