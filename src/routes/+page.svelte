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
	import { Drawer, Modal, Toast, getDrawerStore, getModalStore, initializeStores, type ModalSettings } from '@skeletonlabs/skeleton';
	import { faPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { documentStore } from '../stores/DocumentStore';
	import type LegalDocument from '../models/LegalDocument';
	import AuditLog from '../components/AuditLog.svelte';
	import LabelList from '../components/LabelList.svelte';

	let showAnnotations = false;
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
			console.log("subscribe docu Def "+localStorage.getItem('legal-document'))
			if ((value.title = '')) {
				fileContent = value;
				localStorage.setItem('legal-document', JSON.stringify(value));
				console.log("subscribe docu store if"+localStorage.getItem('legal-document'))
			}
		});
	});

	function handleNewFile(){
			const modal: ModalSettings = {
			type: 'confirm',
			title: 'Nieuwe bestand uploaden',
			body: 'ALERT: huidige bestand wordt niet opgeslagen, weet u zeker om een nieuw bestand te uploaden? ',
			buttonTextCancel: 'Annuleer',
			buttonTextConfirm: 'Bevestig'
			,
			response: (r:boolean) => {
				if(r){
					console.log("file upload")
					localStorage.clear();
					fileContent = null;
				}
			}
		};
		modalStore.trigger(modal);
		
		
	}

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
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
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
			{#if $drawerStore.id === 'filterFile'}
				<FilterFile />
			{/if}
		</Drawer>
		<div
			class="text-white font-bold py-2 px-4 mt-2 mr-2 fixed left-0 top-1/2 -translate-y-1/2 bg-transparent border-0"
			on:mousemove={() => {
				drawerStore.open({
					id: 'filterFile',
					position: 'left',
					bgDrawer: 'bg-surface-600 text-white',
					width: 'w-[30%]',
					padding: 'p-4'
				});
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				fill="rgba(var(--color-primary-700) / 1)"
				><path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" /></svg
			>
		</div>
		<div class="flex justify-center items-center h-screen">
			<div class="w-1/2 overflow-auto h-[100vh]">
				<div class="h-1/3">
					<AnnotationView />
				</div>
				<div class="ml-10 absolute bottom-0 right-0 m-10">
					<button 
					title="New File" 
					class="btn btn-lg variant-filled-success rounded-md"
					on:click={()=> handleNewFile()}
					>
						<Fa size="1.5x" icon={faPlus} />
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
					<span transition:fade={{ delay: 200, duration: 200 }} class="ml-2 text-primary-600"
						>Annotations</span
					>
				{/if}
			</div>
		</button>
	</div>
{/if}
