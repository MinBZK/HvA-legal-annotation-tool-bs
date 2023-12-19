<script lang="ts">
	import AnnotationView from '../components/AnnotationView.svelte';
	import AnnotationResults from '../components/AnnotationResults.svelte';
	import AnnotationExport from '../components/AnnotationExport.svelte';
	import ImportXml from '../components/ImportXML.svelte';
    import FilterFile from "../components/FilterFile.svelte";
	import LabelInputChips from "../components/LabelInputChips.svelte";
	import LabelRelations from "../components/LabelRelations.svelte";

    import { Drawer, getDrawerStore, initializeStores } from "@skeletonlabs/skeleton";
	import Annotation from "../models/Annotation";
	import { labelStore } from "../stores/LabelStore";
	import Label from "../models/Label";

    initializeStores();
    const drawerStore = getDrawerStore();

	let fileContent = '';

    let relationTypes;
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
        <Drawer>
            {#if $drawerStore.id === 'relationships'}
                <LabelRelations />
            {/if}
        </Drawer>
		<div
			class="w-1/2 border dark:border-gray-200 border-gray-950 m-5 p-5 rounded-lg h-[90vh] overflow-auto"
		>
			<FilterFile />
		</div>
		<div
			class="w-1/2 border dark:border-gray-200 border-gray-950 m-5 p-5 rounded-lg h-[90vh] overflow-auto"
		>
			<AnnotationView />
			<AnnotationExport />
		</div>
		<div class="max-w-48">
        <LabelInputChips />
    	</div>
        <div>
            <button class="mt-5 variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 mt-2 mr-2 rounded-full"
                    on:click={() => drawerStore.open({
                        id: "relationships",
                        position: 'right',
                        bgDrawer: 'bg-indigo-900 text-white',
                        width: 'w-[50%]',
                        padding: 'p-4',
                        rounded: 'rounded-xl',
                    })}>
                Modify relationships
            </button>
        </div>
	</div>
{/if}

<AnnotationResults />
