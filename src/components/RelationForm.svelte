<script lang="ts">
    import Button from "./UI/Button.svelte";
	import { Label } from "./models/Label";
    import { Relation } from "./models/Relation";
	import { loadLabels } from "./server";
    export let show = false;
    export let onSubmit: Function;
    export let newRelation = new Relation(
        99, 
        new Label(1, "abc", "abc", null as any, "abc"),
        new Label(2, "abc", "abc", null as any, "abc"),
        "abc"
    );

    function cancel() {
        show = false;
    }
</script>

<div class="pt-5">
    {#if show}
        <input bind:value={newRelation.label1.name} type="text" placeholder="Label 1" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <input bind:value={newRelation.description} type="text" placeholder="Description" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <input bind:value={newRelation.label2.name} type="text" placeholder="Label 2" class="border border-gray-400 rounded-lg p-2 mb-2" />

        <Button type="green" text="Submit" onClickAction={() => onSubmit(newRelation)} />

        <Button type="red" text="Cancel" onClickAction={cancel} />
    {:else}
        <Button type="green" text="Add relation" onClickAction={() => show = true} />
    {/if}
</div>