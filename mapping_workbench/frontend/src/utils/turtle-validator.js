import {Parser} from 'n3';

const turtleValidator = async (content) => {

    const parser = new Parser();
    let res
    try {
        await parser.parse(content, (error, quad, prefixes) => {
            if (error) {
                // throw new Error(`Syntax error in Turtle file: ${error.message}`);
                res = {error: `Syntax error in Turtle file: ${error.message}`}
            } else
                res = {success: "TTL file is valid."}

            if (quad) {
                // Optionally validate the quad here.
                console.log(`Valid triple: ${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`);
            }
            if (!quad && prefixes) {
                // All triples have been processed, output prefixes.
                console.log('Prefixes:', prefixes);
            }
        });

    } catch (err) {
        console.error(`Error: ${err.message}`);
    }
    return res
}

export default turtleValidator