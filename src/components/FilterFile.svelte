<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import objStore from '../stores/ObjStore.ts';
    import { onMount } from 'svelte';

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

    const isIndentedListItem = (sentence) => {
        const trimmedSentence = sentence.trim();
        return !trimmedSentence.match(/^([1234567890])\./) && trimmedSentence.match(/^[a-zA-Z]\./);
    };

    let checkedSentences = new Set();

    function handleCheckboxChange(sentence, event) {
        if (event.target.checked) {
            checkedSentences.add(sentence);
        } else {
            checkedSentences.delete(sentence);
        }
        console.log(checkedSentences);
    }
</script>

<div>
    {#if fileContent}
        <h2 class="text-xl font-bold mb-5">Filter zinnen:</h2>
        <hr class="mb-10" />
        <div class="flex flex-col">
            {#each getSentence() as sentence}
                <div class="flex flex-row items-center mb-10">
                    <SlideToggle
                            name={sentence}
                            id={sentence}
                            on:change={(event) => handleCheckboxChange(sentence, event)}
                            size="sm"
                            class="mr-4"
                    />
                    <label for={sentence} class:ml-2={isIndentedListItem(sentence)}>{sentence}</label>
                </div>
            {/each}
        </div>
    {/if}
</div>
