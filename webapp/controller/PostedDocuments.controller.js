sap.ui.define([
	"com/vSimpleApp/controller/BaseController",
	"sap/m/MessageBox",
	"com/vSimpleApp/service/documentServices",
	'../Formatter'
], function (BaseController, MessageBox, documentServices, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("com.vSimpleApp.controller.PostedDocuments", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		},
		onMenuButtonPress: function() {
		
	
			var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("Dashboard");
		},
		onRefresh: function (oEvent) {
			var tbl = oView.byId("postedTable");
			tbl.setBusy(true);
			documentServices.getInstance().getPostedDocuments(this, function() {
				tbl.setBusy(false);
			});
		}
	});
});