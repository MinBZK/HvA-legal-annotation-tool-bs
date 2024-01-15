<script lang="ts">
	import { AppBar, AppShell, Modal, LightSwitch, initializeStores, popup } from '@skeletonlabs/skeleton';
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
	};

	const popupStyle: PopupSettings = {
		event: 'click',
		target: 'popupStyle',
		placement: 'bottom',
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
				<button class = "btn variant-filled" use:popup={popupStyle}></button>
				<div class ="card p-4 w-72 shadow-xl right-5" data-popup="popupStyle">
					<div><p>testings!</p></div>
					<div class="arrow bg-surface-100-800-token"/>
				</div>





				<!-- <div class="flex content-center justify-between">
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
						<LightSwitch class="size-fit" />
					</div>
				</div> -->
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
