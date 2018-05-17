const utils = require('./utils');

/**
 * Sleep.
 */
exports.sleep = function() {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
};

/**
 * Get content from url.
 * 
 * @param {*} url 
 */
exports.getUrlContent = function(url) {
  return new Promise((resolve, reject) => {
    // select http or https module, depending on requested url
    const parsedUrl = utils.parseUrl(url);
    const lib = parsedUrl.proto === 'https'? require('https') : require('http');
    const request = lib.get(parsedUrl.url, response => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed to load page, status code: ' + response.statusCode));
      }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', chunk => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on('end', () => resolve({
        protocol: parsedUrl.protocol,
        domain: parsedUrl.domain, 
        url: parsedUrl.url, 
        content: body.join('') })
      );
    });
    // handle connection errors of the request
    request.on('error', err => reject(err));
  });
};

exports.parseUrl = function(url) {
    const regex = /((http|https)?:\/\/)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm;
    const requestUrl = url.startsWith('http') ? url : 'http://' + url;
    let m, result = {};
    while ((m = regex.exec(requestUrl)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // Iterate through results
        m.forEach((match, groupIndex) => {
            if (groupIndex === 0) result.url = match;
            if (groupIndex === 1) result.protocol = match;
            if (groupIndex === 2) result.proto = match;
            if (groupIndex === 3) result.domain = match;
            if (groupIndex === 4) result.uri = match;
        });
    }
    return result;
};

exports.toSnapshotFilePath = function(url, basePath = "./snapshots/") {
  const parsedUrl = utils.parseUrl(url);
  let filename = parsedUrl.uri.replace(/\//g, '+') + '.png';
  if (filename.lastIndexOf('+.png') > 0) {
    filename = filename.replace('+.png', '.png');
  }
  return basePath + filename;
};

