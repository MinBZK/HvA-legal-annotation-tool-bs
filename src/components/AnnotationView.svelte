<script lang="ts">
    import { onMount } from 'svelte';
    export let fileContent = '';
    let formattedContent = '';

    onMount(() => {
        let contentToDisplay = fileContent;

        if (!contentToDisplay) {
            const storedContent = localStorage.getItem('uploadedXML');
            if(storedContent) {
                contentToDisplay = storedContent;
            }
        }
        // TODO: Convert to JSON or HTML for better display and styling
        if (contentToDisplay) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contentToDisplay, 'text/xml');
            formattedContent = new XMLSerializer().serializeToString(xmlDoc);
        }
    })
</script>

<style>
    .annotation-view {
        font-family: 'Inter', sans-serif;
        white-space: pre-line;
        overflow-x: auto;
        background-color: #f4f4f4;
        padding: 1em;
        border-radius: 8px;
        border: 1px solid #ccc;
        list-style-type: none;
    }
</style>

<!--TODO: After converting to JSON or HTML, remove contenteditable-->
{#if formattedContent}
    <div class="annotation-view" bind:innerHTML={formattedContent} contenteditable></div>
    {:else}
    <p>No File Uploaded.</p>
{/if}