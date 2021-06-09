sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"

], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.vSimpleApp.model.CreateContract", {
		constructor: function(data) {
			this.Lifnr = (data) ? data.Lifnr : "";
			this.Ktokk = (data) ? data.Ktokk : "";
			this.Sortl = (data) ? data.Ort01 : "";
			this.Land1 = (data) ? data.Land1 : "";

			this.model = new JSONModel();
			this.model.setData(this);
		},

		isBlank: function() {
			return this.CustomerName === "";
		},

		getModel: function() {
			return this.model;
		}
	});
});