<script lang="ts">
    import Button from "./UI/Button.svelte";
	import { Label } from "./models/Label";
    import { Relation } from "./models/Relation";
	import { loadLabels, loadRelationsText } from "./server";

    export let forLabel: Label;
    export let show = false;
    export let onSubmit: Function;
    export let newRelation = new Relation(
        99, 
        forLabel,
        new Label(2, "abc", "abc", null as any, "abc"),
        "abc"
    );
</script>

<div class="pt-5">
    {#if show}
        <input hidden bind:value={forLabel} type="text" placeholder="Label 1" class="border border-gray-400 rounded-lg p-2 mb-2" />
        <h1>{forLabel.getName()}</h1>

        <select bind:value={newRelation.description} placeholder="Description" class="border border-gray-400 rounded-lg p-2 mb-2">
            {#each loadRelationsText() as desc}
                <option value={desc}>{desc}</option>
            {/each}
        </select>

        <select bind:value={newRelation.label2} placeholder="Label 2" class="border border-gray-400 rounded-lg p-2 mb-2">
            {#each loadLabels() as lab}
                <option value={lab}>{lab.getName()}</option>
            {/each}
        </select>

        <Button type="green" text="Submit" onClickAction={() => {
            onSubmit(newRelation);
            show = false;
        }} />

        <Button type="red" text="Cancel" onClickAction={() => show = false} />
    {:else}
        <Button type="green" text="Add relation" onClickAction={() => show = true} />
    {/if}
</div>