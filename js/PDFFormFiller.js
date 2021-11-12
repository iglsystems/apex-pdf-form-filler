/*
 * PDF Form Filler Apex Plug-In v1.0
 * 
 * Based on pdfform.js (https://github.com/phihag/pdfform.js)
 *      and FileSaver.js (https://github.com/eligrey/FileSaver.js)
 *
 * Dual licensed under the MIT and Apache License 2.0
 */ 
var PDFFormFiller = (function() {
      
  console.log("PDFFormFiller: Loaded!");
  
  var l_ajax_identifier,
      l_pdf_source,
      l_pdf_source_text,
      l_form_data_source,
      l_form_data_source_item,
      l_form_data_source_text,
      l_pdf_target,
      l_file_name,
      l_list_fields_only,
      l_list_in_region,
      l_current_buffer;  
  
  function list(buf) {
    var cnt = 1;
	var field_specs;
	try {
		field_specs = pdfform().list_fields(buf);
	} catch (e) {
		console.log(e);
		return;
	}
	
	var list = '<table class="t-Report-report"> \
                  <thead> \
                    <tr> \
                      <th class="t-Report-colHead">Feldname</th> \
                      <th class="t-Report-colHead">Typ</th> \
                    </tr> \
                  </thead> \
                  <tbody>';
                       
	for (var field_key in field_specs) {
		field_specs[field_key].forEach(function(spec, i) {
		    list = list + '<tr> \
                             <td class="t-Report-cell">' + field_key + '</td> \
		                     <td class="t-Report-cell">' + spec.type + '</td> \
                           </tr>';
        })
	}
	
	list = list + '</tbody> \
	               </table>';
	$(l_list_in_region).append(list);
  }

  function fill(buf, formSrcType, formSrcItem, formSrcText) {
    var formData;
    
    if (formSrcType=="ITEM") {
      formData=JSON.parse(apex.item(formSrcItem).getValue());
      build(buf, formData);
    }    

    if (formSrcType=="URL") {
      var request = new XMLHttpRequest();
      request.open("GET", formSrcText, true);
      request.responseType = "json";
      request.onload = function() {
	  	if (this.status == 200) {
            formData = this.response;
            build(buf, formData);
		} else {
			console.log("failed to load URL (code: " + this.status + ")");
		}
      };
      request.send();
    }
    
    if (formSrcType=="SQL") {
      apex.server.plugin(l_ajax_identifier,
        {x01: "getformdata"},
        {success: function(pData){
           formData = pData;
           build(buf, formData);
           },
         error: function(pMessage) {
           console.log("failed to execute sql");
           }
        }
      );
    }

  }

  function build (buf, formData) {
	var filled_pdf; // Uint8Array

	try {
		filled_pdf = pdfform().transform(buf, formData);
	} catch (e) {
		return on_error(e);
	}

	var blob = new Blob([filled_pdf], {type: "application/pdf"});
	saveAs(blob, (l_file_name && l_file_name!="" ? l_file_name : "pdfformfiller.generated.pdf"));
  }
  
  var fillPDF = function() {
    l_ajax_identifier       = this.action.ajaxIdentifier;
    l_pdf_source            = this.action.attribute01;
    l_pdf_source_text       = this.action.attribute02;
    l_form_data_source      = this.action.attribute03;
    l_form_data_source_item = this.action.attribute04;
    l_form_data_source_text = this.action.attribute05;
    l_pdf_target            = this.action.attribute06;
    l_file_name             = this.action.attribute07;
    l_list_fields_only      = this.action.attribute08;
    l_list_in_region        = this.action.attribute09;
    
    if (l_pdf_source=="URL") {
      console.log("Read source file from URL");
      var request = new XMLHttpRequest();
      request.open("GET", l_pdf_source_text, true);
      request.responseType = "arraybuffer";
      request.onload = function() {
	  		if (this.status == 200) {
                l_current_buffer = this.response;
                if (l_list_fields_only=="Y") {
                  list(l_current_buffer);
                } else {
                  fill(l_current_buffer, l_form_data_source, l_form_data_source_item, l_form_data_source_text);
                }
			} else {
				console.log("failed to load URL (code: " + this.status + ")");
			}
		};
      request.send();
    }

    if (l_pdf_source=="SQL") {
      console.log("Read source file from SQL");
      apex.server.plugin(l_ajax_identifier,
        {x01: "getfile"},
        {dataType: "text",
         success: function(pData){
             l_current_buffer = Uint8Array.from(atob(pData), c => c.charCodeAt(0)).buffer;
             if (l_list_fields_only=="Y") {
               list(l_current_buffer);
             } else {
               fill(l_current_buffer, l_form_data_source, l_form_data_source_item, l_form_data_source_text);
             }
           },
         error: function(pMessage) {
           console.log("failed to execute sql");
           }
        }
      );
    }

  };
  return {
    fillPDF: fillPDF
  }
})();