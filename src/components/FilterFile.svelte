<script lang="ts">
    import objStore from '../stores/ObjStore.ts';
    import { onMount } from 'svelte';
    import { writable } from "svelte/store";
    import {Accordion, AccordionItem, TreeView, TreeViewItem} from "@skeletonlabs/skeleton";

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


    let medums = ['Hoofdstuk 1', 'Hoofdstuk 2'];
    let books = ['Artikel 1', 'Artikel 2', 'Artikel 3'];

</script>

<div class="mt-10 ml-5">
    {#if fileContent}
        <div class="flex mb-5">
            <input
                type="checkbox" name="check_all" id="check_all"
                class="checkbox mr-3"
                bind:checked={$selectAll}
                on:click={toggleCheckboxes}
            >
            <label for="check_all" class="font-bold">Selecteer alles</label>
        </div>

        <TreeView selection multiple relational nodes={checkedSentences}>
            <TreeViewItem bind:group={medums} name="medium" value="books">
                <p>Hoofdstuk 1</p>
                <svelte:fragment slot="children">
                    <TreeViewItem bind:group={books} name="books" value="Clean Code">
                        <p>Artikel 1</p>
                    </TreeViewItem>
                    <TreeViewItem bind:group={books} name="books" value="The Clean Coder">
                        <p>Artikel 2</p>
                    </TreeViewItem>
                    <TreeViewItem bind:group={books} name="books" value="The Art of Unix Programming">
                        <p>Artikel 3</p>
                    </TreeViewItem>
                </svelte:fragment>
            </TreeViewItem>
            <TreeViewItem bind:group={medums} name="medium" value="movies">
                <p>Hoofdstuk 2</p>
                <svelte:fragment slot="children">
                    <TreeViewItem bind:group={books} name="books" value="The Matrix">
                        <p>Artikel 1</p>
                    </TreeViewItem>
                    <TreeViewItem bind:group={books} name="books" value="The Lord of the Rings">
                        <p>Artikel 2</p>
                    </TreeViewItem>
                    <TreeViewItem bind:group={books} name="books" value="The Godfather">
                        <p>Artikel 3</p>
                    </TreeViewItem>
                </svelte:fragment>
            </TreeViewItem>
        </TreeView>





        <!--    <div class="flex flex-col">-->
<!--        <div class="flex my-5">-->
<!--            <input-->
<!--                type="checkbox" name="check_all" id="check_all"-->
<!--                class="checkbox mr-3"-->
<!--                bind:checked={$selectAll}-->
<!--                on:click={toggleCheckboxes}-->
<!--            >-->
<!--            <label for="check_all" class="font-bold">Selecteer alles</label>-->
<!--        </div>-->
<!--        {#each getSentence() as sentence}-->
<!--        <Accordion>-->
<!--            <AccordionItem closed>-->
<!--                <svelte:fragment slot="lead">-->
<!--                    <input-->
<!--                        type="checkbox" name={sentence} id="id"-->
<!--                        on:change={(event) => {handleCheckboxChange(sentence, event)}}-->
<!--                        class="checkbox mr-3 sentence"-->
<!--                        checked={checkedSentences.has(sentence)}-->
<!--                    >-->
<!--                </svelte:fragment>-->
<!--                <svelte:fragment slot="summary">-->
<!--                    <label for={sentence}>{sentence}</label>-->
<!--                </svelte:fragment>-->
<!--                <svelte:fragment slot="content"></svelte:fragment>-->
<!--            </AccordionItem>-->
<!--        </Accordion>-->
<!--        {/each}-->
<!--    </div>-->
    {/if}
</div>
