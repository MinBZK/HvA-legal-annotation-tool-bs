<script lang="ts">
	import { onMount } from "svelte";
	import Label from "../models/Label";
    import Relation from "../models/Relation";
    import { labelStore, relationsStore, relationsTextStore } from "../stores/relationStore";

    export let forLabel: Label;
    export let show = false;
    let relationsArray;
    let relationsTextArray;
    let labelsArray;
    
    relationsStore.subscribe(e => relationsArray = e);
    labelStore.subscribe(e => labelsArray = e);
    relationsTextStore.subscribe(e => relationsTextArray = e);

    export let newRelation = new Relation(
        relationsArray[relationsArray.length - 1].relationId + 1,
        forLabel,
        new Label(2, "abc", "abc", null as any),
        "abc"
    );

    function addRelation(relation: Relation) {
        relationsStore.update(arr => JSON.parse(JSON.stringify([...arr, relation])));
        show = false;
    }
</script>

<div class="pt-5">
    {#if show}
        <input hidden bind:value={forLabel} type="text" class="border border-gray-400 rounded-lg p-2 mb-2" />
        <h1>{forLabel.name}</h1>

        <select bind:value={newRelation.description} class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
            {#each relationsTextArray as desc}
                <option value={desc}>{desc}</option>
            {/each}
        </select>

        <select bind:value={newRelation.label2} class="border border-gray-400 rounded-lg p-2 mb-2 text-black">
            {#each labelsArray as lab}
                <option value={lab}>{lab.name}</option>
            {/each}
        </select>

        <button on:click={() => addRelation(newRelation)} 
                class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Submit
        </button>

        <button on:click={() => show = false}
                class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Cancel
        </button>
    {:else}
        <button on:click={() => show = true}
                class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Add relation
        </button>
    {/if}
</div>