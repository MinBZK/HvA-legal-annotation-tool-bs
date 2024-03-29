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
	import { fade, slide } from 'svelte/transition';
	import {
		Drawer,
		Modal,
		Toast,
		getDrawerStore,
		getModalStore,
		initializeStores,
		type ModalSettings,

		localStorageStore

	} from '@skeletonlabs/skeleton';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { documentStore } from '../stores/DocumentStore';
	import LegalDocument from '../models/LegalDocument';
	import AuditLog from '../components/AuditLog.svelte';
	import LabelList from '../components/LabelList.svelte';
	import { annotationStore } from '../stores/AnnotationStore';
	import { selectedChaptersStore } from '../stores/SelectedChapterStore';

	let showAnnotations = false;
	let showFilter = false;

	initializeStores();
	const drawerStore = getDrawerStore();
	const modalStore = getModalStore();
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
			if (!value.filename) {
				fileContent = null;
			} else {
				const file = $documentStore;
				const newFile = new LegalDocument(
					file.title,
					file.filename,
					file.chapterTitles,
					file.chapterContents,
					file.annotations,
					file.history
				);
				fileContent = newFile;
				fileContent = $documentStore;
			}
		});
	});

	// handleNewFile resets the document presistence to cleansheet
	function handleNewFile() {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Nieuwe bestand uploaden',
			body: 'Huidige bestand wordt niet opgeslagen, weet u zeker om een nieuw bestand te uploaden? ',
			buttonTextCancel: 'Annuleren',
			buttonTextConfirm: 'Bevestigen',
			response: (r: boolean) => {
				if (r) {
					localStorage.clear();
					$documentStore.title = '';
					$documentStore.filename = '';
					$documentStore.chapterTitles = [];
					$documentStore.chapterContents = [];
					$documentStore.annotations = [];
					$documentStore.history = [];
					selectedChaptersStore.set([]);
					annotationStore.set([]);
					fileContent = null;
					localStorage.clear();
					location.reload();

				}
			}
		};
		modalStore.trigger(modal);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
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
		<Modal regionBody="overflow-auto" />
		<Toast />
		<Drawer>
			{#if $drawerStore.id === 'relationships'}
				<LabelRelations />
			{/if}
			{#if $drawerStore.id === 'labelsModify'}
				<LabelList />
			{/if}
			{#if $drawerStore.id === 'filterFile'}
				<FilterFile />
			{/if}
		</Drawer>
		<div
			role="button"
			tabindex="0"
			class="text-white font-bold py-2 px-4 mt-2 mr-2 fixed left-0 top-1/2 -translate-y-1/2 bg-transparent border-0"
			on:click={() => {
				drawerStore.open({
					id: 'filterFile',
					position: 'left',
					bgDrawer: 'bg-surface-600 text-white',
					width: 'w-[30%]',
					padding: 'p-4'
				});
			}}
			on:mouseover={() => (showFilter = true)}
			on:mouseout={() => (showFilter = false)}
		>
			<div class="flex items-center group">
				{#if showFilter}
					<span transition:fade={{ delay: 200, duration: 200 }} class="ml-2 text-primary-600"
						>Hoofdstukken</span
					>
				{/if}
				<svg
					transition:slide={{ delay: 200, duration: 200 }}
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="rgba(var(--color-primary-700) / 1)"
					><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" /></svg
				>
			</div>
		</div>
		<div class="flex justify-center items-center h-screen">
			<div class="w-1/2 overflow-auto h-[100vh] flex justify-center">
				<div class="h-1/3">
					<AnnotationView />
				</div>
				<div class="ml-10 absolute bottom-0 right-0 m-10">
					<button
						title="Nieuw Bestand"
						class="btn btn-lg variant-filled-success rounded-md"
						on:click={() => handleNewFile()}
					>
						<Fa class="text-surface-900" size="1.5x" icon={faPlus} />
					</button>
					<AuditLog />
					<AnnotationExport />
				</div>
			</div>
		</div>
		<div class="max-w-48">
			<LabelInputChips />
		</div>
		<button
			tabindex="0"
			class="text-white font-bold py-2 px-4 mt-2 mr-2 fixed right-0 top-1/2 -translate-y-1/2 bg-transparent border-0"
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
			on:focus={() => (showAnnotations = true)}
			on:mouseout={() => (showAnnotations = false)}
			on:blur={() => (showAnnotations = false)}
		>
			<div class="flex items-center group">
				<svg
					transition:slide={{ delay: 200, duration: 200 }}
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="rgba(var(--color-primary-700) / 1)"
					><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" /></svg
				>
				{#if showAnnotations}
					<span transition:fade={{ delay: 200, duration: 200 }} class="ml-2 text-primary-600"
						>Annotaties</span
					>
				{/if}
			</div>
		</button>
	</div>
{/if}
