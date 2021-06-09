/*!
 * ${copyright}
 */
// Provides control cassini.custom.Tile.
sap.ui.define(["jquery.sap.global", "./../library", "sap/ui/core/Control", "com/vSimpleApp/controls/type/TitleLevel"],
	function (jQuery, library, Control, TitleLevel) {
		"use strict";
		/**
		 * Constructor for a new Tile control.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Some class description goes here.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version ${version}
		 *
		 * @constructor
		 * @public
		 * @alias cassini.custom.controls.Tile
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var Button = Control.extend("com.vSimpleApp.controls.Button", {
			metadata: {
				properties: {

					/**
					 * title
					 */
				
				
				

				},
				aggregations: {
                    content: {
                        type: "sap.ui.core.Control"
                    }
				},
				events: {
					/**
					 * Event is fired when the user clicks on the control.
					 */
					press: {}
					

				},
                defaultAggregation: "content"
			},
  
            init: function() {
                //initialisation code, in this case, ensure css is imported
               var libraryPath = jQuery.sap.getModulePath("com.vSimpleApp"); //get the server location of the ui library
                jQuery.sap.includeStyleSheet(libraryPath + "/controls/tile.css"); //specify the css path relative from the ui folder
            },
            
            onclick: function (oEvent) {
            	this.firePress(oEvent);
            },
            renderer: function (oRm, oControl) {
            		oRm.write("<h2> Procure To Pay Portal </h2>");
            }
           /* renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("myAppDemoWTProductRating");
			oRm.writeClasses();
			oRm.write(">");
			
			oRm.write("</div>");
          

			}*/
		});
		return Button;
	}, /* bExport= */ true);