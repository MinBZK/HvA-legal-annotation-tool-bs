<script lang="ts">
    // TODO: Create adding labels functionality, create removing labels functionality
	import { annotationStore } from "../stores/AnnotationStore";
    import { Autocomplete, InputChip, getToastStore, type AutocompleteOption } from "@skeletonlabs/skeleton";
	import { labelStore } from "../stores/LabelStore";
	import type Label from "../models/Label";
	import { onMount } from "svelte";

    export let hideComponent: Function;
    export let selectedAnnotationId: number;

    const toastStore = getToastStore();

    type completeOptions = AutocompleteOption<string>;

    let selectedAnnotation;
    let labelList: Label[] = [];
    let selectedLabelList: string[] = [];
    let autoCompleteOptions: completeOptions[] = [];
    let chip = '';

    $: {
        labelStore.subscribe(e => {
            labelList = e;
            selectedLabelList = selectedAnnotation.label.map(l => l.name);
        });

        autoCompleteOptions = labelList.map((label) => ({ label: label.name, value: label.name })).sort((a, b) => a.label.localeCompare(b.label)).filter((label) => !selectedLabelList.includes(label.label));
    }

    annotationStore.subscribe(e => {
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });

    function onAddLabel(e: CustomEvent) {
        const labelName = e.detail.value;

        if (labelName) {
            const labelObject = labelList.find(l => l.name.toLowerCase() === labelName.toLowerCase());
            if(labelObject === undefined) return;
            selectedAnnotation.label = [...selectedAnnotation.label, labelObject];
            selectedLabelList = [...selectedLabelList, labelName];
        }
    }

    function onRemoveLabel(e: CustomEvent) {
        const labelName = e.detail.chipValue;

        if (labelName) {
            selectedLabelList = selectedLabelList.filter(l => l !== labelName);
            selectedAnnotation.label = selectedAnnotation.label.filter(l => l.name !== labelName);
        }
    }

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
    <h1 class="h5 font-bold mb-5 inline">Annotatie: "{selectedAnnotation.text}"</h1>

    <button type="button" class="btn variant-filled hover:variant-filled-secondary float-right font-bold mb-3"
            on:click={() => submitAnnotation()}>
                Terugkeren
        </button>

        <div class="mb-3 mt-3 w-1/2">
            <label for="labelName" class="font-bold">Comment</label>
            <input type="text" class="input" bind:value={selectedAnnotation.comment.comment} />
        </div>

        <div class="mb-3 mt-3 w-1/2">
            <label for="labelName" class="font-bold">Definition</label>
            <input type="text" class="input" bind:value={selectedAnnotation.definition.comment} />
        </div>

        <div>
            <label for="labelInput" class="font-bold">Labels</label>
            <InputChip
                name="labelInput"
                options={labelList}
                bind:input={chip}
                bind:value={selectedLabelList}
                chips="variant-filled-secondary"
                allowUpperCase
                on:remove={e => onRemoveLabel(e)}
            />
            <div class="card max-h-52 p-4 overflow-y-auto" tabindex="-1">
                <Autocomplete
                    bind:input={chip}
                    options={autoCompleteOptions}
                    on:selection={e => onAddLabel(e)}
                />
            </div>
        </div>
</div>