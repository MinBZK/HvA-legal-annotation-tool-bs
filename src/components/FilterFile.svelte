<script lang="ts">
    import { derived } from 'svelte/store';
    import documentStore from '../stores/DocumentStore.ts';
    import { selectedChaptersStore }  from '../stores/SelectedChapterStore.ts';


    const chaptersStore = derived(documentStore, $documentStore =>
        $documentStore.chapterTitles || []
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
    <div class="mb-5">
        <p class="text-surface-300">Selecteer de hoofdstukken die je wilt annoteren.</p>
    </div>
    {#if $chaptersStore.length > 0}
        {#each $chaptersStore as chapterTitle, index (chapterTitle)}
            <div class="flex items-center mb-8">
                <input
                        type="checkbox"
                        id={`chapter-${index}`}
                        class="checkbox mr-3 min-w-[1.3rem] min-h-[1.3rem]"
                        on:change={(e) => handleCheckboxChange(index, e)}
                >
                <label for={`chapter-${index}`} class="ml-2 cursor-pointer">{chapterTitle}</label>
            </div>
        {/each}
    {:else}
        <p>Geen hoofdstukken gevonden.</p>
    {/if}
</div>

