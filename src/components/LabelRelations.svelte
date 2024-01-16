<script lang="ts">
	import { annotationStore, removeAnnotation } from '../stores/AnnotationStore';
	import RelationForm from './RelationForm.svelte';
	import { labelStore } from '../stores/LabelStore';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { getDrawerStore, popup } from '@skeletonlabs/skeleton';
	import { onMount, tick } from 'svelte';
	import { definition } from '../stores/DefinitionStores';
	import Fa from 'svelte-fa';
	import { faTags } from '@fortawesome/free-solid-svg-icons';

	const drawerStore = getDrawerStore();
	import EditAnnotation from './EditAnnotation.svelte';

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

	labelStore.subscribe((e) => (labels = e));
	annotationStore.subscribe((e) => (annotations = e));

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
					(r) =>
						!(
							r.source === relation.source &&
							r.target === relation.target &&
							r.type === relation.type
						)
				);

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
		<h1 class="font-bold inline">All Annotations</h1>
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
		{#each annotations as annotation}
			<div class="gap-3 mt-5 border-2 border-surface-300 ml-2 w-3/4">
				<!-- confirmation popup for annotation deletion -->
				<div class="card p-4 w-wrap shadow-xl" data-popup="popupFeatured">
					<div><p>Weet u het zeker?</p></div>
					<div class="flex justify-center mt-6">
						<button class="bg-error-500 rounded-full w-full">Nee</button>
						<button
							class="bg-success-500 rounded-full ml-2 w-full"
							on:click={() => removeAnnotation(annotation)}>Ja</button
						>
					</div>
					<div class="arrow bg-surface-100-800-token" />
				</div>
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

					<button
						class="mr-2 bg-transparent text-red-500 text-3xl hover:text-white rounded-full"
						use:popup={popupFeatured}>X</button
					>
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

				<div class="flex space-x-1 ml-2">
					<p class="text-sm">Labels:</p>
					{#each annotation.label as label}
						<p class="text-xs mt-0.5 ml-2" style="color: {label.color};">{label.name}</p>
					{/each}
				</div>
				{#if annotation.definition.definition == '' || annotation.definition.definition == undefined}
					<p class="text-base ml-2">Definition: .v.t.</p>
				{:else}
					<p class="text-base ml-2">Definition: {annotation.definition.definition}</p>
				{/if}
				{#if annotation.comment.comment == '' || annotation.definition.definition == undefined}
					<p class="text-base ml-2">Comment: N.v.t.</p>
				{:else}
					<p class="text-base ml-2">Comment: {annotation.comment.comment}</p>
				{/if}
				<button
					type="button"
					class="btn rounded-none bg-secondary-500 m-2"
					on:click={() => {
                        selectedAnnotation = annotation;
                        editAnnotation = false;
                    }}>Relaties bewerken</button
                    >
                    <button
                        type="button"
                        class="btn rounded-none bg-secondary-500 m-2"
                        on:click={() => {
                            selectedAnnotation = annotation;
                            editAnnotation = true;
                        }}>Annotatie Bewerken</button
                    >
            </div>
		{/each}
    {:else if (selectedAnnotation && editAnnotation)}
    <EditAnnotation 
        hideComponent = {() => {
            selectedAnnotation = null;
            editAnnotation = false;
        }}

        selectedAnnotationId = {selectedAnnotation.id}
    />
	{:else if !showForm}
		<div>
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
