<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedColor, chipSelected, textSelection } from '../stores/LabelStore.ts';

	export let fileContent = '';
	let formattedContent = '';
	let selectedText: Selection | null;
	let inputColor = '';
	let selectChip = false;

	onMount(() => {
		let contentToDisplay = fileContent;
		selectionLogic(null);

		
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
			formattedContent = formattedContent;
		}

		selectedColor.subscribe((value) => {
			inputColor = value.color;
		});

		chipSelected.subscribe((value) => {
			if (value) {
				changeTextBackground();
				chipSelected.set(false); // reset the trigger
			} 
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
	const handleSelection = (e) => (
		(selectedText = document.getSelection()), selectionLogic(selectedText), detectSelection()
	);

	function selectionLogic(selectionInput: Selection | null) {
		const selection = selectionInput;
		const inputChipsDiv = document.querySelector('.input-chips') as HTMLElement;

		if (selectChip) {
			changeTextBackground();
		}

		if (selection && selection.toString().length > 3) {
			inputChipsDiv.style.display = 'block';
			const selectedText = selection.toString();
			console.log(selectedText);

			// Calculate position of the selected text
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			const selectedTextTop = rect.top + window.scrollY;
			const selectedTextLeft = rect.left + window.scrollX;

			// Set the position of the input-chips div
			if (inputChipsDiv) {
				inputChipsDiv.style.position = 'absolute';
				inputChipsDiv.style.top = selectedTextTop + 'px';
				inputChipsDiv.style.left = selectedTextLeft + 'px';
			}
		} else {
			inputChipsDiv.style.display = 'none';
		}
	}

	function detectSelection() {
		const selection = document.getSelection();
		if (selection && selection.toString().length > 3) {
			textSelection.update((store) => {
				return { ...store, text: selection.toString() };
			});
		} else {
			textSelection.update((store) => {
				return { ...store, text: '' };
			});
		}
	}

	// Apply background color to the selected text
	function changeTextBackground() {
		const selection = document.getSelection();
		if (selection && selection.toString().length > 3) {
			console.log('color= ' + inputColor);
			const selectedText = selection.toString();

			const span = document.createElement('span');
			span.style.color = inputColor;
			span.appendChild(document.createTextNode(selectedText));
			selection?.getRangeAt(0).surroundContents(span);
		}
	}

</script>

<!-- svelte-ignore non-top-level-reactive-declaration -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="border border-gray-200 p-4 rounded-lg" role="main" on:mouseup={handleSelection}>
	<h2 class="text-xl font-bold mb-5">Annoteer:</h2>
	<hr />
	{#if formattedContent}
		<div
			class="text-xl leading-loose list-none relative m-10 overflow-scroll"
			bind:innerHTML={formattedContent}
			contenteditable="false"
		></div>
	{:else}
		<p>Upload een .xml bestand</p>
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
