sap.ui.define(
  ['sap/ui/core/Control'],
  function(Control) {
  return Control.extend("com.vSimpleApp.NewTile",{
       metadata: {
            properties: {
            	mario : "",
            
            	 height: {
	                      type: "sap.ui.core.CSSSize",
	                      defaultValue: "auto"
	                },
	                margin: {
	                      type: "sap.ui.core.CSSSize",
	                      defaultValue: "0"
	                },
	                padding: {
	                      type: "sap.ui.core.CSSSize",
	                      defaultValue: "1rem"
	                }
            },
            aggregations: {}
       },
       renderer: function(oRm,oControl){
       	
       	  oRm.write(" <h2> style=\" height: " + oControl.getHeight() + "; margin: " + oControl.getMargin() + "; padding: " + oControl.getPadding() + ";\"   </h2>");
              
            oRm.write("" );
          
       },
       onAfterRendering: function() {
            //if I need to do any post render actions, it will happen here
            if(sap.ui.core.Control.prototype.onAfterRendering) {
                 sap.ui.core.Control.prototype.onAfterRendering.apply(this,arguments); //run the super class's method first
            }
       },
  });
  }
);


