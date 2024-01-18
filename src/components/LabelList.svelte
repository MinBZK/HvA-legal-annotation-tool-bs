<script lang="ts">
	import type Label from "../models/Label";
	import { labelStore } from "../stores/LabelStore";
    import { getDrawerStore, getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import supabase from "$lib/supabaseClient";
    import Fa from "svelte-fa";
	import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";

    // Initialize stores
    const toastStore = getToastStore();
    const modalStore = getModalStore();
    const drawerStore = getDrawerStore();

    // These labels should not be deleted
    const immutableLabels = [
        'Rechtsbetrekking', 
        'Rechtsobject', 
        'Rechtsfeit', 
        'Voorwaarde', 
        'Afleidingsregel', 
        'Variabele', 
        'Variabelewaarde', 
        'Parameter', 
        'Parameterwaarde', 
        'Operator', 
        'Tijdsaanduiding', 
        'Plaatsaanduiding', 
        'Delegatiebevoegdheid', 
        'Delegatie-invulling', 
        'Brondefinitie', 
        'Rechtssubject'
    ];
    
    // Initialize variables
    let labels = [] as Label[];
    let showForm = false;
    let newLabel = { name: "", color: "#000000" } as Label;

    // Subscribe to label store and update labels
    $: labels;
    
    labelStore.subscribe(e => labels = e);

    /**
     * Function to handle the logic when a label is created
     * @returns void
     */
    async function onCreateLabel() {
        // Check if label already exists
        if (labels.find(l => l.name === newLabel.name)) {
            toastStore.trigger({
                message: "Label already exists",
                timeout: 3000,
            });
            return;
        }

        // Check if label name is empty
        if (newLabel.name === "") {
            toastStore.trigger({
                message: "Label name cannot be empty",
                timeout: 3000,
            });
            return;
        }

        // Get the label with highest id and set the id to that label's id + 1
        const highestId = Math.max(...labels.map(l => l.id));
        newLabel.id = highestId + 1;

        // Add label to store
        const { error } = await supabase.from('labels').insert(newLabel);

        if(error) {
            toastStore.trigger({
                message: "Error creating label: " + error.message,
                timeout: 3000,
            });
            return;
        }

        // Load labels from database
        labelStore.set([]);
		const { data } = await supabase.from('labels').select('*');
        // @ts-ignore
		labelStore.set(data);

        showForm = false;
    }

    /**
     * Function to show a confirmation popup
     * @param labelId number - The id of the label to delete
     * @returns void
     */
    const confirmationPopup = (labelId: number) => {
        const modal: ModalSettings = {
            type: "confirm",
            title: "Delete label",
            body: "Are you sure you want to delete this label?",
            response: (r: boolean) => {
                if (r) {
                    onDeleteLabel(labelId);
                }
            },
        };
                                        
        modalStore.trigger(modal);
    }

    /**
     * Function to handle the logic when a label is deleted
     * @param labelId number - The id of the label to delete
     * @returns void
     */
    async function onDeleteLabel(labelId: number) {
        const { error } = await supabase.from('labels').delete().eq('id', labelId);

        if(error) {
            toastStore.trigger({
                message: "Error deleting label: " + error.message,
                timeout: 3000,
            });
        }

        labelStore.set([]);
		const { data } = await supabase.from('labels').select('*');
        // @ts-ignore
		labelStore.set(data);
    }
</script>

<div class="m-5 overflow-auto">
    {#if !showForm}
        <button type="button" class="btn-icon variant-filled mb-5" on:click={() => {
            drawerStore.open({
                id: 'relationships',
                position: 'right',
                bgDrawer: 'bg-surface-600 text-white',
                width: 'w-[40%]',
                padding: 'p-4',
                rounded: 'rounded-xl'
            });
        }}>
            <Fa size="1.5x" icon={faArrowLeftLong} />
        </button>
        <div class="table-container">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th class="text-center">Label naam</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {#each labels as label}
                        <tr>
                            <th style="color: {label.color};">{label.name}</th>
                            <th>
                                <button
                                    type="button"
                                    class="btn variant-filled-error hover:variant-filled-error-secondary text-white font-bold my-1"
                                    disabled={immutableLabels.includes(label.name)}
                                    on:click={() => confirmationPopup(label.id)}>
                                    Wissen
                                </button>
                            </th>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}

    {#if showForm}
        <label for="labelNameInput" class="label mb-1 font-bold">Label naam</label>
        <input id="labelNameInput" class="input mb-4" type="text" bind:value={newLabel.name}/>

        <label for="labelColorInput" class="label mb-1 font-bold">Label kleur</label>
        <div id="labelColorInput" class="grid grid-cols-[auto_1fr] gap-2 mb-4">
            <input class="input" type="color" bind:value={newLabel.color} />
            <input class="input" type="text" bind:value={newLabel.color} readonly tabindex="-1" />
        </div>

        <div class="float-right">
            <button on:click={() => onCreateLabel()}
                class="btn variant-filled hover:variant-filled-secondary text-white font-bold py-2 px-4 rounded-full">
                Verzenden
            </button>
    
            <button on:click={() => showForm = false}
                class="btn variant-filled hover:variant-filled-secondary text-white font-bold py-2 px-4 rounded-full">
                Annuleren
            </button>
        </div>
    {/if}
    {#if !showForm}
        <button on:click={() => showForm = true}
            class="btn variant-filled hover:variant-filled-secondary text-white font-bold py-2 px-4 rounded-full float-right m-5">
            Label toevoegen
        </button>
    {/if}
</div>