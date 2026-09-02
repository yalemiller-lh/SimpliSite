function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('SimpliSite')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.SAMEORIGIN);
}

function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

