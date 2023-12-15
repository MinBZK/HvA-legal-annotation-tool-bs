<script lang="ts">
	import { onMount } from 'svelte';
	import { labelStore, selectedColor, chipSelected, textSelection } from '../stores/LabelStore';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import Label from '../models/Label';

	let inputColor = '';
	let labelName = '';
	let labelID = 0;

	let inputChip = '';
	let inputChipList: string[] = [];

	type PreMadeLabels = AutocompleteOption<string>;

	// Necessary premade labels
	let preMadeLabels: PreMadeLabels[] = [
		{ label: 'Rechtssubject', value: 'Rechtssubject', meta: '0' },
		{ label: 'Rechtsbetrekking', value: 'Rechtsbetrekking', meta: '1' },
		{ label: 'Rechtsobject', value: 'Rechtsobject', meta: '2' },
		{ label: 'Rechtsfeit', value: 'Rechtsfeit', meta: '3' },
		{ label: 'Voorwaarde', value: 'Voorwaarde', meta: '4' },
		{ label: 'Afleidingsregel', value: 'Afleidingsregel', meta: '5' },
		{ label: 'Variabele', value: 'Variabele', meta: '6' },
		{ label: 'Variabelewaarde', value: 'Variabelewaarde', meta: '7' },
		{ label: 'Parameter', value: 'Parameter', meta: '8' },
		{ label: 'Parameterwaarde', value: 'Parameterwaarde', meta: '9' },
		{ label: 'Operator', value: 'Operator', meta: '10' },
		{ label: 'Tijdsaanduiding', value: 'Tijdsaanduiding', meta: '11' },
		{ label: 'Plaatsaanduiding', value: 'Plaatsaanduiding', meta: '12' },
		{ label: 'Delegatiebevoegdheid', value: 'Delegatiebevoegdheid', meta: '13' },
		{ label: 'Delegatie-invulling', value: 'Delegatie', meta: '14' },
		{ label: 'Brondefinitie', value: 'Brondefinitie', meta: '15' }
	];

	// Look up color-code accorrding to value
	const colorLookup = {
		Rechtssubject: '#c2e7ff',
		Rechtsbetrekking: '#70a4ff',
		Rechtsobject: '#98bee1',
		Rechtsfeit: '#97d6fe',
		Voorwaarde: '#91e8d3',
		Afleidingsregel: '#ff7a7a',
		Variabele: '#ffd95d',
		Variabelewaarde: '#fff380',
		Parameter: '#ffb4b4',
		Parameterwaarde: '#ffd8ef',
		Operator: '#c1ebe1',
		Tijdsaanduiding: '#d8b0f9',
		Plaatsaanduiding: '#efcaf6',
		Delegatiebevoegdheid: '#cecece',
		'Delegatie-invulling': '#e2e2e2',
		Brondefinitie: '#f6f6f6'
	};

	onMount(() => {
		preMadeLabels.forEach((preMadeLabel) => {
			labelStore.update((store) => {
				store.push(
					new Label(preMadeLabel.label, colorLookup[preMadeLabel.label], Number(preMadeLabel.meta))
				);
				return store;
			});
		});

		labelStore.subscribe((labels) => {
			labels.forEach((label) => {
				inputColor = label.color;
				labelID = label.labelId;
				labelName = label.name;
			});
		});

		textSelection.subscribe((selection) => {
			let selectedText = selection.text;
			if (!selectedText || selectedText === '') {
				inputChipList = [];
			}
		});
	});

	function onInputChipSelect(event: CustomEvent<PreMadeLabels>): void {
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';

			inputColor = colorLookup[event.detail.value];
			selectedColor.update((store) => {
				return { ...store, color: inputColor };
			});

			chipSelected.set(true);
		} else {
			// Remove the chip from the list
			inputChipList = inputChipList.filter((chip) => chip !== event.detail.value);

			// If no chip is selected, set chipSelected to false
			if (inputChipList.length === 0) {
				chipSelected.set(false);
			}
		}
	}

	function createComment() {}
</script>

<div class="input-chips max-w-sm mt-5 bg-primary-900">
	<div class="m-3">
		<input
			type="text"
			placeholder="Add Comment"
			class="border p-2 mr-2 placeholder-white bg-primary-700"
		/>
		<button on:click={createComment} class="bg-primary-700 text-white px-4 py-2 rounded-md"
			>Comment</button
		>
	</div>
	<InputChip bind:input={inputChip} bind:value={inputChipList} name="chips" allowUpperCase />
	<div class="card max-h-48 p-4 overflow-y-auto" tabindex="-1">
		<Autocomplete
			bind:input={inputChip}
			options={preMadeLabels}
			denylist={inputChipList}
			on:selection={onInputChipSelect}
		/>
	</div>
</div>
