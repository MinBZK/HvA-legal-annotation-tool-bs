<script lang="ts">
	import { getToastStore } from "@skeletonlabs/skeleton";
	import { annotationStore } from "../stores/AnnotationStore";

    // Initialize stores
    const toastStore = getToastStore();

    // Initialize variables imported from the parent component
    export let setShowForm: Function;
    export let selectedAnnotationId: number;

    // Initialize variables
    let annotations;
    let selectedAnnotation;
    let relation = { type: "", source: selectedAnnotationId, target: 0};
    let filteredTypes: string[] = [];

    $: if (relation.target) {
        filteredTypes = getFilteredTypes();
    }

    // Subscribe to annotation store and update annotations
    annotationStore.subscribe(e => {
        annotations = e;
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
        filteredTypes = getFilteredTypes();
    });

    /**
     * Function to handle the logic when a relation is added
     * @returns void
     */
    function addRelationship() {
        // Check if the relation is valid
        if(relation.target === 0 || relation.type === "") {
            toastStore.trigger({
                message: "Please select a relation type and annotation.",
                timeout: 3000,
            });

            return;
        }

        // Check if the relation already exists
        const sourceAnnotation = annotations.find(a => a.id === relation.source);
        const targetAnnotation = annotations.find(a => a.id === relation.target);

        if (relationExists(sourceAnnotation, targetAnnotation, relation.type)) {
            toastStore.trigger({
                message: "This relationship already exists.",
                timeout: 3000,
            });

            return;
        }

        // Add the relation to the source and target annotation
        if (sourceAnnotation && targetAnnotation) {
            sourceAnnotation.relationships = [...sourceAnnotation.relationships, relation];
            targetAnnotation.relationships = [...targetAnnotation.relationships, relation];
        }
        
        // Update the annotation store
        annotationStore.set(annotations);
        
        // Close the form
        setShowForm(false);
    }

    /**
     * Function to get the filtered relation types
     * @returns string[] - The filtered relation types
     */
    function getFilteredTypes() {
        let filteredTypes: string[] = [];

        // Define the possible relations
        const labelRelations = {
            'rechtsbetrekking': {
                'rechtssubject': ["wie heeft het recht", "wie heeft de plicht"],
                'rechtsobject': ["heeft als voorwerp"],
                'rechtsfeit': ["wordt gecreëerd door", "wordt gewijzigd door", "wordt beëindigd door"],
                'voorwaarde': ["is geldig indien voldaan aan"]
            },
            'rechtsfeit': {
                'rechtssubject': ["wordt uitgevoerd door"],
                'rechtsobject': ["heeft als voorwerp"],
                'voorwaarde': ["is geldig indien voldaan aan"],
                'plaatsaanduiding': ["vindt plaats in"],
                'tijdsaanduiding': ["vindt plaats op"]
            },
            'rechtssubject': {
                'rechtssubject': ["is specialisatie van"],
                'voorwaarde': ["is geldig indien voldaan aan"]
            },
            'rechtsobject': {
                'rechtsobject': ["is specialisatie van"],
                'voorwaarde': ["is geldig indien voldaan aan"]
            },
            'afleidingsregel': {
                'variabele': ["heeft als invoer", "heeft als uitvoer"],
                'operator': ["gebruikt"],
                'voorwaarde': ["is geldig indien voldaan aan"],
                'parameterwaarde': ["heeft als invoer"],
                'parameter': ["heeft als invoer"]
            }
        };

        // Get the labels of the source annotation
        const sourceAnnotationLabel = annotations.find(a => a.id === relation.source)?.label.map(l => l.name.toLowerCase());

        // Check if the source annotation has labels
        if (sourceAnnotationLabel && sourceAnnotationLabel.length > 0) {
            sourceAnnotationLabel.forEach(label => {
                const relations = labelRelations[label];

                if (relations) {
                    // Check if the target annotation has the label specified by 'key'
                    Object.entries(relations).forEach(([key, relationArray]) => {
                        const targetAnnotation = annotations.find(a => a.id === relation.target);

                        if (targetAnnotation && targetAnnotation.label.some(l => l.name.toLowerCase() === key)) {
                            // @ts-ignore
                            relationArray.forEach(relation => {
                                if (!filteredTypes.includes(relation)) {
                                    filteredTypes.push(relation);
                                }
                            });
                        }
                    });
                }
            });
        }

        return filteredTypes;
    }

    /**
     * Function to check if a relation already exists
     * @param sourceAnnotation - The source annotation
     * @param targetAnnotation - The target annotation
     * @param relationType - The relation type
     * @returns boolean - Whether the relation already exists
     */
    function relationExists(sourceAnnotation, targetAnnotation, relationType) {
        return sourceAnnotation.relationships.some(r => 
            r.target === targetAnnotation.id && r.type === relationType
        ) || targetAnnotation.relationships.some(r => 
            r.source === sourceAnnotation.id && r.type === relationType
        );
    }
</script>

<div>
    <button type="button" class="btn variant-filled float-right mb-5 hover:variant-filled-secondary text-white font-bold" on:click={() => setShowForm(false)}>Terugkeren</button>
    <h1 class="h5 font-bold mb-5">Relatie toevoegen voor de annotatie: "{selectedAnnotation.text}"</h1>

    <label for="annotationsSelect" class="label mb-1">Selecteer een andere annotatie</label>
    <select bind:value={relation.target} id="annotationsSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black select text-white">
        {#each annotations.filter(a => a.id !== selectedAnnotationId) as annotation}
            <option value={annotation.id} class="text-white">{annotation.text}</option>
        {/each}
    </select>

    {#if relation.target !== 0}
        {#if filteredTypes.length}
            <label for="relationTypesSelect" class="label mb-1">Selecteer een relatietype</label>
            <select bind:value={relation.type} id="relationTypesSelect" class="border border-gray-400 rounded-lg p-2 mb-2 text-black select text-white">
                {#each filteredTypes as val}
                    <option value={val} class="text-white">{val}</option>
                {/each}
            </select>
            <button on:click={() => addRelationship()} disabled={!relation.type} type="button"
                    class="btn block variant-filled hover:variant-filled-secondary text-white font-bold py-2 px-4 mt-2 rounded-full">
                Indienen
            </button>
            {:else}
            <p>Geen relatietypen beschikbaar</p>
        {/if}
    {/if}
</div>