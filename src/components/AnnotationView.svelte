<script lang="ts">
    import { onMount } from 'svelte';
    import labelStore from "./LabelStore.svelte";

    export let fileContent = '';
    let formattedContent = '';
    let selectedColor = '';
    let labelID = '';

    onMount(() => {
        let contentToDisplay = fileContent;
        document.addEventListener('mouseup', handleSelection);

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

        labelStore.subscribe(value => {
            selectedColor = value.selectedColor;
            labelID = value.labelID;
        })
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

    // Add event listener to detect user selection
    function handleSelection(event) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
            const selectedText = selection.toString();

            // Apply background color to the selected text
            const span = document.createElement('span');
            span.style.backgroundColor = selectedColor; // Apply the selected color
            span.appendChild(document.createTextNode(selectedText));
            selection.getRangeAt(0).surroundContents(span);

            // // Assign the label ID to the selected text or store it in your data structure
            // assignLabelID(selectedText, ID); // Function to assign the label ID to the selected text
        }
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
