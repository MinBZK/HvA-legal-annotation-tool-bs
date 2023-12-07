<script lang="ts">
	import { onMount } from "svelte";
    import RelationForm from "./RelationForm.svelte";
    import { Relation } from "./models/Relation";
    import { loadAllRelations as load, loadLabels, loadRelationsForLabel } from "./server";
	import { Label } from "./models/Label";
	import AnnotationResults from "./AnnotationResults.svelte";
	import AnnotationView from "./AnnotationView.svelte";

    let selectedLabel: Label;

    export let relationArray: Relation[] = []; 
    // export let newRelation = new Relation(
    //     99, 
    //     new Label(1, "abc", "abc", null as any, "abc"),
    //     new Label(2, "abc", "abc", null as any, "abc"),
    //     "abc"
    // );
    
    let show = false;

    export function addRelation(relation: Relation) {
        relationArray = [...relationArray, relation];
        show = false;
    }

    onMount(() => {
        relationArray = load();
    });
</script>

<div>
    {#each loadLabels() as Label}
        <!-- Generate a button with tailwind styling for every label to click, and if it's clicked set it as the selected Label -->
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => {
            selectedLabel = Label;
        }}>
            {Label.name}
        </button>
    {/each}

    {#if selectedLabel}
        <h2 class="font-bold">{selectedLabel.name}</h2>
        {#each loadRelationsForLabel(selectedLabel) as Relation}
            <div class="flex gap-3 mt-5">
                <h3 class="align-middle">{Relation.label1.name}</h3>
                <p class="align-middle">{Relation.description}</p>
                <h3 class="align-middle">{Relation.label2.name}</h3>
                <button>Edit</button>
                <button>Delete</button>
            </div>
        {/each}
    {/if}
</div>