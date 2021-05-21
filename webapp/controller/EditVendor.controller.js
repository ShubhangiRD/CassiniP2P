sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",

	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"com/cassiniProcureToPay/model/displayVendor",
	"sap/m/MessageToast",
	"com/cassiniProcureToPay/model/VendorMasters",

	"sap/ui/core/routing/History",
	"sap/ui/core/BusyIndicator"

], function(Controller, Filter, JSONModel, MessageBox, FilterOperator, Fragment, displayVendor, MessageToast, VendorMasters,
	History,
	BusyIndicator) {
	"use strict";
	var oView, oComponent;

	return Controller.extend("com.cassiniProcureToPay.controller.EditVendor", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.view.EditVendor
		 */
		onInit: function() {
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			console.log(oModel);
			// Define the models

			/*	var getVendor = new displayVendor();
				this.getView().setModel(getVendor.getModel(), "VendorContract");
			*/
			this.getVendorList();
			oModel.read("/Fetch_Vendor_DetailsSet", {
				//	oModel.read("/fetch_matpriceSet",{

				success: function(oData) {
					console.log(oData);

				},
				error: function(oError) {
					console.log(oError);
				}
			});

			var oView1 = this.getView();
			var oComponent1 = this.getOwnerComponent();
			var oModel1 = this.getOwnerComponent().getModel("VHeader");
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel1);
			console.log(oModel1);

			this.getExemptionAuthorityList();
			oModel1.read("/DunnblockSet", {
				//	oModel.read("/fetch_matpriceSet",{

				success: function(oData) {
					console.log(oData);

				},
				error: function(oError) {
					console.log(oError);
				}
			});
			
			this.getCustomerList();
			this.getPaymentTermsList();
			this.getIndustryList();
			this.getExemptionAuthorityList();    
			this.getToleranceGroupList();
			this.getHouseBankList();
			this.getAlternatePayeeList();
			this.getDunnRecipientList();
			this.getHeadOfficeList();
			
			var oHierarchyModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oHierarchyModel, "hierarchy");

			// Define the models
			var UpdateContract = new VendorMasters();
			this.getView().setModel(UpdateContract.getModel(), "VendorContract");

			var oEditModel = new JSONModel({
				isEditable: false
			});

			this.getView().setModel(oEditModel, "EditModel");

			var oEditContModel = new JSONModel({
				VendorNumber: "",
				CompCode: "",
				AccountGrp: "",
				PurchaseOrg: "",
				StreetHouse: "",
				PaymentTerm: "",
				FirstName: "",
				Email: "",
				Tcode: "",
				Telephone: "",
				LastName: "",
				PostalCode: "",
				City: "",
				OrderCurrency: "",
				Country: "",
				Region: ""
			});

			this.getView().setModel(oEditContModel, "AddEditModel");

		},
		onSelectTab: function(evt) {
			//navigate the property is selected subheader.

			var selectedTab = evt.getParameter("key");
			console.log(selectedTab);

			if (selectedTab === "Vendor Master") {
				oComponent.getRouter().navTo("VendorCreate");
			} else if (selectedTab === "Purchase Order") {
				oComponent.getRouter().navTo("PurchaseOrderTable");
			} else if (selectedTab === "Post Goods Receipt") {
				oComponent.getRouter().navTo("GoodReceipt");
			} else if (selectedTab === "Book Vendor Invoice") {
				oComponent.getRouter().navTo("Dashboard");
			} else if (selectedTab === "Vendor Rebate Management") {
				oComponent.getRouter().navTo("DashboardVendor");
			}

		},

		onMenuButtonPress: function() {
			oView.byId("idVendor").setValue("");
			oView.byId("idCompCode").setValue("");
			oView.byId("idPurOrg").setValue("");
			oView.byId("idAccGp").setValue("");
			oView.byId("idCountryCode").setValue("");
			oView.byId("idFname").setValue("");
			oView.byId("idLname").setValue("");
			oView.byId("idStreet").setValue("");
			oView.byId("idPostcode").setValue("");
			oView.byId("idCity").setValue("");
			oView.byId("idRegion").setValue("");
			oView.byId("idTel").setValue("");
			oView.byId("idDis").setValue("");
			//	oView.byId("idBirth").setValue("");
			oView.byId("idOrderCur").setValue("");
			oView.byId("idAddno").setValue("");
			//	oView.byId("idPurGrp").setValue("");
			//redirect the page	frot view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");

			/*	var oComponent2 = this.getOwnerComponent();
				oComponent2.getRouter().navTo("ShowTiles");*/
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
		handleMaterialValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Display",
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

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},
		_handleMaterialValueHelpSearch: function(evt) {
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
		_handleValueHelpClose1: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oModel = oView.getModel("Lookup");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue("(" + sDescription + ") " + sTitle);
				if (sDescription !== "") {
					//	this.getVendorDetails(sDescription);
					var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
					oView.byId("idVendor").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
					oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Land1"));
					oView.byId("idRegion").setValue(oModel.getProperty(sBindPath + "/Regio"));
					oView.byId("idFname").setValue(oModel.getProperty(sBindPath + "/Name1"));
					oView.byId("idLname").setValue(oModel.getProperty(sBindPath + "/Name2"));
					oView.byId("idCity").setValue(oModel.getProperty(sBindPath + "/Ort01"));
					oView.byId("idTel").setValue(oModel.getProperty(sBindPath + "/Telf1"));
					oView.byId("idDis").setValue(oModel.getProperty(sBindPath + "/Ort02"));
					//	oView.byId("idBirth").setValue(oModel.getProperty(sBindPath + "/Gbort"));
					oView.byId("idStreet").setValue(oModel.getProperty(sBindPath + "/Stras"));
					oView.byId("idPostcode").setValue(oModel.getProperty(sBindPath + "/Pstlz"));
					oView.byId("idAddno").setValue(oModel.getProperty(sBindPath + "/Adrnr"));
					oView.byId("idAccGp").setValue(oModel.getProperty(sBindPath + "/Ktokk"));
					oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
					//	oView.byId("idPurGrp").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
					oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
					oView.byId("idOrderCur").setValue(oModel.getProperty(sBindPath + "/Waers"));
					//		oView.byId("gendor").setValue(oModel.getProperty(sBindPath + "/idGender"));

				}
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Country code end*/

		// Industry code starts here

		getIndustryList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/industrysSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/IndustrySet", oData.results);
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
		handleMaterialValueHelpIndustry: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogIndustry) {
				this._valueHelpDialogIndustry = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.IndustryList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogIndustry);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogIndustry.getBinding("items").filter(new Filter([new Filter(
				"Brsch",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Brtxt",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogIndustry.open(sInputValue);
		},
		_handleMaterialValueHelpIndustrySearch: function(evt) {
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
		_handleValueHelpIndustryClose1: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oModel = oView.getModel("Lookup");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue("(" + sDescription + ") " + sTitle);
				if (sDescription !== "") {
						this.getVendorDetails(sDescription);
					// var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
					// oView.byId("idVendor").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
					// oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Land1"));
					// oView.byId("idRegion").setValue(oModel.getProperty(sBindPath + "/Regio"));
					// oView.byId("idFname").setValue(oModel.getProperty(sBindPath + "/Name1"));
					// oView.byId("idLname").setValue(oModel.getProperty(sBindPath + "/Name2"));
					// oView.byId("idCity").setValue(oModel.getProperty(sBindPath + "/Ort01"));
					// oView.byId("idTel").setValue(oModel.getProperty(sBindPath + "/Telf1"));
					// oView.byId("idDis").setValue(oModel.getProperty(sBindPath + "/Ort02"));
					// //	oView.byId("idBirth").setValue(oModel.getProperty(sBindPath + "/Gbort"));
					// oView.byId("idStreet").setValue(oModel.getProperty(sBindPath + "/Stras"));
					// oView.byId("idPostcode").setValue(oModel.getProperty(sBindPath + "/Pstlz"));
					// oView.byId("idAddno").setValue(oModel.getProperty(sBindPath + "/Adrnr"));
					// oView.byId("idAccGp").setValue(oModel.getProperty(sBindPath + "/Ktokk"));
					// oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
					// //	oView.byId("idPurGrp").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
					// oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
					// oView.byId("idOrderCur").setValue(oModel.getProperty(sBindPath + "/Waers"));
					//		oView.byId("gendor").setValue(oModel.getProperty(sBindPath + "/idGender"));

				}
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Industry code ends here */
		
		/*Customer code starts here*/
		
			getCustomerList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/getcustomerSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CustomerList", oData.results);
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
		handleCustomer: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCustomer) {
				this._valueHelpDialogCustomer = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.CustomerList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCustomer);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogCustomer.getBinding("items").filter(new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCustomer.open(sInputValue);
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
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Customer List code ends here*/
		
		/*BankKey List code starts here*/
			getBankKeyList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/bankkeySet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/BankKeyList", oData.results);
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
		handleBankKey: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCustomer) {
				this._valueHelpDialogCustomer = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.BankKeyList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCustomer);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogCustomer.getBinding("items").filter(new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCustomer.open(sInputValue);
		},
		_handleBankKeyVendorSearch: function(evt) {
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
		_handleBankKeyVendorClose: function(evt) {
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
		/*BankKey List code ends here*/
		
		/*Exemption Authority List code starts here*/
		getExemptionAuthorityList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/ExemptionAuthoritySet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ExemptionAuthorityList", oData.results);
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

		handleExmptAuthority: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCustomer) {
				this._valueHelpDialogCustomer = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.ExemptionAuthorityList",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCustomer);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogCustomer.getBinding("items").filter(new Filter([new Filter(
				"Kunnr",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogCustomer.open(sInputValue);
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Exemption Authority code ends here*/
		
		/*Payment Terms list code starts here*/
		getPaymentTermsList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/PaymentTemsSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PaymentTermsList", oData.results);
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

		handlePaymenttermsHelp : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
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
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/ToleranceGroupList", oData.results);
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

		handleToleranceGrpValueHelp : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Tolerance group list code ends here*/
		
		/*HouseBank list code starts here*/
		getHouseBankList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("Vendorf4Model");
			//BusyIndicator.show(0);
			oModel.read("/HouseBankSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/HouseBankList", oData.results);
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

		handleHousebank : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*House Bank list code ends here*/
		
		/*Alternate payee list code starts here*/
		getAlternatePayeeList: function() {
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

		handleAlternatePayee : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
		_handleAlternatePayeeVendorClose: function(evt) {
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
		/*Alternate payee list code ends here*/
		
		/*Dunn recipient list code starts here*/
		getDunnRecipientList: function() {
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

		handledunnreceipt : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Dunn recipient list code ends here*/
		
		/*Head Office list code starts here*/
		getHeadOfficeList: function() {
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

		handleheadofficeHelp : function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Head Office list code ends here*/

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

				var a = oView.byId("idCity").setValue(aa);

			}
			evt.getSource().getBinding("items").filter([]);

		},

		/*company code end*/
		/*Po Search*/
		getPurchaseOrgList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_purchaseorg_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/PurchaseOrganization", oData.results);
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

		handlePurchaseOrgVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				if (sDescription !== "") {
					this.getVendorDetails(sDescription);
				}
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
				if (sDescription !== "") {
					this.getVendorDetails(sDescription);
				}
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Company SEarch end*/

		/*Account Group Search Start*/
		getAccountList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/get_accountgrp_f4helpSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/AccountGroup", oData.results);
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

		handleAccountCodeVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogAcc) {
				this._valueHelpDialogAcc = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.AccGrp",
					this
				);
				this.getView().addDependent(this._valueHelpDialogAcc);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogAcc.getBinding("items").filter(new Filter([new Filter(
				"Ktokk",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Ktokk",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialogAcc.open(sInputValue);
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
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue(sTitle);
				if (sDescription !== "") {
					this.getVendorDetails(sDescription);
				}
			}
			evt.getSource().getBinding("items").filter([]);
		},
		/*Account Group SEarch end*/

		/*Country Code Start*/
		getCountryList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/country_keySet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/CountryCodeRegion", oData.results);
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

		handleValueHelpCountryCode: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
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
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				var sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				var oModel = this.getView().getModel("VHeader");
				//var oModelr = oView.getModel("VendorModelItem1");
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

		_handleValueHelpClosegetVendor1: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			//get the all data for selected values
			var oModel = oView.getModel("VHeader");
			var getVendor = this.getView().getModel("VendorContract");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;

				oView.byId("idAccGp").setValue(oModel.getProperty(sBindPath + "/Ktokk"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Land1"));

				oView.byId("idFname").setValue(oModel.getProperty(sBindPath + "/Name1"));
				oView.byId("idLname").setValue(oModel.getProperty(sBindPath + "/Name2"));
				oView.byId("idCity").setValue(oModel.getProperty(sBindPath + "/Ort01"));
				oView.byId("idPostcode").setValue(oModel.getProperty(sBindPath + "/Pstlz"));
				oView.byId("idRegion").setValue(oModel.getProperty(sBindPath + "/Regio"));
				oView.byId("idStreet").setValue(oModel.getProperty(sBindPath + "/Ort02"));

			}
			evt.getSource().getBinding("items").filter([]);

		},

		onCreatePress: function() {
			var oComponent1 = this.getOwnerComponent();
			oComponent1.getRouter().navTo("CreateContractVendor");
		},
		onEditPress: function(oEvent) {
			oView.byId("idEdit").setVisible(false);
			oView.byId("idSave").setVisible(true);
			oView.getModel("EditModel").setProperty("/isEditable", true);

		},
		onSaveContract: function(oEvt) {
			//define and bind the model
			var oVendorModel = oView.getModel("VendorModel");

			//get all the values
			var Lifnr = oView.byId("idVendor").getValue();
			var Waers = oView.byId("idOrderCur").getValue();
			if (Waers === "") {
				MessageBox.error("Order Currency is Mandatory");
			}
			console.log(Waers);
			/*	var zero = "";
			//	var no;
	
				var len = Lifnr.length;
				if (len !== undefined) {
					var z = 5 - len;
					for (var i = 0; i < z; i++) {
						zero += "0";
					}
				}
			
			console.log(len);
			console.log(zero);
			Lifnr = zero + Lifnr;
			console.log(Lifnr);*/
			var Land1 = oView.byId("idCountryCode").getValue();
			var Regio = oView.byId("idRegion").getValue();
			var Name1 = oView.byId("idFname").getValue();
			var Name2 = oView.byId("idLname").getValue();
			var Ort01 = oView.byId("idCity").getValue();
			var Telf1 = oView.byId("idTel").getValue(); //Telphone
			var Ort02 = oView.byId("idDis").getValue(); //Distinct
			//	var Gbort = oView.byId("idBirth").getValue(); //BirthPlace
			var Stras = oView.byId("idStreet").getValue(); //Streets
			var Pstlz = oView.byId("idPostcode").getValue();
			var Adrnr = oView.byId("idAddno").getValue(); //Address Number
			var Ktokk = oView.byId("idAccGp").getValue();
			var Ekorg = oView.byId("idPurOrg").getValue();
			//var Ekgrp = oView.byId("idPurGrp").getValue();
			var Bukrs = oView.byId("idCompCode").getValue();
			//	var Waers = oView.byId("idOrderCur").getValue();
			var Sexkz = oView.byId("idGender").getSelectedKey(); // get selected item's key

			//define the service and get the model

			//define the array/
			var oEntry1 = {};

			oEntry1.Lifnr = Lifnr; //10
			oEntry1.Land1 = Land1; //3
			oEntry1.Regio = Regio; //3
			oEntry1.Name1 = Name1; //35
			oEntry1.Name2 = Name2; //35
			oEntry1.Ort01 = Ort01; //35
			oEntry1.Telf1 = Telf1;
			oEntry1.Ort02 = Ort02;
			//	oEntry1.Gbort = Gbort;
			oEntry1.Stras = Stras; //35
			oEntry1.Pstlz = Pstlz; //10
			oEntry1.Adrnr = Adrnr;
			oEntry1.Ktokk = Ktokk;
			oEntry1.Ekorg = Ekorg; //4
			//oEntry1.Ekgrp = Ekgrp;
			oEntry1.Bukrs = Bukrs; //comp 4
			oEntry1.Waers = Waers;
			oEntry1.Sexkz = Sexkz;
			BusyIndicator.show(0);

			console.log(oEntry1);
			var oModelCreate = this.getView().getModel("VHeader");
			var mParameters = {
				success: this._onCreateEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)

				,
				merge: false
			};
			var sVendorCreate = "/Vendor_CreateSet('" + Lifnr + "')";
			oModelCreate.update(sVendorCreate, oEntry1, mParameters);

		},

		_onCreateEntrySuccess: function(oObject, oResponse) {
			BusyIndicator.hide();

			var oPurchaseModel = oView.getModel("VendorContract");
			oPurchaseModel.setData();
			this.getView().getModel("VHeader").refresh();
			this.getView().getModel("VHeader").refresh();
			oView.byId("idVendor").setValue("");
			oView.byId("idCompCode").setValue("");
			oView.byId("idAccGp").setValue("");
			//		oView.byId("idPurGrp").setValue("");
			oView.byId("idPurOrg").setValue("");
			oView.byId("idAddno").setValue("");
			oView.byId("idStreet").setValue("");
			//	oView.byId("idBirth").setValue("");
			oView.byId("idFname").setValue("");
			oView.byId("idLname").setValue("");
			oView.byId("idDis").setValue("");
			oView.byId("idTel").setValue("");
			oView.byId("idPostcode").setValue("");
			oView.byId("idCity").setValue("");
			oView.byId("idRegion").setValue("");

			oView.byId("idCountryCode").setValue("");
			oView.byId("idOrderCur").setValue("");

			jQuery.sap.require("sap.m.MessageBox");

			sap.m.MessageBox.show("Successfully Updated Vendor Number entry!", {
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

			//if getting the issue while posting the accruls call the _onCreateEntryError
			//sap.ui.core.BusyIndicator.hide();
			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},

		_onCreateEntrySucc: function(oObject, oResponse) {

			MessageBox.success("Successfully Updated Contract #" + oResponse.data.LIFNR);
			this.getView().getModel("VHeader").refresh();
		},
		_onCreateEntryErr: function(oError) {

			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},
		/*	onEditPress: function() {
					var oComponent = this.getOwnerComponent();
					oComponent.getRouter().navTo("UpdateVendor");
				},*/
		OnCancelSaveGroup: function() {
			//cancel model and reset all the values

			oView.byId("idVendor").setValue("");
			oView.byId("idCompCode").setValue("");
			oView.byId("idPurOrg").setValue("");
			oView.byId("idAccGp").setValue("");
			oView.byId("idCountryCode").setValue("");
			oView.byId("idFname").setValue("");
			oView.byId("idLname").setValue("");
			oView.byId("idStreet").setValue("");
			oView.byId("idPostcode").setValue("");
			oView.byId("idCity").setValue("");
			oView.byId("idRegion").setValue("");
			oView.byId("idTel").setValue("");
			oView.byId("idDis").setValue("");
			//	oView.byId("idBirth").setValue("");
			oView.byId("idOrderCur").setValue("");
			oView.byId("idAddno").setValue("");
			//	oView.byId("idPurGrp").setValue("");
			//redirect the page	frot view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");

		},

		/*start country code */

		lpCountryCode: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCCode) {
				this._valueHelpDialogCCode = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.Country",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCCode);
			}

			// create a filter for the binding
			this._valueHelpDialogCCode.getBinding("items").filter([
				new Filter("Land1", sap.ui.model.FilterOperator.Contains, sInputValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCCode.open(sInputValue);

		},

		CloseCountry1: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			var oModel1 = this.getOwnerComponent().getModel("VHeader");

			//var oModel = oView.getModel("VHeader");
			//	var getPurchase = this.getView().getModel("VendorContract");

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
				var CountryName = oSelectedItem.getTitle();
				console.log(CountryName);
				oModel1.read("/region_keySet(Spras='E',Land1='" + CountryName + "')", {
					//	oModel1.read("/region_keySet?$filter=(Spras='E',Land1 eq '"+ CountryName +"')", {

					success: function(oData) {
						var VendorData = new JSONModel();
						VendorData.setData(oData);
						//	sap.ui.getCore().setModel(VendorData);
						sap.ui.getCore().setModel(VendorData, "CountryModel");
						oView.getModel("CountryModel").setProperty("", oData.results);
						var a = oView.byId("idRegion").setValue(VendorData.getProperty("/Bland"));
						//	var oCompanyCode = oView.byId("ccode").setValue(VendorData.getProperty("/Bukrs"));

						var sCmpCode = VendorData.getProperty("/Bland");
						console.log(sCmpCode);
						$("#__xmlview1--idRegion").val(oData.Bland);

					},
					error: function(oError) {
						console.log(oError);
					}
				});

			}
			evt.getSource().getBinding("items").filter([]);
		},
		pCloseCountry: function(oEvent) {
			var Si = oEvent.getParameter("selectedItem");
			if (Si) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(Si.getTitle());

				var oModelr = this.getView().getModel("VHeader");
				//var oModelr = oView.getModel("VendorModelItem1");
				var cd = Si.getTitle();

				var oFilter = new sap.ui.model.Filter('Land1', sap.ui.model.FilterOperator.EQ, cd);
				oModelr.read("/region_keySet?$filter=(Land1 eq '" + cd + "')", {
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

						console.log(a);
					},
					error: function(oError) {
						console.log(oError);
					}
				});

			}
			oEvent.getSource().getBinding("items").filter([]);

		},
		suggestionItemCountryCode: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var getPurchase = this.getView().getModel("VendorContract");
			var oModel1 = this.getOwnerComponent().getModel("VHeader");

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				//	productInput.setValue(sInputValue.getTitle());

				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getText());
				productInput.setValue(oSelectedItem.getKey());
				var no = oSelectedItem.getText();
				var key = oSelectedItem.getKey();

				console.log(no);
				console.log(key);

				oModel1.read("/region_keySet(Spras='E',Land1='" + key + "')", {
					success: function(oData) {
						var VendorData = new JSONModel();
						VendorData.setData(oData);
						sap.ui.getCore().setModel(VendorData, "CountryModel");
						var a = oView.byId("idRegion").setValue(VendorData.getProperty("/Bland"));
						//	var oCompanyCode = oView.byId("ccode").setValue(VendorData.getProperty("/Bukrs"));

						var sCmpCode = VendorData.getProperty("/Bland");
						console.log(sCmpCode);
						$("#__xmlview1--idRegion").val(oData.Bland);

					},
					error: function(oError) {
						console.log(oError);
					}
				});

			}

		},
		OnChangeRegionClick: function(oEvent) {
			var sSelectedkey = oView.byId("idRign").getSelectedKey();
			var sState = oView.byId("idCity").setValue(sSelectedkey);
			console.log(sState);

		},
		/*end country code*/
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassiniProcureToPay.view.view.EditVendor
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.view.EditVendor
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.view.EditVendor
		 */
		//	onExit: function() {
		//
		//	}

	});

});