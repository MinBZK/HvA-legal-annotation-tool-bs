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
        if (contentToDisplay) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contentToDisplay, 'text/xml');
            convertXMLTagsToDiv(xmlDoc);
            formattedContent = new XMLSerializer().serializeToString(xmlDoc);
        }
    })

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
        xmlDoc.querySelectorAll("intitule, aanhef,bwb-inputbestand,redactionele-correcties,citeertitel").forEach((el: Element) => {
            el.remove();
        });
    }
</script>

<div>
    <h2 class="text-3xl font-bold mb-5">Annoteer:</h2>
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
        background-color: #f4f4f4;
        padding: 1em;
        border-radius: 8px;
        border: 1px solid #ccc;
        list-style-type: none;
    }
</style>