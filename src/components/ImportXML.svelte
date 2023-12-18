<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { fileContentStore } from '../stores/fileStore';
	import objStore from '../stores/ObjStore';
	import Fa from 'svelte-fa';
	import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
	import { xml2js } from 'xml-js';
	import { createEventDispatcher } from 'svelte';

	let fileContent: {};

	const dispatch = createEventDispatcher();

	function onChangeHandler(e: Event): void {
		const input = e.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;

		if (file && file.type === 'text/xml') {
			const reader = new FileReader();

			reader.onload = function (event) {
				const content = event.target?.result as string;
				fileContentStore.set(content);
				localStorage.setItem('uploadedXML', content);
				convertXMLtoObj(content, file.name);
			};

			reader.onerror = function () {
				console.error('File could not be read!');
			};

			reader.readAsText(file);
		} else {
			alert('AUB alleen een .xml bestand uploaden.');
		}
	}

	function collectText(obj: any, prevKey: string = ''): string[] {
		let texts: string[] = [];
		for (let key in obj) {
			if (key === '_text') {
				const shouldNotAppendNewline = ['lidnr', 'li.nr'].includes(prevKey) || obj[key].trim().match(/^[0-9]+\.$/);
				texts.push(obj[key] + (shouldNotAppendNewline ? '' : '\n'));
			} else if (typeof obj[key] === 'object') {
				texts = texts.concat(collectText(obj[key], key));
			}
		}
		return texts;
	}


	function convertXMLtoObj(xml: string, filename: string): void {
		const result = xml2js(xml, { compact: true }) as any;
		const title = result.artikel.kop._text;
		const textContent = collectText(result.artikel).join('');

		const data = {
			document: [
				{
					title: title,
					filename: filename,
					text: textContent,
					annotations: []
				}
			]
		};

		objStore.set(data);
		localStorage.setItem('data', JSON.stringify(data, null, 2));
		fileContent = $objStore;
		dispatch('fileUploaded', fileContent);
	}
</script>

<FileDropzone class="m-5 w-[50vh] h-[25vh]" name="file" on:change={onChangeHandler}>
	<svelte:fragment slot="lead">
		<div style="font-size: 3em;" class="flex justify-center items-center">
			<Fa icon={faFileUpload} />
		</div>
	</svelte:fragment>
	<svelte:fragment slot="message">Sleep hier je bestand of klik om te uploaden</svelte:fragment>
	<svelte:fragment slot="meta">
		<div class="text-sm text-gray-300">alleen .XML wordt ondersteund.</div>
	</svelte:fragment>
</FileDropzone>
