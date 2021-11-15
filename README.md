# Oracle Apex DA Plugin - PDF Form Filler
PDF Form Filler is a dynamic action plugin that can be used to fill PDF documents containing form fields (AcroForms) with pure JS. No additional software needed. It is based on pdfform.js (https://github.com/phihag/pdfform.js).

## Demo application

## Install
- Import plugin file "dynamic_action_plugin_de_igl-systems_pdfformfiller.sql" from plugin directory into your application

## Plugin Settings
You can change
- **Source location**
  - Choose the location of the source file. Source files can be read from a URL (HTTP GET) or by selecting from database tables.
- **Location of form data**
  - Form data are expected as JSON document. The JSON document can be read from a URL (HTTP GET), Page Item or database select.
- **Destination filename**
  - Currently only the option "Save to file" is supported. The file name for the processed PDF file can be configured as static value.
