<script>
	import { labelStore } from '../lib/LabelStore.ts';

	let showCreateLabelInput = false;
	let customLabels = [];
	let customLabel = '';
	let customColor = '';

	// Created with hexadecimal codes that represent the RGB of the labels
	const preMadeLabels = [
		{ label: 'Rechtssubject', color: '#c2e7ff' },
		{ label: 'Rechtsbetrekking', color: '#70a4ff' },
		{ label: 'Rechtsobject', color: '#98bee1' },
		{ label: 'Rechtsfeit', color: '#97d6fe' },
		{ label: 'Voorwaarde', color: '#91e8d3' },
		{ label: 'Afleidingsregel', color: '#ff7a7a' },
		{ label: 'Variabele', color: '#ffd95d' },
		{ label: 'Variabelewaarde', color: '#fff380' },
		{ label: 'Parameter', color: '#ffb4b4' },
		{ label: 'Parameterwaarde', color: '#ffd8ef' },
		{ label: 'Operator', color: '#c1ebe1' },
		{ label: 'Tijdsaanduiding', color: '#d8b0f9' },
		{ label: 'Plaatsaanduiding', color: '#efcaf6' },
		{ label: 'Delegatiebevoegdheid', color: '#cecece' },
		{ label: 'Delegatie-invulling', color: '#e2e2e2' },
		{ label: 'Brondefinitie', color: '#f6f6f6' }
	];

	function selectLabel(label, color) {
        console.log('Label: ' + label + ' Color: ' + color);
		labelStore.update((store) => {
			return { ...store, selectedColor: color, labelID: label };
		});
	}

	function createNewLabel() {
		customLabel = customLabel.trim(); // Remove leading/trailing whitespace
		if (customLabel !== '' && customColor !== '') {
			customLabels = [...customLabels, { label: customLabel, color: customColor }];
			console.log('Label: ' + customLabel + ' Color: ' + customColor);
			customLabel = '';
		}
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<main>
	<div class="annotation-results h-[80vh] w-[550px] relative mt-5 mb-10">
		<h1>Label Selection</h1>
		<h4>Select Label/Color:</h4>
		<div class="label-container">
			{#each preMadeLabels as preMadeLabel}
				<span
					class="label-item"
					style="background-color: {preMadeLabel.color}"
					on:click={() => selectLabel(preMadeLabel.label, preMadeLabel.color)}
					>{preMadeLabel.label}</span
				>
			{/each}
			<span
				class="create-label"
				on:click={() => {
					showCreateLabelInput = true;
				}}>Create New Label</span
			>
		</div>
		{#each customLabels as labelObj}
			<div
				class="custom-label-item"
				style="background-color: {labelObj.color}"
				on:click={() => selectLabel(labelObj.label, labelObj.color)}
			>
				{labelObj.label}
			</div>
		{/each}
		{#if showCreateLabelInput}
			<input type="text" bind:value={customLabel} placeholder="Enter custom label" />
			<input type="color" bind:value={customColor} />
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

	.label-container {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.label-item, .create-label, .custom-label-item {
		padding: 8px;
		cursor: pointer;
		border-radius: 4px;
		margin-bottom: 8px;
		display: inline-block;
	}
</style>