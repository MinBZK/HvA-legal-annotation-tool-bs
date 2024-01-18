<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { documentStore } from '../stores/DocumentStore';
	import { annotationStore } from '../stores/AnnotationStore';
	import type LegalDocument from '../models/LegalDocument';
	import { js2xml } from 'xml-js';
	import Fa from 'svelte-fa';
	import { faDownload } from '@fortawesome/free-solid-svg-icons';
	const modalStore = getModalStore();

    let message = 'Not all mandatory relationships are present!<br>';

	function handleClickExport(fileName = '', data: LegalDocument) {
		// TO-DO: Clarify required relationships, commented out for ease of demo...
		let valid: boolean = checkRelationships();

		new Promise<boolean>((resolve) => {
            const body = valid ? 'Are you sure you wish to proceed?' : ("Are you sure you wish to proceed?" + message);
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Exporting annotations...',
				body: body,
				response: (r: boolean) => resolve(r)
			};
			modalStore.trigger(modal);
		}).then((r) => {
			if (r) {
				const modal: ModalSettings = {
					type: 'prompt',
					title: 'What is your name?',
					body: 'Provide your full name in the field below.',
					valueAttr: {
						type: 'text',
						placeholder: 'Full name',
						class: 'input p-2',
						minlength: 3,
						maxlength: 50,
						required: true
					},
					response: (r: string) => {
						if (r) {
							if (!data.history) data.history = [];
							data.history.push({ user: r, date: new Date() });
							data.annotations = $annotationStore;
							fileName = data.filename;
							fileName = 'LAT_' + fileName;
							download(fileName, jsonToXML(data));
						}
					}
				};
				modalStore.trigger(modal);
			}
		});
	}

	/**
	 * @param {LegalDocument} data
	 */

	function jsonToXML(data: LegalDocument) {
		let history = data.history.map((h) => {
			return {
				user: h.user,
				date: h.date.toISOString()
			};
		});

		let obj = {
			xml: {
				title: data.title,
				filename: data.filename,
				chapterTitles: data.chapterTitles,
				chapterContents: data.chapterContents,
				annotations: data.annotations,
				history: history
			}
		};

		let xml = js2xml(obj, { compact: true, spaces: 4 });
		return xml;
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

		if (!annotations.length) {
			message = 'No annotations found<br>';
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
								message += `${annotation.text} misses a relationship of type "wie heeft het recht" with a target of label "rechtssubject"<br>`;
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
								message += `${annotation.text} misses a relationship of type "wie heeft de plicht" with a target of label "rechtssubject"<br>`;
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
								message += `${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"<br>`;
								valid = false;
							}

                            // Check if there is no more than 1 relationship for:
                            // rechtsbetrekking -> wie heeft het recht
                            // rechtsbetrekking -> wie heeft de plicht
                            // rechtsbetrekking -> heeft als voorwerp

                            if(annotation.relationships.filter(r => r.type === 'wie heeft het recht').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "wie heeft het recht"<br>`;
                                valid = false;
                            }

                            if(annotation.relationships.filter(r => r.type === 'wie heeft de plicht').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "wie heeft de plicht"<br>`;
                                valid = false;
                            }

                            if(annotation.relationships.filter(r => r.type === 'heeft als voorwerp').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "heeft als voorwerp"<br>`;
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
								message += `${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"<br>`;
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
								message += `${annotation.text} misses a relationship of type "vind plaats op" with a target of label "tijdsaanduiding"<br>`;
								valid = false;
							}

                            // Check if there is no more than 1 relationship for:
                            // rechtsfeit -> heeft als voorwerp
                            // rechtsfeit -> vindt plaats op

                            if(annotation.relationships.filter(r => r.type === 'heeft als voorwerp').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "heeft als voorwerp"<br>`;
                                valid = false;
                            }

                            if(annotation.relationships.filter(r => r.type === 'vindt plaats op').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "vindt plaats op"<br>`;
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
								message += `${annotation.text} misses a relationship of type "heeft als uitvoer" with a target of label "variabele"<br>`;
								valid = false;
							}
                            if (
								!annotation.relationships.some(
									(r) =>
										r.type === 'gebruikt' &&
										annotations
											.find((a) => a.id === r.target)
											?.label.map((l) => l.name.toLowerCase())
											.includes('operator')
								)
							) {
								message += `${annotation.text} misses a relationship of type "gebruikt" with a target of label "operator"<br>`;
								valid = false;
							}

                            // Check if there is no more than 1 relationship for:
                            // afleidingsregel -> heeft als uitvoer

                            if(annotation.relationships.filter(r => r.type === 'heeft als uitvoer').length > 1) {
                                message += `${annotation.text} has more than 1 relationship of type "heeft als uitvoer"<br>`;
                                valid = false;
                            }

							break;
					}
				}
			}
		}

		return valid;
	}
</script>

<button
	title="Export File"
	type="button"
	class="btn btn-lg variant-filled-primary rounded-md"
	on:click={() => handleClickExport('data.xml', $documentStore)}
>
	<Fa size="1.5x" icon={faDownload} />
</button>
