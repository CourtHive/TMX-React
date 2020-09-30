## pdfEngine

pdfEngine generates _docDefinitions_ accepted by [pdfMake](http://pdfmake.org/) and invokes pdfMake to generate pdf documents which can be output as base64 data, buffers, or blobs, or acted upon using pdfMake convenience methods such as **.open()** or **.save()**.  
pdfEngine is designed to run either client-side or server-side.  
pdfEngine functions asynchronously as there are steps during the generation of a pdf _docDefinition_ that may require asynchronous calls, such as image retrieval and SVG generation.

    pdfEngine({
      type: 'document template reference',
      imageRefs: [],  // array of Objects decribing how to retrieve images
      props: {},      // Object with attributes to be passed into generator (data model),
      action: {}      // Object with attributes for action taken after pdf generated (open / save / emit /..)
    })

The object passed into pdfEngine() is referred to as the **directive**.

    pdfEngine(directive)

pdfEngine processes directives in the following order:

- check handlers for known template **type**
- process imageRefs and assign any retrieved images to the directive
- invoke handler, passing directive as parameter
- handler uses directive.props and directive.imgages to generate _docDefinition_
- assign _docDefinition_ to action and execute it

## Handlers

handlers function as _docDefinition_ generators and must return Promises.  
Parameters to be passed to handlers are contained in the **props** attribute of the directive that is passed to the handler; any images which have been retrieved are assigned to the **images** attribute of the directive.  
Each handler generates a _docDefinition_ by assembling components such as headers, footers, body definitions, layouts, styles and images.

## Actions

Actions can be different if PDF conversion is running on client or server.  
Actions are defined in `templateProvider/index.ts` and can be expanded freely.

## Creating new PDF template

Templates should be stored in `templates/[template name]` directory.
With template definition, template should export generator object which consists of template name and template generator function.

```
export const sampleInvoiceGenerator = {
  sampleInvoice: sampleInvoiceTemplate
};
```

Template should be registered in `templateProvider/index.ts` -> `generatorCollection` array.  
Template name should be added to `templateProvider/types/directive/enums/directiveType.ts` enum.
