<script lang="ts">
	import { derived } from 'svelte/store';
	import { documentStore } from '../stores/DocumentStore.ts';
	import { selectedChaptersStore } from '../stores/SelectedChapterStore.ts';

    const chaptersStore = derived(documentStore, $documentStore =>
        $documentStore.chapterTitles || []
    );

    let selectAll = false;

    function toggleSelectAll() {
        if (selectAll) {
            selectedChaptersStore.set(new Set());
        } else {
            selectedChaptersStore.set(new Set($chaptersStore));
        }
        selectAll = !selectAll;
    }

    function handleCheckboxChange(chapterIndex, event) {
        selectedChaptersStore.update(currentSelection => {
            const newSelection = new Set(currentSelection);
            if (event.target.checked) {
                newSelection.add(chapterIndex);
            } else {
                newSelection.delete(chapterIndex);
            }
            selectAll = newSelection.size === $chaptersStore.length;
            return newSelection;
        });
    }

    $: selectAll = $selectedChaptersStore.size === $chaptersStore.length;
</script>

<div class="mt-10 ml-5">
    <div class="mb-5">
        <p class="text-gray-500 mb-5">Selecteer de hoofdstukken die je wilt annoteren.</p>
        <div class="flex">
            <input
                    class="checkbox mr-3 min-w-[1.3rem] min-h-[1.3rem] mb-2"
                    type="checkbox"
                    bind:checked={selectAll}
                    on:change={toggleSelectAll}
                    name="selectAll"
                    id="selectAll">
            <label for="selectAll" class="ml-2 cursor-pointer font-medium">Selecteer alles</label>
        </div>
    </div>
    {#if $chaptersStore.length > 0}
        {#each $chaptersStore as chapterTitle, index (chapterTitle)}
            <div class="flex items-center mb-8 ml-5">
                <input
                        type="checkbox"
                        id={`chapter-${index}`}
                        class="checkbox mr-3 min-w-[1.3rem] min-h-[1.3rem]"
                        on:change={(e) => handleCheckboxChange(index, e)}
                        checked={$selectedChaptersStore.has(chapterTitle)}
                >
                <label for={`chapter-${index}`} class="ml-2 cursor-pointer">{chapterTitle}</label>
            </div>
        {/each}
    {:else}
        <p>Geen hoofdstukken gevonden.</p>
    {/if}
</div>
