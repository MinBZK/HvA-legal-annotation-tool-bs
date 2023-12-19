<script lang="ts">
	import { onMount } from 'svelte';
	import {
		labelStore,
		selectedColor,
		chipSelected,
		textSelection,
		selectedLabels
	} from '../stores/LabelStore';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import Label from '../models/Label';
	import { annotationStore } from '../stores/AnnotationStore';

	let labelList: Label[] = [];
	let inputColor = '';
	let labelName = '';
	let labelID = 0;
	let inputChip = '';

	type completeOptions = AutocompleteOption<string>;
	let autoCompleteOptions: completeOptions[] = [];

	$: {
		autoCompleteOptions = $labelStore.map(label => ({ label: label.name, value: label.name }));
		console.log("labelstore: " + $labelStore)
		console.log("annotationstore: " + $annotationStore)
		console.log("options= " + autoCompleteOptions[0].label)
	}

	// Necessary premade labels
	let preMadeLabels: Label[] = [
		new Label('Rechtsbetrekking', '#70a4ff', 1),
		new Label('Rechtsobject', '#98bee1', 2),
		new Label('Rechtsfeit', '#97d6fe', 3),
		new Label('Voorwaarde', '#91e8d3', 4),
		new Label('Afleidingsregel', '#ff7a7a', 5),
		new Label('Variabele', '#ffd95d', 6),
		new Label('Variabelewaarde', '#fff380', 7),
		new Label('Parameter', '#ffb4b4', 8),
		new Label('Parameterwaarde', '#ffd8ef', 9),
		new Label('Operator', '#c1ebe1', 10),
		new Label('Tijdsaanduiding', '#d8b0f9', 11),
		new Label('Plaatsaanduiding', '#efcaf6', 12),
		new Label('Delegatiebevoegdheid', '#cecece', 13),
		new Label('Delegatie-invulling', '#e2e2e2', 14),
		new Label('Brondefinitie', '#f6f6f6', 15)
	];

	onMount(() => {
		preMadeLabels.forEach((preMadeLabel) => {
			labelStore.update((store) => {
				store.push(new Label(preMadeLabel.name, preMadeLabel.color, preMadeLabel.labelId));
				return store;
			});
		});

		labelStore.subscribe((labels) => {
			labelList = labels;

			labels.forEach((label) => {
				inputColor = label.color;
				labelID = label.labelId;
				labelName = label.name;
			});
		});

		textSelection.subscribe((selection) => {
			let selectedText = selection.text;
			if (!selectedText || selectedText === '') {
				labelList = [];
			}
		});

		selectedLabels.update((labels) => {
			labelList = labels;
			return labels;
		});
	});

	function onInputChipSelect(event: CustomEvent<completeOptions>): void {
		let selectedLabelName = event.detail;
		let selectedLabel: Label = new Label('', '', 0);

		labelStore.subscribe((labels) => {
			selectedLabel = labels.find((label) => label.name === selectedLabelName.label) as Label;
		});

		if (labelList.includes(selectedLabel) === false) {
			labelList = [...labelList, selectedLabel];
			inputChip = '';

			inputColor = selectedLabel.color;
			selectedColor.update((store) => {
				return { ...store, color: inputColor };
			});
		} else {
			// Remove the chip from the list
			labelList = labelList.filter((chip) => chip !== selectedLabel);
		}

		// Set chipSelected based on whether any chip is selected
		chipSelected.set(labelList.length > 0);
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
	<InputChip bind:input={inputChip} bind:value={labelList} name="chips" allowUpperCase />
	<div class="card max-h-48 p-4 overflow-y-auto" tabindex="-1">
		<Autocomplete
			bind:input={inputChip}
			options={autoCompleteOptions}
			denylist={autoCompleteOptions.map((option) => option.label)}
			on:selection={onInputChipSelect}
		/>
	</div>
</div>
