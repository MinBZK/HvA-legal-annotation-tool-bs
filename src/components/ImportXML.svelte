<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { documentStore } from '../stores/DocumentStore';
	import { annotationStore } from '../stores/AnnotationStore';
	import Fa from 'svelte-fa';
	import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
	import { xml2js } from 'xml-js';
	import { createEventDispatcher } from 'svelte';
	import LegalDocument from '../models/LegalDocument';
	import logStore from '../stores/LogStore';
	import { titleStore } from '../stores/TitleStore';

	let fileContent: {};

	const dispatch = createEventDispatcher();

	function onChangeHandler(e: Event): void {
		const input = e.target as HTMLInputElement;
		const file = input.files ? input.files[0] : null;

		if (file && file.type === 'text/xml') {
			const reader = new FileReader();

			reader.onload = function (event) {
				const content = event.target?.result as string;
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

	// Converts XML to a LegalDocument model, if the file is a reimport, it is parsed by parseLAT().
	function convertXMLtoObj(xml: string, filename: string): void {
		// Checks to see if file is a reimport (i.e. a file prepended with LAT_)
		if (filename.startsWith('LAT_')) {
			parseLAT(filename, xml);
			return;
		}

		const result = xml2js(xml, { compact: true }) as any;

		const title = result?.toestand?.wetgeving?.citeertitel?._text || 'No Title';
		const trimmedTitle = title.trim().replace(/\n/g, ' ');
		const chapterElements = result?.toestand?.wetgeving?.['wet-besluit']?.wettekst?.hoofdstuk ||
				result?.toestand?.wetgeving?.['wet-besluit']?.wettekst?.deel?.hoofdstuk ||
				result?.toestand?.wetgeving?.['wet-besluit']?.wettekst?.artikel;

		let chapterTitles: string[] = [];
		let chapterContents: string[] = [];

		if (chapterElements) {
			if (Array.isArray(chapterElements)) {
				chapterElements.forEach((hoofdstuk) => {
					chapterTitles.push(collectText(hoofdstuk.kop).join(' '));
					chapterContents.push(collectText(hoofdstuk.paragraaf).join(' '));
					chapterContents.push(collectText(hoofdstuk).join(' '));
				});
			} else {
				chapterTitles.push(collectText(chapterElements.kop).join(' '));
				chapterContents.push(collectText(chapterElements.paragraaf).join(' '));
				chapterContents.push(collectText(chapterElements).join(' '));
			}
		}

		const data = new LegalDocument(trimmedTitle, filename, chapterTitles, chapterContents, [], []);

		documentStore.set(data);
		titleStore.set(trimmedTitle);
		console.dir($titleStore);


		localStorage.setItem('legal-document', JSON.stringify(data));
		fileContent = $documentStore;
		dispatch('fileUploaded', fileContent);
	}

	// Parses a document with the LAT_ prepend, mapping it to the LegalDocument model
	function parseLAT(filename: string, xml: string): void {
		filename = filename.substring(4);
		// In case of duplication on client-side, removes the (1), (2)... etc.
		filename = filename.replace(/ *\([^)]*\) */g, '');
		const result = xml2js(xml, { compact: true }) as any;

		const title = result.xml.title._text || '';
		const chaptertitles = result.xml.chapterTitles
			? result.xml.chapterTitles.map((item: any) => item._text)
			: [];

		const chapterContents = result.xml.chapterContents
			? result.xml.chapterContents.map((item: any) => item._text)
			: [];

		let annotations = result.xml.annotations;
		if (!Array.isArray(annotations)) annotations = [annotations];

		if (annotations[0] === undefined) {
			annotations = [];
		} else {
			annotations = annotations.map((item: any) => {
				return {
					id: item.id._text,
					text: item.text._text,
					label: item.label
						? [
								{
									id: item.label.id._text,
									name: item.label.name._text,
									color: item.label.color._text
								}
						  ]
						: [],
					comment: {
						commentId: item.comment.commentId._text,
						comment: item.comment.comment._text,
						creationDate: new Date(item.comment.creationDate._text)
					},
					definition: {
						definitionId: item.definition.definitionId._text,
						definition: item.definition.definition._text,
						creationDate: new Date(item.definition.creationDate._text)
					},
					relationships: item.relationships
						? [
								{
									type: item.relationships.type._text,
									source: item.relationships.source._text,
									target: item.relationships.target._text
								}
						  ]
						: [],
					startPosition: item.startPosition._text,
					endPosition: item.endPosition._text
				};
			});
		}

		let editHistory = result.xml.history;
		if (!Array.isArray(editHistory)) editHistory = [editHistory];

		if (editHistory[0].user._text === undefined) {
			editHistory = [];
		} else {
			editHistory = editHistory.map((item: any) => {
				return {
					user: item.user._text,
					date: new Date(item.date._text)
				};
			});
		}

		const reimport = new LegalDocument(
			title,
			filename,
			chaptertitles,
			chapterContents,
			annotations,
			editHistory
		);

		documentStore.set(reimport);
		annotationStore.set(annotations);
		logStore.set(editHistory);
		titleStore.set(title);

		localStorage.setItem('legal-document', JSON.stringify(reimport));
		fileContent = $documentStore;
		dispatch('fileUploaded', fileContent);
		return;
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