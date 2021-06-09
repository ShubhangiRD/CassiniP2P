sap.ui.define([
	"com/vSimpleApp/controller/BaseController",
	"sap/m/MessageBox",
	"com/vSimpleApp/service/documentServices",
	"../Formatter"
], function (BaseController, MessageBox, documentServices, Formatter) {
	"use strict";
	var oView;
	return BaseController.extend("com.vSimpleApp.controller.DocumentsRejected", {
		onInit: function() {
			oView = this.getView();
		},
		onMenuButtonPress: function() {
		
	
			var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("Dashboard");
		},
		onSelectDocument: function(oEvent) {
			try {
				var rejectionId = oEvent.getSource().data("uniqueId");
				this.getRouter().navTo("DocumentsRejectedDetails", {
					rejectionId: rejectionId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		onRefresh: function (oEvent) {
			var tbl = oView.byId("rejectedDocumentsTable");
			tbl.setBusy(true);
			documentServices.getInstance().getRejectedDocuments(this, function() {
				tbl.setBusy(false);
			});
		}
	});
});