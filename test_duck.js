const { image_search } = require('duckduckgo-images-api');
async function test() {
    try {
        const results = await image_search({ query: "birds", moderate: true });
        console.log(results[0].image);
    } catch(e) {
        console.log("Error", e);
    }
}
test();
