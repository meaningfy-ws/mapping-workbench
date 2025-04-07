import {Parser} from 'n3'

const rdfToJson = (rdfData) => {

    const parser = new Parser();
    const quads = parser.parse(rdfData);

// Convert to a simple JSON structure
//     const jsonResult = quads.map(quad => ({
//         subject: quad.subject.value,
//         predicate: quad.predicate.value,
//         object: quad.object.value,
//     }));

    // console.log(JSON.stringify(jsonResult, null, 2));


    console.log(quads)
    quads.forEach(triple => {
        console.log(`${triple.subject.toString()} ${triple.predicate.toString()} ${triple.object.toString()}`);
    });
}

export default rdfToJson