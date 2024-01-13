<script lang="ts">
    // TODO: Create adding labels functionality, create removing labels functionality
	import { annotationStore } from "../stores/AnnotationStore";
    import { getToastStore } from "@skeletonlabs/skeleton";

    export let hideComponent: Function;
    export let selectedAnnotationId: number;

    const toastStore = getToastStore();

    let selectedAnnotation;

    annotationStore.subscribe(e => {
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });

    function submitAnnotation() {
        if (selectedAnnotation.label.length === 0) {
            toastStore.trigger({
                message: "Please add at least one label.",
                timeout: 3000,
            });

            return;
        }

        annotationStore.update((annotations) => {
            const index = annotations.findIndex(a => a.id === selectedAnnotationId);
            annotations[index] = selectedAnnotation;
            return annotations;
        });

        hideComponent();
    }
</script>

<div>
    <button type="button" class="btn variant-filled hover:variant-filled-secondary float-right font-bold mb-3"
        on:click={hideComponent()}>
            Terugkeren
    </button>
    
    <h1 class="h5 font-bold mb-5">Annotatie: "{selectedAnnotation.text}"</h1>

    <div class="mb-3 mt-3 w-1/2">
        <label for="labelName" class="font-bold">Comment</label>
        <input type="text" class="input" bind:value={selectedAnnotation.comment.comment} />
    </div>

    <div class="mb-3 mt-3 w-1/2">
        <label for="labelName" class="font-bold">Definition</label>
        <input type="text" class="input" bind:value={selectedAnnotation.definition.comment} />
    </div>

    <div class="table-container mt-10">
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
                                class="btn variant-filled-error hover:variant-filled-error-secondary text-white font-bold my-2"
                                on:click={() => null}>Wissen</button
                            ></th
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <div class="float-right mt-5">
        <button type="button" class="btn variant-filled hover:variant-filled-secondary font-bold" on:click={() => null}>
            Labels toevoegen
        </button>
        <button type="button" class="btn variant-filled hover:variant-filled-secondary font-bold" on:click={() => submitAnnotation()}>
            Opslaan
        </button>
    </div>
</div>