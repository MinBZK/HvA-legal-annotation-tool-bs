<script lang="ts">
	import { onMount } from "svelte";
	import type Label from "../models/Label";
	import { labelStore } from "../stores/LabelStore";
    import { getModalStore, getToastStore, type ModalSettings } from "@skeletonlabs/skeleton";
	import supabase from "$lib/supabaseClient";

    const toastStore = getToastStore();
    const modalStore = getModalStore();

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

    let labels = [] as Label[];
    let showForm = false;
    let newLabel = { name: "", color: "#000000" } as Label;

    $: labels;
    
    labelStore.subscribe(e => labels = e);

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
                                    class="btn variant-filled hover:variant-filled-secondary"
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