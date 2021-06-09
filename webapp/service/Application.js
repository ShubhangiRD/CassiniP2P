sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	/* @type sap.ui.base.Object */
	var instance;
	/* @type sap.ui.base.Object */
	var Application = Object.extend("com.vSimpleApp.service.Application", {
		constructor: function () {
			this.Component = "";
		}
	});
	return {
		/**
		 * Method to create new instance of Application.
		 * @public
		 * @returns {sap.ui.base.Object} return new instance of Application
		 */
		getInstance: function () {
			if (!instance) {
				// create new instance of Application Object
				instance = new Application();
			}
			return instance;
		}
	};
});