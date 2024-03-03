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

<ul
  class="mb-5 flex list-none flex-row flex-wrap border-b-0 pl-0"
  role="tablist"
  data-te-nav-ref>
  <li role="presentation">
    <a
      href="#tabs-home"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-home"
      data-te-nav-active
      role="tab"
      aria-controls="tabs-home"
      aria-selected="true"
      >Home</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-profile"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-profile"
      role="tab"
      aria-controls="tabs-profile"
      aria-selected="false"
      >Profile</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-messages"
      class="my-2 block border-x-0 border-b-2 border-t-0 border-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
      data-te-toggle="pill"
      data-te-target="#tabs-messages"
      role="tab"
      aria-controls="tabs-messages"
      aria-selected="false"
      >Messages</a
    >
  </li>
  <li role="presentation">
    <a
      href="#tabs-contact"
      class="disabled pointer-events-none my-2 block border-x-0 border-b-2 border-t-0 border-transparent bg-transparent px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-400 hover:isolate hover:border-transparent hover:bg-neutral-100 focus:isolate focus:border-transparent dark:text-neutral-600"
      data-te-toggle="pill"
      data-te-target="#tabs-contact"
      role="tab"
      aria-controls="tabs-contact"
      aria-selected="false"
      >Contact</a
    >
  </li>
</ul>
<!--
<div
    class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
    on:message={(event) => console.log(event)}
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

        <li class="me-2">
            <a
                href="#"
                class="inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
            >
                Versions
            </a>
        </li>
    </ul>
    <div>
        <slot />
    </div>
</div>
-->