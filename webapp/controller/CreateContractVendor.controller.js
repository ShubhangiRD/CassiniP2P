sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/Button",
	"sap/m/List",

	"sap/m/Text",
	"sap/m/library",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment",
	"com/vSimpleApp/model/CreateVendor"
], function(Controller, JSONModel, Filter, Button, List, Text, library, MessageToast, FilterOperator, MessageBox, Fragment, CreateVendor) {
	"use strict";
	var oView, oController, oComponent;

	return Controller.extend("com.vSimpleApp.controller.CreateContract", {

		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();

			var oVendorModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oVendorModel, "VendorModel");

			var oPurModel = new sap.ui.model.json.JSONModel();
			oPurModel.loadData("data/NewJsonTable.json");
			this.getView().setModel(oPurModel, "PurModel");

			// Define the models
			var getContract = new CreateVendor();
			this.getView().setModel(getContract.getModel(), "VendorContract");

			var oModel = this.getOwnerComponent().getModel("VHeader");
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			console.log(oModel);

			var filterModel = this.getOwnerComponent().getModel("filterModel");
			this.getView().setModel(filterModel, "filterModel");

		//	oModel.read("/country_keySet", {
				//		oModel.read("/region_keySet", {
				//	oModel.read("/Fetch_Vendor_DetailsSet", {

			/*	oModel.read("/Vendor_CreateSet", {

				success: function(oData) {
					console.log(oData);

				},
				error: function(oError) {
					console.log(oError);
				}
			});*/

		},
 
		onSelectTab: function (evt) {
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
						} else if(selectedTab === "Vendor Rebate Management"){
								oComponent.getRouter().navTo("DashboardVendor");
						}	
					

		},
 
		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			//clear the selected values.
			var oFilterModel = this.getView().getModel("filterModel");
			if (oSelectedItem) {
				var productInput = this.inputId;
				if (productInput.includes("idCountryCode")) {
					oFilterModel.setProperty("/catDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/Landx", oSelectedItem.getTitle());
					this.updateSearchHelpValue(productInput);
				} else if (productInput.includes("idRegion")) {
					oFilterModel.setProperty("/typeDescription", oSelectedItem.getDescription());
					oFilterModel.setProperty("/Land1", oSelectedItem.getTitle());
					this.updateSearchHelpValue(productInput);
				}

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*Purchase Order Start*/
		handleValueHelpPurchaseOrg: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();

			//create dialog box for purchase Organization

			if (!this._oValueHelpDialogPur) {
				this._oValueHelpDialogPur = sap.ui.xmlfragment("com.vSimpleApp.view.fragment.Vendor.PurchaseOrg",
					this);
				this.getView().addDependent(this._oValueHelpDialogPur);

				//create a filter for the binding
				this._oValueHelpDialogPur.getBinding("items").filter([
					new Filter("Ekorg", sap.ui.model.FilterOperator.Contains, sInputValue),
					new Filter("Ekotx", sap.ui.model.FilterOperator.Contains, sInputValue)
				]);

				// Open ValueHelpDialog filtered by the input's value
				this._oValueHelpDialogPur.open(sInputValue);

			}
		},
		_handleValueHelpSearchPurOrg: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			//Filter the Bukrs and Butxt via vendor number

			var oFilterd = new Filter("Ekorg", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Ekotx", sap.ui.model.FilterOperator.Contains, sValue);

			oEvent.getSource().getBinding("items").filter([oFilterd, oFiltern]);

		},

		_handleValueHelpClosePurOrg: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

			}
			oEvent.getSource().getBinding("items").filter([]);
		},

		/*Purchase Order End*/

		/* For the Company code andd Name Starting*/
		handleValueHelpCompCode: function(oEvent) {

			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCmp) {
				this._valueHelpDialogCmp = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.CompCode",
					this
				);
				this.getView().addDependent(this._valueHelpDialogCmp);
			}

			// create a filter for the binding
			this._valueHelpDialogCmp.getBinding("items").filter([
				new Filter("Bukrs", sap.ui.model.FilterOperator.Contains, sInputValue),
				new Filter("Butxt", sap.ui.model.FilterOperator.Contains, sInputValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogCmp.open(sInputValue);
		},
		_handleValueHelpSearchCompCode: function(evt) {
			var sValue = evt.getParameter("value");
			//Filter the Bukrs and Butxt via vendor number

			var oFilterd = new Filter("Bukrs", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Butxt", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},
		_handleValueHelpCloseCompCode: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

			}
			evt.getSource().getBinding("items").filter([]);
		},

		suggestionItemCompCode: function(evt) {

		},

		/* End of the CompCode and name*/

		/*Satring the Account Group*/
		handleValueHelpAccGrp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogAC) {
				this._valueHelpDialogAC = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.AccGrp",
					this
				);
				this.getView().addDependent(this._valueHelpDialogAC);
			}

			// create a filter for the binding
			this._valueHelpDialogAC.getBinding("items").filter([
				new Filter("Ktokk", sap.ui.model.FilterOperator.Contains, sInputValue),
				new Filter("Mandt", sap.ui.model.FilterOperator.Contains, sInputValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogAC.open(sInputValue);

		},
		_handleValueHelpSearchAccGrp: function(evt) {
			var sValue = evt.getParameter("value");
			//Filter the Bukrs and Butxt via vendor number

			var oFilterd = new Filter("Ktokk", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Mandt", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},
		_handleValueHelpCloseAccGrp: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*End of the Accocunt Group*/

		/*Starting  Country */

		handleValueHelpCountryCode: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogCCode) {
				this._valueHelpDialogCCode = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.Country",
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
		_handleValueHelpSearchCountry: function(evt) {
			var sValue = evt.getParameter("value");

			var oFilterd = new Filter("Land1", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilterd]);
		},
		_handleValueHelpCloseCountry: function(evt) {

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
						sap.ui.getCore().setModel(VendorData);
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
		suggestionItemCountryRegion: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");

			//get the all data for selected values
			var oModel = oView.getModel("VHeader");
			var getVendor = this.getView().getModel("VendorContract");

			if (oSelectedItem) {
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				oView.byId("idRegion").setValue(oModel.getProperty(sBindPath + "/Regio"));

				//	getPurchase.getData().CustomerID = oSelectedItem.getKey();
				getVendor.getData().Lifnr = oSelectedItem.getText();
				getVendor.getData().Region = oModel.getProperty(sBindPath + "/Regio");

			}
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
						sap.ui.getCore().setModel(VendorData);
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

		/*End of order Country */

		

		onSaveContractnew: function() {
			//define and bind the model
			var oVendorModel = oView.getModel("VendorModel");
			var getPurchase = this.getView().getModel("VendorContract");

			//	perSale.getData().Rate = oView.byId("psMeasure").getValue();

			//get all the values
			getPurchase.getData().VendorNumber = oView.byId("idVendor").getValue();
			getPurchase.getData().AccountGrp = oView.byId("idAccGp").getValue();
			getPurchase.getData().CompCode = oView.byId("idCompCode").getValue();
			getPurchase.getData().PurchaseOrg = oView.byId("idPurOrg").getValue();
			//	getPurchase.getData().VendorTitle = oView.byId("vtitle").getValue();         
			getPurchase.getData().FirstName = oView.byId("idFname").getValue();
			getPurchase.getData().LastName = oView.byId("idLname").getValue();
			getPurchase.getData().OrderCurrency = oView.byId("idOrderCur").getValue();
			getPurchase.getData().StreetHouse = oView.byId("idStreet").getValue();
			getPurchase.getData().Email = oView.byId("idEmail").getValue();
			getPurchase.getData().PostalCode = oView.byId("idPostcode").getValue();
			getPurchase.getData().Country = oView.byId("idCountryCode").getValue();
			getPurchase.getData().PaymentTerm = oView.byId("idPayment").getValue();
			getPurchase.getData().Telephone = oView.byId("idTel").getValue();
			getPurchase.getData().City = oView.byId("idCity").getValue();
			getPurchase.getData().Region = oView.byId("idRegion").getValue();

			//		var LIFNR = oView.byId("vnumber").getValue();
			//var BUKRS = oView.byId("idCountryCode").getValue();
			//	var EKORG = oView.byId("porg").getValue();
			//	var KTOKK = oView.byId("agro").getValue();
			//		var sVendorTitle = oView.byId("vtitle").getSelectedKey(); // get selected item's key

			//	var vTitle = oView.byId("vtitle").getValue();
			//	var NAME2 = oView.byId("fname").getValue();
			//	var NAME3 = oView.byId("lname").getValue();
			//	var STRAS = oView.byId("street").getValue();
			//	var PSTLZ = oView.byId("pcode").getValue();
			//	var ORT01 = oView.byId("city").getValue();
			//	var REGIO = oView.byId("country").getValue();
			//	var REGIO = oView.byId("rgn").getValue();
			//	var sTelPhone = oView.byId("tel").getValue();
			//	var sCode = oView.byId("cd").getValue();
			//	var sEmail = oView.byId("email").getValue();
			//	var sOrderCurrncy = oView.byId("OrderCur").getValue();
			//	var sPayment = oView.byId("payt").getValue();
			//		var LAND1 = oView.byId("concd").getValue();

			//Set all the value to model

			//	oVendorModel
			var zero = "";
			var no;
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
				console.log(no);
				no = VendorNumber;
				//define the service and get the model
				var oModelCreate = this.getView().getModel("VHeader");
				var that = this;

				//define the array/
				var oEntry1 = {};
				oEntry1.Lifnr = getPurchase.getData().VendorNumber;
				//	oEntry1.Bukrs = getPurchase.getData().AccountGrp;
				oEntry1.Bukrs = getPurchase.getData().CompCode;
				oEntry1.Ekorg = getPurchase.getData().PurchaseOrg;
				oEntry1.Name2 = getPurchase.getData().FirstName;
				oEntry1.Name3 = getPurchase.getData().LastName;
				//	oEntry1.OrderCurrency = getPurchase.getData().OrderCurrency;
				oEntry1.Stras = getPurchase.getData().StreetHouse;
				//		oEntry1.Email = getPurchase.getData().Email;
				//		oEntry1.PostalCode = getPurchase.getData().PostalCode;
				//	oEntry1.Country = getPurchase.getData().Country;
				//	oEntry1.PaymentTerm = getPurchase.getData().PaymentTerm;
				//	oEntry1.Telephone = getPurchase.getData().Telephone;
				oEntry1.Ort01 = getPurchase.getData().City;
				oEntry1.Regio = getPurchase.getData().Region;
				//		oEntry1.Tcode = getPurchase.getData().Tcode;

				//bind the values to array
				/*	oEntry1.Land1 = LAND1;
					oEntry1.Lifnr = LIFNR;
					oEntry1.Bukrs = BUKRS;
					oEntry1.Ekorg = EKORG;
					oEntry1.ktokk = KTOKK;
					oEntry1.Name2 = NAME2;
					oEntry1.Name3 = NAME3;
					oEntry1.Stras = STRAS;
					oEntry1.Pstlz = PSTLZ;
					oEntry1.Ort01 = ORT01;
					oEntry1.Regio = REGIO;*/
				//	oEntry1.telp = sTelPhone;
				//	oEntry1.cdd = sCode;
				//	oEntry1.Email = sEmail;
				///	oEntry1.currncy = sOrderCurrncy;
				//	oEntry1.Paymt = sPayment;
				//	oEntry1.VendorTitle= sVendorTitle;

				oModelCreate.create('/Vendor_CreateSet', oEntry1, {

						success: MessageToast.show("Inserted Successfully"), //that._onCreateEntrySuccess.bind(that),
						//		success: this._onCreateEntrySuccess.bind(this),
						error: that._onCreateEntryError.bind(that)
					}

				);
			}
		},

		onSaveContract: function() {
			/*	if (Ktokk === "") {
					MessageToast.show("Account Number is Mandetory");

				}*/
			
			//get all the values
			var Lifnr = oView.byId("idVendor").getValue();
	/*	var zero = "";
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
			console.log(Lifnr);*/
			//	no = Lifnr;
			var Land1 = oView.byId("idCountryCode").getValue();
			var Regio = oView.byId("idRegion").getValue();
			var Name1 = oView.byId("idFname").getValue();
			var Name2 = oView.byId("idLname").getValue();
			var Ort01 = oView.byId("idCity").getValue();
			var Telf1 = oView.byId("idTel").getValue(); //Telphone
			var Ort02 = oView.byId("idDis").getValue(); //Distinct
			var Gbort = oView.byId("idBirth").getValue(); //BirthPlace
			var Stras = oView.byId("idStreet").getValue(); //Streets
			var Pstlz = oView.byId("idPostcode").getValue();
			var Adrnr = oView.byId("idAddno").getValue();  //Address Number
			var Ktokk = oView.byId("idAccGp").getValue();
			var Ekorg = oView.byId("idPurOrg").getValue();
			var Ekgrp = oView.byId("idPurGrp").getValue();
			var Bukrs = oView.byId("idCompCode").getValue();
			var Waers = oView.byId("idOrderCur").getValue();
			var gendor = oView.byId("idGender").getSelectedKey(); // get selected item's key
			if(gendor === "Male"){
			gendor = "1";
			}else if(gendor === "Female"){
			gendor = "2";
			}
		
			console.log(Sexkz);
			var Sexkz = gendor;
	
		//define the service and get the model
			var oModelCreate = this.getView().getModel("VHeader");
			var that = this;


			var payLoad = {
							"Lifnr": Lifnr,
							"Land1": Land1,
							"Regio": Regio,
							"Name1": Name1,
							"Name2": Name2,
							"Ort01": Ort01,
							"Telf1": Telf1,
							"Ort02": Ort02,
							"Gbort": Gbort,
							"Stras": Stras,
							"Pstlz": Pstlz,
							"Adrnr": Adrnr,
							"Ktokk": Ktokk,
							"Ekorg": Ekorg,
							"Ekgrp": Ekgrp,
							"Bukrs": Bukrs,
							"Waers": Waers,
							"Sexkz": Sexkz
							
						
						};
				console.log(payLoad);
			
		var oEntry1 = {};
			//bind the values to array
				oEntry1.Lifnr = Lifnr; //10
			oEntry1.Land1 = Land1; //3
			oEntry1.Regio = Regio; //3
			oEntry1.Name1 = Name1; //35
			oEntry1.Name2 = Name2; //35
			oEntry1.Ort01 = Ort01; //35
			oEntry1.Telf1 = Telf1;
			oEntry1.Ort02 = Ort02;
			oEntry1.Gbort = Gbort;
			oEntry1.Stras = Stras; //35
			oEntry1.Pstlz = Pstlz; //10
			oEntry1.Adrnr = Adrnr;
			oEntry1.Ktokk = Ktokk;
			oEntry1.Ekorg = Ekorg; //4
			oEntry1.Ekgrp = Ekgrp;
			oEntry1.Bukrs = Bukrs; //comp 4
			oEntry1.Waers = Waers;
			oEntry1.Sexkz = Sexkz;
			
		oModelCreate.create("/Vendor_CreateSet", oEntry1, {
			success: this._onCreateEntrySuccess.bind(that),
					error: that._onCreateEntryError.bind(that)
				}

	);

		},

		_onCreateEntrySuccess: function(oObject, oResponse) {
			var successObj = oResponse.data.Lifnr;

			MessageToast.show("Successfully" + successObj + "inserted new entry!");
			//		console.log(successObj);
			//	var oModel = this.getOwnerComponent().getModel("VHeader");

			//	oModel.setData([]);
			//reset all the values from model
	/*		oView.byId("idVendor").setValue("");
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
			oView.byId("idBirth").setValue("");
			oView.byId("idOrderCur").setValue("");
			oView.byId("idAddno").setValue("");
			oView.byId("idPurGrp").setValue("");
*/
		/*	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");
*/		},
		_onCreateEntryError: function(oError) {
			//if getting the issue while posting the accruls call the _onCreateEntryError
			//sap.ui.core.BusyIndicator.hide();
			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},
		OnCancelContract: function() {
			//cancel model and reset all the values
			MessageToast.show("Cancel Contract");
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
			oView.byId("idTcode").setValue("");
			oView.byId("idTel").setValue("");
			//		oView.byId("cd").setValue("");
			oView.byId("idEmail").setValue("");
			oView.byId("idOrderCur").setValue("");
			oView.byId("idPayment").setValue("");

			//redirect the page	frot view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");

		},
		onEditPress: function() {
			var oComponent1 = this.getOwnerComponent();
			oComponent1.getRouter().navTo("DisplayVendor");
		},
		onDisplayPress: function() {
				var oComponent1 = this.getOwnerComponent();
				oComponent1.getRouter().navTo("DisplayVendor");
				
	
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.vSimpleApp.view.view.CreateContract
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vSimpleApp.view.view.CreateContract
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vSimpleApp.view.view.CreateContract
		 */
		//	onExit: function() {
		//
		//	}

	});

});