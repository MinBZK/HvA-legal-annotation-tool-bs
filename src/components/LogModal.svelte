<script lang="ts">
	import {
		Table,
		getModalStore,
		type TableSource,
		tableMapperValues
	} from '@skeletonlabs/skeleton';
	import logStore from '../stores/LogStore';
	import type EditHistory from '../models/EditHistory';
	import type { SvelteComponent } from 'svelte';

	// local
	const modalStore = getModalStore();

	let auditLog: EditHistory[] = [];

	auditLog = $logStore;

	const tableLog: TableSource = {
		head: ['Name', 'Date'],
		body: tableMapperValues(auditLog, ['user', 'date'])
	};
</script>

<!-- @component component for displaying the audit log. -->

{#if $modalStore[0]}
	<div class="w-1/2">
		<h2 class="h2 font-mono">File History</h2>
		<Table source={tableLog} interactive={true} />
	</div>
{/if}
