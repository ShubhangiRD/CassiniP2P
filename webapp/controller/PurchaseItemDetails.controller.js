sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	
	"sap/ui/model/FilterOperator",
		'sap/ui/core/BusyIndicator',
			"sap/m/MessageToast"
], function(Controller,JSONModel,Filter,FilterOperator,BusyIndicator,MessageToast) {
	"use strict";
var oView;
	var ListofVendor = [], ListofCompanycode =[], ListofPurchaseOrg = [];
	return Controller.extend("com.vSimpleApp.controller.PurchaseItemDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vSimpleApp.view.view.PurchaseItemDetails
		 */
			onInit: function() {
				oView= this.getView();
			
			var PurchaseItemDetailsModel = new JSONModel();
			oView.setModel(PurchaseItemDetailsModel,"PurchaseItemDetailsModel");
			
		//	this.getVendorList();
		//	this.getCompanyList();
		//	this.getPurchaseOrgList();
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("PurchaseItemDetails").attachPatternMatched(this._onObjectMatched, this);
		
		
		},
			getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
							console.log(oData);
					var item = oData.results.length;
					

					for (var iRowIndex = 0; iRowIndex <= 2600; iRowIndex++) {
						var odata = oData.results[iRowIndex];
						if(odata!==undefined)
						{
							var Lifnrr = odata.Lifnr;
							var Name1r = odata.Name1;
							ListofVendor.push({
								Lifnr: Lifnrr,
								Name1: Name1r
							});
						}

					}
					console.log(ListofVendor);

					var Count = new sap.ui.model.json.JSONModel({
						item: item

					});
					oView.setModel(Count, "Count");

					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/DisplyaVendorList", ListofVendor);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
				getPurchaseOrgList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_purchaseorg_f4helpSet", {
				success: function(oData) {
					
					//BusyIndicator.hide();
					console.log(oData);
						var purorgitem = oData.results.length;

					for (var iRowIndex = 0; iRowIndex <= purorgitem; iRowIndex++) {
						var odata = oData.results[iRowIndex];
						if(odata!==undefined)
						{
							var Ekorg = odata.Ekorg;
							var Ekotx = odata.Ekotx;
							ListofPurchaseOrg.push({
								Ekorg: Ekorg,
								Ekotx: Ekotx
							});
						}

					}
					console.log(ListofPurchaseOrg);
					
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseOrganization", ListofPurchaseOrg);
					oLookupModel.refresh(true);
					
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		getCompanyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_companycode_f4helpSet", {
				success: function(oData) {
						console.log(oData);
					var compitem = oData.results;
					
					
						for (var iRowIndex = 0; iRowIndex <= compitem; iRowIndex++) {
						var odata = oData.results[iRowIndex];
						if(odata!==undefined)
						{
							var Bukrs = oData.results[iRowIndex].Bukrs;
							var Butxt = oData.results[iRowIndex].Butxt;
							ListofCompanycode.push({
								Bukrs: Bukrs,
								Butxt: Butxt
							});
						}

					}
					console.log(ListofCompanycode);
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CountryCode", ListofCompanycode);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		onNavBack: function(){
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('ShowTiles');
		},
			onRefresh: function (oEvent) {
			var tbl = oView.byId("PurchaseTable");
			tbl.setBusy(true);
				this.byId("PurchaseTable").getBinding("items").refresh();
		},
			_onObjectMatched: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel("VHeader");

			var sPath = oEvent.getParameter("arguments");
			var PurchaseOno = sPath.PoNumber;
			console.log(PurchaseOno);
				this.getVendorList();
				this.getCompanyList();
				this.getPurchaseOrgList();
			var pomodel = new JSONModel({
				PurchaseO: PurchaseOno
			});

			this.getView().setModel(pomodel, "pomodel");
			
			
			var aFilter = [
				new sap.ui.model.Filter({
					path: "Purchaseorder",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: PurchaseOno
				})

			];
			return new Promise(function (resolve1, reject1) { 
			oModel.read("/PO_DetailsSet()", {
				filters: aFilter,
				success: function(odata) {
					console.log(odata);
					var item = odata.results.length;
					var PoDetailsItems = [];
					for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {

					var PoNumber = odata.results[iRowIndex].PoNumber;
					var Vendor = odata.results[iRowIndex].Vendor;
					var Material = odata.results[iRowIndex].Material;
					var ShortText = odata.results[iRowIndex].ShortText;
					var NetPrice = odata.results[iRowIndex].NetPrice;
					var Quantity = odata.results[iRowIndex].Quantity;
					var CreatedBy = odata.results[iRowIndex].CreatedBy;
					var CreatDate = odata.results[iRowIndex].CreatDate;
					
					var CompCode = odata.results[iRowIndex].CompCode;
					var PurchOrg = odata.results[iRowIndex].PurchOrg;
					var PurGroup = odata.results[iRowIndex].PurGroup;
					var Currency = odata.results[iRowIndex].Currency;
					var PoItem = odata.results[iRowIndex].PoItem;
					var Plant = odata.results[iRowIndex].Plant;
				
							if (Vendor !== "" || Vendor !== undefined) {
							for(var y = 0; y < ListofVendor.length; y++)
							{
								if(Vendor==ListofVendor[y].Lifnr)
								{
									var vendorname = ListofVendor[y].Name1;
									console.log(vendorname);
								
								}
							}
						}
							if (CompCode !== "" || CompCode !== undefined) {
							for(var z = 0; z < ListofCompanycode.length; z++)
							{
								if(CompCode==ListofCompanycode[z].Bukrs)
								{
									var compcodename = ListofCompanycode[z].Butxt;
									console.log(compcodename);
								
								}
							}
						}
								if (PurchOrg !== "" || PurchOrg !== undefined) {
							for(var w = 0; w < ListofPurchaseOrg.length; w++)
							{
								if(PurchOrg==ListofPurchaseOrg[w].Ekorg)
								{
									var PurchOrgname = ListofPurchaseOrg[w].Ekotx;
									console.log(PurchOrgname);
								
								}
							}
						}
					
					
						var Dateon = CreatDate.getFullYear() + "/" +CreatDate.getMonth() +"/"+  CreatDate.getDate() + " " ;
						//Header model 
								var oHeaderDataModel = new JSONModel({
								Name : vendorname,
								Number : Vendor,
								createdby: CreatedBy,
								createddate : Dateon,
								CompCodeno : CompCode,
								CompCodename : compcodename,
								PurchOrgno : PurchOrg,
								PurchOrgname :PurchOrgname
								});

								oView.setModel(oHeaderDataModel, "oHeaderDataModel");
								console.log(oHeaderDataModel)



						var oHeaderDataCodePurOrg = new JSONModel({
							
								CompCode : compcodename,
								PurchOrg :PurchOrgname
								});

								oView.setModel(oHeaderDataCodePurOrg, "oHeaderDataCodePurOrg");
								console.log(oHeaderDataCodePurOrg)



			
						PoDetailsItems.push({
						PoNumber:PoNumber,
						Vendor:Vendor,
						Name : vendorname,
						Material: Material,
						ShortText:ShortText,
						NetPrice:NetPrice,
						Quantity:Quantity,
						CreatedBy:CreatedBy,
						CreatDate:CreatDate,
						CompCode : CompCode,
						PurchOrg : PurchOrg,
						PurGroup: PurGroup ,
						Currency: Currency,
						PoItem : PoItem,
						Plant: Plant
						});

					}
					console.log(PoDetailsItems);
					oView.getModel("PurchaseItemDetailsModel").setSizeLimit(PoDetailsItems.length);
					oView.getModel("PurchaseItemDetailsModel").setData(PoDetailsItems);
						},
				error: function(oError) {
					console.log(oError);
				}
			});

	});
		},
			onPostItems: function() {
			var oPurchaseModel = this.getView().getModel("PurchaseItemDetailsModel");
			console.log(oPurchaseModel);
			var aItems=	oPurchaseModel.oData;
				var itemDataHeader = [];

			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

				var Ebelnn = oPurchaseModel.oData[iRowIndex].PoNumber;
				var Bukrss = oPurchaseModel.oData[iRowIndex].CompCode;
				var PurchOrg = oPurchaseModel.oData[iRowIndex].PurchOrg;
				var Lifnrr = oPurchaseModel.oData[iRowIndex].Vendor;
				var PurGroup = oPurchaseModel.oData[iRowIndex].PurGroup;
				var Currency = oPurchaseModel.oData[iRowIndex].Currency;
				
				itemDataHeader.push({
					Ebeln: Ebelnn,
					Bukrs: Bukrss,
					Lifnr: Lifnrr,
					Ekorg: PurchOrg,
					Ekgrp: PurGroup,
					Waers : Currency
					
			
				});
		}
		console.log(itemDataHeader);
		
			var Lifnr = itemDataHeader[0].Lifnr;
		
			var zero = "";
			//	var no;

			var len = Lifnr.length;
			if (len !== undefined) {
				var z = 10 - len;
				for (var i = 0; i < z; i++) {
					zero += "0";
				}
			}

			console.log(len);
			console.log(zero);
			Lifnr = zero + Lifnr;
			console.log(Lifnr);
			var Ekorg = itemDataHeader[0].Ekorg;
			var Ekgrp = itemDataHeader[0].Ekgrp;
			var Waers = itemDataHeader[0].Waers;
			var Ebeln = itemDataHeader[0].Ebeln;
			var Bukrs = itemDataHeader[0].Bukrs;
		
		
			var POItem = [];

			var oModel = this.getOwnerComponent().getModel("VHeader");

	
			var itemData = [];

			//iterate the values of levels
			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

				var PoItem = oPurchaseModel.oData[iRowIndex].PoItem;
				var Material = oPurchaseModel.oData[iRowIndex].Material;
				var Quantity = oPurchaseModel.oData[iRowIndex].Quantity;
				var Plant = oPurchaseModel.oData[iRowIndex].Plant;
			
				
				itemData.push({
					Ebelp: PoItem,
					Matnr: Material,
					Menge: Quantity,
					Werks: Plant
					
			
				});

			
			}

			var oEntry1 = {};
			oEntry1.Ebeln = Ebeln;
			oEntry1.Bukrs = Bukrs;
			oEntry1.Bsart = "EC";
			oEntry1.Lifnr = Lifnr;
			oEntry1.Ekorg = Ekorg;
			oEntry1.Ekgrp = Ekgrp;
			oEntry1.Waers = Waers;

		
			oEntry1.POItem = itemData;
			console.log(oEntry1);
			BusyIndicator.show(0);

			oModel.create("/POHeaderSet", oEntry1, {
				success: this._onUpdateProdEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});

			oPurchaseModel.refresh(true);

		},
		_onUpdateProdEntrySuccess: function(oObject, oResponse) {
			BusyIndicator.hide();
				var Ebeln = oResponse.data.Ebeln;
						var oPurchaseModel = this.getView().getModel("PurchaseItemDetailsModel");
	
				var s = oPurchaseModel.oData.destroy;
			//	s.refresh(true);
			oPurchaseModel.refresh(true);
			//
			//	this.getView().getModel("VHeader").refresh();
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show("Standard PO updated under the number  #" + Ebeln + " ", {
					
				icon: sap.m.MessageBox.Icon.INFORMATION,
			
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CLOSE],
				onClose: function(oAction) {
					if (oAction === "OK") {
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('ShowTiles');
					}
				}.bind(this)
			});

		},
		_onCreateEntryError: function(oError) {
				BusyIndicator.hide();
				
			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vSimpleApp.view.view.PurchaseItemDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vSimpleApp.view.view.PurchaseItemDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vSimpleApp.view.view.PurchaseItemDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});