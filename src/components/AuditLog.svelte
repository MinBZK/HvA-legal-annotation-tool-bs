<script lang="ts">
	import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import LogModal from '../components/LogModal.svelte';
	import {
		getModalStore,
		initializeStores,
		Modal,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	initializeStores();

	const modalStore = getModalStore();

	const modalComponent: ModalComponent = { ref: LogModal };

	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	function handleClick(): void {
		modalStore.trigger(modal);
	}
</script>

<Modal />
<button
	title="File History"
	class="btn btn-lg variant-filled-tertiary rounded-md"
	on:click={() => handleClick()}
	type="button"
>
	<Fa size="1.5x" icon={faClockRotateLeft} class="text-surface-900" />
</button>
