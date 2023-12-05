<script lang="ts">
    export let onClickAction: Function;
    export let type: string;
    export let text: string;
</script>

<div>
    <button on:click={() => onClickAction()} 
        class='text-white font-bold py-2 px-4 rounded'
        class:bg-green-500={type === 'green'}
        class:hover:bg-green-700={type === 'green'}

        class:bg-red-500={type === 'red'}
        class:hover:bg-red-700={type === 'red'}

        class:bg-blue-500={type === 'blue'}
        class:hover:bg-blue-700={type === 'blue'}>
        {text}
    </button>
</div>