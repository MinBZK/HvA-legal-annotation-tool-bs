<script>
    import labelStore from "./LabelStore.svelte";

    let showCreateLabelInput = false;
    let customLabels = [];
    let customLabel = '';
    let customColor = '';
    let selectedColor = '';
    let selectedLabel = '';

    const preMadeLabels = [
        { label: 'Label 1  ', color: 'blue' },
        { label: 'Label 2  ', color: 'green' },
        { label: 'Label 3  ', color: 'red' },
        // Add more pre-made labels with colors as needed
    ];

    function selectLabel(label, color) {
        labelStore.update(store => {
            return { ...store, selectedColor: color, labelID: label};
        })
    }

    function createNewLabel() {
        customLabel = customLabel.trim(); // Remove leading/trailing whitespace
        if (customLabel !== '' && customColor !== '') {
            customLabels = [...customLabels, { label: customLabel, color: customColor }];
            customLabel = '';
        }
    }


</script>

<main>
    <div class="annotation-results h-[80vh] w-[750px] relative mt-5 mb-10">
        <h1>Label Selection</h1>
        <h4>Select Label:</h4>
        <div>
            {#each preMadeLabels as preMadeLabel}
                <span style="color: {preMadeLabel.color}" on:click={() => selectLabel(preMadeLabel.label, preMadeLabel.color)}>{preMadeLabel.label}</span>
            {/each}
            <span on:click={() => { showCreateLabelInput = true; }}>Create New Label</span>
        </div>
        {#each customLabels as labelObj}
            <div style="color: {labelObj.color}" >{labelObj.label}</div>
        {/each}
        {#if showCreateLabelInput}
            <input type="text" bind:value={customLabel} placeholder="Enter custom label">
            <input type="color" bind:value={customColor}>
            <button on:click={createNewLabel}>Create</button>
        {/if}
    </div>
</main>

<style>
    .annotation-results {
        font-family: 'Inter', sans-serif;
        white-space: pre-line;
        overflow-x: auto;
        padding: 1em;
        border-radius: 8px;
        list-style-type: none;
    }
</style>
