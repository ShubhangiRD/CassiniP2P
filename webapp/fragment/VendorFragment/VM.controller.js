sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"com/cassiniProcureToPay/model/displayVendor",
	"sap/m/MessageToast",
	"com/cassiniProcureToPay/model/Vendor",
	"sap/ui/core/routing/History",
	"sap/ui/core/BusyIndicator"

], function(Controller, Filter, JSONModel, MessageBox, FilterOperator, Fragment, displayVendor, MessageToast, Vendor,
	History,
	BusyIndicator) {
	"use strict";
	var oView, oComponent;
	return Controller.extend("com.cassiniProcureToPay.controller.VM", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.VM
		 */
		onInit: function() {
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var oModel = this.getOwnerComponent().getModel("VHeader");
			var oModelLookup = this.getOwnerComponent().getModel("Lookup");

			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			console.log(oModel);
			oView.byId("iddEditt").setVisible(false);
			var oHierarchyModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oHierarchyModel, "hierarchy");

			var oEditModel = new JSONModel({
				isEditable: true
			});

			this.getView().setModel(oEditModel, "EditModel");
			var oVisibleModel = new JSONModel({
				isVisible: false
			});

			this.getView().setModel(oVisibleModel, "VisibleModel");
			var ScreenModel = new JSONModel({
				isScreen: "Create Vendor"
			});

			this.getView().setModel(ScreenModel, "ScreenName");

			var oVendorModel = this.getOwnerComponent().getModel("Vendor");

			var number = oVendorModel.oData.Vendor;

			var listvd = oModelLookup.oData.DisplyaVendorList;

			if (number !== "" || number !== undefined) {
				var a = "Display Vendor";
				oView.getModel("ScreenName").setProperty("/isScreen", a);
				oView.getModel("VisibleModel").setProperty("/isVisible", true);
				oView.byId("btn_display").setVisible(false);
				oView.byId("iddEditt").setVisible(true);
				oView.getModel("EditModel").setProperty("/isEditable", false);

				for (var y = 0; y < listvd.length; y++) {
					if (number == listvd[y].Lifnr) {
						
						var Ekorg = listvd[y].Ekorg;
						var ComCode = listvd[y].Bukrs;
						var Ktokk = listvd[y].Ktokk;
						
						console.log(Ekorg);
						console.log(Ktokk);
						oView.byId("idAccGp").setValue(Ktokk);
						oView.byId("idPurOrg").setValue(Ekorg);

					}
				}

			}

		},
		/*Vendor Details f4 functionality start here*/
		onNavBack: function(oevt) {

			var oVendorModel = oComponent.getModel("Vendor");

			oVendorModel.setData({
				oData: {}
			});
			oVendorModel.updateBindings(true);

			oVendorModel.refresh(true);
			var a = "Create Vendor";
			oView.getModel("ScreenName").setProperty("/isScreen", a);
			oView.getModel("EditModel").setProperty("/isEditable", true);
			oView.getModel("VisibleModel").setProperty("/isVisible", false);
			oView.byId("btn_display").setVisible(true);
			oView.byId("iddEditt").setVisible(false);

			this.getOwnerComponent().getRouter().navTo("ShowTiles");

		},
		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);

			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					//	//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/DisplyaVendorList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					//	//BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleVendorValueHelpBox: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdVendor = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogDisplayV) {
				this._valueHelpDialogDisplayV = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Display",
					this
				);
				this.getView().addDependent(this._valueHelpDialogDisplayV);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogDisplayV.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogDisplayV.open(sInputValue);
			this.getVendorList();
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
			var oModelRe = this.getOwnerComponent().getModel("VHeader");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdVendor),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sDescription);

				var zero = "";
				//	var no;

				var len = sDescription.length;
				if (len !== undefined) {
					var z = 10 - len;
					for (var i = 0; i < z; i++) {
						zero += "0";
					}
				}

				console.log(len);
				console.log(zero);
				sDescription = zero + sDescription;
				console.log(sDescription);

				//	this.getVendorDetails(sDescription);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;

				var ComCode = oModel.getProperty(sBindPath + "/Bukrs");
				var Lifnr = oModel.getProperty(sBindPath + "/Lifnr");
				var Ekorg = oModel.getProperty(sBindPath + "/Ekorg");
				var Ktokk = oModel.getProperty(sBindPath + "/Ktokk");
				oView.byId("idVendor").setValue(Lifnr);

				/*		oView.byId("idCompCode").setValue(ComCode);
						oView.byId("idAccGp").setValue(Ktokk);
						oView.byId("idPurOrg").setValue(Ekorg);

				*/
				console.log(sDescription);
				console.log(ComCode)

				var aFilter = [
					new sap.ui.model.Filter({
						path: "Vendorno",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: sDescription
					}),
					new sap.ui.model.Filter({
						path: "Companycode",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: ComCode
					})

				];
				BusyIndicator.show(true);
				oModelRe.read("/bapi_vendor_getdetailSet", {
					//oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						BusyIndicator.hide(false);
						console.log(oData);
						var item = oData.results.length;

						var oVendor = new Vendor(oData.results[0]);
						oComponent.getModel("Vendor").setData(oData.results[0]);

						/*	var oVendor = new Vendor(oData.results[0]);
						oComponent.getModel("Vendor").setProperty("/VendorTemp", oVendor); // setData(oData.results);
				*/

						//	oView.getModel("Vendor",oVendor); // setData(oData.results);
						//	oView.getModel("Vendor").setData(oData.results); // setData(oData.results);
						//	oView.setModel(oVendor,"Vendor");
						oView.byId("idAccGp").setValue(Ktokk);
						oView.byId("idPurOrg").setValue(Ekorg);

					},
					error: function(oError) {
						BusyIndicator.hide(false);
						//console.log(oError);
					}
				});

			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Vendor Details f4 functionality end here*/

		/*Po Search*/
		getPurchaseOrgList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/get_purchaseorg_f4helpSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseOrganization", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handlePurchaseOrgVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdPOD = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogporg) {
				this._valueHelpDialogporg = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.PurchaseOrg",
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

			// open value help dialog filtered by the input value
			this._valueHelpDialogporg.open(sInputValue);
			this.getPurchaseOrgList();
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
				var productInput = this.byId(this.inputIdPOD),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*PO Search end*/

		/*PPlanning Group Search*/
		getPlanningGroups: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/PlanningGroupsSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PlanningGroups", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handlePlanningGroups: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdPGG = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPlanG) {
				this._valueHelpDialogPlanG = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.PlanningGroups",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPlanG);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPlanG.getBinding("items").filter(new Filter([new Filter(
					"Grupp",
					FilterOperator.Contains, sInputValue
				)

			]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPlanG.open(sInputValue);
			this.getPlanningGroups();
		},
		handlePlanningSearchGroup: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Grupp",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		handlePlaningGroupsClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdPGG),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*Planning Group Search end*/

		/*Comp Search start*/

		getCompanyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/get_companycode_f4helpSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CountryCode", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleCompanyCodeVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdCCode = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogcomp) {
				this._valueHelpDialogcomp = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.CompCode",
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

			// open value help dialog filtered by the input value
			this._valueHelpDialogcomp.open(sInputValue);
			this.getCompanyList();
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
				var productInput = this.byId(this.inputIdCCode),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Company SEarch end*/

		/*Account Group Search Start*/
		getAccountList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(true);
			oModel.read("/get_accountgrp_f4helpSet", {
				success: function(oData) {
					BusyIndicator.hide(false);
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/AccountGroup", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					BusyIndicator.hide(false);
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleAccountCodeVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdAcolist = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogAccCode) {
				this._valueHelpDialogAccCode = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.AccGrp",
					this
				);
				this.getView().addDependent(this._valueHelpDialogAccCode);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogAccCode.getBinding("items").filter(new Filter([new Filter(
				"Ktokk",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Ktokk",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogAccCode.open(sInputValue);
			this.getAccountList();
		},
		_handlevendorAccountGSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Ktokk",
				FilterOperator.Contains, sValue
			), new Filter(
				"Ktokk",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlevendorAccountGClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdAcolist),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Account Group SEarch end*/

		/*Country Code Start*/
		getCountryList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/country_keySet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CountryCodeRegion", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleValueHelpCountryCode: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdContry = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogcountry) {
				this._valueHelpDialogcountry = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.Country",
					this
				);
				this.getView().addDependent(this._valueHelpDialogcountry);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogcountry.getBinding("items").filter(new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Landx",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogcountry.open(sInputValue);
			this.getCountryList();
		},
		_handlecountryVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Landx",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlecountryVendorClose: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdContry);
				productInput.setValue(oSelectedItem.getTitle());
				var sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				var oModel = this.getView().getModel("VHeader");
				oView.byId("TimeZone").setValue(sDescription);

				var cd = oSelectedItem.getTitle();

				var oFilter = new sap.ui.model.Filter('Land1', sap.ui.model.FilterOperator.EQ, cd);
				oModel.read("/region_keySet?$filter=(Land1 eq '" + cd + "')", {
					filters: [oFilter],
					success: function(oData) {
						var VendorData = new JSONModel();
						VendorData.setData(oData.results);
						oView.setModel(VendorData);
						//oView.setModel(VendorData,"CountryModel"); 
						//	oView.getModel().getData();
						//oView.getModel("CountryModel").getData();
						//	oView.getSource().getBinding("items").filter([]);
						//	oView.getModel("CountryModel").setData(oData.results);
						//	oView.getModel("CountryModel").setProperty("/Bland", oData.results);
						//	var a = oView.byId("idRign").setValue(VendorData.getProperty("/Bland"));
						oView.getModel("hierarchy").setData(oData);
						/*	var oHierarchyModel = new sap.ui.model.json.JSONModel(oData);
							oView.setModel(oHierarchyModel, "hierarchy");
						*/
						//var a = oView.byId("idCity").setValue(oHierarchyModel.getProperty("/Bezei"));

						console.log(oData);

					},
					error: function(oError) {
						console.log(oError);
					}
				});

			}
			oEvent.getSource().getBinding("items").filter([]);

		},

		/*Country code end*/

		/*Region Code start*/

		handleValueHelpCust: function(oEvent) {
			//var oView = this.getView().getId();
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdCust = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogcust) {
				this._valueHelpDialogcust = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.Region",
					this
				);
				this.getView().addDependent(this._valueHelpDialogcust);
			}

			// create a filter for the binding
			this._valueHelpDialogcust.getBinding("items").filter(
				[
					new Filter("Bland", sap.ui.model.FilterOperator.Contains, sInputValue),
					new Filter("Bezei", sap.ui.model.FilterOperator.Contains, sInputValue)

				]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogcust.open(sInputValue);
		},
		_handleValueHelpSearchCust: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterID = new Filter("Bland", sap.ui.model.FilterOperator.EQ, sValue);
			var oFilterName = new Filter("Bezei", sap.ui.model.FilterOperator.EQ, sValue);
			evt.getSource().getBinding("items").filter([oFilterID, oFilterName]);
		},
		_handleValueHelpCloseCust: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdCust);

				productInput.setValue(oSelectedItem.getDescription());
				var aa = oSelectedItem.getTitle();

				var a = oView.byId("idDistin").setValue(aa);

			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*language f4 start here*/
		getLanguages: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			BusyIndicator.show(0);
			oModel.read("/LanguageSet", {
				success: function(oData) {
					console.log(oData)
						////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/LanguageList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleLanguage: function(oEvent) {
			//var oView = this.getView().getId();
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdLanguage = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogLanguage) {
				this._valueHelpDialogLanguage = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.Language",
					this
				);
				this.getView().addDependent(this._valueHelpDialogLanguage);
			}

			// create a filter for the binding
			this._valueHelpDialogLanguage.getBinding("items").filter(
				[
					new Filter("Sptxt", sap.ui.model.FilterOperator.Contains, sInputValue),
					new Filter("Sptxt", sap.ui.model.FilterOperator.Contains, sInputValue)

				]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogLanguage.open(sInputValue);
			this.getLanguages();

		},
		_handleValueHelpSearchLanguage: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilterID = new Filter("Sptxt", sap.ui.model.FilterOperator.EQ, sValue);
			var oFilterName = new Filter("Sptxt", sap.ui.model.FilterOperator.EQ, sValue);
			evt.getSource().getBinding("items").filter([oFilterID, oFilterName]);
		},
		_handleValueHelpCloseLanguage: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("idlanguage").setValue(oSelectedItem.getTitle());

		},
		/*language f4 end here*/
		/*Customer code starts here*/

		getCustomerList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			BusyIndicator.show(0);
			oModel.read("/getcustomerSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					console.log(oData);
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CustomerList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleCustomer: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdCustomer = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpCustomerList) {
				this._valueHelpCustomerList = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.CustomerList",
					this
				);
				this.getView().addDependent(this._valueHelpCustomerList);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpCustomerList.getBinding("items").filter(new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpCustomerList.open(sInputValue);
			this.getCustomerList();
		},
		_handleCustomerVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleCustomerVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("idCustomer").setValue(oSelectedItem.getTitle());

		},
		/*Customer List code ends here*/

		/*Trading partner code start*/

		handleTradingPartners: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTP = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogtradingpartners) {
				this._valueHelpDialogtradingpartners = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.TradingPartners",

					this
				);
				this.getView().addDependent(this._valueHelpDialogtradingpartners);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogtradingpartners.getBinding("items").filter(new Filter([new Filter(
				"Bukrs",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Butxt",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogtradingpartners.open(sInputValue);
			this.getCompanyList();
		},
		_handleValueTPHelpClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("idTrading").setValue(oSelectedItem.getTitle());

		},
		_handleValueTPHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},

		/*Trading partner code end*/

		getIndustryList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/industrysSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/IndustrySet", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleValueHelpIndustry: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdInd = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogIndustryS) {
				this._valueHelpDialogIndustryS = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.IndustryList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogIndustryS);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogIndustryS.getBinding("items").filter(new Filter([new Filter(
				"Brsch",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Brtxt",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogIndustryS.open(sInputValue);
			this.getIndustryList();
		},
		_handleValueHelpIndustrySearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Brsch",
				FilterOperator.Contains, sValue
			), new Filter(
				"Brtxt",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueHelpIndustryClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("Industry1").setValue(oSelectedItem.getTitle());

		},
		/*Industry code ends here */

		/* Transport zone list code starts here*/
		getTransportZoneList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			oModel.read("/TransportZoneSet", {
				success: function(oData) {
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/TransportZoneList", oData.results);
					oLookupModel.refresh(true);
				},
				error: function(oError) {
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleTransportZone: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTzone = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogTransportZone) {
				this._valueHelpDialogTransportZone = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.TransportZoneList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogTransportZone);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogTransportZone.getBinding("items").filter(new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Zone1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogTransportZone.open(sInputValue);
			this.getTransportZoneList();
		},
		_handleTransportZoneSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Zone1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleTransportZoneClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("idTransportzone").setValue(oSelectedItem.getTitle());

		},
		/*Transport zone list code ends here*/

		/*Fiscal Address F4 function start*/
		handleFiscalAddressValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdFA = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogFA) {
				this._valueHelpDialogFA = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.FiscalAddress",
					this
				);
				this.getView().addDependent(this._valueHelpDialogFA);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogFA.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogFA.open(sInputValue);
			this.getVendorList();
		},
		_handleFiscalAddressSearch: function(evt) {
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
		_handleFiscalAddressClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdFA);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*Fiscal Address F4 function end*/

		/*Tax office  F4 function start*/
		handleTaxOfficeValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTO = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogTaxOfc) {
				this._valueHelpDialogTaxOfc = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.TaxOffice",
					this
				);
				this.getView().addDependent(this._valueHelpDialogTaxOfc);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogTaxOfc.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogTaxOfc.open(sInputValue);

		},
		_handleTaxOfficeSearch: function(evt) {
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
		_handleTaxOfficeClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdTO);
				productInput.setValue(oSelectedItem.getInfo());
			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*Tax office F4 function end*/

		/*Alternate payee list code starts here*/

		handleAlternatePayee: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdAPY = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogAlternatePayee) {
				this._valueHelpDialogAlternatePayee = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.AlternatePayeeList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogAlternatePayee);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogAlternatePayee.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogAlternatePayee.open(sInputValue);
			this.getVendorList();
		},
		_handleAlternatePayeeVendorSearch: function(evt) {

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
		_handleAlternatePayeeClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdAPY);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Alternate payee list code ends here*/

		/*Instruction Key list code starts here*/
		getInstructionKeyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/InstructionsKeysSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/InstructionKeyList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleInstructionKey: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdIKEYS = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogInstructionKey) {
				this._valueHelpDialogInstructionKey = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.InstructionKeyList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogInstructionKey);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogInstructionKey.getBinding("items").filter(new Filter([new Filter(
				"Dtaws",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Dtws1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogInstructionKey.open(sInputValue);
			this.getInstructionKeyList();
		},
		_handleInstructionKeySearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Dtaws",
				FilterOperator.Contains, sValue
			), new Filter(
				"Dtws1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleInstructionKeyClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdIKEYS);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Instruction key list code ends here*/

		/*Head Office list code starts here*/

		handleHeadOfficeHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdHO = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogHeadOffice) {
				this._valueHelpDialogHeadOffice = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.HeadOfficeList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogHeadOffice);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogHeadOffice.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogHeadOffice.open(sInputValue);
			this.getVendorList();
		},
		_handleHeadOfficeVendorSearch: function(evt) {
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
		_handleHeadOfficeVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdHO);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Head Office list code ends here*/

		/*Release Group list code starts here*/
		getReleaseGroupList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/ReleaseGroupSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ReleaseGroupList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleReleasegrpValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdRG = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogReleaseGroup) {
				this._valueHelpDialogReleaseGroup = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ReleaseGroupList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogReleaseGroup);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Frgrp
			this._valueHelpDialogReleaseGroup.getBinding("items").filter(new Filter([new Filter(
				"Frgrp",
				FilterOperator.Contains, sInputValue
			)]));
			// open value help dialog filtered by the input value
			this._valueHelpDialogReleaseGroup.open(sInputValue);
			this.getReleaseGroupList();
		},
		_handleReleaseGroupVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Frgrp",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleReleaseGroupVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdRG);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Release Group List code ends here*/

		/*Exemption Authority List code starts here*/
		getExemptionAuthorityList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/ExemptionAuthoritySet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ExemptionAuthorityList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleExmptAuthority: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdEXA = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogExmpAutho) {
				this._valueHelpDialogExmpAutho = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ExemptionAuthorityList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogExmpAutho);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogExmpAutho.getBinding("items").filter(new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogExmpAutho.open(sInputValue);
			this.getExemptionAuthorityList();
		},
		_handleExemptionVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleExemptionVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdEXA);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Exemption Authority code ends here*/

		/*Payment Terms list code starts here*/
		getPaymentTermsList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/PaymentTemsSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PaymentTermsList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handlePaymenttermsHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdPTER = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPaymentTerms) {
				this._valueHelpDialogPaymentTerms = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PaymentTermsList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPaymentTerms);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPaymentTerms.getBinding("items").filter(new Filter([new Filter(
				"Zterm",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Text1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPaymentTerms.open(sInputValue);
			this.getPaymentTermsList();
		},
		_handlePaymentTermsVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Zterm",
				FilterOperator.Contains, sValue
			), new Filter(
				"Text1",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlePaymentTermsVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdPTER);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Payment term list code ends here*/

		/*Tolerance group list code starts here*/
		getToleranceGroupList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/TolenrenceGrpSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ToleranceGroupList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleToleranceGrpValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTG = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogToleranceGroup) {
				this._valueHelpDialogToleranceGroup = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ToleranceGroupList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogToleranceGroup);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogToleranceGroup.getBinding("items").filter(new Filter([new Filter(
				"Usnam",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Rfpro",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogToleranceGroup.open(sInputValue);
			this.getToleranceGroupList();
		},
		_handleToleranceGroupVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Usnam",
				FilterOperator.Contains, sValue
			), new Filter(
				"Rfpro",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleToleranceGroupVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdTG);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Tolerance group list code ends here*/

		/*HouseBank list code starts here*/
		getHouseBankList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/HouseBankSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/HouseBankList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleHousebank: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdHoB = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogHouseBank) {
				this._valueHelpDialogHouseBank = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.HouseBankList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogHouseBank);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogHouseBank.getBinding("items").filter(new Filter([new Filter(
				"Hbkid",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Bankl",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogHouseBank.open(sInputValue);
			this.getHouseBankList();
		},
		_handleHouseBankVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Hbkid",
				FilterOperator.Contains, sValue
			), new Filter(
				"Bankl",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleHouseBankVendorClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdHoB);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*House Bank list code ends here*/

		/*Dunn recipient list code starts here*/

		handledunnreceipt: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdDunnRe = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogDunnRecipient) {
				this._valueHelpDialogDunnRecipient = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.DunnRecipientList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogDunnRecipient);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogDunnRecipient.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogDunnRecipient.open(sInputValue);
			this.getVendorList();
		},
		_handleDunnRecipientVendorSearch: function(evt) {
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
		_handleDunnRecipientVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdDunnRe);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Dunn recipient list code ends here*/

		/*Order Currenct list code starts here*/
		getOrderCurrencyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/OrderCurrencySet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/OrderCurrencyList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					MessageToast.show(oError);
				}
			});
		},

		handleOrderCurrencyValue: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdORC = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogOrderCurrency) {
				this._valueHelpDialogOrderCurrency = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.OrderCurrencyList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogOrderCurrency);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Name1 and Lifnr
			this._valueHelpDialogOrderCurrency.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogOrderCurrency.open(sInputValue);
			this.getOrderCurrencyList();
		},
		_handleOrderCurrencyVendorSearch: function(evt) {
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
		_handleOrderCurrencyVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdORC),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Order Currency list code ends here*/

		/*Incoterns list code starts here*/
		getIncotermsList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/IncotermsSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/IncotermsList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleIncotermsValue: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdInco = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogIncoterms) {
				this._valueHelpDialogIncoterms = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.IncotermsList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogIncoterms);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Inco1 and Ortob
			this._valueHelpDialogIncoterms.getBinding("items").filter(new Filter([new Filter(
				"Inco1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Ortob",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogIncoterms.open(sInputValue);
			this.getIncotermsList();
		},
		_handleIncotermsVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Inco1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Ortob",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleIncotermsVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdInco),

					sTitle = oSelectedItem.getTitle();
				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Incoterms list code ends here*/

		/*Po Search*/
		getPurchaseGroupList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			BusyIndicator.show(true);
			oModel.read("/PurchasingGroupSet", {
				success: function(oData) {
					BusyIndicator.hide(false);
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseGroupList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					BusyIndicator.hide(false);
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handlePurchaseGroupVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdPGP = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPgrp) {
				this._valueHelpDialogPgrp = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.PurchaseGroup",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPgrp);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPgrp.getBinding("items").filter(new Filter([new Filter(
				"Ekgrp",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Eknam",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPgrp.open(sInputValue);
			this.getPurchaseGroupList();
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
				var productInput = this.byId(this.inputIdPGP),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*PO Search end*/

		/*Shipping Condition list code starts here*/
		getShippingConditionList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/ShippingConditionsSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ShippingConditionList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleShippingCondition: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdSPC = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogShippingCondition) {
				this._valueHelpDialogShippingCondition = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ShippingConditionList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogShippingCondition);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Vsbed
			this._valueHelpDialogShippingCondition.getBinding("items").filter(new Filter([new Filter(
				"Vsbed",
				FilterOperator.Contains, sInputValue
			)]));
			// open value help dialog filtered by the input value
			this._valueHelpDialogShippingCondition.open(sInputValue);
			this.getShippingConditionList();
		},
		_handleShippingConditionVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Vsbed",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleShippingConditionVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdSPC),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Shipping Condition list code ends here*/

		/*Release Group list code starts here*/
		getModeOfTransport: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/ModeOfTransportSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ModeOfTransportList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleModeOfTrnsprtBorder: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdMOT = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogModeOfTransport) {
				this._valueHelpDialogModeOfTransport = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ModeOfTransport",
					this
				);
				this.getView().addDependent(this._valueHelpDialogModeOfTransport);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Frgrp
			this._valueHelpDialogModeOfTransport.getBinding("items").filter(new Filter([new Filter(
				"Vktra",
				FilterOperator.Contains, sInputValue
			)]));
			// open value help dialog filtered by the input value
			this._valueHelpDialogModeOfTransport.open(sInputValue);
			this.getModeOfTransport();
		},
		_handleModeOfTransportSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Vktra",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleModeOfTransportClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdMOT),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Release Group List code ends here*/

		/*Customer Office Entry code starts here*/
		getCustomerOfficeEntryList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/CustomerOfficeSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CustomerOfficeEntryList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleCustomerOfficeofEntry: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdCOEN = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCustomerOfficeEntry) {
				this._valueHelpDialogCustomerOfficeEntry = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.CustomerOfficeEntryList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCustomerOfficeEntry);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Land1 and Zolla
			this._valueHelpDialogCustomerOfficeEntry.getBinding("items").filter(new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Zolla",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCustomerOfficeEntry.open(sInputValue);
			this.getCustomerOfficeEntryList();
		},
		_handleCustomerOfficeEntryVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Land1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Zolla",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleCustomerOfficeEntryVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdCOEN),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*CustomerOffice Entry code ends here*/

		/*Activity group list code starts here*/
		getActivityCodeList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/ActivityGroupSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ActivityCodeList", oData.results);
					oLookupModel.refresh(true);

				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},

		handleActivityCode: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdACode = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogActivityCode) {
				this._valueHelpDialogActivityCode = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ActivityCodeList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogActivityCode);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding of Actvt
			this._valueHelpDialogActivityCode.getBinding("items").filter(new Filter([new Filter(
				"Actvt",
				FilterOperator.Contains, sInputValue
			)]));
			// open value help dialog filtered by the input value
			this._valueHelpDialogActivityCode.open(sInputValue);
			this.getActivityCodeList();
		},
		_handleActivityCodeSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Actvt",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleActivityCodeClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdACode),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Activity group list code ends here*/

		/*Interest indic set*/
		handleinterestindic: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();

			this.inputIdInd = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogInterestL) {
				this._valueHelpDialogInterestL = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.interestlndic",
					this
				);
				this.getView().addDependent(this._valueHelpDialogInterestL);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogInterestL.getBinding("items").filter(new Filter([new Filter(
				"Vzskz",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Vzskz",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogInterestL.open(sInputValue);
			this.getInterestLndicList();
		},
		_handleValueILHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Vzskz",
				FilterOperator.Contains, sValue
			), new Filter(
				"Vzskz",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueILHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdInd),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		getInterestLndicList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/IntrestsIndicSet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/InterestlndicList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		/*Interest indic set end*/

		/*Contact Person f4 functionality start here*/

		handleContPersonValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdCPERs = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCP) {
				this._valueHelpDialogCP = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ContPerson",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCP);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogCP.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCP.open(sInputValue);
			//this.getVendorList();
		},
		_handleValueContPersonHelpSearch: function(evt) {
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
		_handleValueContPersonHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdCPERs),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Contact Person f4 functionality end here*/

		/*Contact Person f4 functionality start here*/

		handleReconAccountValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogReAcc) {
				this._valueHelpDialogReAcc = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ReconAccount",
					this
				);
				this.getView().addDependent(this._valueHelpDialogReAcc);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogReAcc.getBinding("items").filter(new Filter([new Filter(
				"GLAccount",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogReAcc.open(sInputValue);
		},
		_handleReconAccountSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"GLAccount",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleReconAccountClose: function(evt) {
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
		/*Contact Person f4 functionality end here*/
		/*SortKey List code starts here*/
		handleSorkeyValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogSortKey) {
				this._valueHelpDialogSortKey = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.SortKeyList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogSortKey);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogSortKey.getBinding("items").filter(new Filter([new Filter(
				"sortno",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogSortKey.open(sInputValue);
		},
		_handleSortKeySearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"sortno",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleSortKeyClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*SortKey Liat code ends here*/

		/*CashManagement list code starts here*/

		handlecashmangmentgrpValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCashManagement) {
				this._valueHelpDialogCashManagement = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.CashManagementGroup",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCashManagement);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogCashManagement.getBinding("items").filter(new Filter([new Filter(
				"plangrp",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCashManagement.open(sInputValue);
		},
		_handleCashManagementSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"plangrp",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleCashManagementClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Cash Management code ends here*/

		/*Partner function code starts here*/
		handlepurchasefunction: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPartnerFunction) {
				this._valueHelpDialogPartnerFunction = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PartnerFunction",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPartnerFunction);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPartnerFunction.getBinding("items").filter(new Filter([new Filter(
				"function",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPartnerFunction.open(sInputValue);
		},
		_handlePartnerFunctionSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"function",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handlePartnerFunctionClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Partner function code ends here*/

		/*Pricing date control code starts here*/
		handlePricingdatecontrol: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPricingDate) {
				this._valueHelpDialogPricingDate = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PricingDateControl",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPricingDate);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPricingDate.getBinding("items").filter(new Filter([new Filter(
				"pricingno",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPricingDate.open(sInputValue);
		},
		_handleValueHelpSearchPrice: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"pricingno",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueHelpClosePrice: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Pricing date control code ends here*/

		/*Payment methods code starts here*/
		handlePaymentmethod: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogPaymentMethods) {
				this._valueHelpDialogPaymentMethods = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PaymentMethods",
					this
				);
				this.getView().addDependent(this._valueHelpDialogPaymentMethods);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogPaymentMethods.getBinding("items").filter(new Filter([new Filter(
				"paymentmethodno",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogPaymentMethods.open(sInputValue);
		},
		_handleValueHelpSearchPayment: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"paymentmethodno",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleValueHelpClosePayment: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Payment methods code ends here*/
		/*Time Zone f4 functionality start here*/
		getTimeZone: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);

			oModel.read("/TimeZoneSet", {
				success: function(oData) {
					console.log(oData);
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/TimeZoneList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleValueHelpTimeZone: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputIdTimZ = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogTimeZone) {
				this._valueHelpDialogTimeZone = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.TimeZone",
					this
				);
				this.getView().addDependent(this._valueHelpDialogTimeZone);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogTimeZone.getBinding("items").filter(new Filter([new Filter(
				"Tzone",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Zonerule",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogTimeZone.open(sInputValue);
			this.getTimeZone();
		},
		handleValueHelpTimeZoneSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Tzone",
				FilterOperator.Contains, sValue
			), new Filter(
				"Zonerule",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		handleValueHelpTimeZoneClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputIdTimZ),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*Time zone f4 functionality end here*/

		/*BankKey List code starts here*/
		getBankKeyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//	BusyIndicator.show(0);
			oModel.read("/bankkeySet", {
				success: function(oData) {
					////BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/BankKeyList", oData.results);
					oLookupModel.refresh(true);
					//that.getMaterialList();
				},
				error: function(oError) {
					////BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		handleBankKey: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogBankkey) {
				this._valueHelpDialogBankkey = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.BankKeyList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogBankkey);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogBankkey.getBinding("items").filter(new Filter([new Filter(
				"Bankl",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Banks",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogBankkey.open(sInputValue);
			this.getBankKeyList();
		},
		_handleBankKeyVendorSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Bankl",
				FilterOperator.Contains, sValue
			), new Filter(
				"Banks",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleBankKeyVendorClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*BankKey List code ends here*/

		/*taxnotype*/

		handleTaxnotype: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputTaxnotype = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpTaxnotype) {
				this._valueHelpTaxnotype = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Taxnotype",
					this
				);
				this.getView().addDependent(this._valueHelpTaxnotype);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpTaxnotype.getBinding("items").filter(new Filter([new Filter(
				"taxnoType",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpTaxnotype.open(sInputValue);

		},
		_handleTaxnoTypeSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"taxnoType",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleTaxnoTypeClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("Taxnotype").setValue(oSelectedItem.getTitle());

		},
		/*Trading partner code start*/

		/*tax type code start*/

		/*tax type code start*/

		handleTaxtype: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputTaxtype = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpTaxtype) {
				this._valueHelpTaxtype = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Taxtype",
					this
				);
				this.getView().addDependent(this._valueHelpTaxtype);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpTaxtype.getBinding("items").filter(new Filter([new Filter(
				"Taxtype",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpTaxtype.open(sInputValue);

		},
		_handleTaxTypeSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Taxtype",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleTaxTypeClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("Taxtype").setValue(oSelectedItem.getTitle());

		},

		/*tax type code ends*/

		/*Actual qm sys start*/
		handleidAcutalQMsys: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputAutalQmSys = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpAcutalQmSys) {
				this._valueHelpAcutalQmSys = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.AcutalQmSys",
					this
				);
				this.getView().addDependent(this._valueHelpAcutalQmSys);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpAcutalQmSys.getBinding("items").filter(new Filter([new Filter(
				"ActQmSys",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"ShortText",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpAcutalQmSys.open(sInputValue);
		},
		_handleAcutalQmSysSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"ActQmSys",
				FilterOperator.Contains, sValue
			), new Filter(
				"ShortText",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleAcutalQmSysClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputAutalQmSys),

					sTitle = oSelectedItem.getTitle();

				productInput.setValue(sTitle);

			}

		},

		/*Actual qm sys ends*/

		/*sex type code start*/

		handleiidsex: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputSexType = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpsex) {
				this._valueHelpsex = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.SexType",
					this
				);
				this.getView().addDependent(this._valueHelpsex);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpsex.getBinding("items").filter(new Filter([new Filter(
				"sex",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpsex.open(sInputValue);

		},

		_handleSexTypeSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"sex",
				FilterOperator.Contains, sValue
			), new Filter(
				"Description",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},
		_handleSexTypeClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			evt.getSource().getBinding("items").filter([]);

			if (!oSelectedItem) {
				return;
			}

			this.byId("idsex").setValue(oSelectedItem.getTitle());

		},

		/*sex type code end*/
		onCreatePress: function() {
			var oComponent1 = this.getOwnerComponent();
			oComponent1.getRouter().navTo("CreateContractVendor");
		},
		onDisplayPress: function(oEvent) {
			var a = "Display Vendor";

			oView.getModel("ScreenName").setProperty("/isScreen", a);

			oView.getModel("VisibleModel").setProperty("/isVisible", true);
			oView.byId("btn_display").setVisible(false);
			oView.byId("iddEditt").setVisible(true);
			oView.getModel("EditModel").setProperty("/isEditable", false);

		},
		onEditPress: function(oEvent) {
			var a = "Edit Vendor";

			oView.getModel("ScreenName").setProperty("/isScreen", a);
			oView.getModel("VisibleModel").setProperty("/isVisible", true);

			oView.byId("iddEditt").setVisible(false);
			oView.getModel("EditModel").setProperty("/isEditable", true);

		},
		onSaveContract: function(oEvt) {
			var oModel = this.getView().getModel("VHeader");

			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			//	var oTempContract = oVendorModel.getProperty("/VendorTemp");

			//	var vendor = oVendorModel.oData.Vendor;
			var oVendors = oVendorModel.getData();

			var oVendor = oVendors.Vendor;
			console.log(oVendor)

			//define and bind the model
			var ovm = new Vendor(oVendors);
			var oContract = ovm.getUpdateRequestPayload();
			console.log(oContract);

			if (oVendor === null || oVendor === undefined || oVendor === "") {
				//	BusyIndicator.show(0);
				oModel.create("/Vendor_crudSet", oContract, {

					success: this._onCreateEntrySuccess.bind(this),
					error: this._onCreateEntryError.bind(this)

				});

			} else {

				var mParameters = {
					success: this._onCreateEntrySuccess.bind(this),
					error: this._onCreateEntryError.bind(this),
					merge: false
				};
				var sVendorCreate = "/Vendor_crudSet(Lifnra='" + oVendor + "')";
				//	BusyIndicator.show(0);
				oModel.update(sVendorCreate, oContract, mParameters);
			}

		},

		_onCreateEntrySuccess: function(oObject, oResponse) {
			//BusyIndicator.hide();
			var oVendorModel = oView.getModel("Vendor");

			var Message = JSON.parse(oResponse.headers["sap-message"]).message;
			if (Message == "Vendors found with same address; check") {
				MessageBox.warning(Message);
			} else if (Message === "Changes have been made") {
				sap.m.MessageBox.show(Message, {
					icon: sap.m.MessageBox.Icon.INFORMATION,

					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CLOSE],
					onClose: function(oAction) {
						if (oAction === "OK") {

							oVendorModel.setData({
								oData: {}
							});
							oVendorModel.updateBindings(true);

							oVendorModel.refresh(true);

							this.getOwnerComponent().getRouter().navTo("ShowTiles");
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo('ShowTiles');
						}
					}.bind(this)
				});
			} else {
				sap.m.MessageBox.show(Message, {
					icon: sap.m.MessageBox.Icon.INFORMATION,

					actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CLOSE],
					onClose: function(oAction) {
						if (oAction === "OK") {

							oVendorModel.setData({
								oData: {}
							});
							oVendorModel.updateBindings(true);

							oVendorModel.refresh(true);

							this.getOwnerComponent().getRouter().navTo("ShowTiles");
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo('ShowTiles');
						}
					}.bind(this)
				});
			}

		},
		_onCreateEntryError: function(oError) {
			//BusyIndicator.hide();

			//if getting the issue while posting the accruls call the _onCreateEntryError
			//sap.ui.core.//BusyIndicator.hide();
			var x = JSON.parse(oError.responseText);
			var err = x.error.message.value;
			console.log(err);

			MessageBox.error(
				"Error creating entry: " + err + " "
			);
		}

		/*Region Code end*/
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassiniProcureToPay.view.VM
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.VM
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.VM
		 */
		//	onExit: function() {
		//
		//	}

	});

});