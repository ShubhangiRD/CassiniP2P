sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"sap/m/Input",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/cassiniProcureToPay/model/RebateConditionItem",
	"com/cassiniProcureToPay/model/VendorRebateCondition",
	"com/cassiniProcureToPay/model/CreateContract",
	"com/cassiniProcureToPay/model/GetPODetails",
	"com/cassiniProcureToPay/model/GetPurchaseVendor",

	"sap/m/ColumnListItem",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller, JSONModel, library, Input, Fragment, Filter, FilterOperator, RebateConditionItem,
	VendorRebateCondition, CreateContract, GetPODetails, GetPurchaseVendor, ColumnListItem, jQuery, MessageToast, MessageBox) {
	"use strict";
	var oView,oComponent;

	return Controller.extend("com.cassiniProcureToPay.controller.DisplayPOItems", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.view.DisplayPOItems
		 */
		onInit: function() {
			//	POHeaderSet ,POItemSet


oComponent = this.getOwnerComponent();
this._data = {
				Products : [
				            
				            { Name : 'Clock' , size : '1X2X5'},
				            { Name : 'Pen' , size : '7X2X5'}
				            ]	
			};
			
			this.jModel = new sap.ui.model.json.JSONModel();
			this.jModel.setData(this._data);


			oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("VHeader");

			// Define the models
			var getVendor = new GetPODetails();
			this.getView().setModel(getVendor.getModel(), "PODetails");

			/*	//define the json models
				var POitemsTab = new JSONModel();
				oView.setModel(POitemsTab, "PurchaseModelItems");
			*/

			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			console.log(oModel);
			oView = this.getView();

			// Define the models
			var createContract = new CreateContract();
			this.getView().setModel(createContract.getModel(), "CreateContract");

			oModel.read("/POHeaderSet", {

				success: function(oData) {
					console.log(oData);

				},
				error: function(oError) {
					console.log(oError);
				}
			});

			var oPurchaseData = {
				//		TempContract: new GetPurchaseVendor()
				PurchaseConditionItems: []
			};
			var oPurchaseModel = new JSONModel(oPurchaseData);
			this.getView().setModel(oPurchaseModel, "PurchaseModelItems");

			/*		var oEditModel = new JSONModel({
				isEditable: false
			});

			this.getView().setModel(oEditModel, "EditModel");

		
*/

			// 		var oEditContModel = new JSONModel({
			// 		PurchaseConditionItems: []
			// 			});
			// //		oEditContModel.setData([]);
			//   		this.getView().setModel(oEditContModel, "PurchaseModelItems");



		

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
 
		getRequestPayload: function() {
			var that = this;
			var aRebateConditionItems = [];
			this.PurchaseConditionItems.forEach(function(item) {
				aRebateConditionItems.push(item.getRequestPayload());

			});
			return {
				//	Rcont: this.ContractNo,
				Bukrs: this.CompanyCode,
				Bsart: "EC",
				Lifnr: this.VendorNo,
				Ekorg: this.PurchaseOrg,
				Ekgrp: this.PurchaseGroup,
				Waers: this.Currency,
				POItem: aRebateConditionItems

			};

		},

		/*Vendor Number start*/

		onValueHelpRequest: function(oEvent) {

			var sValue = oEvent.getParameter("value");

			//	var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogVendorno) {
				this._valueHelpDialogVendorno = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.GetPOHeader",
					this
				);
				this.getView().addDependent(this._valueHelpDialogVendorno);
			}

			// create a filter for the binding
			this._valueHelpDialogVendorno.getBinding("items").filter([
				new Filter("Lifnr", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Bsart", sap.ui.model.FilterOperator.Contains, sValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogVendorno.open(sValue);
		},
		onValueHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Lifnr", FilterOperator.Contains, sValue);
			//	var oFiltern = new Filter("Name1", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);
		},

		HandlehelpCloseVendorNumber: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var oModel = this.getOwnerComponent().getModel("VHeader");
			console.log(oModel);
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var no = oSelectedItem.getTitle();

				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				oView.byId("idPoOrder").setValue(oModel.getProperty(sBindPath + "/Ebeln"));

				var Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Ebeln",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData.results);
						oView.getModel("PurchaseModelItems").setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelItems"), "PurchaseModelItems");

			}
			evt.getSource().getBinding("items").filter([]);
		},

		/*Vendor number end*/
		VendorSuggestionItem: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			//get the all data for selected values
			var oModel = oView.getModel("VHeader");
			var GetPODetils = this.getView().getModel("PODetails");
			var sInputValue = evt.getSource().getValue();
			this.inputId = evt.getSource().getId();

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				//	productInput.setValue(oSelectedItem.getTitle());
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getText());
				productInput.setValue(oSelectedItem.getKey());
				//	var no = oSelectedItem.getText();
				//	var key = oSelectedItem.getKey();
				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				var Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var filter1 = new sap.ui.model.Filter({
					path: "Ebeln",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: Ebeln
				});
				var table = oView.byId("idpotable");
				var oBinding = table.getBinding("rows");
				oBinding.filter(filter1);

				oModel.read("/POItemSet", {
					filters: [filter1],
					success: function(oData) {
						console.log(oData);
						var getPOItems = new JSONModel();
						getPOItems.setData(oData);
						sap.ui.getCore().setModel(getPOItems);

						var oTable = oView.byId("idpotable");
						var arr = [];
						for (var i = 0; i < oData[i].length; i++) {

						}
						var oBinding = oTable.getBinding("rows");

					},
					error: function(oError) {
						console.log(oError);
					}
				});
			}

		},
		suggestionItemSelectedVendor: function(evt) {
			var oDataD = oView.getModel("PurchaseModelItems").getData();
			if (oDataD.length > 0) {
				this.getView().getModel("PurchaseModelItems").setData([]);

			}

			var oSelectedItem = evt.getParameter("selectedItem");
			//get the all data for selected values
			var oModel = oView.getModel("VHeader");
			var GetPODetils = this.getView().getModel("PODetails");
			var sInputValue = evt.getSource().getValue();
			this.inputId = evt.getSource().getId();

			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				//	productInput.setValue(oSelectedItem.getTitle());
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getText());
				productInput.setValue(oSelectedItem.getKey());
				//	var no = oSelectedItem.getText();
				//	var key = oSelectedItem.getKey();
				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				oView.byId("idPoOrder").setValue(oModel.getProperty(sBindPath + "/Ebeln"));

				var Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Ebeln",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData.results);
						oView.getModel("PurchaseModelItems").setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelItems"), "PurchaseModelItems");

			}
		},

		/*Purchase Suggestion Items Started*/

		onValueHelpRequestPOrder: function(oEvent) {
			//Get the value from view
			var sValue = oEvent.getParameter("value");
			this.inputId = oEvent.getSource().getId();

			//create value help dialog bos
			if (!this.valuehelpDialogPurchaseDoc) {
				this.valuehelpDialogPurchaseDoc = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.PurchaseDocument", this
				);
				this.getView().addDependent(this.valuehelpDialogPurchaseDoc);
			}
			//create a filterr for binding
			this.valuehelpDialogPurchaseDoc.getBinding("items").filter([
				new Filter("Ebeln", sap.ui.model.FilterOperator.Contains, sValue)
			]);

			//open value help dialog filtered by input value
			this.valuehelpDialogPurchaseDoc.open(sValue);
		},
		onPurchaseDocHelpSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Ebeln", FilterOperator.Contains, sValue);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		onClosePurchaseDoc: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var oModel = this.getOwnerComponent().getModel("VHeader");
			console.log(oModel);
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				oView.byId("idPoOrder").setValue(oModel.getProperty(sBindPath + "/Ebeln"));
				var Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Ebeln",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData.results);
						oView.getModel("PurchaseModelItems").setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelItems"), "PurchaseModelItems");

			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onEditPOOrders: function(oEvent) {
			//	oView.byId("idEdit").setVisible(false);
			//	oView.byId("idSave").setVisible(true);
			//	oView.getModel("EditModel").setProperty("/isEditable", true);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("EditPOOrder");

		},

		/*Purchase Order Suggestion Items Ended*/

		/*Material Number Dialog Start*/
		_handleMaterialValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			//Filter the Bukrs and Butxt via vendor number

			var oFilterd = new Filter("Materialno", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},
		_handleMaterialValueHelpClose: function(evt) {

			var oSelectedItem = evt.getParameter("selectedItem");
			var getPurchase = this.getView().getModel("CreateContract");
			var oModel = oView.getModel("VHeader");
			if (oSelectedItem) {
				var productInput = this.byId(this.MaterialinputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				//		oView.byId("nDescription").setValue(oModel.getProperty(sBindPath + "/Description"));

				//		oView.byId("idUOM").setValue(oModel.getProperty(sBindPath + "PurchaseModel>/TempContract/UOM"));
				//	oView.byId(" ").setValue(oModel.getProperty(sBindPath + "/ "));
				var oDiscription = oModel.getProperty(sBindPath + "/Description");
				var uom = oModel.getProperty(sBindPath + "/UOM");

				//$(this).closest(".desc1").val(oDiscription);
				//$(this).closest(".desc1").find("input").val(oDiscription);
				var ab = $(this)[0].MaterialinputId;
				var id = $("#" + ab).closest("tr").find(".desc1").attr("id");
				$("#" + id + "-inner").val(oDiscription);

				getPurchase.getData().Materialno = oSelectedItem.getTitle();
				var a = getPurchase.getData().Description = oModel.getProperty(sBindPath + "/Description");
				var UOM = getPurchase.getData().UOM = oModel.getProperty(sBindPath + "/UOM");

				//	oView.byId("nDescription").setValue(a);
				//$(this).closest("#__xmlview1--nDescription-__clone1-inner").val(a);
				//$(this).closest(".desc1").find("input").val(a);
				//this.getView().byId("nDescription").setValue(a);

				var b = oModel.getProperty(sBindPath + "/UOM");
				//this.getView().byId("measure1").setValue(b); getPurchase.getData().UOM = 
				var ab1 = $(this)[0].MaterialinputId;
				var id1 = $("#" + ab1).closest("tr").find(".measure1").attr("id");
				$("#" + id1 + "-inner").val(b);

				//		getPurchase.getData().PurchaseGroup = oModel.getProperty(sBindPath + "/ ");
			}
			evt.getSource().getBinding("items").filter([]);
		},
		handleValueHelpMaterial: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			//	var sInputValue = oEvent.getSource().getValue();
			this.MaterialinputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMaterialno) {
				this._valueHelpDialogMaterialno = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.MaterialNumber",
					this
				);
				this.getView().addDependent(this._valueHelpDialogMaterialno);
			}

			// create a filter for the binding
			this._valueHelpDialogMaterialno.getBinding("items").filter([
				new Filter("Materialno", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogMaterialno.open(sValue);

		},
		onAddNewConditionItem1: function(oEvent) {
			var oItem = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Input(),
					new sap.m.Input({
						showValueHelp: true

					})
				]
			});

			var oTable = this.getView().byId("idPOItemsTab");
			oTable.addItem(oItem);
		},
	
		onAddNewConditionItem11: function() {
				var oVendorModel = this.getView().getModel("PurchaseModelItems");
  
				var aPurchaseConditionItems = oVendorModel.getProperty("/PurchaseConditionItems");
				aPurchaseConditionItems.push(new RebateConditionItem({
					ItemNo: (aPurchaseConditionItems.length + 1).toString()
				}));
				oVendorModel.refresh(true);

				//	var aPurchaseConditionItems = oVendorModel.getProperty("/TempContract/PurchaseConditionItems");
				var data = oVendorModel.oData.length;

				console.log(data);
				if (data) {
					//	if(aPurchaseConditionItems.length===0){
					aPurchaseConditionItems.push(new RebateConditionItem({
						ItemNo: (aPurchaseConditionItems.length + 1).toString()
					}));
					console.log(length);
				}

				oVendorModel.setProperty("/PurchaseModelItems", aPurchaseConditionItems);
				//	this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelItems"), aPurchaseConditionItems);

				oVendorModel.refresh(true);
			},
			
			
			/*Material Number Dialog Ends*/
			//	oView.getModel("PurchaseModelItems").setData(oData.results);

		/*	onAddNewConditionItem: function() {
						var oVendorModel = this.getOwnerComponent().getModel("PurchaseModel");
						var aPurchaseConditionItems = oVendorModel.getProperty("/TempContract/PurchaseConditionItems");
						aPurchaseConditionItems.push(new RebateConditionItem({
							ItemNo: (aPurchaseConditionItems.length + 1).toString()
						}));
						oVendorModel.refresh(true);
				},
				onDeleteConditionItem: function() {
						var oPurchaseItemTable = this.byId("idPOItemsTab");
						var aSelectedIndex = oPurchaseItemTable.getSelectedIndices().reverse();
						var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
						var aPurchaseConditionItems = oPurchaseModel.getProperty("/TempContract/PurchaseConditionItems");
						for (var i = 0; i < aSelectedIndex.length; i++) {
							aPurchaseConditionItems.splice(aSelectedIndex[i], 1);
						}
						oPurchaseItemTable.clearSelection();
						oPurchaseModel.refresh(true);
					}
				*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassiniProcureToPay.view.view.DisplayPOItems
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.view.DisplayPOItems
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.view.DisplayPOItems
		 */
		//	onExit: function() {
		//
		//	}

	});

});