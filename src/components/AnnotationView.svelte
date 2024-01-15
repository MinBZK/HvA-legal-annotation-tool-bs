<script lang="ts">
	import { onMount } from 'svelte';
	import documentStore from '../stores/DocumentStore.ts';
	import { selectedChaptersStore } from '../stores/SelectedChapterStore.ts';
	import {
		selectedColor,
		textSelection,
		selectedLabels,
		labelStore
	} from '../stores/LabelStore.ts';
	import { addAnnotation, annotationStore } from '../stores/AnnotationStore.ts';
	import { comment, clearInput } from '../stores/CommentStore.ts';
	import { definition } from '../stores/DefinitionStores.ts';
	import Annotation from '../models/Annotation.ts';
	import type Label from '../models/Label.ts';
	import Comment from '../models/Comment.ts';
	import Definition from '../models/Definition.ts';
	import type LegalDocument from '../models/LegalDocument.ts';

	export let activeDocument: LegalDocument;

	let selectedText: Selection | null;
	let previousSelection: string | null = null;
	let inputColor = '';
	let selectedAnnotation: Annotation | null = null;
	let labelList: Label[] = [];
	let prevSelectedLabels: Label[] = [];
	let selectedComment: Comment;
	let selectedDefinition: Definition;
	let selectionOffset = { start: 0, end: 0 };
	let boundDoc: HTMLElement;
	let selectedChapters: any;
	let highlightSpan;

	$: {
		selectedLabels.subscribe((value) => {
			if (value) {
				prevSelectedLabels = value;
			}
		});

		selectedChaptersStore.subscribe((value) => {
			selectedChapters = value;
		});
	}

	onMount(() => {
		changeTextColor();
		selectionLogic(null);

		documentStore.subscribe((value) => {
			activeDocument = value;
		});

		selectedColor.subscribe((value) => {
			inputColor = value.color;
		});

		selectedLabels.subscribe((value) => {
			labelList = value;
		});

		comment.subscribe((value) => {
			selectedComment = value;
		});

		definition.subscribe((value) => {
			selectedDefinition = value;
		});
	});

	// Add event listener to detect user selection
	const handleSelection = () => (
		(selectedText = document.getSelection()), selectionLogic(selectedText), detectSelection()
	);

	// Logic for handling user selection
	function selectionLogic(selectionInput: Selection | null) {
		const selection = selectionInput;
		const inputChipsDiv = document.querySelector('.input-chips') as HTMLElement;
		clearInput.set(true);

		// If there's a previous selection, create an annotation for it
		if (previousSelection && labelList.length > 0) {
			createAnnotation(previousSelection);
		}

		// Remove the highlight from the selected text
		if (highlightSpan && highlightSpan.parentNode) {
			while (highlightSpan.firstChild) {
				highlightSpan.parentNode.insertBefore(highlightSpan.firstChild, highlightSpan);
			}
			highlightSpan.parentNode.removeChild(highlightSpan);
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

			// Highlight the selected text
			highlightSpan = document.createElement('span');
			highlightSpan.style.paddingTop = '4px';
			highlightSpan.style.paddingBottom = '5px';
			highlightSpan.style.backgroundColor = '#8090bb';
			highlightSpan.appendChild(range.extractContents());
			range.insertNode(highlightSpan);

			previousSelection = selectedText;
		} else {
			inputChipsDiv.style.display = 'none';
		}
	}

	// Function to create an annotation
	function createAnnotation(text: string) {
		annotationStore.subscribe((annotations) => {
			// Check if the name of previousSelection is not already appointed to an annotation
			const isNameAlreadyAppointed = annotations.some(
				(annotation) => annotation.text === previousSelection?.toString()
			);

			if (!isNameAlreadyAppointed && previousSelection && labelList.length > 0) {
				// Get the start and end positions of the selected text
				const startPosition = selectionOffset.start;
				const endPosition = selectionOffset.end;

				selectedAnnotation = new Annotation(
					Math.floor(Math.random() * 1000) + 1,
					previousSelection.toString(),
					labelList,
					selectedComment,
					selectedDefinition,
					[],
					startPosition,
					endPosition
				);
				addAnnotation(selectedAnnotation);
				console.log(selectedAnnotation);
				selectedComment = new Comment(0, '');
				selectedDefinition = new Definition(0, '');

				// Update the labelStore with the contents of previously selectedLabels
				labelStore.update((labels) => {
					return [...labels, ...prevSelectedLabels];
				});

				labelList = [];
				changeTextColor();
			}
		});
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
		annotationStore.subscribe((annotations) => {
			annotations.forEach((annotation) => {
				const walker = document.createTreeWalker(boundDoc, NodeFilter.SHOW_TEXT, null);

				let node;
				let index = 0;
				while ((node = walker.nextNode())) {
					const nextIndex = index + node.textContent.length;
					if (index <= annotation.startPosition && annotation.endPosition <= nextIndex) {
						const range = document.createRange();
						range.setStart(node, annotation.startPosition - index);
						range.setEnd(node, annotation.endPosition - index);

						const span = document.createElement('span');
						span.style.fontWeight = 'bold';
						span.style.textDecoration = `underline ${annotation.label[0].color}`;
						span.style.textDecorationThickness = '2px';
						span.style.textUnderlineOffset = '4px';
						span.appendChild(range.extractContents());
						range.insertNode(span);

						break;
					}
					index = nextIndex;
				}
			});
		});
	}

	function getSelectionCharacterOffsetWithin(element) {
		let start = 0;
		let end = 0;
		const sel = window.getSelection();
		if (sel && sel.rangeCount > 0) {
			const range = sel.getRangeAt(0);
			const preSelectionRange = range.cloneRange();
			preSelectionRange.selectNodeContents(element);
			preSelectionRange.setEnd(range.startContainer, range.startOffset);
			start = preSelectionRange.toString().length;
			end = start + range.toString().length;
		}
		return { start, end };
	}

	function selectionOffsets(node) {
		node.addEventListener('mouseup', () => {
			// Delay the resetting of the selection offsets by 1 millisecond
			setTimeout(() => {
				selectionOffset = getSelectionCharacterOffsetWithin(node);
			}, 1);
		});
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="p-4" role="main">
	{#if activeDocument}
		<div class="text-md leading-loose list-none relative m-10">
			<h2 class="font-medium text-xl">
				{activeDocument.title}
			</h2>
			<br />
			<div use:selectionOffsets bind:this={boundDoc} on:mouseup={handleSelection}>
				{#each activeDocument.chapterContents as chapter, index}
					{#if selectedChapters.has(index)}
						<p>{chapter}</p>
						<p class="bg-red-500 py-10">Test break between chapter</p>
					{/if}
				{/each}
			</div>
		</div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}
</div>
