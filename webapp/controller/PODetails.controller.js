sap.ui.define([
	"./Formatter",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"sap/m/Input",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/vSimpleApp/model/RebateConditionItemPO",
	"com/vSimpleApp/model/CreateContract",
	"sap/m/ColumnListItem",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/m/DatePicker",
	"sap/ui/model/FilterType",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/routing/History",
	"com/vSimpleApp/model/PODetail",
	"com/vSimpleApp/model/GetPurchaseVendor",
	"sap/ui/model/Sorter"
], function(Formatter, Controller, JSONModel, mobileLibrary, Input, Fragment, Filter, FilterOperator, RebateConditionItemPO,
	CreateContract, ColumnListItem, jQuery, MessageToast, MessageBox, Text, TextArea, DatePicker, FilterType,
	BusyIndicator, History, PODetail, GetPurchaseVendor, Sorter) {
	"use strict";
	var oView;
	var Ebeln, oComponent;
	return Controller.extend("com.vSimpleApp.view.controller.PODetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf QuickStartApplication2.view.Purchase
		 */
		onInit: function() {
			oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var OdataModel = new sap.ui.model.json.JSONModel();
			oView.setModel(OdataModel, "VendorListM");
			var odPurcOrg = new sap.ui.model.json.JSONModel();
			oView.setModel(odPurcOrg, "PurchaseORg");
		var compMode = new sap.ui.model.json.JSONModel();
			oView.setModel(compMode, "compMode");
			// Define the models
			this.getCompanyList();
			this.getVendorList();
			this.getPurchaseOrgList();
			this.getPurchaseOrderList();

			this.bDescending = false;
			this.sSearchQuery = 0;
			this.bGrouped = false;

		},
		onNavBack: function(oevt) {
			var oPurchaseModel = oComponent.getModel("PurchaseModel");
			oPurchaseModel.refresh(true);
			this.getOwnerComponent().getRouter().navTo("ShowTiles");
			this.getView().getModel("VHeader").refresh();

		},
		getSelect: function(sId) {
			return this.getView().byId(sId);
		},

		onChangefunction: function(oEvent) {
			var aFilter = [];
			//	var sQuery = oEvent.getSource().getValue();
			var sQuery = this.getView().byId('BPGroupSelect').getLiveValue();
			if (sQuery) {
				aFilter.push(
					new Filter("Ebeln", FilterOperator.EQ, sQuery),
					new Filter("Lifnr", FilterOperator.EQ, sQuery),
					new Filter("Bukrs", FilterOperator.EQ, sQuery));

			}
			// update list binding
			var list = this.getView().byId("PurchaseTableDisplay");
			var binding = list.getBinding("items");
			binding.filter(aFilter, "Application");

		},

		onSelectChange: function() {
			this.aKeys = [
				"Lifnr", "Bukrs"
			];
			this.oSelectName = this.getSelect("vnumber");
			//		this.oSelectCategory = this.getSelect("idPurchaseOrg");
			this.oSelectSupplierName = this.getSelect("cc");

			var aCurrentFilterValues = [];

			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectName));
			//	aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

			this.filterTable(aCurrentFilterValues);

		},
		filterTable: function(aCurrentFilterValues) {
			//	var aFilter = [];
			this.getTableItems().filter(this.getFilters(aCurrentFilterValues));
			// update list binding
			/*	var list = this.getView().byId("PurchaseTableDisplay");
			var binding = list.getBinding("items");
			binding.filter(this.getFilters(aCurrentFilterValues), "Application");
*/
		},
		getTable: function() {
			return this.getView().byId("PurchaseTableDisplay");
		},
		getTableItems: function() {
			return this.getTable().getBinding("items");
		},
		getFilters: function(aCurrentFilterValues) {

			var aFilters = [];

			aFilters = this.aKeys.map(function(sCriteria, i) {
				return new Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
			});

			return aFilters;
		},

		getSelectedItemText: function(oSelect) {
			return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";
		},

		onCreatePurchaseOrder: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("POCreation");
		},
		onSearchEbeln: function(oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getSource().getValue();
			if (sQuery) {
				aFilter.push(
					new Filter("Ebeln", FilterOperator.EQ, sQuery));

			}
			// update list binding
			var list = this.getView().byId("PurchaseTableDisplay");
			var binding = list.getBinding("items");
			binding.filter(aFilter, "Application");

		},
		OnNavigateDetails: function(oEvent) {

			try {
				var PurchaseNumber = oEvent.getSource().data("Ebeln");
				oComponent.getRouter().navTo("POITemDetails", {
					PoNo: PurchaseNumber
				});
			} catch (ex) {
				MessageBox.error(ex);
			}

			//oComponent.getRouter().navTo("Dashboard2");
		},

		/*start purchase order f4 click*/
		getPurchaseOrderList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(true);
			//oModel.read("/POListSet", {
			oModel.read("/openpo_headerSet", {
				success: function(oData) {
					BusyIndicator.hide(false);

					var itemPO = oData.results.length;
					console.log(oData);
					var CountPo = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					oView.setModel(CountPo, "CountPo");

					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/OpenPOList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
					var oPOHeaderData = new PODetail(oData.results);
					oView.getModel("POHeaderModel", oPOHeaderData); // setData(oData.results);

				},
				error: function(oError) {
					BusyIndicator.hide(false);
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					
					
					
							var item = oData.results.length;
					
					
					var ListofVendors = [];
					ListofVendors.push({
								"": ""
							});
						for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
							//		console.log(iRowIndex);
							
							var Lifnrr = oData.results[iRowIndex].Lifnr;
							ListofVendors.push({
								Lifnr: Lifnrr
							});
						}
							console.log(ListofVendors);
					
					
					
					
					
					
					
					//	oView.getModel("VendorListM").setData(oData.results);
					oView.getModel("VendorListM").setSizeLimit(ListofVendors.length);
					oView.getModel("VendorListM").setData(ListofVendors);

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
			//	BusyIndicator.show(0);
			oModel.read("/get_purchaseorg_f4helpSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					oView.getModel("PurchaseORg").setSizeLimit(oData.results.length);
					oView.getModel("PurchaseORg").setData(oData.results);

					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		onMenuButtonPress: function() {
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();

			//	oPurchaseModel.setData([]);
			var sss = oPurchaseModel.oData.TempContract.destroy;
			var s = oPurchaseModel.oData.TempContract.setData;
			//	s.refresh(true);

			oPurchaseModel.refresh(true);
			this.getView().getModel("VHeader").refresh();

			oView.byId("idPurchaseOrg").setValue("");
			oView.byId("pg").setValue("");
			oView.byId("cc").setValue("");
			oView.byId("vnumber").setValue("");
			oView.byId("cu").setValue("");
			oView.byId("VendorName").setValue("");

			var oComponent2 = this.getOwnerComponent();
			oComponent2.getRouter().navTo("ShowTiles");
		},

		/*Po Search*/

		/*PO Search end*/

		/*Comp Search start*/

		getCompanyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_companycode_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					
					
					
							var item = oData.results.length;
					
					
					var CountryCode = [];
					CountryCode.push({
								"": ""
							});
						for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
							//		console.log(iRowIndex);
							
							var Bukrs = oData.results[iRowIndex].Bukrs;
							CountryCode.push({
								Bukrs: Bukrs
							});
						}
							console.log(CountryCode);
					
					
					
						oView.getModel("compMode").setSizeLimit(CountryCode.length);
					oView.getModel("compMode").setData(CountryCode);

					
					
				
					//that.getMaterialList();
				},
				error: function(oError) {
					//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		/*Company SEarch end*/

		/*Material Number Search start*/
		getMaterialList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/MaterialmasterSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/MaterialList", oData.results);
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

		/*Material SEarch end*/

		// Po sorting 
		onSort: function(oEvent) {
			this.bDescending = !this.bDescending;
			this.fnApplyFiltersAndOrdering();
		},

		_fnGroup: function(oContext) {
			var PoItem = oContext.getProperty("Lookup>Lifnr");

			return {
				key: PoItem,
				text: PoItem
			};
		},
		fnApplyFiltersAndOrdering: function(oEvent) {
				var aFilters = [],
					aSorters = [];

				if (this.bGrouped) {
					aSorters.push(new Sorter("Lookup>Lifnr", this.bDescending, this._fnGroup));
				} else {
					aSorters.push(new Sorter("Lookup>Ebeln", this.bDescending));
				}

				if (this.sSearchQuery) {
					var oFilter = new Filter("Lookup>Ebeln", FilterOperator.Contains, this.sSearchQuery);
					aFilters.push(oFilter);
				}

				this.byId("PurchaseTableDisplay").getBinding("items").filter(aFilters).sort(aSorters);
			}
			// dialog code end

	});

});