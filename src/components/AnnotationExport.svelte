<script lang="ts">
	import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import documentStore from '../stores/DocumentStore';
	import { annotationStore } from '../stores/AnnotationStore';
	import type LegalDocument from '../models/LegalDocument';
	import { js2xml } from 'xml-js';
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let data = $documentStore;

	function handleClickExport(fileName = '', data: LegalDocument) {
		// TO-DO: Clarify required relationships, commented out for ease of demo...
		// if(!checkRelationships()) {
		//     return;
		// }

		console.log('TESTING123:  ' + JSON.stringify($annotationStore));

		new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Exporting annotations...',
				body: 'Are you sure you wish to proceed?',
				response: (r: boolean) => resolve(r)
			};
			modalStore.trigger(modal);
		}).then((r) => {
			if (r) {
				data.annotations = $annotationStore;
				fileName = data.filename;
				fileName = 'LAT_' + fileName;
				download(fileName, jsonToXML(data));
			}
		});
	}

	/**
	 * @param {LegalDocument} data
	 */

	function jsonToXML(data: LegalDocument) {
		let obj = {
			xml: {
				title: data.title,
				filename: data.filename,
				chapterTitles: data.chapterTitles,
				chapterContents: data.chapterContents,
				annotations: data.annotations
			}
		}

		let xml = js2xml(obj, { compact: true, spaces: 4 });
		return xml;


		// for (let prop in json) {
		// 	xml += json[prop] instanceof Array ? '' : '\n' + indentation + '<' + prop + '>';
		// 	if (json[prop] instanceof Array) {
		// 		for (let array in json[prop]) {
		// 			xml += '\n' + indentation + '<' + prop + '>';
		// 			xml += jsonToXML(new Object(json[prop][array]), indent + 2);
		// 			xml += '\n' + indentation + '</' + prop + '>';
		// 		}
		// 	} else if (typeof json[prop] == 'object') {
		// 		xml += jsonToXML(new Object(json[prop]), indent + 1);
		// 	} else {
		// 		xml += json[prop];
		// 	}
		// 	xml += json[prop] instanceof Array ? '' : '</' + prop + '>';
		// }
		// console.log("exported DATA: " + JSON.stringify(json))
		// return xml;
	}

	/**
	 * @param {string} filename
	 * @param {string} text
	 */

	function download(filename: string, text: string) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	}

	function checkRelationships() {
		let annotations;
		annotationStore.subscribe((e) => (annotations = e));

		let valid = true;
		let message = 'Not all mandatory relationships are present!';

		if (!annotations.length) {
			message = 'No annotations found';
			valid = false;
		} else {
			for (let annotation of annotations) {
				const annotationLabels = annotation.label.map((l) => l.name.toLowerCase());

				for (let label of annotationLabels) {
					switch (label) {
						case 'rechtsbetrekking':
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'wie heeft het recht' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('rechtssubject')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "wie heeft het recht" with a target of label "rechtssubject"\n`;
								valid = false;
							}
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'wie heeft de plicht' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('rechtssubject')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "wie heeft de plicht" with a target of label "rechtssubject"\n`;
								valid = false;
							}
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'heeft als voorwerp' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('rechtsobject')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"\n`;
								valid = false;
							}
							break;
						case 'rechtsfeit':
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'heeft als voorwerp' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('rechtsobject')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"\n`;
								valid = false;
							}
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'vindt plaats op' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('tijdsaanduiding')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "vind plaats op" with a target of label "tijdsaanduiding"\n`;
								valid = false;
							}
							break;
						case 'afleidingsregel':
							if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'heeft als uitvoer' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('variabele')
								)
							) {
								// message += `${annotation.text} misses a relationship of type "heeft als uitvoer" with a target of label "variabele"\n`;
								valid = false;
							}
							break;
					}
				}
			}
		}

		if (!valid) {
			toastStore.trigger({
				message: message.trim(),
				timeout: 8000
			});
		}

		return valid;
	}
</script>

<div class="ml-10 absolute bottom-0 mx-10 my-5 right-0">
	<button
		type="button"
		class="btn btn-lg variant-filled rounded-md"
		on:click={() => handleClickExport('data.xml', data)}
		>Export to XML
	</button>
</div>
