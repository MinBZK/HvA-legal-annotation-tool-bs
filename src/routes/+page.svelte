<script lang="ts">
    import UploadFile from "../components/UploadFile.svelte";
    import AnnotationView from "../components/AnnotationView.svelte";
    import FilterFile from "../components/FilterFile.svelte";
    import AnnotationResults from "../components/AnnotationResults.svelte";
	import LabelRelations from "../components/LabelRelations.svelte";

    import { Drawer, getDrawerStore, initializeStores } from "@skeletonlabs/skeleton";
	import Annotation from "../models/Annotation";
	import { annotationsStore, relationsTypesStore } from "../stores/relationStore";
	import { labelStore } from "$lib/LabelStore";
	import Label from "../models/Label";

    initializeStores();
    const drawerStore = getDrawerStore();

    let fileContent = "";

    let relationTypes;
    let annotations;

    relationsTypesStore.subscribe(e => relationTypes = e);
    annotationsStore.subscribe(e => annotations = e);

    const selectedAnnotation = annotations[0];
</script>

<div class="mx-10 mt-10 flex gap-10">
    <Drawer>
        {#if $drawerStore.id === 'relationships'}
            <LabelRelations selectedAnnotation={selectedAnnotation}/>
        {/if}
    </Drawer>
    <div class="flex flex-col gap-10 border border-gray-200 rounded-lg p-4">
        <UploadFile on:fileUploaded={e => fileContent = e.detail} />
        <FilterFile />
    </div>
    <div>
        <AnnotationView fileContent={fileContent} />
    </div>
    <AnnotationResults />
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
