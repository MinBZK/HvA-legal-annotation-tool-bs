<script lang="ts">
	import { onMount } from 'svelte';
	import  objStore from '../stores/ObjStore.ts';
	import { selectedColor, chipSelected, textSelection } from '../stores/LabelStore.ts';

	export let fileContent: {} = '';
	let selectedText: Selection | null;
	let inputColor = '';
	let selectChip = false;

	onMount(() => {
		selectionLogic(null);
		objStore.subscribe(value => {
			fileContent = value;
		});

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
	{#if fileContent}
		<div class="text-xl leading-loose list-none relative m-10 overflow-scroll">
			{ fileContent.document[0].title }
			{ fileContent.document[0].text }
		</div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}
</div>
