<script lang="ts">
	import {
		Table,
		getModalStore,
		type TableSource,
		tableMapperValues
	} from '@skeletonlabs/skeleton';

	// local
	const modalStore = getModalStore();

	const auditLog = [
		{ id: 1, name: 'Bill', date: '01-01-2001' },
		{ id: 2, name: 'John', date: '03-03-2003' },
		{ id: 3, name: 'James', date: '05-05-2005' }
	];

	const tableLog: TableSource = {
		head: ['Name', 'Date'],
		body: tableMapperValues(auditLog, ['name', 'date'])
	};
</script>

<!-- @component component for displaying the audit log. -->

{#if $modalStore[0]}
	<div class="w-1/2">
        <h2 class="h2 font-mono">File History</h2>
		<Table source={tableLog} interactive={true} />
	</div>
{/if}
