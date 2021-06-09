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
		var Dashboard = Control.extend("com.vSimpleApp.controls.Dashboard", {
			metadata: {
				properties: {

					/**
					 * title
					 */
				
				
					width: {
                    	type: "sap.ui.core.CSSSize",
                    	defaultValue: "auto"
	                },	description: {
						type: "string",
						group: "Misc",
						defaultValue: null
					},
	                height: {
	                      type: "sap.ui.core.CSSSize",
	                      defaultValue: "auto"
	                },
	                text : {
	                	type: "string"
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
                jQuery.sap.includeStyleSheet(libraryPath + "/controls/tile22.css"); //specify the css path relative from the ui folder
            },
            
            onclick: function (oEvent) {
            	this.firePress(oEvent);
            },
            
            renderer: function (oRm, oControl) {
				//first up, render a div for the ShadowBox
                oRm.write("<div");
                 //   oRm.addClass("casTile");
                oRm.writeControlData(oControl);
                oRm.addStyle("width", oControl.getProperty('width'));
                  oRm.addStyle("height", oControl.getProperty('height'));
                  oRm.addStyle("margin", oControl.getProperty('margin'));
                  oRm.addStyle("padding", oControl.getProperty('padding'));
                  oRm.writeStyles();
                oRm.write(">");
          oRm.write("<button type ='button'");
                 oRm.addStyle("width", oControl.getProperty('width'));
                  oRm.addStyle("height", oControl.getProperty('height'));
                    oRm.addStyle("margin", oControl.getProperty('margin'));
                  oRm.addStyle("padding", oControl.getProperty('padding'));
                
                  oRm.writeStyles();
                      oRm.write(">");
                      oRm.write("</button>");
                      oRm.write("</div>");
                //add this controls style class (plus any additional ones the developer has specified)
            
          

			}
		});
		return Dashboard;
	}, /* bExport= */ true);