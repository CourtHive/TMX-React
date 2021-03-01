/*
 // PDFMAKE EXAMPLES

   docDefinition = {
      pageOrientation: 'portrait',
      content: [
        {text: 'Text on Portrait'},
        {text: 'Text on Landscape', pageOrientation: 'landscape', pageBreak: 'before'},
        {text: 'Text on Landscape 2', pageOrientation: 'portrait', pageBreak: 'after'},
        {text: 'Text on Portrait 2'},
      ]
    }

     pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        var pageInnerHeight = currentNode.startPosition.pageInnerHeight;
        var top = (currentNode.startPosition.top) ? currentNode.startPosition.top : 0;
        var footerHeight = 30;
        var nodeHeight = 0;
        if (followingNodesOnPage && followingNodesOnPage.length) {
           nodeHeight = followingNodesOnPage[0].startPosition.top - top;
        }

        if (currentNode.headlineLevel === 'footer') return false;

        return (currentNode.image && (top + nodeHeight + footerHeight > pageInnerHeight))
           || (currentNode.headlineLevel === 'longField' && (top + nodeHeight + footerHeight > pageInnerHeight))
           || currentNode.startPosition.verticalRatio >= 0.95;
     }

// https://github.com/bpampuch/pdfmake/releases/tag/0.1.17

var dd = {
  content: [
    {text: '1 Headline', headlineLevel: 1},
    'Some long text of variable length ...',
    {text: '2 Headline', headlineLevel: 1},
    'Some long text of variable length ...',
    {text: '3 Headline', headlineLevel: 1},
    'Some long text of variable length ...',
  ],
  pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
    return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
  }
}

// If pageBreakBefore returns true, a page break will be added before the currentNode. Current node has the following information attached:
{
 id: '<as specified in doc definition>', 
 headlineLevel: '<as specified in doc definition>',
 text: '<as specified in doc definition>', 
 ul: '<as specified in doc definition>', 
 ol: '<as specified in doc definition>', 
 table: '<as specified in doc definition>', 
 image: '<as specified in doc definition>', 
 qr: '<as specified in doc definition>', 
 canvas: '<as specified in doc definition>', 
 columns: '<as specified in doc definition>', 
 style: '<as specified in doc definition>', 
 pageOrientation '<as specified in doc definition>',
 pageNumbers: [2, 3], // The pages this element is visible on (e.g. multi-line text could be on more than one page)
 pages: 6, // the total number of pages of this document
 stack: false, // if this is an element which encapsulates multiple sub-objects
 startPosition: {
   pageNumber: 2, // the page this node starts on
   pageOrientation: 'landscape', // the orientation of this page
   left: 60, // the left position
   right: 60, // the right position
   verticalRatio: 0.2, // the ratio of space used vertically in this document (excluding margins)
   horizontalRatio: 0.0  // the ratio of space used horizontally in this document (excluding margins)
 }
}
*/
