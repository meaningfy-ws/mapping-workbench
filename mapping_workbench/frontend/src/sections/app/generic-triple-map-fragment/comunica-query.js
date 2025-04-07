const {newEngine} = require('@comunica/query-sparql');

const comunicaQuery = (rdfData) => {
    const myEngine = newEngine();

    (async () => {
        const result = await myEngine.query(`
    PREFIX ex: <http://example.org/>
    SELECT ?person WHERE {
      ex:John ex:knows ?person .
    }
  `, {
            sources: [{type: 'string', value: rdfData, mediaType: 'text/turtle'}]
        });

        result.bindingsStream.on('data', (binding) => {
            console.log(`John knows: ${binding.get('?person').value}`);
        });

        result.bindingsStream.on('end', () => {
            console.log('Query finished.');
        });
    })();
}

export default comunicaQuery