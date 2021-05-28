sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/library",
	"sap/m/Input",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/cassiniProcureToPay/model/RebateConditionItemPO",
	"com/cassiniProcureToPay/model/VendorRebateCondition",
	"com/cassiniProcureToPay/model/CreateContract",
	"com/cassiniProcureToPay/model/GetPODetails",
	"com/cassiniProcureToPay/model/UpdatePO",
	"sap/m/ColumnListItem",
	"jquery.sap.global",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	'sap/ui/core/BusyIndicator',
	"com/cassiniProcureToPay/model/POItem"

], function(Controller, JSONModel, library, Input, Fragment, Filter, FilterOperator, RebateConditionItemPO,
	VendorRebateCondition, CreateContract, GetPODetails, UpdatePO, ColumnListItem, jQuery, MessageToast, MessageBox, History, BusyIndicator,
	POItem) {
	"use strict";
	var oView, oComponent;
	var Ebeln, PurchaseOno;
	var ListofVendor = [],
		ListofCompanycode = [],
		ListofPurchaseOrg = [];
	var MaterialnUmberForPo;
	return Controller.extend("com.cassiniProcureToPay.controller.POITemDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.view.POITemDetails
		 */
		onInit: function() {
			oView = this.getView();
			var oModel = this.getOwnerComponent().getModel("VHeader");
			oComponent = this.getOwnerComponent();
			//set the model on view to be used by the UI controls
			this.getView().setModel(oModel);
			//		console.log(oModel);
			this.getPurchaseOrderList();

			/*	this.getVendorList();
				this.getMaterialList();
				this.getPOPlant();
			*/ //define the json models
			var POitemsTab = new JSONModel();
			oView.setModel(POitemsTab, "PurchaseModelITem");

			var oEditModel = new JSONModel({
				isEditable: false
			});

			this.getView().setModel(oEditModel, "EditModel");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("POITemDetails").attachPatternMatched(this._onObjectMatched, this);
			oView.byId("idSave").setVisible(false);
		},
		_onObjectMatched: function(oEvent) {

			var oModel = this.getOwnerComponent().getModel("VHeader");

			var sPath = oEvent.getParameter("arguments");
			PurchaseOno = sPath.PoNo;
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
			return new Promise(function(resolve1, reject1) {

				/*			oModel.read("/fetch_openPOSet(Purchaseorder='" + PurchaseOno + "')", {
					urlParameters: {
						"$expand": "fpoItemSet"
					},
					success: function(oData) {
						BusyIndicator.hide();
						console.log(oData);
	oView.getModel("PurchaseModel", oData);
						oView.getModel("PurchaseModel").setProperty("/TempContract/POItem", oData.fpoItemSet.results); // setData(oData.results);

					},
					error: function(oError) {
						BusyIndicator.hide();
						console.log(oError);
					}
				});
*/
				oModel.read("/PO_DetailsSet()", {
					filters: aFilter,
					success: function(odata) {
						console.log(odata);

						oView.getModel("PurchaseModel").setProperty("/TempContract/POItem", odata.results); // setData(oData.results);

						var item = odata.results.length;
						var PoDetailsItems = [];
						for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {

							var PoNumber = odata.results[iRowIndex].PoNo;
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
								for (var y = 0; y < ListofVendor.length; y++) {
									if (Vendor == ListofVendor[y].Lifnr) {
										var vendorname = ListofVendor[y].Name1;
										console.log(vendorname);

									}
								}
							}
							if (CompCode !== "" || CompCode !== undefined) {
								for (var z = 0; z < ListofCompanycode.length; z++) {
									if (CompCode == ListofCompanycode[z].Bukrs) {
										var compcodename = ListofCompanycode[z].Butxt;
										console.log(compcodename);

									}
								}
							}
							if (PurchOrg !== "" || PurchOrg !== undefined) {
								for (var w = 0; w < ListofPurchaseOrg.length; w++) {
									if (PurchOrg == ListofPurchaseOrg[w].Ekorg) {
										var PurchOrgname = ListofPurchaseOrg[w].Ekotx;
										console.log(PurchOrgname);

									}
								}
							}

							oView.byId("vnumber").setValue(Vendor);
							oView.byId("idPurchaseOrg").setValue(PurchOrg);
							oView.byId("cc").setValue(CompCode);
							oView.byId("cu").setValue(Currency);
							oView.byId("pg").setValue(PurGroup);

							var Dateon = CreatDate.getFullYear() + "/" + CreatDate.getMonth() + "/" + CreatDate.getDate() + " ";
							//Header model 
							var oHeaderDataModel = new JSONModel({
								Name: vendorname,
								Number: Vendor,
								createdby: CreatedBy,
								createddate: Dateon,
								CompCodeno: CompCode,
								CompCodename: compcodename,
								PurchOrgno: PurchOrg,
								PurchOrgname: PurchOrgname
							});

							oView.setModel(oHeaderDataModel, "oHeaderDataModel");
							console.log(oHeaderDataModel)

							var oHeaderDataCodePurOrg = new JSONModel({

								CompCode: compcodename,
								PurchOrg: PurchOrgname
							});

							oView.setModel(oHeaderDataCodePurOrg, "oHeaderDataCodePurOrg");
							console.log(oHeaderDataCodePurOrg)

							PoDetailsItems.push({
								PoNumber: PoNumber,
								Vendor: Vendor,
								Name: vendorname,
								Material: Material,
								ShortText: ShortText,
								NetPrice: NetPrice,
								Quantity: Quantity,
								CreatedBy: CreatedBy,
								CreatDate: CreatDate,
								CompCode: CompCode,
								PurchOrg: PurchOrg,
								PurGroup: PurGroup,
								Currency: Currency,
								PoItem: PoItem,
								Plant: Plant
							});

						}
						console.log(PoDetailsItems);
						//	oView.getModel("PurchaseModel").setProperty("/TempContract/POItem", odata.results);
					},
					error: function(oError) {
						console.log(oError);
					}
				});

			});
		},

		onEditPress: function() {
			oView.byId("iddEdit").setVisible(false);
			oView.byId("idSave").setVisible(true);
			oView.getModel("EditModel").setProperty("/isEditable", true);
		},
		OnCancel: function(event) {
			oView.getModel("EditModel").setProperty("/isEditable", false);
			oView.byId("iddEdit").setVisible(true);
			oView.byId("idSave").setVisible(false);
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			//	oPurchaseModel.setData([]);
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);

			oPurchaseModel.refresh(true);
			this.getView().getModel("VHeader").refresh();

			oView.byId("idPurOrg").setValue("");

			oView.byId("idCountryCode").setValue("");
			oView.byId("vnumber").setValue("");
			oView.byId("idCompCode").setValue("");
			oView.byId("idPurGrg").setValue("");

			//redirect the page	frot view
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ShowTiles");

		},

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
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.MaterialDescription",
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
			var getPurchase1 = this.getView().getModel("PurchaseModel");
			//	var oPurchaseContract = oPurchaseModel.getProperty("/TempContract");

			var getPurchase = this.getView().getModel("CreateContract");
			var oModel = oView.getModel("Lookup");

			/*	var oSelectedItem = evt.getParameter("selectedItem");
					var getPurchase = this.getView().getModel("CreateContract");
				var oModel = oView.getModel("Lookup");
			*/
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				//productInput2 = this.byId(this.inputId),
				MaterialnUmberForPo = oSelectedItem.getInfo();
				var sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(MaterialnUmberForPo);

				productInput.setValue(sTitle);
				//**********
				//var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(MaterialnUmberForPo);
				//productInput2.setValue(sDescription);

				//		oView.byId("nDescription").setValue(oModel.getProperty(sBindPath + "/Description"));

				//		oView.byId("idUOM").setValue(oModel.getProperty(sBindPath + "PurchaseModel>/TempContract/UOM"));
				//	oView.byId(" ").setValue(oModel.getProperty(sBindPath + "/ "));
				var oMat = oModel.getProperty(sBindPath + "/Materialno");
				var ab = $(this)[0].inputId;
				var id = $("#" + ab).closest("tr").find(".mtid").attr("id");
				$("#" + id + "-inner").val(oMat);
				var oDiscription = oModel.getProperty(sBindPath + "/Description");
				var uom = oModel.getProperty(sBindPath + "/UOM");

				//$(this).closest(".desc1").val(oDiscription);
				//$(this).closest(".desc1").find("input").val(oDiscription);
				var ab = $(this)[0].inputId;
				var id = $("#" + ab).closest("tr").find(".desc1").attr("id");
				$("#" + id + "-inner").val(oDiscription);

				//	getPurchase.getData().Materialno = sDescription;

				//	getPurchase.getData().Materialno = oModel.getProperty(sBindPath + "/Materialno");
				//	var a = getPurchase.getData().Description = oModel.getProperty(sBindPath + "/Description");
				//var UOM = getPurchase.getData().UOM = oModel.getProperty(sBindPath + "/UOM");

				//	oView.byId("nDescription").setValue(a);
				//$(this).closest("#__xmlview1--nDescription-__clone1-inner").val(a);
				//$(this).closest(".desc1").find("input").val(a);
				//this.getView().byId("nDescription").setValue(a);

				var b = oModel.getProperty(sBindPath + "/UOM");
				//this.getView().byId("measure1").setValue(b); getPurchase.getData().UOM = 
				var ab1 = $(this)[0].inputId;
				var id1 = $("#" + ab1).closest("tr").find(".measure1").attr("id");
				$("#" + id1 + "-inner").val(b);

				var vendorModel = this.getView().getModel("PurchaseModel");
				var path = vendorModel.oData.TempContract.POItem;
				var Modifiedlenght = path.length - 1;

				path[Modifiedlenght].Matnr = MaterialnUmberForPo;
				vendorModel.setProperty(path + "/Matnr");

				path[Modifiedlenght].Material = MaterialnUmberForPo;

				vendorModel.setProperty(path + "/Material");

			}
			evt.getSource().getBinding("items").filter([]);
		},

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
					"com.cassiniProcureToPay.view.fragment.Vendor.PurchaseGroup",
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

		/*start purchase order f4 click*/
		getPurchaseOrderList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/POListSet", {
				success: function(oData) {
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
			//
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

			//		console.log(oModel);
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var eelnvalue = oSelectedItem.getTitle();
				console.log(eelnvalue);
				oView.byId("vnumber").setValue(oModellookup.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModellookup.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModellookup.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModellookup.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModellookup.getProperty(sBindPath + "/Ekgrp"));
				//		oView.byId("productPO").setValue(oModellookup.getProperty(sBindPath + "/Ebeln"));
				Ebeln = oModellookup.getProperty(sBindPath + "/Ebeln");

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

		/*SEARCH vendor start*/
		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					//		console.log(oData);
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
					//		console.log(ListofVendor);

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
		_handleValueVendorHelpS: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMP) {
				this._valueHelpDialogMP = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.Display",
					this
				);
				this.getView().addDependent(this._valueHelpDialogMP);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogMP.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));
			this.getVendorList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogMP.open(sInputValue);
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

				}
			}
			evt.getSource().getBinding("items").filter([]);

		},

		getVendorList1: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/POHeaderSet", {
				success: function(oData) {
					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/POVendorList", oData.results);
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
		handlePOVHelpVendor: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogg) {
				this._valueHelpDialogg = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.GetPOHeader",
					this
				);
				this.getView().addDependent(this._valueHelpDialogg);
			}
			if (sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialogg.getBinding("items").filter(new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sInputValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sInputValue
			)]));
			this.getVendorList();
			// open value help dialog filtered by the input value
			this._valueHelpDialogg.open(sInputValue);
		},
		_handlePOVendorSearch: function(evt) {
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
		_handlePOVendorHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			//	var oModel = this.getOwnerComponent().getModel("Lookup");
			var oModelRead = this.getOwnerComponent().getModel("VHeader");

			var oModel = oView.getModel("Lookup");

			console.log(oModel);
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				var no = oSelectedItem.getTitle();

				oView.byId("vnumber").setValue(oModel.getProperty(sBindPath + "/Lifnr"));
				oView.byId("idPurOrg").setValue(oModel.getProperty(sBindPath + "/Ekorg"));
				oView.byId("idCompCode").setValue(oModel.getProperty(sBindPath + "/Bukrs"));
				oView.byId("idCountryCode").setValue(oModel.getProperty(sBindPath + "/Waers"));
				oView.byId("idPurGrg").setValue(oModel.getProperty(sBindPath + "/Ekgrp"));
				//	oView.byId("productPO").setValue(oModel.getProperty(sBindPath + "/Ebeln"));
				Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);

				Ebeln = oModel.getProperty(sBindPath + "/Ebeln");
				console.log(Ebeln);
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Purchaseorder",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModelRead.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData.results);
						oView.getModel("PurchaseModelITem").setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelITem"), "PurchaseModelITem");

			}
			evt.getSource().getBinding("items").filter([]);

		},
		suggestionItemSelectedVendor: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			//get the all data for selected values
			var oModel = this.getOwnerComponent().getModel("VHeader");
			if (oSelectedItem) {

				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				//	productInput.setValue(oSelectedItem.getText());
				var no = oSelectedItem.getText();

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
						path: "Ebeln",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData.results);
						oView.getModel("PurchaseModelITem").setData(oData.results);
						//console.log(oData);

					},
					error: function(oError) {
						//console.log(oError);
					}
				});
				this.byId("idPOItemsTab").setModel(oView.getModel("PurchaseModelITem"), "PurchaseModelITem");

			}

		},

		/*search vendor end*/

		onPOITemDetailss: function(oEvent) {
			oView.byId("idEdit").setVisible(false);
			oView.byId("idSave").setVisible(true);
			oView.byId("ed").setText("Change Purchase Order");

			oView.getModel("EditModel").setProperty("/isEditable", true);
			/*	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("POITemDetails");
				*/
			$(document).ready(function() {
				$("idEdit").click(function() {
					$("nDescription").removeAttr("value");
				});
			});

		},

		/*Purchase Order Suggestion Items Ended*/
		onAddNewConditionItem: function() {
			//		var oVendorModel = this.getView().getModel("PurchaseModelITem");
			//	var PurchaseConditionItems = [];
			var oVendorModel = this.getView().getModel("PurchaseModel");
			//	var aPurchaseConditionItems = oVendorModel.getData();
			var aPurchaseConditionItems = oVendorModel.getProperty("/TempContract/POItem");

			aPurchaseConditionItems.push(new RebateConditionItemPO({
				Ebelp: (aPurchaseConditionItems.length + 1).toString()
			}));
			oVendorModel.refresh(false);

		},

		onDeleteConditionItem: function() {
			var oPurchaseItemTable = this.byId("idPOItemsTab");
			var aSelectedIndex = oPurchaseItemTable.getSelectedIndices().reverse();
			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var aPurchaseConditionItems = oPurchaseModel.getProperty("/TempContract/POItem");
			for (var i = 0; i < aSelectedIndex.length; i++) {
				aPurchaseConditionItems.splice(aSelectedIndex[i], 1);
			}
			oPurchaseItemTable.clearSelection();
			oPurchaseModel.refresh(true);
		},

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
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.MaterialNumber",
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
			var getPurchase1 = this.getView().getModel("PurchaseModel");
			//	var oPurchaseContract = oPurchaseModel.getProperty("/TempContract");

			var getPurchase = this.getView().getModel("CreateContract");
			var oModel = oView.getModel("Lookup");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());

				//		oView.byId("nDescription").setValue(oModel.getProperty(sBindPath + "/Description"));

				//		oView.byId("idUOM").setValue(oModel.getProperty(sBindPath + "PurchaseModel>/TempContract/UOM"));
				//	oView.byId(" ").setValue(oModel.getProperty(sBindPath + "/ "));
				var oDiscription = oModel.getProperty(sBindPath + "/Description");
				var uom = oModel.getProperty(sBindPath + "/UOM");

				//$(this).closest(".desc1").val(oDiscription);
				//$(this).closest(".desc1").find("input").val(oDiscription);

				var ab = $(this)[0].inputId;
				var id = $("#" + ab).closest("tr").find(".desc1").attr("id");
				var ss = "#" + id + "-inner";
				console.log(ss);
				$("#" + id + "-inner").val(oDiscription);

				MaterialnUmberForPo = oSelectedItem.getTitle();
				console.log(MaterialnUmberForPo);
				var a = oModel.getProperty(sBindPath + "/Description");
				var UOM = oModel.getProperty(sBindPath + "/UOM");

				//	oView.byId("nDescription").setValue(a);
				//$(this).closest("#__xmlview1--nDescription-__clone1-inner").val(a);
				//$(this).closest(".desc1").find("input").val(a);
				//this.getView().byId("nDescription").setValue(a);

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
		handleValueHelpPlant1: function(oEvent) {
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
		_handlePlantSearch1: function(evt) {
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
			var vendorModel = this.getView().getModel("PurchaseModel");
			var VendorNumber = vendorModel.oData.TempContract.Lifnr;
			console.log(VendorNumber);

			var Materialno = MaterialnUmberForPo
			console.log(Materialno);
			var oModelread = oView.getModel("VHeader");
			//	var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;

			//	var getPurchase = this.getView().getModel("CreateContract");
			//	var Materialno = getPurchase.getProperty("/Materialno");
			//	console.log(Materialno);
			var oModel = oView.getModel("Lookup");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId);
				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var PlantNumber = oSelectedItem.getTitle();
				console.log(PlantNumber);
				console.log(Materialno);
				oView.byId("Price").setValue(oModel.getProperty("/Stprs"));
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
				}
				/*	var that = this;
				oModelread.read("/fetch_matpriceSet(Matnr='" + Materialno + "',Bwkey='" + PlantNumber + "')", {
		*/
				var notzwer = "";
				//	var no;

				if ($.isNumeric((VendorNumber)) == true) {
					var len = VendorNumber.length;
					if (len !== undefined) {
						var z = 18 - len;
						for (var i = 0; i < z; i++) {
							notzwer += "0";
						}
					}
					console.log(len);
					console.log(notzwer);
					VendorNumber = notzwer + VendorNumber;
				}

				/*	var len = VendorNumber.length;
					if (len !== undefined) {
						var z = 10 - len;
						for (var i = 0; i < z; i++) {
							notzwer += "0";
						}
					}
						
				console.log(len);
				console.log(notzwer);
				VendorNumber = notzwer + VendorNumber;
				console.log(VendorNumber);*/
				var oFilter = new sap.ui.model.Filter('Lifnr', sap.ui.model.FilterOperator.EQ, VendorNumber);
				var oFilterV = new sap.ui.model.Filter('Matnr', sap.ui.model.FilterOperator.EQ, Materialno);
				var that = this;
				oModelread.read("/fetch_matpriceSet?$filter=(Lifnr eq '" + VendorNumber + "',Matnr eq '" + Materialno + "')", {
					filters: [oFilter, oFilterV],

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

							$("#" + id + "-inner").removeAttr('value');

							$("#" + id + "-inner").val(aaas);
							//	$("#" + id + "-inner").val(oHierarchyModel.getProperty("/Netpr"));

							//var price = oView.byId("idPrice").setValue(PriceJson.getProperty("/Stprs"));

						}

						/*	console.log(oData);

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

						}
*/
						/*
							var ab = $(that)[0].inputId;
							var id = $("#" + ab).closest("tr").find(".price1").attr("id");
							$("#" + id + "-inner").val(PriceJson.getProperty("/Stprs"));*/

					},
					error: function(oError) {
						console.log(oError);
						alert("No price found for given material number and plant combination. Add the price manually.");
					}

				});

				evt.getSource().getBinding("items").filter([]);
			}
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

		_handlePlantClose11: function(evt) {
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

				/*	var oMaterial = oModel.getProperty(sBindPath + "/Materialno");
					$("#__xmlview1--idMaterialNumber-__clone0-inner").val(oMaterial);
					$("#__xmlview1--idMaterialNumber-__clone0-inner").val(oMaterial);	

					var oUnitODm = oModel.getProperty(sBindPath + "/UOM");
					$("#__xmlview1--idUOM-__clone3-inner").val(oUnitODm);
					*/

				//	getPurchase.getData().Bwkey = oSelectedItem.getTitle();
				//	getPurchase.getData().Bwkey = oModel.getProperty(sBindPath + "/Bwkey");
				evt.getSource().getBinding("items").filter([]);
			}
		},
		/*plant search end*/

		/*material ddiscription start*/

		handleValueHelpMaterialDiscription: function(oEvent) {
			var sValue = oEvent.getParameter("value");

			//	var sInputValue = oEvent.getSource().getValue();
			this.MaterialDesinputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogMaterialDes) {
				this._valueHelpDialogMaterialDes = sap.ui.xmlfragment(
					"com.cassiniProcureToPay.view.fragment.Vendor.fragment.MaterialDescription",
					this
				);
				this.getView().addDependent(this._valueHelpDialogMaterialDes);
			}

			// create a filter for the binding
			this._valueHelpDialogMaterialDes.getBinding("items").filter([
				new Filter("Description", sap.ui.model.FilterOperator.Contains, sValue),
				new Filter("Materialno", sap.ui.model.FilterOperator.Contains, sValue)

			]);

			// open value help dialog filtered by the input value
			this._valueHelpDialogMaterialDes.open(sValue);

		},

		_handleMaterialDescriptionValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			//Filter the Bukrs and Butxt via vendor number

			var oFilterd = new Filter("Description", sap.ui.model.FilterOperator.Contains, sValue);
			var oFiltern = new Filter("Materialno", sap.ui.model.FilterOperator.Contains, sValue);

			evt.getSource().getBinding("items").filter([oFilterd, oFiltern]);
		},
		_handleMaterialDescriptionValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			var getPurchase = this.getView().getModel("VendorContract");
			var oModel = oView.getModel("VHeader");
			if (oSelectedItem) {
				var productInput = this.byId(this.MaterialDesinputId);
				var sBindPath = oSelectedItem.getBindingContext("VHeader").sPath;
				productInput.setValue(oSelectedItem.getTitle());
				var no = oSelectedItem.getTitle();

				var oMaterial = oModel.getProperty(sBindPath + "/Materialno");
				$("#__xmlview1--idMaterialNumber-__clone0-inner").val(oMaterial);
				//		oView.byId("idMaterialNumber").setValue(oMaterial);
				//	$(selector).val(value)
				//		$("#__xmlview1--idMaterialNumber-__clone0-inner").val(oMaterial);	

				var oUnitODm = oModel.getProperty(sBindPath + "/UOM");
				$("#__xmlview1--idUOM-__clone3-inner").val(oUnitODm);
				//	getPurchase.getData().CustomerID = oSelectedItem.getKey();
				getPurchase.getData().Description = oSelectedItem.getTitle();
				getPurchase.getData().Materialno = oModel.getProperty(sBindPath + "/Materialno");
				//		getPurchase.getData().PurchaseGroup = oModel.getProperty(sBindPath + "/ ");
			}
			evt.getSource().getBinding("items").filter([]);

		},
		/*Material Description fragment end*/

		onSavePurchaseOrder: function() {
			var oPurchaseModel = this.getView().getModel("PurchaseModel");
			var oPurchaseContract = oPurchaseModel.getProperty("/TempContract");
			console.log(oPurchaseModel);

			//	var Ebeln = oView.byId("productPO").getValue();
			console.log(PurchaseOno);
			//	Ebeln = oPurchaseContract.Ebeln;
			var Bukrs = oPurchaseContract.Bukrs;
			//	var Bsart = oPurchaseContract.Bsart;
			var Lifnr = oPurchaseContract.Lifnr;
			var Ebelp = oPurchaseContract.PoItem;

			var PoItem = Ebelp;
			console.log(Ebelp);
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
			var Ekorg = oPurchaseContract.Ekorg;
			var Ekgrp = oPurchaseContract.Ekgrp;
			var Waers = oPurchaseContract.Waers;

			console.log(Ebeln);
			var POItem = [];

			var oModel = this.getOwnerComponent().getModel("VHeader");

			var aItems = oPurchaseContract.POItem;
			//	Ebeln = oPurchaseContract.oData[0].Ebeln;

			console.log(aItems.length);
			// Define an empty Array
			var itemData = [];

			//iterate the values of levels
			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {

				var s_Ebelp = oPurchaseContract.POItem[iRowIndex].Ebelp;
				s_Ebelp = Number(s_Ebelp).toString();

				var l_PoItem = oPurchaseContract.POItem[iRowIndex].PoItem;
				l_PoItem = Number(l_PoItem).toString();

				var l_Ebelp1;

				if (!isNaN(s_Ebelp)) {
					l_Ebelp1 = s_Ebelp;
				} else if (l_PoItem !== undefined) {
					l_Ebelp1 = l_PoItem;
				}

				console.log(l_Ebelp1);

				var l_material = oPurchaseContract.POItem[iRowIndex].Material;

				var l_Menge = oPurchaseContract.POItem[iRowIndex].Quantity;
				var l_Werks = oPurchaseContract.POItem[iRowIndex].Plant;

				itemData.push({
					Ebelp: l_Ebelp1,
					//Ebelp: l_Ebelp,
					Matnr: l_material,
					Menge: l_Menge,
					Werks: l_Werks

				});
			}

			var oEntry1 = {};
			oEntry1.Ebeln = PurchaseOno;
			oEntry1.Bukrs = Bukrs;
			oEntry1.Bsart = "EC";
			oEntry1.Lifnr = Lifnr;
			oEntry1.Ekorg = Ekorg;
			oEntry1.Ekgrp = Ekgrp;
			oEntry1.Waers = Waers;

			//set the item data to ProductSet
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

			var oPurchaseModel = this.getOwnerComponent().getModel("PurchaseModel");
			var oTempContract = oPurchaseModel.getProperty("/TempContract");
			oTempContract.setData();
			var s = oPurchaseModel.oData.TempContract.destroy;
			//	s.refresh(true);
			oView.byId("vnumber").setValue("");

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
			}
			/*Company SEarch end*/

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassiniProcureToPay.view.view.POITemDetails
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.view.POITemDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.view.POITemDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});