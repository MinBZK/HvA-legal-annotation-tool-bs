<script lang="ts">
	import { annotationStore } from "../stores/AnnotationStore";
    import { relationTypes } from "../stores/relationStore";

    export let setShowForm: Function;
    export let selectedAnnotationId: number;
    let annotations;
    let selectedAnnotation;
    let relation = { type: "", source: selectedAnnotationId, target: 0};

    annotationStore.subscribe(e => {
        annotations = e;
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });

    // Create a function to add a relationship to the annotation
    function addRelationship() {
        if(relation.target === 0) {
            // Smerig, voor nu even een alert
            alert("Please select a target annotation");
            return;
        }

        console.log(relation);

        const sourceAnnotation = annotations.find(a => a.id === relation.source);
        const targetAnnotation = annotations.find(a => a.id === relation.target);

        if (sourceAnnotation && targetAnnotation) {
            sourceAnnotation.relationships = [...sourceAnnotation.relationships, relation];
            targetAnnotation.relationships = [...targetAnnotation.relationships, relation];
        }

        console.log(sourceAnnotation, targetAnnotation, annotations);
        
        annotationStore.set(annotations);

        console.log(sourceAnnotation, targetAnnotation, annotations);
        
        setShowForm(false);
    }
</script>

<div>
    <button type="button" class="btn variant-filled float-right mb-5" on:click={() => setShowForm(false)}>Return</button>
    <h1 class="h5 font-bold mb-5">Add relationship for de annotatie: "{selectedAnnotation.text}"</h1>

    <label for="relationTypesSelect" class="label mb-1">Select a relation type</label>
    <select bind:value={relation.type} id="relationTypesSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
        {#each relationTypes as val}
            <option value={val}>{val}</option>
        {/each}
    </select>

    <label for="annotationsSelect" class="label mb-1">Select other annotation</label>
    <select bind:value={relation.target} id="annotationsSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
        {#each annotations as annotation}
            <option value={annotation.id}>{annotation.text}</option>
        {/each}
    </select>

    <button on:click={() => addRelationship()} 
            class="block variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 mt-2 rounded-full">
        Submit
    </button>
</div>