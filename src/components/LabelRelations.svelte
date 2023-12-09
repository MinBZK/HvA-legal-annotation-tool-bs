<script lang="ts">
	import { onMount } from "svelte";
    import RelationForm from "./RelationForm.svelte";
    import type { Relation } from "./models/Relation";
    import { deleteRelation, loadRelations as load, loadLabels, saveRelation } from "./server";
	import type { Label } from "./models/Label";

    let selectedLabel: Label;
    let show = false;
    let relationArray: Relation[] = [];

    export function addRelation(relation: Relation) {
        saveRelation(relation);
        show = false;
        relationArray = load();
    }

    export function filterRelations(label: Label) {
        return relationArray.filter(relation => relation.label1.getLabelId() === label.getLabelId() || relation.label2.getLabelId() === label.getLabelId());
    }

    onMount(() => {
        relationArray = load();
    });
</script>

<div>
    {#each loadLabels() as Label}
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => {
            selectedLabel = Label;
        }}>
            {Label.name}
        </button>
    {/each}

    {#if selectedLabel}
        <h2 class="font-bold">{selectedLabel.name}</h2>
        {#each filterRelations(selectedLabel) as Relation}
            <div class="flex gap-3 mt-5">
                <h3 class="align-middle">{Relation.label1.name}</h3>
                <p class="align-middle">{Relation.description}</p>
                <h3 class="align-middle">{Relation.label2.name}</h3>
                <button>Edit</button>
                <button on:click={() => {
                    deleteRelation(Relation);
                    relationArray = load();
                }}>Delete</button>
            </div>
        {/each}
        <RelationForm show={show} onSubmit={addRelation} forLabel={selectedLabel} />
    {/if}
</div>