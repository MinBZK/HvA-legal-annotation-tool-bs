<script lang="ts">
    import { derived } from 'svelte/store';
    import objStore from '../stores/ObjStore.ts';
    import { selectedChaptersStore }  from '../stores/SelectedChapterStore.ts';


    const chaptersStore = derived(objStore, $objStore =>
        $objStore.document?.[0]?.chapters || []
    );

    function handleCheckboxChange(chapterIndex, event) {
        selectedChaptersStore.update(currentSelection => {
            const newSelection = new Set(currentSelection);
            if (event.target.checked) {
                newSelection.add(chapterIndex);
            } else {
                newSelection.delete(chapterIndex);
            }
            return newSelection;
        });
    }
</script>

<div class="mt-10 ml-5">
    {#if $chaptersStore.length > 0}
        {#each $chaptersStore as chapter, index (chapter)}
            <div class="flex items-center mb-8 cursor-pointer">
                <input
                        type="checkbox"
                        id={`chapter-${index}`}
                        class="checkbox mr-3 min-w-[1.3rem] min-h-[1.3rem]"
                        on:change={(e) => handleCheckboxChange(index.toString(), e)}
                >
                <label for={`chapter-${index}`} class="ml-2">{chapter}</label>
            </div>
        {/each}
    {:else}
        <p>Geen hoofdstukken gevonden.</p>
    {/if}
</div>

