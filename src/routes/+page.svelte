<script>
	import UploadFile from '../components/UploadFile.svelte';
	import AnnotationView from '../components/AnnotationView.svelte';
	import FilterFile from '../components/FilterFile.svelte';
	import AnnotationResults from '../components/AnnotationResults.svelte';
	import AnnotationExport from '../components/AnnotationExport.svelte';
	import ImportXml from '../components/ImportXML.svelte';

	let fileContent = '';
</script>

{#if !fileContent}
	<div class="flex flex-col">
		<div class="self-center">
			<ImportXml
				on:fileUploaded={(e) => {
					fileContent = e.detail;
					console.log(fileContent);
				}}
			/>
		</div>
	</div>
{:else}
	<div class="flex flex-row">
		<div
			class="w-1/2 border dark:border-gray-200 border-gray-950 m-5 p-5 rounded-lg h-[90vh] overflow-auto"
		>
			<AnnotationView />
			<AnnotationExport />
		</div>
		<div
			class="w-1/2 border dark:border-gray-200 border-gray-950 m-5 p-5 rounded-lg h-[90vh] overflow-auto"
		></div>
	</div>
{/if}

<AnnotationResults />
