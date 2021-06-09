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
	"com/vSimpleApp/model/VendorRebateCondition",
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
	"sap/ui/core/routing/History"
], function(Formatter, Controller, JSONModel, mobileLibrary, Input, Fragment, Filter, FilterOperator, RebateConditionItemPO,
	VendorRebateCondition, CreateContract, ColumnListItem, jQuery, MessageToast, MessageBox, Text, TextArea, DatePicker, FilterType,
	BusyIndicator, History) {
	"use strict";
	var oView;
	var Ebeln, oComponent;
	return Controller.extend("com.vSimpleApp.view.controller.POCreation", {

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
			// Define the models
			var createContract = new CreateContract();
			this.getView().setModel(createContract.getModel(), "CreateContract");

			//window.location.reload();
		},
	onNavBack: function(oevt) {
			var oPurchaseModel = oComponent.getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			//	oPurchaseModel.setData([]);
			var s = oPurchaseModel.oData.TempContract.destroy;	
				
				
		
		
			oPurchaseModel.refresh(true);
			this.getOwnerComponent().getRouter().navTo("PODetails");
		//	this.getView().getModel("VHeader").refresh();

		},
		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/DisplyaVendorList", oData.results);
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

		handleVendorValuehelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.fragment.Display",
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
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));
			this.getVendorList();
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
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
					oView.byId("idPurchaseOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
					oView.byId("cc").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
					oView.byId("pg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
					oView.byId("cu").setValue(oModel.getProperty(sBindPath + "/Waers"));
					oView.byId("VendorName").setValue(oModel.getProperty(sBindPath + "/Name1"));

					var org = oModel.getProperty(sBindPath + "/Ekorg");
					var cmp = oModel.getProperty(sBindPath + "/Bukrs");
					var cur = oModel.getProperty(sBindPath + "/Ekgrp");
					var pgp = oModel.getProperty(sBindPath + "/Waers");
					var name = oModel.getProperty(sBindPath + "/Name1");
					
						oView.byId("idStreetHeader").setValue(oModel.getProperty(sBindPath + "/Stras"));
					oView.byId("idTelHeader").setValue(oModel.getProperty(sBindPath + "/Telf1"));
					oView.byId("idPostcodeHeader").setValue(oModel.getProperty(sBindPath + "/Pstlz"));
				oView.byId("idCountryCodeHeader").setValue(oModel.getProperty(sBindPath + "/Land1"));
					oView.byId("idAddnoHeader").setValue(oModel.getProperty(sBindPath + "/Adrnr"));
				oView.byId("idCityHeader").setValue(oModel.getProperty(sBindPath + "/Ort02"));
			
					
				
					
					
					
					
					

				}
			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*Po Search*/
		getPurchaseOrgList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(0);
			oModel.read("/get_purchaseorg_f4helpSet", {
				success: function(oData) {
					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseOrganization", oData.results);
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

		handlePurchaseOrgVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogporg) {
				this._valueHelpDialogporg = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.PurchaseOrg",
					this
				);
				this.getView().addDependent(this._valueHelpDialogporg);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogporg.getBinding("items").filter(new Filter([new Filter(
				"Ekorg",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Ekotx",
				FilterOperator.Contains, sInputValue
			)]));
			this.getPurchaseOrgList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogporg.open(sInputValue);
		},
		_handlePOrganiVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Ekorg",
				FilterOperator.Contains, sValue
			), new Filter(
				"Ekotx",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlePOrganiVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*PO Search end*/

		/*Comp Search start*/

		getCompanyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_companycode_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CountryCode", oData.results);
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

		handleCompanyCodeVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogcomp) {
				this._valueHelpDialogcomp = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.CompCode",
					this
				);
				this.getView().addDependent(this._valueHelpDialogcomp);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogcomp.getBinding("items").filter(new Filter([new Filter(
				"Bukrs",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Butxt",
				FilterOperator.Contains, sInputValue
			)]));
			this.getCompanyList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogcomp.open(sInputValue);
		},
		_handlevendorCompSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Bukrs",
				FilterOperator.Contains, sValue
			), new Filter(
				"Butxt",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlevendorCompClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Company SEarch end*/

		/*PGRP Search start*/

		getPurchaseGroupList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_purgrp_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseGroupList", oData.results);
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

		handlePurchaseGroupVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogpgrop) {
				this._valueHelpDialogpgrop = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.PurchaseGroup",
					this
				);
				this.getView().addDependent(this._valueHelpDialogpgrop);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogpgrop.getBinding("items").filter(new Filter([new Filter(
				"Ekgrp",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Eknam",
				FilterOperator.Contains, sInputValue
			)]));
			this.getPurchaseGroupList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogpgrop.open(sInputValue);
		},
		_handlePurchaseGroupSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Ekgrp",
				FilterOperator.Contains, sValue
			), new Filter(
				"Eknam",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlePurchaseGroupClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*POGRP SEarch end*/

		/*plant search start*/

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
					"com.vSimpleApp.view.fragment.Vendor.fragment.Plant",
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
			var getPurchase = this.getView().getModel("CreateContract");
			var vendorModel = this.getView().getModel("PurchaseModel");
			var Materialno = getPurchase.getProperty("/Materialno");
			var VendorNumber = vendorModel.oData.TempContract.Lifnr;
			console.log(Materialno);

			console.log(VendorNumber);

			var oModel = oView.getModel("VHeader");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var PlantNumber = oSelectedItem.getTitle();
				console.log(PlantNumber);
				console.log(Materialno);
				oView.byId("Price").setValue(getPurchase.getProperty("/Stprs"));
				var s = "This";
				var a = oView.byId("Price").setValue(s);
				if ($.isNumeric((Materialno)) == true) {
					var len = Materialno.length;
					if (len !== undefined) {
						var z = 18 - len;
						for (var i = 0; i < z; i++) {
							zero += "0";
						}
					}
					console.log(len);
					console.log(zero);
					Materialno = zero + Materialno;
					console.log(Materialno)
				}

				var notzwer = "";
				//	var no;

				if ($.isNumeric((VendorNumber)) == true) {
					var len = VendorNumber.length;
					if (len !== undefined) {
						var z = 10 - len;
						for (var i = 0; i < z; i++) {
							notzwer += "0";
						}
					}
					console.log(len);
					console.log(notzwer);
					VendorNumber = notzwer + VendorNumber;
				}
				console.log(VendorNumber);
				var oFilter = new sap.ui.model.Filter('Lifnr', sap.ui.model.FilterOperator.EQ, VendorNumber);
				var oFilterV = new sap.ui.model.Filter('Matnr', sap.ui.model.FilterOperator.EQ, Materialno);
				var that = this;
				oModel.read("/fetch_matpriceSet?$filter=(Lifnr eq '" + VendorNumber + "',Matnr eq '" + Materialno + "')", {
					filters: [oFilter, oFilterV],

					/*		oModel.read("/fetch_matpriceSet(Matnr='" + Materialno + "',Bwkey='" + PlantNumber + "')", {
					 */ //	oModel.read("/fetch_matpriceSet(Lifnr='" + VendorNumber + "',Matnr ='" + Materialno + "')", {

					//	oModel.read("/fetch_matpriceSet?$filter=(Lifnr eq + VendorNumber + and Matnr eq + Materialno + ))",{

					success: function(oData) {

						console.log(oData);

						if (!oData.results.length) {
							alert("No price found for given material number and plant combination. Add the price manually.");
							var aaas = "0.00"
							console.log(aaas);
							var ab = $(that)[0].inputId;
							var id = $("#" + ab).closest("tr").find(".price1").attr("id");
							$("#" + id + "-inner").val(aaas);
						} else {
							console.log("array having values");
							var PriceJson = new JSONModel();
							PriceJson.setData(oData.results);
							oView.setModel(PriceJson);
							var oHierarchyModel = new sap.ui.model.json.JSONModel();
							oView.setModel(oHierarchyModel, "hierarchy");
							oView.getModel("hierarchy").setData(oData);
							var aaas = oHierarchyModel.oData.results[0].Netpr;

							console.log(aaas);
							var ab = $(that)[0].inputId;
							var id = $("#" + ab).closest("tr").find(".price1").attr("id");
							$("#" + id + "-inner").val(aaas);
							//	$("#" + id + "-inner").val(oHierarchyModel.getProperty("/Netpr"));

							//var price = oView.byId("idPrice").setValue(PriceJson.getProperty("/Stprs"));

						}

					},
					error: function(oError) {
						console.log(oError);

					}

				});

				evt.getSource().getBinding("items").filter([]);
			}
		},

		/*plant search end*/

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

		handlePOMaterialHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogph) {
				this._valueHelpDialogph = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.fragment.MaterialNumber",
					this
				);
				this.getView().addDependent(this._valueHelpDialogph);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogph.getBinding("items").filter(new Filter([new Filter(
				"Materialno",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));
			this.getMaterialList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogph.open(sInputValue);
		},
		_handlePOMaterialSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Materialno",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlePOMaterialClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var getPurchase = this.getView().getModel("CreateContract");
			var oModel = oView.getModel("Lookup");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				var oDiscription = oModel.getProperty(sBindPath + "/Description");
				var uom = oModel.getProperty(sBindPath + "/UOM");

				var ab = $(this)[0].inputId;
				var id = $("#" + ab).closest("tr").find(".desc1").attr("id");
				$("#" + id + "-inner").val(oDiscription);

				getPurchase.getData().Materialno = oSelectedItem.getTitle();
				var a = getPurchase.getData().Description = oModel.getProperty(sBindPath + "/Description");
				var UOM = getPurchase.getData().UOM = oModel.getProperty(sBindPath + "/UOM");

				var b = oModel.getProperty(sBindPath + "/UOM");
				//this.getView().byId("measure1").setValue(b); getPurchase.getData().UOM = 
				var ab1 = $(this)[0].inputId;
				var id1 = $("#" + ab1).closest("tr").find(".measure1").attr("id");
				$("#" + id1 + "-inner").val(b);

				//		getPurchase.getData().PurchaseGroup = oModel.getProperty(sBindPath + "/ ");
			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*Material SEarch end*/

		/*material discription start*/

		/*Comp Search start*/

		getMaterialDisList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/MaterialmasterSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/MaterialDiscription", oData.results);
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

		handleMaterialDisVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMD) {
				this._valueHelpDialogMD = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.fragment.MaterialDescription",
					this
				);
				this.getView().addDependent(this._valueHelpDialogMD);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogMD.getBinding("items").filter(new Filter([new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Materialno",
				FilterOperator.Contains, sInputValue
			)]));
			this.getMaterialDisList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogMD.open(sInputValue);
		},
		_handleMaterialDisSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Description",
				FilterOperator.Contains, sValue
			), new Filter(
				"Materialno",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleMaterialDisClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var getPurchase = this.getView().getModel("CreateContract");
			var oModel = oView.getModel("Lookup");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					//productInput2 = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);

				//	productInput.setValue(sTitle);
				//**********
				//var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(sTitle);

				var oMat = oModel.getProperty(sBindPath + "/Materialno");
				var ab = $(this)[0].inputId;
				var id = $("#" + ab).closest("tr").find(".mtid").attr("id");
				$("#" + id + "-inner").val(oMat);

				var oDiscription = oModel.getProperty(sBindPath + "/Description");
				var uom = oModel.getProperty(sBindPath + "/UOM");

				getPurchase.getData().Materialno = sDescription;

				var b = oModel.getProperty(sBindPath + "/UOM");
				//this.getView().byId("measure1").setValue(b); getPurchase.getData().UOM = 
				var ab1 = $(this)[0].inputId;
				var id1 = $("#" + ab1).closest("tr").find(".measure1").attr("id");
				$("#" + id1 + "-inner").val(b);

				var vendorModel = this.getView().getModel("PurchaseModel");
				var path = vendorModel.oData.TempContract.POItem;
				var Modifiedlenght = path.length - 1;

				path[Modifiedlenght].Matnr = sDescription;
				vendorModel.setProperty(path + "/Matnr");

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Company SEarch end*/

		onAddNewConditionItem: function() {
			var oVendorModel = this.getOwnerComponent().getModel("PurchaseModel");

			var aPurchaseConditionItems = oVendorModel.getProperty("/TempContract/POItem");
			aPurchaseConditionItems.push(new RebateConditionItemPO({
				Ebelp: (aPurchaseConditionItems.length + 1).toString()
			}));

			oVendorModel.refresh(false);

		},

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

		suggestionVebor: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			//get the all data for selected values
			var oModel1 = this.getOwnerComponent().getModel("VHeader");
			if (oSelectedItem) {
				var zero = "";
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				//	productInput.setValue(oSelectedItem.getText());
				var no = oSelectedItem.getText();
				console.log($.isNumeric((no)));
				if ($.isNumeric((no)) == true) {
					var len = no.length;
					if (len !== undefined) {
						var z = 10 - len;
						for (var i = 0; i < z; i++) {
							zero += "0";
						}
					}
					console.log(len);
					console.log(zero);
					no = zero + no;
				}
				console.log(zero + no);
				oModel1.read("/Fetch_Vendor_DetailsSet('" + no + "')", {
					success: function(oData) {
						var VendorData = new JSONModel();
						VendorData.setData(oData);
						sap.ui.getCore().setModel(VendorData);
						var a = oView.byId("idPurchaseOrg").setValue(VendorData.getProperty("/Ekorg"));
						var oCompanyCode = oView.byId("cc").setValue(VendorData.getProperty("/Bukrs"));
						var c = oView.byId("pg").setValue(VendorData.getProperty("/Ekgrp"));
						/*		var oCompanyCode = VendorData.getProperty("/Bukrs");
						oView.byId("ccode").setValue(oCompanyCode);
			*/
						var sCmpCode = VendorData.getProperty("/Bukrs");
						console.log(sCmpCode);
						/*	$("#__xmlview1--ccode-inner").val(oData.Bukrs);
					$("#__xmlview1--porg-inner").val(oData.Ekorg);
					$("#__xmlview1--pgrp-inner").val(oData.Ekgrp);
			*/
						console.log(oData);

						oModel1.read("/get_companycode_f4helpSet(Mandt='800',Bukrs='" + sCmpCode + "')", {
							//filters: aFilter,
							success: function(oData) {
								console.log(oData);
								var GetCompCode = new JSONModel();
								GetCompCode.setData(oData);
								sap.ui.getCore().setModel(GetCompCode);

								var oCurrency = oView.byId("cu").setValue(GetCompCode.getProperty("/Waers"));
								console.log(oCurrency);
							},
							error: function(oError) {
								console.log(oError);
							}
						});
					},
					error: function(oError) {
						console.log(oError);
					}
				});

			}

		},

		onCancelPRess: function(event) {

			MessageToast.show("Cancelling Order");
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();

			//	oPurchaseModel.setData([]);
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);
			oPurchaseModel.refresh(true);
			this.getView().getModel("VHeader").refresh();

			oView.byId("idPurchaseOrg").setValue("");
			oView.byId("pg").setValue("");
			oView.byId("cc").setValue("");
			oView.byId("vnumber").setValue("");
			oView.byId("cu").setValue("");
			oView.byId("VendorName").setValue("");

			var idq = "__xmlview1--nDescription-__clone1";
			$("#" + idq + "-inner").val(" ");

			var idqq = "__xmlview1--uom1-__clone3";
			$("#" + idqq + "-inner").val(" ");

			var idqa = "__xmlview1--Price-__clone5";
			$("#" + idqa + "-inner").val(" ");

			//redirect the page	frot view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");

		},
		onSavePurchaseOrder: function(evt) {
			var oPurchaseModel = this.getView().getModel("PurchaseModel");
			var oPurchaseContract = oPurchaseModel.getProperty("/TempContract");

			var oRequestPayload = oPurchaseContract.getRequestPayload();

			//	var Ebeln = oRequestPayload.Ebeln;
			var Bukrs = oRequestPayload.Bukrs;
			//	var Bsart = oPurchaseContract.Bsart;
			var Lifnr = oRequestPayload.Lifnr;

			var zero = "";
			//	var no;
			console.log($.isNumeric((Lifnr)));
			if ($.isNumeric((Lifnr)) == true) {
				var len = Lifnr.length;
				if (len !== undefined) {
					var z = 10 - len;
					for (var i = 0; i < z; i++) {
						zero += "0";
					}
				}
			}
			console.log(len);
			console.log(zero);
			Lifnr = zero + Lifnr;
			console.log(Lifnr);
			var Ekorg = oRequestPayload.Ekorg;
			var Ekgrp = oRequestPayload.Ekgrp;
			var Waers = oRequestPayload.Waers;

			var POItem = [];

			var aItems = oRequestPayload.POItem;
			console.log(aItems.length);

			// Define an empty Array
			var itemData = [];

			//iterate the values of levels
			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

				var l_Ebelp = oPurchaseContract.POItem[iRowIndex].Ebelp;

				var l_material = oPurchaseContract.POItem[iRowIndex].Matnr;

				var l_Menge = oPurchaseContract.POItem[iRowIndex].Menge;
				var l_Werks = oPurchaseContract.POItem[iRowIndex].Werks;

				itemData.push({

					Ebelp: l_Ebelp,
					Matnr: l_material,
					Werks: l_Werks,
					Menge: l_Menge

				});
			}
			var payLoad = {

				"Bukrs": Bukrs,
				"Bsart": "EC",
				"Lifnr": Lifnr,
				"Ekorg": Ekorg,
				"Ekgrp": Ekgrp,
				"Waers": Waers,

				"POItem": itemData

			};
			console.log(payLoad);

			var oEntry1 = {};
			//	oEntry1.Ebeln = Ebeln;
			oEntry1.Bukrs = Bukrs;
			oEntry1.Bsart = "EC";
			oEntry1.Lifnr = Lifnr;
			oEntry1.Ekorg = Ekorg;
			oEntry1.Ekgrp = Ekgrp;
			oEntry1.Waers = Waers;

			//set the item data to ProductSet
			oEntry1.POItem = itemData;
			console.log(oEntry1);
			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(0);

			//method for creating the prod
			oModel.create("/POHeaderSet", payLoad, {
				success: this._onCreateEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});

			oPurchaseModel.refresh(true);

		},
		_onCreateEntrySuccess: function(oObject, oResponse) {
			BusyIndicator.hide();
			var successObj = oResponse.data.Ebeln;

			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			var s = oPurchaseModel.oData.TempContract.destroy;
			var aaa = oPurchaseModel.oData.TempContract.setData([]);
			//	s.refresh(true);

			oView.byId("idPurchaseOrg").setValue("");
			oView.byId("pg").setValue("");
			oView.byId("cc").setValue("");
			oView.byId("vnumber").setValue("");
			oView.byId("cu").setValue("");
			oView.byId("VendorName").setValue("");

			var idq = "__xmlview1--nDescription-__clone1";
			$("#" + idq + "-inner").val(" ");

			var idqq = "__xmlview1--uom1-__clone3";
			$("#" + idqq + "-inner").val(" ");

			var idqa = "__xmlview1--Price-__clone5";
			$("#" + idqa + "-inner").val(" ");

			oPurchaseModel.refresh(true);
			this.getView().getModel("VHeader").refresh();

			sap.m.MessageBox.show("Standard PO created under the number  #" + successObj + " ", {
				icon: sap.m.MessageBox.Icon.INFORMATION,

				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CLOSE],
				onClose: function(oAction) {
					if (oAction === "OK") {
						var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
						oRouter.navTo('PODetails');
					}
				}.bind(this)
			});

		},
		_onCreateEntryError: function(oError) {
			BusyIndicator.hide();
			var x = JSON.parse(oError.responseText);
			var err = x.error.message.value;

			jQuery.sap.require("sap.m.MessageBox");
			
			sap.m.MessageBox.error(
				"Error creating entry: " + err + " "  
			);

	
		},

		onEditPOOrders: function() {
			var oComponent1 = this.getOwnerComponent();
			oComponent1.getRouter().navTo("DisplayPOItems");
		},
		onEditPRess: function() {

			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			//	oPurchaseModel.setData([]);
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);

			oPurchaseModel.refresh(true);
			this.getView().getModel("VHeader").refresh();
			var oComponent1 = this.getOwnerComponent();
			oComponent1.getRouter().navTo("EditPOOrder");

		},

		/*Table PO ITems fragement*/
		AddPOITems: function() {
			this.pressDialog = this.getView().byId("ListDialog");
			if (!this.pressDialog) {
				this.pressDialog = sap.ui.xmlfragment("com.vSimpleApp.view.POTable.PoItems", this);
				//this.getView().addDependent(pressDialog);
				//  this.pressDialog.setModel(this.getView().getModel());
				this.pressDialog.open();
			}
		},

		onCloseFu: function() {
			this.pressDialog.close();
			this.pressDialog.destroy();
		},
		onExit: function() {
			if (this.pressDialog) {
				this.pressDialog.destroy();
			}
		},
		/*Table PO ITems  fragment end*/

		/*Table Condition header item fragement*/
		AddConditionItemsHeader: function() {
			this.pressConditionDialog = this.getView().byId("idConditonITems");
			if (!this.pressConditionDialog) {
				this.pressConditionDialog = sap.ui.xmlfragment("com.vSimpleApp.view.POTable.ConditionHeaderTable", this);
				//this.getView().addDependent(pressDialog);
				//  this.pressDialog.setModel(this.getView().getModel());
				this.pressConditionDialog.open();
			}
		},

		onCloseCondition: function() {
			this.pressConditionDialog.close();
			this.pressConditionDialog.destroy();
		},
		onExitCondition: function() {
			if (this.pressConditionDialog) {
				this.pressConditionDialog.destroy();
			}
		},
		/*Table Condition header item fragment end*/

		/*Table Partner header item fragement*/
		AddPartnerHeaderItems: function() {
			this.pressPartnerDialog = this.getView().byId("idPartnerHITems");
			if (!this.pressPartnerDialog) {
				this.pressPartnerDialog = sap.ui.xmlfragment("com.vSimpleApp.view.POTable.PartnerHeader", this);
				//this.getView().addDependent(pressDialog);
				//  this.pressDialog.setModel(this.getView().getModel());
				this.pressPartnerDialog.open();
			}
		},

		onClosePartner: function() {
			this.pressPartnerDialog.close();
			this.pressPartnerDialog.destroy();
		},
		onExitPartner: function() {
			if (this.pressPartnerDialog) {
				this.pressPartnerDialog.destroy();
			}
		},
		/*Table Partner header item fragment end*/

		/*Table DeliverySchedule header item fragement*/
		AddDeliveryScheduleHeaderItems: function() {
			this.pressDeliveryScheduleDialog = this.getView().byId("idDeliveryScheduleITems");
			if (!this.pressDeliveryScheduleDialog) {
				this.pressDeliveryScheduleDialog = sap.ui.xmlfragment("com.vSimpleApp.view.POTable.DeliveryScheduleTable", this);
				//this.getView().addDependent(pressDialog);
				//  this.pressDialog.setModel(this.getView().getModel());
				this.pressDeliveryScheduleDialog.open();
			}
		},

		onCloseDeliverySchedule: function() {
			this.pressDeliveryScheduleDialog.close();
			this.pressDeliveryScheduleDialog.destroy();
		},
		onExitDeliverySchedule: function() {
				if (this.pressDeliveryScheduleDialog) {
					this.pressDeliveryScheduleDialog.destroy();
				}
			}
			/*Table DeliverySchedule header item fragment end*/

	});

});