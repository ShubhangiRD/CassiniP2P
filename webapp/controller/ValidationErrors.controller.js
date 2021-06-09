sap.ui.define([
	"com/vSimpleApp/controller/BaseController",
	"sap/m/MessageBox",
	"com/vSimpleApp/service/documentServices",
	'../Formatter'
], function (BaseController, MessageBox, documentServices, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("com.vSimpleApp.controller.ValidationErrors", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
		},	onMenuButtonPress: function() {
		
	
			var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("Dashboard");
		},
		onSelectDocument: function(oEvent) {
			try { 
				var docId = oEvent.getSource().data("uniqueId");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo("ValidationErrorDetails", {
					docId: docId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		onRefresh: function (oEvent) {
			var tbl = oView.byId("validationErrorTable");
			tbl.setBusy(true);
			documentServices.getInstance().getValidationErrorDocuments(this, function() {
				tbl.setBusy(false);
			});
		}
	});
});