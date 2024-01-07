<script>
	import { AppBar, AppShell, Modal, LightSwitch, initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

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
