sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"


], function (Object, JSONModel,MessageToast) {
	"use strict";
	var instance;
	var f4Services = Object.extend("com.cassiniProcureToPay.service.f4Services", {
		constructor: function () {},
	getLanguage : function(event){
	
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/industrysSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/IndustrySet", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		}
	
	});
	return {
		getInstance: function () {
			if (!instance) {
				instance = new f4Services();
			}
			return instance;
		}
	};
});