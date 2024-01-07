<script lang="ts">
	import { annotationStore, removeAnnotation } from '../stores/AnnotationStore';
	import RelationForm from './RelationForm.svelte';
	import { labelStore } from '../stores/LabelStore';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import { onMount, tick } from 'svelte';

	let annotations;
	let labels;
	let selectedAnnotation = null as any;
	let showForm = false;

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'top'
	};

	labelStore.subscribe((e) => (labels = e));
	annotationStore.subscribe((e) => (annotations = e));

	let showPopup = null;
	onMount(async () => {
		await tick();
		document.addEventListener('click', () => {
			showPopup = null;
		});
	});

	function onDeleteRelation(relation) {
		annotationStore.update((annotations) => {
			const sourceAnnotation = annotations.find((a) => a.id === relation.source);
			const targetAnnotation = annotations.find((a) => a.id === relation.target);

			if (sourceAnnotation && targetAnnotation) {
				sourceAnnotation.relationships = sourceAnnotation.relationships.filter(
					(r) => !(r.source === relation.source && r.target === relation.target)
				);

				targetAnnotation.relationships = targetAnnotation.relationships.filter(
					(r) => !(r.source === relation.source && r.target === relation.target)
				);
			}

			return annotations;
		});
	}

	function shortenText(text) {
		const words = text.split(' ');
		if (words.length <= 8) {
			return text;
		}
		const start = words.slice(0, 5).join(' ');
		const end = words.slice(-5).join(' ');
		return `${start} .... ${end}`;
	}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div class="m-5 overflow-auto">
	{#if selectedAnnotation === null}
		<h1 class="font-bold">All Annotations</h1>
		{#each annotations as annotation}
			<div class="gap-3 mt-5 border-2 border-primary-400 ml-2">
				<!-- confirmation popup for annotation deletion -->
				<div class="card p-4 w-wrap shadow-xl" data-popup="popupFeatured">
					<div><p>Are you sure?</p></div>
					<div class="flex justify-center mt-6">
						<button class="bg-error-500 rounded-full w-full">No</button>
						<button
							class="bg-success-500 rounded-full ml-2 w-full"
							on:click={() => removeAnnotation(annotation)}>Yes</button
						>
					</div>
					<div class="arrow bg-surface-100-800-token" />
				</div>
				<button
					class="ml-2 bg-transparent text-red-500 text-2xl hover:text-white rounded-full"
					use:popup={popupFeatured}>X</button
				>
				<!-- add an id to each popup div -->
				<div
					id="popup-{annotation.id}"
					class={`card p-4 variant-filled-secondary absolute ${
						showPopup === annotation.id ? 'block' : 'hidden'
					}`}
					style="position: fixed; top: 10%; left: 48%; transform: translate(-50%, 0); width: 320px;"
				>
					<p>{annotation.text}</p>
				</div>
				<!-- set showPopup to the id of the corresponding div on mouseover -->
				<p
					class="text-xl ml-2"
					on:mouseover|stopPropagation={() => {
						showPopup = annotation.id;
					}}
					on:mouseout|stopPropagation={() => {
						showPopup = null;
					}}
				>
					{shortenText(annotation.text)}
				</p>
				<div class="flex space-x-1 ml-2">
					<p class="text-sm ml-2">Labels:</p>
					{#each annotation.label as label}
						<p class="text-xs ml-2" style="color: {label.color};">{label.name}</p>
					{/each}
				</div>
				<p class="text-base ml-2">Definition: {annotation.definition.definition}</p>
				<p class="text-base ml-2">Comment: {annotation.comment.comment}</p>
				<button
					type="button"
					class="btn flex flex-col rounded-none bg-secondary-500 m-2"
					on:click={() => (selectedAnnotation = annotation)}>Edit Relationships</button
				>
			</div>
		{/each}
	{:else if !showForm}
		<div>
			<button
				type="button"
				class="btn variant-filled float-right mb-5"
				on:click={() => (selectedAnnotation = null)}>Return</button
			>
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Annotatie 1</th>
							<th>Relationship</th>
							<th>Annotatie 2</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each selectedAnnotation.relationships as relationship}
							<tr>
								<th>{annotations.find((a) => a.id === relationship.source).text}</th>
								<th>{relationship.type}</th>
								<th>{annotations.find((a) => a.id === relationship.target).text}</th>
								<th
									><button
										type="button"
										class="btn variant-filled"
										on:click={() => onDeleteRelation(relationship)}>Delete</button
									></th
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<button type="button" class="btn variant-filled mt-5" on:click={() => (showForm = true)}
				>Add relationship</button
			>
		</div>
	{:else}
		<RelationForm
			selectedAnnotationId={selectedAnnotation.id}
			setShowForm={(value) => (showForm = value)}
		/>
	{/if}
</div>

<style>
	/** logic for showing arrow next to shown popup*/
	.card::after {
		content: '';
		position: absolute;
		top: 50%;
		right: -20px;
		border-width: 12px;
		border-style: solid;
		border-color: transparent transparent transparent rgb(79, 70, 229);
	}
</style>
