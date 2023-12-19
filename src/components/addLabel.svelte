<script lang="ts">
	import { labelStore } from "$lib/LabelStore";

    let labels;
    let showForm = false;
    
    labelStore.subscribe(e => labels = e);
</script>

<div>
    {#if showForm}
        <input placeholder="Label name" class="input my-4" />
        <button on:click={() => showForm = false}
            class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Submit
        </button>
        <button on:click={() => showForm = false}
            class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Cancel
        </button>
    {/if}
    {#if !showForm}
        <button on:click={() => showForm = true}
            class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full">
            Add Label
        </button>
    {/if}
</div>