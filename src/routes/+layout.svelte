<script lang="ts">
	import {
		AppBar,
		AppShell,
		Modal,
		LightSwitch,
		initializeStores,
		popup
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import type { ModalComponent, PopupSettings } from '@skeletonlabs/skeleton';
	import LogModal from '../components/LogModal.svelte';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	const modalRegistry: Record<string, ModalComponent> = {
		modalComponentOne: { ref: LogModal }
	};

	let theme = 'skeleton';

	function changeTheme(event: any) {
		theme = event.target.value;
		document.body.setAttribute('data-theme', theme);
	}

	const popupStyle: PopupSettings = {
		event: 'click',
		target: 'popupStyle',
		placement: 'bottom'
	};

	import '../app.css';
	import { documentStore } from '../stores/DocumentStore';
	import Fa from 'svelte-fa';
	import { faGear } from '@fortawesome/free-solid-svg-icons';
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
				<button class="btn variant-filled" use:popup={popupStyle}>
					<Fa icon={faGear} />
				</button>
				<div class="card p-4 w-72 shadow-xl" data-popup="popupStyle">
					<div class="flex items-center justify-between">
						<div class="flex-initial m-1">
							<select
								id="theme-selector"
								class="select size-fit"
								bind:value={theme}
								on:change={(e) => {
									changeTheme(e);
								}}
							>
								<option value="skeleton">Skeleton</option>
								<option value="wintry">Wintry</option>
								<option value="rocket">Seafoam</option>
								<option value="vintage">Vintage</option>
								<option value="sahara">Sahara</option>
								<option value="hamlindigo">Hamlindigo</option>
								<option value="gold-nouveau">Gold Nouveau</option>
								<option value="crimson">Crimson</option>
							</select>
						</div>
						<div class="flex-initial m-1">
							<LightSwitch />
						</div>
					</div>
					<div class="arrow bg-surface-100-800-token" />
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
