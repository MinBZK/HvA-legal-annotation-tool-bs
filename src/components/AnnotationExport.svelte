<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { documentStore } from '../stores/DocumentStore';
	import { annotationStore } from '../stores/AnnotationStore';
	import type LegalDocument from '../models/LegalDocument';
	import { js2xml } from 'xml-js';
	import Fa from 'svelte-fa';
	import { faDownload } from '@fortawesome/free-solid-svg-icons';
	const modalStore = getModalStore();

    let message = 'Niet alle verplichte relaties tussen labels zijn aanwezig!<br>';

	function handleClickExport(fileName = '', data: LegalDocument) {
		let valid: boolean = checkRelationships();

		new Promise<boolean>((resolve) => {
            const body = valid ? 'Weet u zeker dat u door wilt gaan?' : ('Weet u zeker dat u door wilt gaan?<br>' + message);
			const modal: ModalSettings = {
				type: 'confirm',
				title: 'Annotaties exporteren...',
                buttonTextCancel: "Annuleren", 
                buttonTextConfirm: "Bevestigen", 
				body: body,
				response: (r: boolean) => resolve(r)
			};
			modalStore.trigger(modal);
		}).then((r) => {
			if (r) {
				const modal: ModalSettings = {
					type: 'prompt',
					title: 'Wat is uw naam?',
					body: 'Vul in het onderstaande veld uw volledige naam in.',
					valueAttr: {
						type: 'text',
						placeholder: 'Volledige naam',
						class: 'input p-2',
						minlength: 3,
						maxlength: 50,
						required: true
					},
                    buttonTextCancel: "Annuleren", 
                    buttonTextSubmit: "Exporteren", 
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
			message = 'Er zijn nog geen annotaties<br>';
			valid = false;
		} else {
			for (let annotation of annotations) {
                /** 
                 * Checks if the annotation has more than the maxCount relationships of the given type
                 * @param {string} type
                 * @param {number} maxCount
                 * @returns {void}
                 */
                const checkMaxRelationships = (type: string, maxCount: number) => {
                    if (
                        annotation.relationships.filter((r: { type: string }) => r.type === type).length >
                        maxCount
                    ) {
                        message += `"${annotation.text}" heeft meer dan ${maxCount} relatie(s) van het type "${type}"<br>`;
                        valid = false;
                    }
                };

                /** 
                 * Checks if the annotation has a relationship of the given type with a target of the given label
                 * @param {string} type
                 * @param {string} targetLabel
                 * @returns {void}
                 */
                const checkRelationship = (type: string, targetLabel: string) => {
                    if (
                        !annotation.relationships.some(
                            (r: { type: any; target: any }) =>
                                r.type === type && annotations
                                    .find((a: { id: any }) => a.id === r.target)
                                    ?.label.map((l: { name: string }) => l.name.toLowerCase())
                                    .includes(targetLabel)
                                    )
                            ) {
                                message += `"${annotation.text}" mist een relatie van het type "${type}" met een andere annotatie met het label "${targetLabel}"<br>`;
                                valid = false;
                            }
                    };

				const annotationLabels = annotation.label.map((l) => l.name.toLowerCase());

				for (let label of annotationLabels) {
					switch (label) {
						case 'rechtsbetrekking':
                            checkRelationship('wie heeft het recht', 'rechtssubject');
                            checkRelationship('wie heeft de plicht', 'rechtssubject');
                            checkRelationship('heeft als voorwerp', 'rechtsobject');
                            checkMaxRelationships('wie heeft het recht', 1);
                            checkMaxRelationships('wie heeft de plicht', 1);
                            checkMaxRelationships('heeft als voorwerp', 1);
                            break;
						case 'rechtsfeit':
                            checkRelationship('heeft als voorwerp', 'rechtsobject');
                            checkRelationship('vindt plaats op', 'tijdsaanduiding');
                            checkMaxRelationships('heeft als voorwerp', 1);
                            checkMaxRelationships('vindt plaats op', 1);
                            break;
						case 'afleidingsregel':
                            checkRelationship('heeft als uitvoer', 'variabele');
                            checkRelationship('gebruikt', 'operator');
                            checkMaxRelationships('heeft als uitvoer', 1);
                            break;
					}
				}
			}
		}

		return valid;
	}
</script>

<button
	title="Exporteer Bestand"
	type="button"
	class="btn btn-lg variant-filled-primary rounded-md"
	on:click={() => handleClickExport('data.xml', $documentStore)}
>
	<Fa size="1.5x" icon={faDownload} class="text-surface-900" />
</button>
