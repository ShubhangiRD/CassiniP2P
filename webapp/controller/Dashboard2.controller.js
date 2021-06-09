sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/format/DateFormat",
	"sap/m/MessageToast",
	"sap/ui/integration/library",
	"sap/ui/core/BusyIndicator"
], function(Controller,JSONModel, DateFormat, MessageToast, integrationLibrary,BusyIndicator) {
	"use strict";
var oView;
	return Controller.extend("com.vSimpleApp.controller.Dashboard2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vSimpleApp.view.view.Dashboard2
		 */
		onInit: function() {
				
			
				var oModel = this.getOwnerComponent().getModel("VHeader");
			
			oView = this.getView();
				var manifests = new sap.ui.model.json.JSONModel();
			manifests.loadData("model/cardManifests.json");
			this.getView().setModel(manifests, "manifests");
			console.log(manifests);
			
			this.getVendorList();
			
			this.getPurchaseList();
			
			

			},
				getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					var item = oData.results.length;
					var ListofVendor = [];

					for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
						var odata = oData.results[iRowIndex];

						
							var Lifnr = odata.Lifnr;
							var Name1 = odata.Name1;
							ListofVendor.push({
								Lifnr: Lifnr,
									Name1 : Name1

							});
						
					}
					console.log(ListofVendor);

					var ListofVendorData = new JSONModel();
					ListofVendorData.setData(ListofVendor);
					oView.setModel(ListofVendorData);

					sap.ui.getCore().setModel(ListofVendorData, "ListofVendorData");	
				//	console.log(oData);
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
			getPurchaseList: function() {
		
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/POListSet", {
				success: function(oData) {
				//	console.log(oData);
					BusyIndicator.hide();
						var item = oData.results.length;
					var ListofPurchaseOrder = [];

					for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
						var odataset = oData.results[iRowIndex];
							var Compcode = odataset.Bukrs;
							var polost = odataset.Ebeln;
							var pogrp = odataset.Ekgrp;
							var poorg = odataset.Ekorg;
							var lifnrr = odataset.Lifnr;
							var currency = odataset.Waers;
				
						
							ListofPurchaseOrder.push({
								Bukrs: Compcode,
								Ebeln : polost,
								Ekgrp: pogrp,
								Ekorg : poorg,
								Lifnr: lifnrr,
								Waers : currency

							});
						
					}
					console.log(ListofPurchaseOrder);

					var ListofPOData = new JSONModel();
					ListofPOData.setData(ListofPurchaseOrder);
					oView.setModel(ListofPOData);

					sap.ui.getCore().setModel(ListofPOData, "ListofPOData");
				
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vSimpleApp.view.view.Dashboard2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vSimpleApp.view.view.Dashboard2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vSimpleApp.view.view.Dashboard2
		 */
		//	onExit: function() {
		//
		//	}

	});

});