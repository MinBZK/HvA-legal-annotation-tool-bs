<script lang="ts">
	import { onMount } from 'svelte';
	import objStore from '../stores/ObjStore.ts';
	import { selectedChaptersStore } from '../stores/SelectedChapterStore.ts';

	import {
		selectedColor,
		chipSelected,
		textSelection,
		selectedLabels,
		chipUnselected,
		labelStore
	} from '../stores/LabelStore.ts';
	import Annotation from '../models/Annotation.ts';
	import type Label from '../models/Label.ts';
	import LegalDoc from '../models/LegalDoc.ts';
	import Comment from '../models/Comment.ts';
	import Definition from '../models/Definition.ts';
	import { addAnnotation, annotationStore } from '../stores/AnnotationStore.ts';
	import {derived} from "svelte/store";

	export let fileContent: {} = '';
	let visibleContent = [];
	let selectedText: Selection | null;
	let previousSelection: string | null = null;
	let inputColor = '';
	let selectedAnnotation: Annotation | null = null;
	let labelList: Label[] = [];
	let lastSpanId: string | null = null;
	let prevSelectedLabels: Label[] = [];

	$: {
		// When a chip is selected, change the color of the selected text
		chipSelected.subscribe((value) => {
			if (value) {
				changeTextColor();
				chipSelected.set(false); // reset the trigger
			}
		});

		// When a chip is unselected, remove the color from the selected text
		chipUnselected.subscribe((value) => {
			if (value) {
				removeTextColor();
				chipUnselected.set(false); // reset the trigger
			}
		});

		selectedLabels.subscribe((value) => {
			if (value) {
				prevSelectedLabels = value;
			}
		});
	}

	onMount(() => {
		selectionLogic(null);
		objStore.subscribe((value) => {
			fileContent = value;
		});

		selectedColor.subscribe((value) => {
			inputColor = value.color;
		});

		selectedLabels.subscribe((value) => {
			labelList = value;
		});
	});

	// Add event listener to detect user selection
	const handleSelection = (e) => (
		(selectedText = document.getSelection()), selectionLogic(selectedText), detectSelection()
	);

	// Logic for handling user selection
	function selectionLogic(selectionInput: Selection | null) {
		const selection = selectionInput;
		const inputChipsDiv = document.querySelector('.input-chips') as HTMLElement;

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

			annotationStore.subscribe((annotations) => {
				// Check if the name of previousSelection is not already appointed to an annotation
				const isNameAlreadyAppointed = annotations.some(
					(annotation) => annotation.text === previousSelection?.toString()
				);

				if (!isNameAlreadyAppointed && previousSelection && labelList.length > 0) {
					selectedAnnotation = new Annotation(
						Math.floor(Math.random() * 1000) + 1,
						new LegalDoc(0, 'null', 'null', []),
						previousSelection.toString(),
						labelList,
						new Comment(0, 'placeholder comment'),
						new Definition(0, 'placeholder definition'),
						[]
					);
					addAnnotation(selectedAnnotation);
					console.log(selectedAnnotation);

					// Update the labelStore with the contents of previously selectedLabels
					labelStore.update((labels) => {
						return [...labels, ...prevSelectedLabels];
					});

					labelList = [];
				}
			});
		}
	}

	// Detect if user has selected text
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

	// Apply color to the selected text
	function changeTextColor() {
		const selection = document.getSelection();

		if (selection && selection.toString().length > 3) {
			const selectedText = selection.toString();

			const span = document.createElement('span');
			span.style.color = inputColor;
			span.appendChild(document.createTextNode(selectedText));
			span.id = 'selected-text-' + Date.now();
			selection?.getRangeAt(0).surroundContents(span);

			lastSpanId = span.id;
		}
	}

	// Remove color from the selected text
	function removeTextColor() {
		if (lastSpanId) {
			const span = document.getElementById(lastSpanId);
			if (span) {
				const textNode = document.createTextNode(span.textContent || '');
				span.parentNode?.replaceChild(textNode, span);
			}
			lastSpanId = null;
		}
	}

	$: $selectedChaptersStore;
	$: filteredContent = derived(
			[objStore, selectedChaptersStore],
			([$objStore, $selectedChaptersStore]) => {
				if ($selectedChaptersStore.size > 0) {
					return $objStore.document[0].chapters
							.filter((_, index) => $selectedChaptersStore.has(index.toString()))
							.map(chapter => chapter); // This only gets the chapter titles
				}
				return [];
			}
	);

	function splitIntoSentences(text) {
		const textWithBreaks = text.replace(/([;:])/g, "$1\n\n");
		return textWithBreaks.split('\n').filter(sentence => sentence.trim().length > 0);
	}

</script>

<div class="p-4" role="main">
	{#if fileContent}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="text-md leading-loose list-none relative m-10" on:mouseup={handleSelection}>
			<h2 class="font-medium text-xl mb-5">
				{fileContent.document[0].title}
			</h2>


			{#each $filteredContent as content}
				<p>{content}</p>
			{/each}

			{#each splitIntoSentences(fileContent.document[0].text) as sentence}
				<p>{sentence}</p>
			{/each}

		</div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}
</div>