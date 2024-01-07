<script lang="ts">
    import { derived, writable } from 'svelte/store';
    import objStore from '../stores/ObjStore.ts';
    import {selectedChaptersStore}  from '../stores/SelectedChapterStore.ts';


    const chaptersStore = derived(objStore, $objStore =>
        $objStore.document?.[0]?.chapters || []
    );

    let checkedChapters = writable(new Set());

    const selectAll = derived([chaptersStore, checkedChapters], ([$chaptersStore, $checkedChapters]) =>
        $chaptersStore.length > 0 && $chaptersStore.every(chapter => $checkedChapters.has(chapter))
    );

    function handleCheckboxChange(chapter, event) {
        selectedChaptersStore.update($selectedChapters => {
            const newCheckedChapters = new Set($selectedChapters);
            if (event.target.checked) {
                newCheckedChapters.add(chapter);
            } else {
                newCheckedChapters.delete(chapter);
            }
            return newCheckedChapters;
        });
    }

    function toggleCheckboxes() {
        checkedChapters.update($checkedChapters => {
            if ($selectAll) {
                return new Set();
            } else {
                const newCheckedChapters = new Set();
                $chaptersStore.forEach(chapter => newCheckedChapters.add(chapter));
                return newCheckedChapters;
            }
        });
    }

</script>

<div class="mt-10 ml-5">
    {#if $chaptersStore.length > 0}
        <div class="flex mb-5">
            <input
                    type="checkbox"
                    class="checkbox mr-3"
                    bind:checked={$selectAll}
                    on:click={toggleCheckboxes}
            >
            <label class="font-bold">Selecteer alles</label>
        </div>

        {#each $chaptersStore as chapter}
            <div class="flex items-center mb-8 cursor-pointer">
                <input
                        type="checkbox"
                        id={chapter}
                        class="checkbox mr-3 min-w-[1.3rem] min-h-[1.3rem]"
                        on:change={(e) => handleCheckboxChange(chapter, e)}
                >
                <label for={chapter} class="ml-2">{chapter}</label>
            </div>
        {/each}
    {:else}
        <p>Geen hoofdstukken gevonden.</p>
    {/if}
</div>

