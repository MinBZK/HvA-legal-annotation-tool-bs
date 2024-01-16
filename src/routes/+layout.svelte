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
	import { documentStore } from '../stores/DocumentStore';
</script>

<AppShell>
	<Modal components={modalRegistry} />
	<svelte:fragment slot="header">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<h5 class="h3 font-sans">LEGAL ANNOTATION TOOL</h5>
			</svelte:fragment>
			{#if $documentStore.filename}
			<h4 class="h4">
				<span class="font-mono font-thin uppercase">{$documentStore.filename}</span>
			</h4>
			{:else}
			<h3 class="h3">
				<span class="font-mono">WORK IN PROGRESS</span>
			</h3>
			{/if}
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
