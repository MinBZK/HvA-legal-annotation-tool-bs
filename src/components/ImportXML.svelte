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

	function collectText(obj: any, prevKey: string = '', excludeTags = ['meta-data']): string[] {
		let texts: string[] = [];
		let isKopTag = prevKey === 'kop';

		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (excludeTags.includes(prevKey)) {
					continue;
				}

				if (key === '_text' && typeof obj[key] === 'string') {
					let text = obj[key];
					if (isKopTag) {
						text = text.trim() + ' ';
					}
					texts.push(text);
				} else if (typeof obj[key] === 'object') {
					const childTexts = collectText(obj[key], key, excludeTags);
					if (isKopTag && childTexts.length > 0) {
						childTexts[childTexts.length - 1] = childTexts[childTexts.length - 1].trim() + ' ';
					}
					texts = texts.concat(childTexts);
				}
			}
		}

		if (isKopTag && texts.length > 0) {
			texts[texts.length - 1] = texts[texts.length - 1].trim();
			texts.push('\n');
		}

		return texts;
	}

	function convertXMLtoObj(xml: string, filename: string): void {
		const result = xml2js(xml, { compact: true }) as any;
		const title = result?.toestand?.wetgeving?.citeertitel?._text || 'No Title';
		const chapterElements = result?.toestand?.wetgeving?.["wet-besluit"]?.wettekst?.hoofdstuk;

		let chapterTitles: string[] = [];
		let chapterContents: string[] = [];

		if (chapterElements) {
			if (Array.isArray(chapterElements)) {
				chapterElements.forEach(hoofdstuk => {
					chapterTitles.push(collectText(hoofdstuk.kop).join(' '));
					chapterContents.push(collectText(hoofdstuk.paragraaf).join(' '));
				});
			}
			else {
				chapterTitles.push(collectText(chapterElements.kop).join(' '));
				chapterContents.push(collectText(chapterElements.paragraaf).join(' '));
			}
		}

		const data = {
			document: [
				{
					title: title,
					filename: filename,
					chapterTitles: chapterTitles,
					chapterContents: chapterContents,
					annotations: []
				}
			]
		};

		console.log(data.document[0].chapterContents);

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
