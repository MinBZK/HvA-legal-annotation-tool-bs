<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import objStore from '../stores/ObjStore';
	import { annotationStore } from '../stores/AnnotationStore';
	const modalStore = getModalStore();

	let data = $objStore;

	function handleClickExport(fileName = '', data: Object) {
        // Due to merge request this is not working anymore..
        // if(!checkRelationships()) { 
        //     return;
        // }
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
				fileName = (data as { document: { filename: string }[] }).document[0].filename;
				fileName = 'LAT_' + fileName;
				download(fileName, jsonToXML(data));
			}
		});
	}

	/**
	 * @param {Object} json
	 */

	function jsonToXML(json: Object, indent = 0) {
		let xml = '';
		const indentation = ' '.repeat(indent * 2);

		for (let prop in json) {
			xml += json[prop] instanceof Array ? '' : '\n' + indentation + '<' + prop + '>';
			if (json[prop] instanceof Array) {
				for (let array in json[prop]) {
					xml += '\n' + indentation + '<' + prop + '>';
					xml += jsonToXML(new Object(json[prop][array]), indent + 2);
					xml += '\n' + indentation + '</' + prop + '>';
				}
			} else if (typeof json[prop] == 'object') {
				xml += jsonToXML(new Object(json[prop]), indent + 1);
			} else {
				xml += json[prop];
			}
			xml += json[prop] instanceof Array ? '' : '</' + prop + '>';
		}
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
        annotationStore.subscribe(e => annotations = e);

        let valid = false;

        for(let annotation of annotations) {
            switch(annotation.label.toLowerCase()) {
                case 'rechtsbetrekking':
                    // Check if there is a relationship of 'wie heeft het recht' that has a target of label 'rechtssubject'
                    if(!annotation.relationships.some(r => r.type === 'wie heeft het recht' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'rechtssubject')) {
                        alert(`${annotation.text} misses a relationship of type "wie heeft het recht" with a target of label "rechtssubject"`);
                        return;
                    }
                    // Check the same thing but with 'wie heeft de plicht'
                    if(!annotation.relationships.some(r => r.type === 'wie heeft de plicht' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'rechtssubject')) {
                        alert(`${annotation.text} misses a relationship of type "wie heeft de plicht" with a target of label "rechtssubject"`);
                        return;
                    }
                    // Check if there is a relationship of 'heeft als voorwerp' that has a target of label 'rechtsobject'
                    if(!annotation.relationships.some(r => r.type === 'heeft als voorwerp' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'rechtsobject')) {
                        alert(`${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"`);
                        return;
                    }

                    valid = true;
                    return;
                case 'rechtsfeit':
                    // Check if there is a relationship of 'heeft als voorwerp' that has a target of label 'rechtsobject'
                    if(!annotation.relationships.some(r => r.type === 'heeft als voorwerp' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'rechtsobject')) {
                        alert(`${annotation.text} misses a relationship of type "heeft als voorwerp" with a target of label "rechtsobject"`);
                        return;
                    }
                    // Check if there is a relationship of 'vind plaats op' that has a target of label 'tijdsaanduiding'
                    if(!annotation.relationships.some(r => r.type === 'vind plaats op' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'tijdsaanduiding')) {
                        alert(`${annotation.text} misses a relationship of type "vind plaats op" with a target of label "tijdsaanduiding"`);
                        return;
                    }

                    valid = true;
                    return;
                case 'afleidingsregel':
                    // Check if there is a relationship of 'heeft als uitvoer' that has a target of label 'variabele'
                    if(!annotation.relationships.some(r => r.type === 'heeft als uitvoer' && annotations.find(a => a.id === r.target).label.toLowerCase() === 'variabele')) {
                        alert(`${annotation.text} misses a relationship of type "heeft als uitvoer" with a target of label "variabele"`);
                        return;
                    }

                    valid = true;
                    return;
                default:
                    valid = true;
                    return;
            }
        }

        return false;
    }
</script>

<button
	type="button"
	class="btn btn-xl variant-filled sticky bottom-0"
	on:click={() => handleClickExport('data.xml', data)}
	>Export to XML
</button>
