<script lang="ts">
    import { derived } from 'svelte/store';
    import { documentStore } from '../stores/DocumentStore.ts';
    import { selectedChaptersStore } from '../stores/SelectedChapterStore.ts';

    const chaptersStore = derived(documentStore, $documentStore =>
        $documentStore.chapterTitles || []
    );

    let selectAll = false;

    $: selectAll = $selectedChaptersStore.length === $chaptersStore.length;

    function toggleSelectAll() {
        if (selectAll) {
            selectedChaptersStore.set([]);
        } else {
            selectedChaptersStore.set([...$chaptersStore]);
        }
        selectAll = !selectAll;
    }

    function handleCheckboxChange(chapterIndex, event) {
        selectedChaptersStore.update(currentSelection => {
            const newSelection = [...currentSelection];
            const indexInArray = newSelection.indexOf(chapterIndex);
            if (event.target.checked) {
                if (indexInArray === -1) newSelection.push(chapterIndex);
            } else {
                if (indexInArray !== -1) newSelection.splice(indexInArray, 1);
            }
            return newSelection;
        });
    }
</script>

<div class="mt-10 ml-5">
    <div class="mb-5">
        <p class="text-slate-300 mb-5">Selecteer de hoofdstukken die je wilt annoteren.</p>
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
                        checked={$selectedChaptersStore.includes(index.toString())}
                >
                <label for={`chapter-${index}`} class="ml-2 cursor-pointer">{chapterTitle}</label>
            </div>
        {/each}
    {:else}
        <p>Geen hoofdstukken gevonden.</p>
    {/if}
</div>
