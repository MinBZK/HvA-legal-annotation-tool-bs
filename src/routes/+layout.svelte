<script>
	import { AppBar, AppShell, Modal, LightSwitch, initializeStores } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import '../app.css';
</script>

<AppShell>
	<Modal />
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">buttter</svelte:fragment>
			<h1 class="h3">
				<span
					class="bg-gradient-to-br from-red-500 to-yellow-300 bg-clip-text text-transparent box-decoration-clone"
					>LEGAL ANNOTATION TOOL</span
				>
			</h1>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
