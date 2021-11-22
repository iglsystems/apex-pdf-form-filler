# Oracle Apex DA Plugin - PDF Form Filler
PDF Form Filler is a dynamic action plugin that can be used to fill PDF documents containing form fields (AcroForms) with pure JS. No additional software needed. It is based on pdfform.js (https://github.com/phihag/pdfform.js).

## Demo application
Try out the plugin at https://apex.oracle.com/pls/apex/iglsystems/r/apex-plugin-showroom/pdf-form-filler

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
- **Other**
  - The plugin has an option to list the names and types of all form fields of the source file. You can configure a region id (jQuery selector) where the data shall be listed. This feature can be useful for aiding the development process of the JSON document containing the form data. **Note:** When using the list option, no target file will be rendered.

## Use the Plugin
- Create a dynamic action on target page, e.g. firing on a button click and select the PDF Form Filler Plugin as action
- Provide a PDF file containing form fields and configure the plugin for the right location
- Provide JSON document containing form data and configure the plugin for the right location
