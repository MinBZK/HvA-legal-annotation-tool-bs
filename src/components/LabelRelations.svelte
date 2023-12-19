<script lang="ts">
	import Annotation from "../models/Annotation";
    import { annotationStore, addAnnotation } from "../stores/AnnotationStore";
	import { onMount } from "svelte";
	import RelationForm from "./RelationForm.svelte";
    import { relationTypes } from "../stores/relationStore";

    let annotations;
    let selectedAnnotation = null as any;
    let showForm = false;

    // For testing purposes
    // annotationStore.set([
    //     new Annotation(1, null as any, "Deze wet", "Rechtssubject", null as any, null as any, [
    //         { type: relationTypes[10], source: 1, target: 2 },
    //         { type: relationTypes[6], source: 1, target: 3 }
    //     ]),
    //     new Annotation(2, null as any, "Die andere wet", "Rechtssubject", null as any, null as any, [
    //         { type: relationTypes[10], source: 1, target: 2 },
    //     ]),
    //     new Annotation(3, null as any, "Als Bamischijf het toelaat", "Voorwaarden", null as any, null as any, [
    //         { type: relationTypes[6], source: 1, target: 3 }
    //     ])
    // ]);

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
</script>

<div class="m-5">
    {#if selectedAnnotation === null}
        <h1 class="font-bold">All Annotations</h1>
        {#each annotations as annotation}
            <div class="gap-3 mt-5">
                <button type="button" class="btn variant-filled"
                on:click={() => selectedAnnotation = annotation}>
                    <p class="align-middle">{annotation.text}</p>
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