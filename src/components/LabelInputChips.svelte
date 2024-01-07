<script lang="ts">
	import { onMount } from 'svelte';
	import {
		labelStore,
		selectedColor,
		chipSelected,
		textSelection,
		selectedLabels,
		chipUnselected
	} from '../stores/LabelStore';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import Label from '../models/Label';

	import Comment from "../models/Comment";
	import {comment} from "../stores/CommentStore";
	import Definition from "../models/Definition";
	import {definition} from  "../stores/DefinitionStores";

	let labelList: Label[] = [];
	let labelNames: string[] = [];
	let inputColor = '';
	let inputChip = '';

	type completeOptions = AutocompleteOption<string>;
	let autoCompleteOptions: completeOptions[] = [];

	let additionalComment: string = "";
	let additionalDefinition: string = "";

	$: {
		autoCompleteOptions = $labelStore.map((label) => ({ label: label.name, value: label.name })).sort((a, b) => a.label.localeCompare(b.label));	
		labelNames = labelList.map((label) => label.name);
	}

	onMount(async () => {
		textSelection.subscribe((selection) => {
			let selectedText = selection.text;
			if (!selectedText || selectedText === '') {
				labelList = [];
			}
		});
	});

	// Function to handle chip selection logic
	function onInputChipSelect(event: CustomEvent<completeOptions>): void {
		let selectedLabelName = event.detail;
		let selectedLabel: Label = new Label(0, '', '');

		labelStore.subscribe((labels) => {
			selectedLabel = labels.find((label) => label.name === selectedLabelName.label) as Label;
		});

		// Add the selected label to labelList
		if (labelList.includes(selectedLabel) === false) {
			labelList = [...labelList, selectedLabel];
			inputChip = '';

			inputColor = selectedLabel.color;
			selectedColor.update((store) => {
				return { ...store, color: inputColor };
			});

			$labelStore = $labelStore.filter((label) => label.name !== selectedLabel.name);
		}

		// Update the selectedLabels store
		selectedLabels.update((labels) => {
			labels = labelList;
			return labels;
		});

		// Set chipSelected based on whether any chip is selected
		chipSelected.set(labelList.length > 0);
	}

	// Function to handle chip deselection logic
	function onInputChipDeselect({ detail }) {
		let deselectedLabel = labelList[detail.chipIndex];

		// Remove the deselected label from labelList
		labelList = labelList.filter((_, index) => index !== detail.chipIndex);
		selectedLabels.update((labelList) =>
			labelList.filter((_, index) => index !== detail.chipIndex)
		);

		// Add the deselected label back to labelStore
		$labelStore = [...$labelStore, deselectedLabel];

		chipUnselected.set(true);
	}

	function createAdditional() {

		// Generate new number for commentId
		let newId: number = Math.floor(Math.random()*1_000) +1

		// Initiate Comment
		const newComment: Comment = new Comment(
			newId,
			additionalComment
		);
		const newDefinition: Definition = new Definition(
			newId,
			additionalDefinition
		)
		// add/update Store array
		comment.set(newComment);
		definition.set(newDefinition);
		}
	
	function clearComInput(){
		additionalComment = "";
	}

	function clearDefInput(){
		additionalDefinition= ""
	}
</script>

<div class="input-chips max-w-sm mt-5 bg-secondary-900">
	<div class="m-3" on:change={createAdditional}>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mb-2">
			<input
			bind:value={additionalComment}
			type="text"
			placeholder="Enter your Comment..."
			class="input variant-form-material p-2  placeholder-white bg-surface-700"
		/>
		<button class="variant-form-secondary" on:click={clearComInput}>Clear</button>
		</div>

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mb-2">
		<input
			bind:value={additionalDefinition}
			type="text"
			placeholder="Enter your definition..."
			class="input variant-form-material p-2 placeholder-white bg-primary-700"
		/>
		<button class="variant-form-secondary" on:click={clearDefInput}>Clear</button>
		</div>
		
		
		
	</div>
	<InputChip
		bind:input={inputChip}
		bind:value={labelNames}
		name="chips"
		chips="variant-filled-secondary"
		allowUpperCase
		on:remove={onInputChipDeselect}
	/>
	<div class="card max-h-48 p-4 overflow-y-auto" tabindex="-1">
		<Autocomplete
			bind:input={inputChip}
			options={autoCompleteOptions}
			on:selection={onInputChipSelect}
		/>
	</div>
</div>
