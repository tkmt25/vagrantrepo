// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
	
	interface Config {
		basePath: string;
		apiUrl: string;
	}
}

declare var config: Config;
export {config};
