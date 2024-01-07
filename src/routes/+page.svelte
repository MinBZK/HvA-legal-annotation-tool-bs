<script lang="ts">
	import AnnotationView from '../components/AnnotationView.svelte';
	import AnnotationResults from '../components/AnnotationResults.svelte';
	import AnnotationExport from '../components/AnnotationExport.svelte';
	import ImportXml from '../components/ImportXML.svelte';
	import FilterFile from '../components/FilterFile.svelte';
	import LabelInputChips from '../components/LabelInputChips.svelte';
	import LabelRelations from '../components/LabelRelations.svelte';

	import supabase from '../lib/supabaseClient';

	import { labelStore } from '../stores/LabelStore';
	import { onMount } from 'svelte';

	import { Drawer, Modal, Toast, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
	const drawerStore = getDrawerStore();

	let fileContent = '';

	onMount(async () => {
		labelStore.set([]);
		const { data, error } = await supabase.from('labels').select('*');
		if (error) {
			console.log(error);
		} else {
			labelStore.set(data);
		}
	});
</script>

{#if !fileContent}
	<div class="flex flex-col">
		<div class="self-center">
			<ImportXml
				on:fileUploaded={(e) => {
					fileContent = e.detail;
				}}
			/>
		</div>
	</div>
{:else}
	<div class="flex flex-row">
        <Modal />
		<Toast />
		<Drawer>
			{#if $drawerStore.id === 'relationships'}
				<LabelRelations />
			{/if}
		</Drawer>
		<div class="w-1/4 p-5 bg-gray-300 dark:bg-slate-900">
			<FilterFile />
		</div>
		<div class="w-3/4 overflow-auto">
			<AnnotationView />
			<AnnotationExport />
		</div>
		<div class="max-w-48">
			<LabelInputChips />
		</div>
		<div
			class="w-1/4 h-1/4 flex justify-center items-center absolute right-0 top-20 transform -translate-y-1/2"
		>
			<button
				class="mt-5 variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 mt-2 mr-2 rounded-full"
				on:click={() =>
					drawerStore.open({
						id: 'relationships',
						position: 'right',
						bgDrawer: 'bg-indigo-900 text-white',
						width: 'w-[40%]',
						padding: 'p-4',
						rounded: 'rounded-xl'
					})}
			>
				All Annotations
			</button>
		</div>
	</div>
{/if}

<AnnotationResults />
