export const extractNamespaces = (doc) => {
    const root = doc.documentElement;
    const attributes = root.attributes;
    const namespaces = {};

    for (let attr of attributes) {
        if (attr.name.startsWith('xmlns:')) {
            const prefix = attr.name.split(':')[1];
            namespaces[prefix] = attr.value;
        }
    }

    return namespaces;
}

export const getAbsoluteXPath = (node) => {
    if (node?.nodeType !== Node.ELEMENT_NODE) {
        return '';
    }
    const parts = [];
    while (node?.nodeType === Node.ELEMENT_NODE) {
        const nodeName = node.nodeName;
        parts.unshift(nodeName);
        node = node.parentNode;
    }
    return `${parts.join('/')}`;
}

export const executeXPaths = (doc, xPaths) => {
    const namespaces = extractNamespaces(doc);

    const nsResolver = (prefix) => namespaces[prefix] || null;

    const evaluatedNamespaces = []

    xPaths.forEach(xPath => {
        try {
            const evaluated = doc.evaluate(
                xPath.absolute_xpath,
                doc,
                nsResolver,
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                null,
            );


            if (evaluated.snapshotLength > 0) {
                // for (let i = 0; i < evaluated.snapshotLength; i++) {
                //     const node = evaluated.snapshotItem(i);
                //     const absoluteXPath = getAbsoluteXPath(node);
                //     evaluatedNamespaces.push({...xPath, resolved_xpath: absoluteXPath})
                // }
                const node = evaluated.snapshotItem(0);
                const absoluteXPath = getAbsoluteXPath(node);
                evaluatedNamespaces.push({...xPath, resolved_xpath: absoluteXPath})
            } else {
                // console.log('No nodes found.');
            }

        } catch (err) {
            // console.log(err)
        }
    })
    return evaluatedNamespaces.map(e => {
        const shifted = e.resolved_xpath.split('/')
        shifted.shift()
        return {...e, resolved_xpath: shifted.join('/')}
    })
}


