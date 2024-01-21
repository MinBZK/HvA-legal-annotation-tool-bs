<script lang="ts">
	import { annotationStore } from '../stores/AnnotationStore';
	import RelationForm from './RelationForm.svelte';
	import { labelStore } from '../stores/LabelStore';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore, popup } from '@skeletonlabs/skeleton';
	import { onMount, tick } from 'svelte';
	import Fa from 'svelte-fa';
	import {
		faHandshakeAngle,
		faPenToSquare,
		faSpaghettiMonsterFlying,
		faTags,
		faTrash
	} from '@fortawesome/free-solid-svg-icons';
	import EditAnnotation from './EditAnnotation.svelte';

	// Initialize stores
	const drawerStore = getDrawerStore();

	// Initialize variables
	let annotations;
	let labels;
	let selectedAnnotation = null as any;
	let showForm = false;
	let editAnnotation = false;
	let showPopup = null;

	const popupFeatured: PopupSettings = {
		event: 'click',
		target: 'popupFeatured',
		placement: 'top'
	};

	// Subscribe to stores
	labelStore.subscribe((e) => (labels = e));
	annotationStore.subscribe((e) => (annotations = e));

	onMount(async () => {
		await tick();
		document.addEventListener('click', () => {
			showPopup = null;
		});
	});

	/**
	 * Function to handle the logic when a relation is deleted
	 * @param relation - The relation that is deleted
	 * @returns void
	 */
	function onDeleteRelation(relation) {
		annotationStore.update((annotations) => {
			// Get the source and target annotation
			const sourceAnnotation = annotations.find((a) => a.id === relation.source);
			const targetAnnotation = annotations.find((a) => a.id === relation.target);

			// Check if the source and target annotation exist
			if (sourceAnnotation && targetAnnotation) {
				// Remove the relation from the source annotation
				sourceAnnotation.relationships = sourceAnnotation.relationships.filter(
					(r) =>
						!(
							r.source === relation.source &&
							r.target === relation.target &&
							r.type === relation.type
						)
				);

				// Remove the relation from the target annotation
				targetAnnotation.relationships = targetAnnotation.relationships.filter(
					(r) =>
						!(
							r.source === relation.source &&
							r.target === relation.target &&
							r.type === relation.type
						)
				);
			}

			return annotations;
		});
	}

	/**
	 * Function to shorten the text of an annotation
	 * @param text
	 */
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
		<h1 class="font-bold inline">Alle Annotaties</h1>
		<div class="float-right">
			<button
				type="button"
				class="btn btn-lg variant-filled rounded-md w-20"
				on:click={() => {
					drawerStore.open({
						id: 'labelsModify',
						position: 'right',
						bgDrawer: 'bg-surface-600 text-white',
						width: 'w-[40%]',
						padding: 'p-4',
						rounded: 'rounded-xl'
					});
				}}
				><Fa icon={faTags} size="1.5x"></Fa>
			</button>
		</div>
		{#each annotations as annotation, index}
			<div class="gap-3 mt-5 bg-surface-800 p-3 rounded-md ml-2 w-3/4">
				<div class="flex justify-between items-center">
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

					<div class="self-start">
						<button
							type="button"
							class="btn rounded-md bg-error-500 m-2"
							on:click={() => {
								annotationStore.update((annotations) => {
									annotations.splice(index, 1);

                                    annotations.forEach((annotation) => {
                                        annotation.relationships = annotation.relationships.filter((relationship) => {
                                            return relationship.source !== annotation.id && relationship.target !== annotation.id;
                                        });
                                    });
                                    
									return annotations;
								});
							}}
						>
							<Fa class="text-surface-900" size="1.5x" icon={faTrash} />
						</button>
					</div>
				</div>

				<!-- add an id to each popup div -->
				<div
					id="popup-{annotation.id}"
					class={`card hoverPop p-4 bg-surface-600 absolute ${
						showPopup === annotation.id ? 'block' : 'hidden'
					}`}
					style="position: fixed; top: 10%; left: 47%; transform: translate(-50%, 0); width: 20%;"
				>
					<p>{annotation.text}</p>
				</div>

				<div class="flex space-x-1 ml-2 pt-3">
					<p class="text-sm">Labels:</p>
					{#each annotation.label as label}
						<p class="text-xs mt-0.5 ml-2" style="color: {label.color};">{label.name}</p>
					{/each}
				</div>
				{#if annotation.definition.definition == '' || annotation.definition.definition == undefined}
					<p class="text-base pt-2 ml-2">Definition: N.v.t.</p>
				{:else}
					<p class="text-base pt-2 ml-2">Definition: {annotation.definition.definition}</p>
				{/if}
				{#if annotation.comment.comment == '' || annotation.definition.definition == undefined}
					<p class="text-base ml-2">Comment: N.v.t.</p>
				{:else}
					<p class="text-base ml-2">Comment: {annotation.comment.comment}</p>
				{/if}
				<div class="flex">
					<button
						type="button"
						class="btn rounded-md bg-success-500 m-2"
						on:click={() => {
							selectedAnnotation = annotation;
							editAnnotation = false;
						}}
					>
						<Fa class="text-surface-900" size="1.5x" icon={faHandshakeAngle} />
					</button>
					<button
						type="button"
						class="btn rounded-md bg-primary-500 m-2"
						on:click={() => {
							selectedAnnotation = annotation;
							editAnnotation = true;
						}}
					>
						<Fa class="text-surface-900" size="1.5x" icon={faPenToSquare} />
					</button>
				</div>
			</div>
		{/each}
	{:else if selectedAnnotation && editAnnotation}
		<EditAnnotation
			hideComponent={() => {
				selectedAnnotation = null;
				editAnnotation = false;
			}}
			selectedAnnotationId={selectedAnnotation.id}
		/>
	{:else if !showForm}
		<div>
			<h1 class="h5 font-bold">Annotatie: "{selectedAnnotation.text}"</h1>

			<button
				type="button"
				class="btn variant-filled float-right mb-5 hover:variant-filled-secondary text-white font-bold"
				on:click={() => (selectedAnnotation = null)}>Terugkeren</button
			>
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Annotatie 1</th>
							<th>Relatie</th>
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
										class="btn variant-filled-error hover:variant-filled-error-secondary text-white font-bold my-2"
										on:click={() => onDeleteRelation(relationship)}>Wissen</button
									></th
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<button
				type="button"
				class="btn variant-filled mt-5 hover:variant-filled-secondary text-white font-bold"
				on:click={() => (showForm = true)}>Relatie toevoegen</button
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
	.hoverPop::after {
		content: '';
		position: absolute;
		top: 45%;
		right: -23px;
		border-width: 12px;
		border-style: solid;
		border-color: transparent transparent transparent rgba(var(--color-surface-800) / 1);
	}
</style>
