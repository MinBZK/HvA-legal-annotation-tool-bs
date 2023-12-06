<script lang="ts">
    import { onMount } from 'svelte';
    export let fileContent = '';
    let formattedContent = '';

    onMount(() => {
        let contentToDisplay = fileContent;

        // If no file content is passed, check if there is a file in local storage
        if (!contentToDisplay) {
            const storedContent = localStorage.getItem('uploadedXML');
            if(storedContent) {
                contentToDisplay = storedContent;
            }
        }
        // If there is content to display, format it
        if (contentToDisplay) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contentToDisplay, 'text/xml');
            convertXMLTagsToDiv(xmlDoc);
            formattedContent = new XMLSerializer().serializeToString(xmlDoc);
        }
    })

    // Convert XML tags to divs
    function convertXMLTagsToDiv(xmlDoc: Document) {
        xmlDoc.querySelectorAll('kop').forEach((el: any) => {
            const div = document.createElement('div');
            div.className = 'kop flex gap-2 text-lg font-bold';
            div.innerHTML = el.innerHTML;
            el?.parentNode.replaceChild(div, el);
        });
        xmlDoc.querySelectorAll("meta-data").forEach((el: any) => {
            const div = document.createElement('div');
            div.className = 'meta-data opacity-0';
            div.innerHTML = el.innerHTML;
            el?.parentNode.replaceChild(div, el);
        });
        // Remove all tags that should not be displayed
        //TODO: find a way to keep the content of these tags for exporting
        xmlDoc.querySelectorAll("intitule,aanhef,bwb-inputbestand,redactionele-correcties,citeertitel")
            .forEach((el: Element) => {
            el.remove();
        });
    }
</script>

<div class="border border-gray-200 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-5">Annoteer:</h2>
    <hr>
    {#if formattedContent}
        <div class="annotation-view h-[80vh] w-[750px] relative mt-5 mb-10" bind:innerHTML={formattedContent} contenteditable="false"></div>
    {:else}
        <p>Upload een .xml bestand</p>
    {/if}
</div>

<style>
    .annotation-view {
        font-family: 'Inter', sans-serif;
        white-space: pre-line;
        overflow-x: auto;
        padding: 1em;
        border-radius: 8px;
        list-style-type: none;
    }
</style>