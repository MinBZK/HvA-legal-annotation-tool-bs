<script lang="ts">
	import AnnotationView from '../components/AnnotationView.svelte';
	import AnnotationExport from '../components/AnnotationExport.svelte';
	import ImportXml from '../components/ImportXML.svelte';
	import FilterFile from '../components/FilterFile.svelte';
	import LabelInputChips from '../components/LabelInputChips.svelte';
	import LabelRelations from '../components/LabelRelations.svelte';

	import supabase from '../lib/supabaseClient';

	import { labelStore } from '../stores/LabelStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Drawer, Modal, Toast, getDrawerStore, initializeStores } from '@skeletonlabs/skeleton';
	import LabelList from '../components/LabelList.svelte';

	let showAnnotations = false;
	initializeStores();
	const drawerStore = getDrawerStore();

	let fileContent: LegalDocument | null = null;

	onMount(async () => {
		labelStore.set([]);
		const { data, error } = await supabase.from('labels').select('*');
		if (error) {
			console.log(error);
		} else {
			labelStore.set(data);
		}

		documentStore.subscribe((value) => {
			console.dir(value);
			if (value.title = '') {
				fileContent = value;
				localStorage.setItem('legal-document', JSON.stringify(value));
			}
		});
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
            {#if $drawerStore.id === 'labelsModify'}
                <LabelList />
            {/if}
		</Drawer>
		<div class="w-1/4 p-5 bg-surface-300 dark:bg-surface-700">
			<FilterFile />
		</div>
		<div class="w-3/4 overflow-auto h-[100vh]">
			<div class="h-1/3">
				<AnnotationView />
			</div>
			<div class="ml-10 absolute bottom-0 right-0 m-10">
				<btn title="New File" class="btn btn-lg variant-filled-success rounded-md">
					<Fa size="1.5x" icon={faPlus} />
				</btn>
				<AuditLog />
				<AnnotationExport />
			</div>
		</div>
		<div class="max-w-48">
			<LabelInputChips />
		</div>
		<!-- svelte-ignore a11y-mouse-events-have-key-events -->
		<button
			class="text-white font-bold py-2 px-4 mt-2 mr-2"
			style="position: fixed; right: 0; top: 50%; transform: translateY(-50%); background: none; border: none;"
			on:click={() => {
				drawerStore.open({
					id: 'relationships',
					position: 'right',
					bgDrawer: 'bg-surface-600 text-white',
					width: 'w-[40%]',
					padding: 'p-4',
					rounded: 'rounded-xl'
				});
			}}
			on:mouseover={() => (showAnnotations = true)}
			on:mouseout={() => (showAnnotations = false)}
		>
			<div class="flex items-center group">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="rgba(var(--color-primary-700) / 1)"
					><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" /></svg
				>
				{#if showAnnotations}
                    <span transition:fade={{ delay: 200, duration: 200 }} class="ml-2">Annotations</span>
				{/if}
			</div>
		</button>
	</div>
{/if}
