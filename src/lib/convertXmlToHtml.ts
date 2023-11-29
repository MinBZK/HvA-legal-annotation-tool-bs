function convertXmlToHtml(xmlString: any) {
    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Function to process each node
    const processNode = (node:any) => {
        let html = '';
        if (node.nodeType === Node.ELEMENT_NODE) {
            // Handle element node
            html += `<span class="xml-tag">&lt;${node.nodeName}</span>`;
            if (node.attributes) {
                Array.from(node.attributes).forEach(attr => {
                    // @ts-ignore
                    html += ` <span class="xml-attribute">${attr.name}</span>=<span class="xml-value">"${attr.value}"</span>`;
                });
            }
            html += `<span class="xml-tag">&gt;</span>`;
            Array.from(node.childNodes).forEach(child => {
                html += processNode(child); // Recursive call for child nodes
            });
            html += `<span class="xml-tag">&lt;/${node.nodeName}&gt;</span>`;
        } else if (node.nodeType === Node.TEXT_NODE) {
            // Handle text node
            html += `<span class="xml-text">${node.textContent}</span>`;
        }
        return html;
    };

    // Start processing from the root node
    return Array.from(xmlDoc.childNodes).map(processNode).join('');
}