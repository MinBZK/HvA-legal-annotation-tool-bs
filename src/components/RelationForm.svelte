<script lang="ts">
	import { Label, Relation } from "./classes";
    export let show = false;
    export let onSubmit: Function;
    export let newRelation = new Relation(
        99, 
        null as any, 
        null as any, 
        "abc"
    );

    function cancel() {
        show = false;
    }
</script>

<div class="pt-5">
    {#if show}
        <input bind:value={newRelation.label1.name} type="text" placeholder="Label 1" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <input bind:value={newRelation.description} type="text" placeholder="Description" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <input bind:value={newRelation.label2.name} type="text" placeholder="Label 2" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <button on:click={() => onSubmit()} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Submit
        </button>

        <button on:click={cancel} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Cancel
        </button>
    {:else}
        <button on:click={() => show = true} class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Add relation
        </button>
    {/if}
</div>