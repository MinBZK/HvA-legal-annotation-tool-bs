<script lang="ts">
	import { annotationStore } from "../stores/AnnotationStore";
    import { Autocomplete, getToastStore, type AutocompleteOption } from "@skeletonlabs/skeleton";
	import { labelStore } from "../stores/LabelStore";
	import type Label from "../models/Label";
	import CustomInputChip from "$lib/components/CustomInputChip.svelte";

    // Two vars to hide this compoent and to get the selected annotation
    export let hideComponent: Function;
    export let selectedAnnotationId: number;

    // Get the stores
    const toastStore = getToastStore();

    type completeOptions = AutocompleteOption<string>;

    // Vars for the selected annotation and for all the labels, selected labels and the input for the chips
    let selectedAnnotation;
    let labelList: Label[] = [];
    let selectedLabelList: string[] = [];
    let autoCompleteOptions: completeOptions[] = [];
    let chip = '';

    // Get the labels from the store after changes, and update the auto complete options
    $: {
        labelStore.subscribe(e => {
            labelList = e;
            selectedLabelList = selectedAnnotation.label.map(l => l.name);
        });

        autoCompleteOptions = labelList.map((label) => ({ label: label.name, value: label.name })).sort((a, b) => a.label.localeCompare(b.label)).filter((label) => !selectedLabelList.includes(label.label));
    }

    // Get the annotation when the component loads

    annotationStore.subscribe(e => {
        selectedAnnotation = e.find(a => a.id === selectedAnnotationId);
    });

    /**
     * Function to handle the logic when a label is added
     * @param e CustomEvent - The event that is triggered when a label is added
     * @returns void
    */
    function onAddLabel(e: CustomEvent) {
        // Get the label name from the event
        const labelName = e.detail.value;

        // Check if the label name is not empty and if the label exists
        if (labelName) {
            const labelObject = labelList.find(l => l.name.toLowerCase() === labelName.toLowerCase());
            if(labelObject === undefined) return;
            selectedAnnotation.label = [...selectedAnnotation.label, labelObject];
            selectedLabelList = [...selectedLabelList, labelName];
        }
    }

    /**
     * Function to handle the logic when a label is removed
     * @param e CustomEvent - The event that is triggered when a label is removed
     * @returns void
    */
    function onRemoveLabel(e: CustomEvent) {
        // Get the label name from the event
        const labelName = e.detail.chipValue;

        // Check if the label name is not empty and remove it from the selected labels and from the annotation
        if (labelName) {
            selectedLabelList = selectedLabelList.filter(l => l !== labelName);
            selectedAnnotation.label = selectedAnnotation.label.filter(l => l.name !== labelName);
        }
    }

    /**
     * Function to submit changes to the selected annotation
     * @returns void
    */
    function submitAnnotation() {
        // Check if the annotation has at least one label
        if (selectedAnnotation.label.length === 0) {
            toastStore.trigger({
                message: "Please add at least one label.",
                timeout: 3000,
            });

            return;
        }

        // Update the annotation in the store
        annotationStore.update((annotations) => {
            const index = annotations.findIndex(a => a.id === selectedAnnotationId);
            annotations[index] = selectedAnnotation;
            return annotations;
        });

        // Hide this component
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
            <input type="text" class="input" bind:value={selectedAnnotation.definition.definition} />
        </div>

        <div>
            <label for="labelInput" class="font-bold">Labels</label>
            <CustomInputChip
                name="labelInput"
                options={labelList}
                bind:input={chip}
                bind:value={selectedLabelList}
                chipColors={selectedAnnotation.label.map((label) => label.color)}
                chips="variant-filled-primary"
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