<script lang="ts">
	import type Annotation from "../models/Annotation";
	import { annotationsStore, labelStore, relationsTypesStore } from "../stores/relationStore";

    export let selectedAnnotation: Annotation;

    let labels;
    let relationTypes;
    let annotations;

    // annotationsStore.subscribe(e => annotations = e);
    labelStore.subscribe(e => labels = e);
    relationsTypesStore.subscribe(e => relationTypes = e);
    annotationsStore.subscribe(e => annotations = e);

    // Get all relations for the selected annotation
    let relations = annotations.filter(annotation => annotation.id === selectedAnnotation.id)[0].relationships;
    console.log(relations);
</script>

<div class="m-5">
    <div class="gap-3 mt-5">
        <h3 class="align-middle">{selectedAnnotation.text}</h3>
        <p class="align-middle">{selectedAnnotation.label}</p>
        {#each relations as relationship}
            <div class="flex gap-3 mt-5">
                <h3 class="align-middle">{annotations.find(a => a.id === relationship.source).text}</h3>
                <p class="align-middle">{relationship.type}</p>
                <h3 class="align-middle">{annotations.find(a => a.id === relationship.target).text}</h3>
            </div>
        {/each}
    </div>
</div>























<!-- <script lang="ts">
    import RelationForm from "./RelationForm.svelte";
    import type Relation from "../models/Relation";
	import type Label from "../models/Label";
    import { labelStore, relationsStore, relationsTextStore } from "../stores/relationStore";
	import { onMount } from "svelte";
	import AddLabel from "./addLabel.svelte";

    let selectedLabel: Label;
    let show = false;

    let relationsArray;
    let relationsTextArray;
    let labelsArray;

    relationsStore.subscribe(e => relationsArray = e);
    labelStore.subscribe(e => labelsArray = e);
    relationsTextStore.subscribe(e => relationsTextArray = e);

    function removeRelation(relation: Relation) {
        let updatedRelations = relationsArray.filter(r => r.relationId !== relation.relationId);
        relationsStore.update(() => updatedRelations);
    }

    onMount(() => localStorage.removeItem('relations'));
</script>

<div>
    {#each labelsArray as Label}
        <button class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 mt-2 mr-2 rounded-full" on:click={() => {
            selectedLabel = Label;
        }}>
            {Label.name}
        </button>
    {/each}

    {#if selectedLabel}
        <div class="mt-5">
            <h2 class="font-bold">{selectedLabel.name}</h2>
            {#each relationsArray.filter(relation => relation.label1.labelId === selectedLabel.labelId || relation.label2.labelId === selectedLabel.labelId) as Relation}
                <div class="flex gap-3 mt-5">
                    <h3 class="align-middle">{Relation.label1.name}</h3>
                    <p class="align-middle">{Relation.description}</p>
                    <h3 class="align-middle">{Relation.label2.name}</h3>
                    {#if !Relation.mandatory}
                        <button on:click={() => removeRelation(Relation)} 
                                class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
                            Delete
                        </button>
                    {/if}
                </div>
            {/each}
            <RelationForm 
                show={show} 
                forLabel={selectedLabel}
            />
        </div>
    {/if}
    <div class="mt-5">
        <AddLabel />
    </div>
</div> -->