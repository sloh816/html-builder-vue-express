const { unzip } = require("unzipper");
const WordDocument = require("./models/wordDocument");
const { readStyles } = require("./utils/unzipDocx");
const Publication = require("./models/publication");

const main = async () => {
    const publicationId = "2024-07-13_02-26-29_5043-anrows-fitzgibbon-rr2-v1e-client-reviewed";
    const publication = new Publication(publicationId);
    await publication.setProperties();
    console.log(publication.print());

    // // create the stylesheet from unzipped word

    // const wordDocument = new WordDocument(`db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed.docx`);
    // const unzippedWordFolder = `db/publications/${publicationId}/input/5043 - ANROWS - FitzGibbon RR2 - v1e - client reviewed`;
    // const styleMap = await wordDocument.getStyleMap(unzippedWordFolder);

    // const css = await wordDocument.getCssCode(unzippedWordFolder);

    // // create style.css file
    // const fs = require("fs");
    // fs.writeFileSync(`db/publications/${publicationId}/output/style.css`, css);
};

main();
