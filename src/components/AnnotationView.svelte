<script lang="ts">
	import { onMount } from 'svelte';
	import { labelStore } from '../lib/LabelStore.ts';
	import type { PopupSettings, AutocompleteOption } from '@skeletonlabs/skeleton';
	import { Autocomplete, InputChip } from '@skeletonlabs/skeleton';
	import Page from '../routes/+page.svelte';

	export let fileContent = '';
	let formattedContent = '';
	let selectedColor = '';
	let labelID = '';
	let visible = false;

	const popupFocusClick: PopupSettings = {
		event: 'focus-click',
		target: 'popupFocusClick',
		placement: 'bottom'
	};

	let inputChip = '';
	let inputChipList: string[] = [];

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
		let contentToDisplay = fileContent;

		// If no file content is passed, check if there is a file in local storage
		if (!contentToDisplay) {
			const storedContent = localStorage.getItem('uploadedXML');
			if (storedContent) {
				contentToDisplay = storedContent;
			}
		}
		// If there is content to display, format it
		if (contentToDisplay) {
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(contentToDisplay, 'text/xml');
			convertXMLTagsToDiv(xmlDoc);
			formattedContent = new XMLSerializer().serializeToString(xmlDoc);
		}

		labelStore.subscribe((value) => {
			selectedColor = value.selectedColor;
			labelID = value.labelID;
		});
	});

	// Convert XML tags to divs
	function convertXMLTagsToDiv(xmlDoc: Document) {
		xmlDoc.querySelectorAll('kop').forEach((el: any) => {
			const div = document.createElement('div');
			div.className = 'kop flex gap-2 text-lg font-bold';
			div.innerHTML = el.innerHTML;
			el?.parentNode.replaceChild(div, el);
		});
		xmlDoc.querySelectorAll('meta-data').forEach((el: any) => {
			const div = document.createElement('div');
			div.className = 'meta-data opacity-0';
			div.innerHTML = el.innerHTML;
			el?.parentNode.replaceChild(div, el);
		});
		// Remove all tags that should not be displayed
		//TODO: find a way to keep the content of these tags for exporting
		xmlDoc
			.querySelectorAll('intitule,aanhef,bwb-inputbestand,redactionele-correcties,citeertitel')
			.forEach((el: Element) => {
				el.remove();
			});
	}

	// Add event listener to detect user selection
	function handleSelection() {
		const selection = window.getSelection();
		if (selection && selection.toString().length > 0) {
			const selectedText = selection.toString();
			console.log(selectedText);

			// Calculate position of the selected text
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			const selectedTextTop = rect.top + window.scrollY;
			const selectedTextLeft = rect.left + window.scrollX;

			// Set the position of the input-chips div
			const inputChipsDiv = document.querySelector('.input-chips') as HTMLElement;
			if (inputChipsDiv) {
				inputChipsDiv.style.position = 'absolute';
				inputChipsDiv.style.top = selectedTextTop + 'px';
				inputChipsDiv.style.left = selectedTextLeft + 'px';
			}
		}
	}

	function onInputChipSelect(event: CustomEvent<PreMadeLabels>): void {
		console.log('onInputChipSelect', event.detail);
		if (inputChipList.includes(event.detail.value) === false) {
			inputChipList = [...inputChipList, event.detail.value];
			inputChip = '';

			let inputColor: string = '';
			inputColor = colorLookup[event.detail.value];

			labelStore.update((store) => {
				return { ...store, selectedColor: inputColor, labelID: event.detail.value };
			});

			const selection = window.getSelection();
			if(selection) {
				const selectedText = selection.toString();
				// Apply background color to the selected text
				const span = document.createElement('span');
				span.style.backgroundColor = selectedColor; // Apply the selected color
				span.appendChild(document.createTextNode(selectedText));
				selection?.getRangeAt(0).surroundContents(span);		
			}

		}
	}

	function startAnnotate(){
		visible = true;
		labelStore.update((store) => {
			return { ...store, selectedColor: "#c2e7ff"}
		})
	}

	function clearSelection() {
		visible = false;
	}
</script>

<svelte:body on:dblclick={clearSelection} on:mouseup={handleSelection} />
<div class="py-2"><button class="variant-glass-primary hover:variant-glass-secondary text-white font-bold py-2 px-4 rounded-full " on:click={startAnnotate}>Annotate</button></div>

<div class="border border-gray-200 p-4 rounded-lg">
	<h2 class="text-xl font-bold mb-5">Annoteer:</h2>
	<hr />
	{#if formattedContent}
		<div
			class="annotation-view h-[80vh] w-[750px] relative mt-5 mb-10"
			bind:innerHTML={formattedContent}
			contenteditable="false"
		></div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}

	{#if visible}
		<div class="input-chips max-w-24 mt-5 bg-white">
			<InputChip bind:input={inputChip} bind:value={inputChipList} name="chips" />
			<div class="card w-full max-w-48 max-h-48 p-4 overflow-y-auto" tabindex="-1">
				<Autocomplete
					bind:input={inputChip}
					options={preMadeLabels}
					denylist={inputChipList}
					on:selection={onInputChipSelect}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.annotation-view {
		font-family: 'Inter', sans-serif;
		white-space: pre-line;
		overflow-x: auto;
		padding: 1em;
		border-radius: 8px;
		list-style-type: none;
	}
</style>
