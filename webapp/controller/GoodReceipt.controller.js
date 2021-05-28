sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter",
	"sap/m/library",
	"sap/ui/core/Fragment",
	"com/cassiniProcureToPay/model/RebateConditionItem",
	"com/cassiniProcureToPay/model/VendorRebateCondition",
	"com/cassiniProcureToPay/model/CreateContract",
	"com/cassiniProcureToPay/model/GetPODetails",
	"com/cassiniProcureToPay/model/UpdatePO",
	"sap/m/ColumnListItem",
	"jquery.sap.global",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"

], function(Controller, JSONModel, BusyIndicator, MessageToast, FilterOperator, Filter, library, Fragment, RebateConditionItem,
	VendorRebateCondition, CreateContract, GetPODetails, UpdatePO, MessageBox, History) {
	"use strict";
	var oView, Ebeln, oComponent;
	var ListofVendor = [];
	var VendorNum, Vendorname, vendorname, s_Plant, CreateDocDate, CreateDoctypeDate;
	return Controller.extend("com.cassiniProcureToPay.controller.GoodReceipt", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.view.GoodReceipt
		 */
		onInit: function() {
			oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			oComponent = this.getOwnerComponent();
			//		console.log(oModel);
			//	this.getPurchaseOrderList();
			this.getVendorList();
			var POItemsModel = new JSONModel();
			oView.setModel(POItemsModel, "POItemsModel");

			var oEditModel = new JSONModel({
				isEditable: true
			});

			this.getView().setModel(oEditModel, "EditModel");

		},
	
		onMenuButtonPress: function() {
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);

			oPurchaseModel.refresh(true);
			//	oView.byId("vtitle").setValue("");
			//	oView.byId("idPurchaseOrder").setValue("");
			oView.byId("idPD").setValue("");
			oView.byId("idlant").setValue("");
			oView.byId("idVendor").setValue("");
	
			oView.byId("idMatdis").setValue("");
			oView.byId("idMatNo").setValue("");
			oView.byId("VMatNo").setValue("");
			oView.byId("idMatGrp").setValue("");
			oView.byId("idmatGrptwo").setValue("");
			oView.byId("ident").setValue("");

			oView.byId("idQunat").setValue("");
			oView.byId("idQntS").setValue("");
			oView.byId("idQuantsku").setValue("");
			oView.byId("idDelNot").setValue("");
			oView.byId("idDelNott").setValue("");
			oView.byId("idPOrder").setValue("");
			var oComponent2 = this.getOwnerComponent();
			oComponent2.getRouter().navTo("ShowTiles");
		},
		/*Storage Location start*/

		handleStorageLocationValue: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			//create value help dialog 
			if (!this._valueHelpDialogStorage) {
				this._valueHelpDialogStorage = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.StorageLocation",
					this
				);
				this.getView().addDependent(this._valueHelpDialogStorage);
			}
			this.getStorageLocation();
			if (sInputValue.includes(")")) {
				var sSubstring = sInputValue.split(")")[1];
				sInputValue = sSubstring.trim();
			}
			// ccreate a filter for the binding
			this._valueHelpDialogStorage.getBinding("items").filter(new Filter([new Filter(
					"Lgort",
					FilterOperator.Contains, sInputValue),
				new Filter(
					"Lgobe",
					FilterOperator.Contains, sInputValue
				)
			]));
			this._valueHelpDialogStorage.open(sInputValue);
		},

		_handleStorageLocationSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Lgort",
				FilterOperator.Contains, sValue
			), new Filter(
				"Lgobe",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleStorageLocationClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

			}
			oEvent.getSource().getBinding("items").filter([]);

		},

		getStorageLocation: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");

			var oPurchaseModel = this.getView().getModel("PurchaseModel");
			var oTempModel = oPurchaseModel.getProperty("/TempContract");

			var aItems = oTempModel.POItem;
			console.log(aItems.length);

			for (var i = 0; i < aItems.length; i++) {

				s_Plant = oTempModel.POItem[i].Plant;

			}

			console.log(s_Plant);

			var oFilter = new sap.ui.model.Filter('Werks', sap.ui.model.FilterOperator.EQ, s_Plant);
			oModel.read("/storage_f4helpSet?$filter=(Werks eq '" + s_Plant + "')", {
				filters: [oFilter],

				success: function(oData) {
					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/StorageLocationList", oData.results);
					oLookupModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusCode + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		/*Storage Location End*/

		/*start purchase order f4 click*/
		getPurchaseOrderList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);

			//	oModel.read("/POListSet", {
			oModel.read("/just_poheader2Set", {

				success: function(oData) {
					console.log(oData);

					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/POOrderList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handlePursOrderValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PurchaseDocument",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter(new Filter([new Filter(
				"Ebeln",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));
			this.getPurchaseOrderList();
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);

		},
		_handleValueHelpSearchPurs: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Ebeln",
				FilterOperator.Contains, sValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},

		_handleValueHelpClosePurs: function(oEvent) {

			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oModel = this.getOwnerComponent().getModel("VHeader");

			var oModellookup = oView.getModel("Lookup");

			console.log(oModellookup);
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var eelnvalue = oSelectedItem.getTitle();
				console.log(eelnvalue);
				VendorNum = oModellookup.getProperty(sBindPath + "/Lifnr");
				oView.byId("idVendor").setValue(VendorNum);
				//	oView.byId("idvendorno").setValue(oModellookup.getProperty(sBindPath + "/Lifnr"));
				oView.getModel("EditModel").setProperty("/isEditable", true);

				Ebeln = oModellookup.getProperty(sBindPath + "/Ebeln");
				var Vendorname1 = oModellookup.getProperty(sBindPath + "/Lifnr");
				Vendorname = oModellookup.getProperty(sBindPath + "/Name1");
				console.log(Vendorname1);

				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Purchaseorder",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];
 
				

				var Purchaseorder = Ebeln;
				oModel.read("/fetch_openPOSet(Purchaseorder='" + Purchaseorder + "')", {
					urlParameters: {
						"$expand": "fpoItemSet"
					},
					success: function(oData) {
						console.log(oData);
							var lq = oData.fpoItemSet.results.length;
						for (var quant = 0; quant <lq; quant++) {
								var Quantity = oData.fpoItemSet.results[quant].Quantity;

								if (Quantity === "0.000") {
									oView.getModel("EditModel").setProperty("/isEditable", false);

									console.log('value starts with zero');
									var PO = new JSONModel({
										PONO: Ebeln
									});

									oView.setModel(PO, "PO");
								} 

							}
						var datedoc = oData.CreatDate;
						var s_doc_date = datedoc;
						var str = s_doc_date.toISOString();
						str = str.slice(0, -5);
						console.log(str);

						var Megodate = new JSONModel({
							CreatDate: str
						});

						oView.setModel(Megodate, "Megodate");

						console.log(oData.Vendor);
						var vendor = oData.Vendor;

						if (vendor !== "" || vendor !== undefined) {
							for (var y = 0; y < ListofVendor.length; y++) {
								if (vendor == ListofVendor[y].Lifnr) {
									var venname = ListofVendor[y].Name1;
									console.log(venname);
									//	oView.byId("idvendorno1").setValue(venname);
									//			oView.byId("idpatven").setValue(venname);
									//	oView.byId("idPostDateq").setValue(venname);

								}
							}
						}
 					var OData = new JSONModel({
							Vendor: vendor,
							VendorName : venname,
							PON : Ebeln
							
						});

						oView.setModel(OData, "OData");
						var aa = oView.getModel("PurchaseModel");
						console.log(aa);
						var ppp = oData.fpoItemSet.results[0].Plant;
						oView.byId("idlant").setValue(ppp);
						var oModellookup = oView.getModel("Lookup");

						console.log(oModellookup);
						var dd = "abc";
						var path = oData.fpoItemSet.results;
						console.log(path.length);
						//	aa.setProperty(path + "/SuppVendor", dd);

						var aData = aa.getProperty("/TempContract/POItem");
						aData.push.apply(aData, oData.fpoItemSet.results);
						aa.setProperty("/TempContract/POItem", aData);
						/*	for (var i = 0; i < aa.oData.TempContract.POItem.length; i++) {
						oView.getModel("PurchaseModel").setProperty("/TempContract/POItem", oData.results); // setData(oData.results);
						//console.log(oData);
						}*/

						var poModel = oView.getModel("PurchaseModel");
						console.log(poModel);
						var mModel = poModel.getProperty("/TempContract/POItem");
						CreateDocDate = oData.CreatDate;
						CreateDoctypeDate = oData.DocDate;
						var mno = mModel[0].Material;
						var matgp = mModel[0].MatlGroup;
						var shot = mModel[0].ShortText;
						var qunt = mModel[0].Quantity;
						var pun = mModel[0].PoUnit;
						var MaterialAndVendor = mno.concat("-", VendorNum);
						oView.byId("VMatNo").setValue(MaterialAndVendor);
						//		oView.byId("iddis").setValue(VendorNum);
						oView.byId("idPOrder").setValue(Ebeln);
						oView.byId("idMatdis").setValue(shot);
						oView.byId("idMatNo").setValue(mno);
						oView.byId("idMatGrp").setValue(matgp);
						oView.byId("ident").setValue(qunt);
						oView.byId("idQunat").setValue(pun);
						oView.byId("idQntS").setValue(qunt);
						oView.byId("idQuantsku").setValue(pun);
						oView.byId("idDelNot").setValue(qunt);
						oView.byId("idDelNott").setValue(pun);

					},
					error: function(oError) {
						console.log(oError);
					}
				});
				//	this.byId("idPOItemsTab").setModel(oView.getModel("POItemsModel"), "POItemsModel");

			}
			oEvent.getSource().getBinding("items").filter([]);

		},
		suggestionItemSelectedPOrder: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			//get the all data for selected values
			var oModel = this.getOwnerComponent().getModel("VHeader");
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				//	productInput.setValue(oSelectedItem.getText());
				var no = oSelectedItem.getText();

				//	productInput.setValue(sInputValue.getTitle());
				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				oView.byId("idPoOrder").setValue(oModel.getProperty(sBindPath + "/Ebeln"));
				Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Purchaseorder",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModel.read("/PO_DetailsSet", {
					//oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						//	console.log(oData.results);
						//	oView.getModel("PurchaseModelITem").setData(oData.results);
						oView.getModel("PurchaseModel").setProperty("/TempContract/POItem", oData.results); // setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelITem"), "PurchaseModelITem");

			}

		},

		/*end purchase order f4 click*/
		/*Plant search start */
		getPOPlant: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_plant_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/POPlant", oData.results);
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
		handleValueHelpPlant: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogpp) {
				this._valueHelpDialogpp = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Plant",
					this
				);
				this.getView().addDependent(this._valueHelpDialogpp);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogpp.getBinding("items").filter(new Filter([new Filter(
				"Bwkey",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Bwkey",
				FilterOperator.Contains, sInputValue
			)]));
			this.getPOPlant();
			// open value help dialog filtered by the input value
			this._valueHelpDialogpp.open(sInputValue);

		},
		_handlePlantSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Bwkey",
				FilterOperator.Contains, sValue
			), new Filter(
				"Bwkey",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},

		_handlePlantClose: function(evt) {
			var zero = "";
			var oSelectedItem = evt.getParameter("selectedItem");
			
			var oModel = oView.getModel("Lookup");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var PlantNumber = oSelectedItem.getTitle();
				console.log(PlantNumber);
			
				evt.getSource().getBinding("items").filter([]);
			}
		},
		/*plant search end*/

		onDeleteConditionItem: function() {
			var oPurchaseItemTable = this.byId("idTableitem");
			var aSelectedIndex = oPurchaseItemTable.getSelectedIndices().reverse();
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var aPurchaseConditionItems = oPurchaseModel.getProperty("/TempContract/POItem");
			for (var i = 0; i < aSelectedIndex.length; i++) {
				aPurchaseConditionItems.splice(aSelectedIndex[i], 1);
			}
			oPurchaseItemTable.clearSelection();
			oPurchaseModel.refresh(true);
		},

		/*vendor list start*/
		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
		BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					var item = oData.results.length;

					for (var iRowIndex = 0; iRowIndex <= 2600; iRowIndex++) {
						var odata = oData.results[iRowIndex];
						if (odata !== undefined) {
							var Lifnrr = odata.Lifnr;
							var Name1r = odata.Name1;
							ListofVendor.push({
								Lifnr: Lifnrr,
								Name1: Name1r
							});
						}

					}
					//	console.log(ListofVendor);

					var Count = new sap.ui.model.json.JSONModel({
						item: item

					});
					oView.setModel(Count, "Count");

				BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/DisplyaVendorList", ListofVendor);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					//BusyIndicator.hide();
					MessageToast.show(oError);
				}
			});
		},

		handleMaterialValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogvendor) {
				this._valueHelpDialogvendor = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Display",
					this
				);
				this.getView().addDependent(this._valueHelpDialogvendor);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogvendor.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));
			this.getVendorList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogvendor.open(sInputValue);
		},
		_handleValueVendorHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueVendorHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oModel = oView.getModel("Lookup");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sDescription);
				if (sDescription !== "") {
					//	this.getVendorDetails(sDescription);
					var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
					oView.byId("idvendorno1").setValue(oModel.getProperty(sBindPath + "/Name1"));
					

				}
			}
			evt.getSource().getBinding("items").filter([]);

		},
	
		/*vendor list end*/
		onPostPurchaseOrder: function() {
			var oPurchaseModel = this.getView().getModel("PurchaseModel");
			var oTempModel = oPurchaseModel.getProperty("/TempContract");
			var oModel = this.getOwnerComponent().getModel("VHeader");

			console.log(oTempModel);
			var oPoorder = oView.byId("idPD").getValue();
			var oVendor = oView.byId("idVendor").getValue();
			//	var idVendornumber = oView.byId("idvendorno").getValue();

			var aItems = oTempModel.POItem;
			console.log(aItems.length);

			var itemData = [];

			for (var i = 0; i < aItems.length; i++) {

				var s_Material = oTempModel.POItem[i].Material;
				var zero = "";
				//	var no;

				var len = s_Material.length;
				if (len !== undefined) {
					var z = 18 - len;
					for (var m = 0; m < z; m++) {
						zero += "0";
					}
				}

				console.log(len);
				console.log(zero);
				s_Material = zero + s_Material;
				console.log(s_Material);

				s_Plant = oTempModel.POItem[i].Plant;
				var s_PoItem = oTempModel.POItem[i].PoItem;
				var s_PoNumber = oPoorder;
				var s_PoUnit = oTempModel.POItem[i].PoUnit;
				var s_Quantity = oTempModel.POItem[i].Quantity;
				var s_store = oTempModel.POItem[i].Plant;

				itemData.push({
					Bwart: "101",
					Sobkz: "Q",
					Matnr: s_Material,
					Ebeln: s_PoNumber,
					Ebelp: s_PoItem,
					Erfmg: s_Quantity,
					Erfme: s_PoUnit,
					Werks: s_Plant,
					Lgort: s_store

				});

			}
			var oEntry1 = {};

			var s_postingDate = CreateDocDate;
			var str = s_postingDate.toISOString();
			str = str.slice(0, -5);
			console.log(str);

			var s_documentDate = CreateDoctypeDate;
			var string = s_documentDate.toISOString();
			string = string.slice(0, -5);
			console.log(string);

			oEntry1.Budat = str;
			oEntry1.Bldat = string;
			oEntry1.Xblnr = "1234";

			oEntry1.GRITEMSet = itemData;

			console.log(oEntry1);
	

			BusyIndicator.show(0);
			oModel.create("/GRHEADSet", oEntry1, {

				success: this._onUpdateProdEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});
			oPurchaseModel.refresh(true);

		},

		_onUpdateProdEntrySuccess: function(oObject, oResponse) {
			BusyIndicator.hide();

			var sap1 = {};
			sap1 = JSON.parse(oResponse.headers["sap-message"]);
			console.log(sap1.message);
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);

		
			oPurchaseModel.refresh(true);
			//	oView.byId("vtitle").setValue("");
			//	oView.byId("idPurchaseOrder").setValue("");
			oView.byId("idPD").setValue("");
			oView.byId("idlant").setValue("");
			oView.byId("idVendor").setValue("");
			oView.byId("idMatdis").setValue("");
			oView.byId("idMatNo").setValue("");
			oView.byId("VMatNo").setValue("");
			oView.byId("idMatGrp").setValue("");
			oView.byId("idmatGrptwo").setValue("");
			oView.byId("ident").setValue("");
			oView.byId("idQunat").setValue("");
			oView.byId("idQntS").setValue("");
			oView.byId("idQuantsku").setValue("");
			oView.byId("idDelNot").setValue("");
			oView.byId("idDelNott").setValue("");
			oView.byId("idPOrder").setValue("");
		oView.byId("idDocDate").setValue(" ");
			oView.byId("idPostDate").setValue(" ");

			//
			//	this.getView().getModel("VHeader").refresh();
			jQuery.sap.require("sap.m.MessageBox");

			sap.m.MessageBox.show("Material document #" + sap1.message + " posted", {
				icon: sap.m.MessageBox.Icon.INFORMATION,
				title: "Message",
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
			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);

		},

		onCancelPRess: function(event) {
			
				var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
				var oTempContract = oPurchaseModel.getProperty("/TempContract");
				oTempContract.setData();
				//	oPurchaseModel.setData([]);
				var s = oPurchaseModel.oData.TempContract.destroy;
				//	s.refresh(true);

				oPurchaseModel.refresh(true);
				this.getView().getModel("VHeader").refresh();

				//	oView.byId("vtitle").setValue("");
				//	oView.byId("idPurchaseOrder").setValue("");
				oView.byId("idPD").setValue("");
				oView.byId("idlant").setValue("");
				oView.byId("idVendor").setValue("");
		
				oView.byId("idMatdis").setValue("");
				oView.byId("idMatNo").setValue("");
				oView.byId("VMatNo").setValue("");
				oView.byId("idMatGrp").setValue("");
				oView.byId("idmatGrptwo").setValue("");
				oView.byId("ident").setValue("");

				oView.byId("idQunat").setValue("");
				oView.byId("idQntS").setValue("");
				oView.byId("idQuantsku").setValue("");
				oView.byId("idDelNot").setValue("");
				oView.byId("idDelNott").setValue("");
				oView.byId("idPOrder").setValue("");
			
				//redirect the page	frot view
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("ShowTiles");

			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.cassiniProcureToPay.view.view.GoodReceipt
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.view.GoodReceipt
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.view.GoodReceipt
		 */
		//	onExit: function() {
		//
		//	}

	});

});