sap.ui.define([
	"com/vSimpleApp/controller/BaseController",
	"sap/m/MessageBox",
	"com/vSimpleApp/service/documentServices",
	'../Formatter'
], function (BaseController, MessageBox, documentServices, Formatter) {
	"use strict";
	var oView, oController, oComponent;
	return BaseController.extend("com.vSimpleApp.controller.ScanningErrors", {
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
				var postData = [
				{
					postId: "1",
					status: 1,
					workflow: 1,
					vendorNo: 'V23425',
					vendorName: 'ABC Corporation',
					poNo: 'P123',
					grossAmount: 990,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D123455",
					invoiceNo: "IN12345",
					process: "MM",
					docDate: "2018-07-19"
				},
				{
					postId: "2",
					status: 2,
					workflow: 2,
					vendorNo: 'V56545',
					vendorName: 'XYZ Inc.',
					poNo: 'P234',
					grossAmount: 123,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D232323",
					invoiceNo: "IN23232",
					process: "FI",
					docDate: "2018-07-19"
				},
				{
					postId: "3",
					status: 0,
					workflow: 0,
					vendorNo: 'V67686',
					vendorName: 'Alpha Pvt. Ltd.',
					poNo: 'P345',
					grossAmount: 145,
					currencyCode: 'USD',
					currencySymbol: '$',
					docId: "D343345",
					invoiceNo: "IN34332",
					process: "FI",
					docDate: "2018-07-19"
				}
			];
			
			var oModelPost = new sap.ui.model.json.JSONModel({
				PostData: postData
			});
			
			this.setModel(oModelPost);
		//	var oModelPost = this.getOwnerComponent().getModel();
		//	var postData = oModelPost.getData().PostData;
			var scanningErrorData = postData.filter(function(data) {
			    return data.status === 0;
			});
			
			var oScanningErrorModel = new sap.ui.model.json.JSONModel({
				PostData: scanningErrorData
			});
			this.getOwnerComponent().setModel(oScanningErrorModel, "ScanningErrorData");
		},
			onMenuButtonPress: function() {
		
	
			var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("Dashboard");
		},
		onSelectDocument: function(oEvent) {
			try {
				
				//var row = oEvent.getSource().getParent();
				//var sPath = row.getBindingContext('NonSapErrorData').getPath();
				//var selectedRecord = row.getBindingContext('NonSapErrorData').getModel().getProperty(row.getBindingContext('NonSapErrorData').getPath());
				
				
				var scanId = oEvent.getSource().getProperty('text');
				var oRouter = sap.ui.core.UIComponent.getRouterFor(oView);
				oRouter.navTo("ScanningErrorDetails", {
					scanId: scanId
				});
			} catch (ex) {
				MessageBox.error(ex);
			}
		},
		onNavigateManualVerify: function (oEvent) {
			var batchId = oEvent.getSource().data("batchId");
			//var url = "/dataVerifier?batchId=" + batchId;
			var url = "http://219.91.153.113/DataVerifier/?batchId=" + batchId;
			window.open(url, '_blank');
		},
		onRefresh: function (oEvent) {
			var tbl = oView.byId("manualVerifyTable");
			tbl.setBusy(true);
			documentServices.getInstance().getManualVerificationDocuments(this, function() {
				tbl.setBusy(false);
			});
		}
	});
});