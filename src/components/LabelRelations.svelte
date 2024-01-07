<script lang="ts">
	import Annotation from "../models/Annotation";
    import { annotationStore, addAnnotation, removeAnnotation } from "../stores/AnnotationStore";
	import { onMount } from "svelte";
	import RelationForm from "./RelationForm.svelte";
    import { relationTypes } from "../stores/relationStore";
	import { labelStore } from "../stores/LabelStore";
	import { definition } from "../stores/DefinitionStores";

    let annotations;
    let selectedAnnotation = null as any;
    let showForm = false;
    
    let labels;
    labelStore.subscribe(e => labels = e);

    annotationStore.subscribe(e => annotations = e);

    function onDeleteRelation(relation) {
        annotationStore.update(annotations => {
            const sourceAnnotation = annotations.find(a => a.id === relation.source);
            const targetAnnotation = annotations.find(a => a.id === relation.target);

            if (sourceAnnotation && targetAnnotation) {
                sourceAnnotation.relationships = sourceAnnotation.relationships.filter(r =>
                    !(r.source === relation.source && r.target === relation.target)
                );

                targetAnnotation.relationships = targetAnnotation.relationships.filter(r =>
                    !(r.source === relation.source && r.target === relation.target)
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

<div class="m-5 w-5/6 overflow-auto">
    {#if selectedAnnotation === null}
        <h1 class="font-bold">All Annotations</h1>
        {#each annotations as annotation}
        <div class="gap-3 mt-5">
            <button type="button" class="btn flex flex-col rounded-none bg-secondary-500"
            on:click={() => selectedAnnotation = annotation}>
            <button class="absolute ml-2 top-0 left-0 bg-transparent border-0 text-red-500 text-2xl"
            on:click|stopPropagation={() => removeAnnotation(annotation)}>X</button>
            <p class="text-xl">{shortenText(annotation.text)}</p>
            <div class="flex space-x-1">
                <p class="text-sm">Labels:</p>
                {#each annotation.label as label}
                    <p class="text-xs" style="color: {label.color};">{label.name}</p>
                {/each}
            </div>
            {#if annotation.definition.definition == ""}
            <p class="text-base">Definition: N.v.t.</p>
            {:else}
            <p class="text-base">Definition: {annotation.definition.definition}</p>
            {/if}
            {#if annotation.comment.comment == ""}
            <p class="text-base">Comment: N.v.t.</p>        
            {:else}
            <p class="text-base">Comment: {annotation.comment.comment}</p>        
            {/if}
            </button>
        </div>
        {/each}
        {:else}
        {#if !showForm}
            <div>
                <button type="button" class="btn variant-filled float-right mb-5" on:click={() => selectedAnnotation = null}>Return</button>
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
                                    <th>{annotations.find(a => a.id === relationship.source).text}</th>
                                    <th>{relationship.type}</th>
                                    <th>{annotations.find(a => a.id === relationship.target).text}</th>
                                    <th><button type="button" class="btn variant-filled"
                                        on:click={() => onDeleteRelation(relationship)}
                                        >Delete</button></th>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
                <button type="button" class="btn variant-filled mt-5"
                    on:click={() => showForm = true}
                    >Add relationship</button>
            </div>
            {:else}
            <RelationForm selectedAnnotationId={selectedAnnotation.id} setShowForm={(value) => showForm = value} />
        {/if}
    {/if}
</div>