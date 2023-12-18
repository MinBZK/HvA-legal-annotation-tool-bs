<script lang="ts">
	import { annotationStore } from "../stores/AnnotationStore";
    import { relationTypes } from "../stores/relationStore";

    export let setShowForm: Function;
    export let selectedAnnotationId: number;
    let annotations;
    let selectedAnnotation;

    annotationStore.subscribe(e => {
        annotations = e;
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });
</script>

<div>
    <button type="button" class="btn variant-filled float-right mb-5" on:click={() => setShowForm(false)}>Return</button>
    <h1 class="h5 font-bold mb-5">Add relationship for de annotatie: "{selectedAnnotation.text}"</h1>

    <label for="relationTypesSelect" class="label mb-1">Select a relation type</label>
    <select id="relationTypesSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
        {#each relationTypes as val}
            <option value={val}>{val}</option>
        {/each}
    </select>

    <label for="annotationsSelect" class="label mb-1">Select other annotation</label>
    <select id="annotationsSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
        {#each annotations as annotation}
            <option value={annotation.id}>{annotation.text}</option>
        {/each}
    </select>

    <button on:click={() => null} 
            class="block variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 mt-2 rounded-full">
        Submit
    </button>
    
</div>


<div class="pt-5">
    
</div>