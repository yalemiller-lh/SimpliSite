function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SimpliSite');
}

function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
