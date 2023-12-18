<script lang="ts">
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption } from '@skeletonlabs/skeleton';
	import { labelStore } from '../stores/LabelStore';

	let inputChip = '';
	let inputChipList: string[] = [];
	let openInput = false;

	type PreMadeLabels = AutocompleteOption<string, { colorCode: string }>;

	// Created with hexadecimal codes that represent the RGB of the labels
	let preMadeLabels: PreMadeLabels[] = [
		{ label: 'Rechtssubject', value: 'Rechtssubject', meta: { colorCode: '#c2e7ff' } },
		{ label: 'Rechtsbetrekking', value: 'Rechtsbetrekking', meta: { colorCode: '#70a4ff' } },
		{ label: 'Rechtsobject', value: 'Rechtsobject', meta: { colorCode: '#98bee1' } },
		{ label: 'Rechtsfeit', value: 'Rechtsfeit', meta: { colorCode: '#97d6fe' } },
		{ label: 'Voorwaarde', value: 'Voorwaarde', meta: { colorCode: '#91e8d3' } },
		{ label: 'Afleidingsregel', value: 'Afleidingsregel', meta: { colorCode: '#ff7a7a' } },
		{ label: 'Variabele', value: 'Variabele', meta: { colorCode: '#ffd95d' } },
		{ label: 'Variabelewaarde', value: 'Variabelewaarde', meta: { colorCode: '#fff380' } },
		{ label: 'Parameter', value: 'Parameter', meta: { colorCode: '#ffb4b4' } },
		{ label: 'Parameterwaarde', value: 'Parameterwaarde', meta: { colorCode: '#ffd8ef' } },
		{ label: 'Operator', value: 'Operator', meta: { colorCode: '#c1ebe1' } },
		{ label: 'Tijdsaanduiding', value: 'Tijdsaanduiding', meta: { colorCode: '#d8b0f9' } },
		{ label: 'Plaatsaanduiding', value: 'Plaatsaanduiding', meta: { colorCode: '#efcaf6' } },
		{ label: 'Delegatiebevoegdheid',value: 'Delegatiebevoegdheid',meta: { colorCode: '#cecece' }},
		{ label: 'Delegatie-invulling', value: 'Delegatie-invulling', meta: { colorCode: '#e2e2e2' } },
		{ label: 'Brondefinitie', value: 'Brondefinitie', meta: { colorCode: '#f6f6f6' } }
	];

	const colorLookup = {
  		'Rechtssubject': '#c2e7ff',
  		'Rechtsbetrekking': '#70a4ff',
  		'Rechtsobject': '#98bee1',
  		'Rechtsfeit': '#97d6fe',
 		'Voorwaarde': '#91e8d3',
  		'Afleidingsregel': '#ff7a7a',
 		'Variabele': '#ffd95d',
 		'Variabelewaarde': '#fff380',
 		'Parameter': '#ffb4b4',
  		'Parameterwaarde': '#ffd8ef',
 		'Operator': '#c1ebe1',
  		'Tijdsaanduiding': '#d8b0f9',
		'Plaatsaanduiding': '#efcaf6',
		'Delegatiebevoegdheid': '#cecece',
 		'Delegatie-invulling': '#e2e2e2',
 		'Brondefinitie': '#f6f6f6'
	};

	function onInputChipSelect(event: CustomEvent<PreMadeLabels>): void {
		console.log('onInputChipSelect', event.detail);
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';

			let inputColor: string = '';
			inputColor = colorLookup[event.detail.value];

			labelStore.update((store) => {
				return { ...store, selectedColor: inputColor, labelID: event.detail.value}
			})
		}
	}

</script>

<!-- <div class:translate-x-0={!openInput} class:translate-x-full={openInput}>
	<InputChip bind:input={inputChip} bind:value={inputChipList} name="chips" />
	<div class="card w-full max-w-sm max-h-48 p-4 " tabindex="-1">
		<Autocomplete
			bind:input={inputChip}
			options={preMadeLabels}
			denylist={inputChipList}
			on:selection={onInputChipSelect}
		/>
	</div>
</div> -->