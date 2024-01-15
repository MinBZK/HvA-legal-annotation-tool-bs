<script lang="ts">
	import { AppBar, AppShell, Modal, LightSwitch, initializeStores } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import LogModal from '../components/LogModal.svelte';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const modalRegistry: Record<string, ModalComponent> = {
		modalComponentOne: { ref: LogModal }
	};

	import '../app.css';
</script>

<AppShell>
	<Modal components={modalRegistry} />
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<h5 class="h5 font-mono">PROTOTYPE VERSION</h5>
			</svelte:fragment>
			<h3 class="h3">
				<span class=""><a href="/">LEGAL ANNOTATION TOOL</a></span>
			</h3>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
