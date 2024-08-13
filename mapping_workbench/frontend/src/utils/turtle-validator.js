import {Parser} from 'n3';

const turtleValidator = async (content) => {

    const parser = new Parser();



        await parser.parse(content, (error, quad, prefixes) => {
                if (error) {
                    console.log(error.message)
                    throw new Error(error.message)
                    // throw `Syntax error in Turtle file: ${error.message}`
                    // throw new Error(`Syntax error in Turtle file: ${error.message}`);
                }
                if (quad) {
                    // Here, you can validate the quad (subject, predicate, object, graph)
                    console.log(`Valid triple: ${quad.subject.value} ${quad.predicate.value} ${quad.object.value}`);
                }
                if (!quad && prefixes) {
                    // All triples have been processed
                    console.log('Prefixes:', prefixes);
                }
        });
            return "TTL file is valid."

        // throw new Error(err.message)
        // console.log('catch', err);
}

export default turtleValidator