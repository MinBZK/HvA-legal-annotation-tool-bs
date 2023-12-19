<script lang="ts">
    import objStore from '../stores/ObjStore.ts';
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";

    export let fileContent: {} = "";

    onMount(() => {
        objStore.subscribe(value => {
            fileContent = value;
        });
    });

    const getSentence = () => {
        return fileContent.document && fileContent.document[0].text
            ? fileContent.document[0].text.split('\n').filter(sentence => sentence.trim() !== '')
            : [];
    };

    let checkedSentences = new Set();
    let selectAll = writable(false);

    function handleCheckboxChange(sentence, event) {
        if (event.target.checked) {
            checkedSentences.add(sentence);
        } else {
            checkedSentences.delete(sentence);
        }

        selectAll.set(checkedSentences.size === getSentence().length);

        console.log(checkedSentences);
    }

    function toggleCheckboxes() {
        if ($selectAll) {
            checkedSentences.clear();
        } else {
            getSentence().forEach(sentence => checkedSentences.add(sentence));
        }
        checkedSentences = new Set(checkedSentences);
        selectAll.set(!$selectAll);
        console.log(checkedSentences);
    }
</script>

<div>
    <h2 class="text-xl">Kies de onderdelen die u wilt annoteren:</h2>
    {#if fileContent}
    <div class="flex flex-col">
        <div class="flex my-5">
            <input
                type="checkbox" name="check_all" id="check_all"
                class="checkbox mr-3"
                bind:checked={$selectAll}
                on:click={toggleCheckboxes}
            >
            <label for="check_all" class="font-bold">Selecteer alles</label>
        </div>
        {#each getSentence() as sentence}
        <Accordion>
            <AccordionItem closed>
                <svelte:fragment slot="lead">
                    <input
                        type="checkbox" name={sentence} id="id"
                        on:change={(event) => {handleCheckboxChange(sentence, event)}}
                        class="checkbox mr-3 sentence"
                        checked={checkedSentences.has(sentence)}
                    >
                </svelte:fragment>
                <svelte:fragment slot="summary">
                    <label for={sentence}>{sentence}</label>
                </svelte:fragment>
                <svelte:fragment slot="content"></svelte:fragment>
            </AccordionItem>
        </Accordion>
        {/each}
    </div>
    {/if}
</div>
