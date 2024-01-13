<script lang="ts">
	import { annotationStore } from "../stores/AnnotationStore";

    export let hideComponent: Function;
    export let selectedAnnotationId: number;

    // Get the correct annotation object from the store
    let selectedAnnotation;

    annotationStore.subscribe(e => {
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });
</script>

<div>
    <button type="button" class="btn variant-filled hover:variant-filled-secondary float-right font-bold mb-3"
        on:click={hideComponent()}>
            Terugkeren
    </button>

    <div class="table-container">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Label Naam</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each selectedAnnotation.label as label}
                    <tr>
                        <th style="color: {label.color};">{label.name}</th>
                        <th
                            ><button
                                type="button"
                                class="btn variant-filled bg-error"
                                on:click={() => null}>Wissen</button
                            ></th
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <button type="button" class="btn variant-filled mt-5" on:click={() => null}>
        Add Labels
    </button>
</div>