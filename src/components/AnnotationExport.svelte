<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import objStore from '../stores/ObjStore';
	const modalStore = getModalStore();

	let data = $objStore;

	function handleClickExport(fileName = '', data: Object) {
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
</script>

<button
	type="button"
	class="btn btn-xl variant-filled sticky bottom-0"
	on:click={() => handleClickExport('data.xml', data)}
	>Export to XML
</button>
