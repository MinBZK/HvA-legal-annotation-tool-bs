<script lang="ts">
	import { onMount } from "svelte";
    import RelationForm from "./RelationForm.svelte";
    import { Label, Relation, loadRelations as load } from "./classes";

    export let relationArray: Relation[] = []; 
    export let newRelation = new Relation(
        99, 
        new Label(99, "abc", "abc", null as any, "abc"), 
        new Label(99, "abc", "abc", null as any, "abc"), 
        "abc");
    let show = false;

    export function addRelation(relation: Relation) {
        console.log(relation);
        relationArray = [...relationArray, relation];
        show = false;
    }

    onMount(() => {
        relationArray = load();
    });
</script>

<div>
    <table class="table-auto">
        <thead>
            <tr>
                <th class="px-4 py-2">Label 1</th>
                <th class="px-4 py-2">Description</th>
                <th class="px-4 py-2">Label 2</th>
                <th class="px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each relationArray as relation}
                <tr>
                    <td class="border px-4 py-2">{relation.getLabel1().getName()}</td>
                    <td class="border px-4 py-2">{relation.getDescription()}</td>
                    <td class="border px-4 py-2">{relation.getLabel2().getName()}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Edit
                        </button>
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Delete
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
    <RelationForm show={show} newRelation={newRelation} onSubmit={() => addRelation(newRelation)} />
</div>