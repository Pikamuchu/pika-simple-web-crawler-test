const { Chromeless } = require('chromeless');
const cheerio = require('cheerio');
const utils = require('./utils');

// Constants
var chunk = 2;
var initialUrl = 'www.desigual.com/es_ES';

async function run() {
  console.log('*********** Starting web crawler test **************');
  console.log('*');

  // Configure test
  setupParams();

  console.log('* Initial Url: ' + initialUrl);
  console.log('* Chunks: ' + chunk);
  console.log('*');

  // Opening headless chrome session
  const masterChromeless = new Chromeless();
  // Needed to wait for Chrome to start up
  await utils.sleep();

  try {
    // Read test data
    console.log('* Opening url ' + initialUrl + ' and parsing links');

    const testLinksArray = await openAndParseUrlLinks(initialUrl);
    if (testLinksArray) {
      // Process links in chunks
      let i, j;
      console.log('* Total test urls ' + testLinksArray.length);
      for (i = 0, j = testLinksArray.length; i < j; i += chunk) {
        // Preparing chunk
        const start = i;
        const end = start + chunk < testLinksArray.length ? start + chunk : testLinksArray.length;
        const testUrlChunk = testLinksArray.slice(start, end);
        // Executing test data chunk
        console.log('* Processing chunk ' + i / chunk + ' size ' + testUrlChunk.length + ' total processed ' + i);
        await multiTaskOpenUrl(testUrlChunk);
      }
    }
  } catch (error) {
    console.error('Unexpected error ocurred: ' + error);
  } finally {
    // Closing chrome session
    await masterChromeless.end();
    console.log('*');
    console.log('*********** Crawler test end **************');
  }
}

function setupParams() {
  for (i = 0; i < process.argv.length; i++) {
    if (i === 2 && process.argv[2]) {
      initialUrl = process.argv[2];
    }
    if (i === 3 && process.argv[3]) {
      chunk = Number(process.argv[3]);
    }
  }
}

async function openAndParseUrlLinks(url) {
  let links = new Array();
  try {
    // Open initial Url
    const response = await utils.getUrlContent(url);
    if (response.content) {
      // Parse opened url links
      const $ = cheerio.load(response.content);
      $('a').each(function() {
        const linkHref = $(this).attr('href');
        if (linkHref) {
          const link = linkHref.startsWith('/') ? response.protocol + response.domain + linkHref : linkHref;
          console.log('Found link ' + link);
          links.push(link);
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
  return links;
}

async function multiTaskOpenUrl(testUrls = []) {
  try {
    // Creating tasks promises
    let openUrlsPromises = testUrls.filter(url => url && url.length > 0).map(url => openUrl(url));
    // Executing tasks
    if (openUrlsPromises && openUrlsPromises.length) {
      const screenshots = await Promise.all(openUrlsPromises);
      // Print screenshots
      screenshots.forEach(screenshot => console.log(screenshot));
    }
  } catch (error) {
    console.error('Unexpected error ocurred: ' + error);
  }
}

function openUrl(url) {
  // Opening url on headless chrome
  return new Promise((resolve, reject) => {
    const chromeless = new Chromeless({ launchChrome: false });
    chromeless
      .goto(url)
      .screenshot({
        filePath: utils.toSnapshotFilePath(url)
      })
      .then(async screenshot => {
        await chromeless.end();
        resolve(screenshot);
      })
      .catch(err => reject(err));
  });
}

run();
