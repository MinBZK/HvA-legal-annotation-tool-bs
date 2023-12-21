<script lang="ts">
	import { onMount } from 'svelte';
	import objStore from '../stores/ObjStore.ts';
	import {
		selectedColor,
		chipSelected,
		textSelection,
		selectedLabels
	} from '../stores/LabelStore.ts';
	import Annotation from '../models/Annotation.ts';
	import type Label from '../models/Label.ts';
	import LegalDoc from '../models/LegalDoc.ts';
	import Comment from '../models/Comment.ts';
	import Definition from '../models/Definition.ts';
	import { addAnnotation } from '../stores/AnnotationStore.ts';

	export let fileContent: {} = '';
	let selectedText: Selection | null;
	let inputColor = '';
	let selectChip = false;
	let selectedAnnotation: Annotation | null = null;
	let labelList: Label[] = [];
	let previousSelection: string | null = null;

	onMount(() => {
		selectionLogic(null);
		objStore.subscribe((value) => {
			fileContent = value;
		});

		selectedColor.subscribe((value) => {
			inputColor = value.color;
		});

		chipSelected.subscribe((value) => {
			if (value) {
				changeTextBackground();
				chipSelected.set(false);
			}
		});

		selectedLabels.subscribe((value) => {
			labelList = value;
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

			previousSelection = selectedText;
		} else {
			inputChipsDiv.style.display = 'none';

			if (previousSelection) {
				selectedAnnotation = new Annotation(
					Math.floor(Math.random() * 1000) + 1,
					new LegalDoc(0, 'null', 'null', []),
					previousSelection.toString(),
					labelList,
					new Comment(0, 'null'),
					new Definition(0, 'null'),
					[]
				);
				addAnnotation(selectedAnnotation);
			}
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
			const selectedText = selection.toString();

			const span = document.createElement('span');
			span.style.color = inputColor;
			span.appendChild(document.createTextNode(selectedText));
			selection?.getRangeAt(0).surroundContents(span);
		}
	}

	function splitIntoSentences(text) {
		return text.split('\n'); // Splitting by full stop and space, adjust as needed
	}

</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div class="p-4" role="main" on:mouseup={handleSelection}>
	{#if fileContent}
		<div class="text-md leading-loose list-none relative m-10">
			<h2 class="font-medium text-xl">
				{ fileContent.document[0].title }
			</h2>
			<br>
			{#each splitIntoSentences(fileContent.document[0].text) as sentence}
				<p>{sentence}.</p> <!-- Rendering each sentence with a full stop -->
				<br>
			{/each}
		</div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}
</div>
