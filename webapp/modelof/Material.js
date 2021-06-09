sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application"
], function(BaseObject, Application) {
	"use strict";
	var Material = BaseObject.extend("com.vSimpleApp.model.Material", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.setData(oData);
		},

		setData: function(oData) {
			this.MaterialNo = (oData && oData.Materialno) ? oData.Materialno : "";
			this.Description = (oData && oData.Description) ? oData.Description : "";
		},
		
		getRequestPayload: function(sContractNo) {
			return { 
				Rcont: sContractNo,
				Matnr: this.MaterialNo
			};
		}
	});
	return Material;
});