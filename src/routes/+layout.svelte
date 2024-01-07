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
            <svelte:fragment slot="lead">PROTOTYPE BUILD</svelte:fragment>
			Legal Annotation Tool
            <svelte:fragment slot="trail">
                <LightSwitch />
            </svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
