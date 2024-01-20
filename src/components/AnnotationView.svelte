<script lang="ts">
	import { onMount } from 'svelte';

	import { documentStore } from '../stores/DocumentStore.ts';
	import { selectedChaptersStore } from '../stores/SelectedChapterStore.ts';
	import { textSelection, selectedLabels, labelStore } from '../stores/LabelStore.ts';
	import { addAnnotation, annotationStore } from '../stores/AnnotationStore.ts';
	import { comment, clearInput } from '../stores/CommentStore.ts';
	import { definition } from '../stores/DefinitionStores.ts';

	import Annotation from '../models/Annotation.ts';
	import type Label from '../models/Label.ts';
	import Comment from '../models/Comment.ts';
	import Definition from '../models/Definition.ts';

	let selectedText: Selection | null;
	let previousSelection: string | null = null;
	let selectedAnnotation: Annotation | null = null;
	let labelList: Label[] = [];
	let prevSelectedLabels: Label[] = [];
	let selectedComment: Comment;
	let selectedDefinition: Definition;
	let selectionOffset = { start: 0, end: 0 };
	let boundDoc: HTMLElement;
	let highlightSpan;

	$: {
		selectedLabels.subscribe((value) => {
			if (value) {
				prevSelectedLabels = value;
			}
		});
	}

	onMount(() => {
		selectionLogic(null);

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
		(selectedText = document.getSelection()),
		selectionLogic(selectedText),
		detectSelection(),
		changeTextColor()
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
			
			// Check if the parent tag is a header tag.
			const parentTag = selection.anchorNode?.parentNode?.nodeName.toLowerCase();
			if (parentTag?.startsWith('h') && !isNaN(Number(parentTag[1]))) return;


			inputChipsDiv.style.display = 'block';
			const selectedText = selection.toString();

			// Calculate position of the selected text
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			const selectedTextBottom = rect.bottom + window.scrollY;
			const selectedTextCenter =
				rect.left + rect.width / 2 - inputChipsDiv.offsetWidth / 2 + window.scrollX;

			// Set the position of the input-chips div
			if (inputChipsDiv) {
				inputChipsDiv.style.position = 'absolute';
				inputChipsDiv.style.top = selectedTextBottom + 'px';
				inputChipsDiv.style.left = selectedTextCenter + 'px';
			}

			// Highlight the selected text
			highlightSpan = document.createElement('span');
			highlightSpan.style.paddingTop = '4px';
			highlightSpan.style.paddingBottom = '5px';
			highlightSpan.style.backgroundColor = 'rgba(var(--color-primary-900) / 1)';
			highlightSpan.appendChild(range.surroundContents(highlightSpan));
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
				selectedComment = new Comment(0, '');
				selectedDefinition = new Definition(0, '');

				// Update the labelStore with the contents of previously selectedLabels
				labelStore.update((labels) => {
					return [...labels, ...prevSelectedLabels];
				});

				labelList = [];
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
				if (boundDoc) {
					const walker = document.createTreeWalker(boundDoc, NodeFilter.SHOW_TEXT, null);
					let node;
					let index = 0;
					let startNode, endNode, startIndex, endIndex;
					while ((node = walker.nextNode())) {
						const nextIndex = index + node.textContent.length;
						if (index <= annotation.startPosition && annotation.startPosition < nextIndex) {
							startNode = node;
							startIndex = annotation.startPosition - index;
						}
						if (index < annotation.endPosition && annotation.endPosition <= nextIndex) {
							endNode = node;
							endIndex = annotation.endPosition - index;
						}
						index = nextIndex;
					}

					if (startNode && endNode) {
						const range = document.createRange();
						range.setStart(startNode, startIndex);
						range.setEnd(endNode, endIndex);

						const span = document.createElement('span');
						span.style.fontWeight = 'bold';
						span.style.whiteSpace = 'no-wrap';
						span.style.textDecoration = `underline ${annotation.label[0].color}`;
						span.style.textDecorationThickness = '2px';
						span.style.textUnderlineOffset = '4px';
						span.appendChild(range.extractContents());
						range.insertNode(span);
					}
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

	function splitSentences(text) {
		return text.split('\n');
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
	{#if $documentStore}
		<div class="text-md leading-loose list-none relative bg-surface-200 dark:bg-surface-800 pl-5 pr-5 pt-2 w-full">
			<div class="mt-3" use:selectionOffsets bind:this={boundDoc} on:mouseup={handleSelection}>
				{#if $selectedChaptersStore && $selectedChaptersStore.length > 0}
					<h1 class="h1 font-mono mb-2">
						{$documentStore.title}
					</h1>
				{/if}
				{#each $documentStore.chapterContents as chapter, index}
					{#if $selectedChaptersStore.includes(index)}
						<h2 class="h2 font-serif mb-2">{$documentStore.chapterTitles[index]}</h2>
						{#each splitSentences(chapter) as line}
							{line}<br />
						{/each}
						<br>
						<hr class="!border-t-8" />
						<br>
					{/if}
				{/each}
			</div>
		</div>
	{:else}
		<p>Upload een .xml bestand</p>
	{/if}
</div>
