sap.ui.define([
	"com/vSimpleApp/controller/BaseController",
	"sap/m/MessageBox",
	"com/vSimpleApp/service/documentServices"
], function (BaseController, MessageBox, documentServices) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("com.vSimpleApp.controller.ScannedDocuments", {
		
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		},	onMenuButtonPress: function() {
		
	
			var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("Dashboard");
		},
		onRefresh: function (oEvent) {
			var tbl = oView.byId("scannedTable");
			tbl.setBusy(true);
			documentServices.getInstance().getSuccesfullyScannedDocuments(this, function() {
				tbl.setBusy(false);
			});
		}
	});
});