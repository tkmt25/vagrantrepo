<script lang="ts" context="module">
	import vagrantrepo from "$lib/common/repo";
	const role = vagrantrepo.accessToken.role;
	if(!role) {
		//await vagrantrepo.guestLogin();
	}

</script>

<script lang="ts">
	import "../app.css";
	import Header from "$lib/components/Header.svelte";
    
</script>

<div class="app">
	
	<Header/>
	
	<main>
		<slot />
	</main>
</div>

<style lang="postcss">
	:global(html) {
		@apply bg-gray-100;
    }

	.app {
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 1rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
	
</style>
