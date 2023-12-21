<script>
	import AnnotationView from '../components/AnnotationView.svelte';
	import AnnotationResults from '../components/AnnotationResults.svelte';
	import AnnotationExport from '../components/AnnotationExport.svelte';
	import ImportXml from '../components/ImportXML.svelte';
    import FilterFile from "../components/FilterFile.svelte";
	import LabelInputChips from "../components/LabelInputChips.svelte";

	let fileContent = '';
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
	<div class="flex flex-row h-[100vh]">
		<div
			class="w-1/4 p-5 bg-gray-300 dark:bg-slate-900"
		>
			<FilterFile />
		</div>
		<div
			class="w-3/4 overflow-auto"
		>
			<AnnotationView />
			<AnnotationExport />
		</div>
		<div class="max-w-48">
        <LabelInputChips />
    	</div>
	</div>
{/if}

<AnnotationResults />
