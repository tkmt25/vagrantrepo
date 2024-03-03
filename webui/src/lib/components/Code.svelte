<script lang="ts">
    let codeElement: HTMLElement;
    let showTooltip = false;

    async function copyToClipboard() {
        const text = codeElement.innerText;
        await navigator.clipboard.writeText(text);
        showTooltip = true;
    }
</script>

<div class="flex items-start bg-gray-800 text-white p-4 rounded-lg overflow-hidden">
    <pre class="flex-1 overflow-auto"><code bind:this={codeElement}><slot/></code></pre>
    <button
        class="material-symbols-outlined ml-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-2 rounded active:bg-blue-500"
        on:click={copyToClipboard}
    >
    content_copy
    </button>
</div>
