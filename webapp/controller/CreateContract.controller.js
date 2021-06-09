sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/Fragment",
	"sap/m/Token",
	"sap/ui/model/json/JSONModel",
	"com/vSimpleApp/model/RebateConditionItem",
	"com/vSimpleApp/model/Scale",
	"com/vSimpleApp/model/Material",
	"com/vSimpleApp/model/EligibleData",
	"com/vSimpleApp/model/AccrualItem",
	"com/vSimpleApp/model/SettlementItem",
	"com/vSimpleApp/service/dateServices",
	"com/vSimpleApp/model/Formatter"
], function(Controller, MessageToast, Filter, FilterOperator, BusyIndicator, Fragment, Token, JSONModel, RebateConditionItem, Scale, Material, EligibleData, AccrualItem, SettlementItem, dateServices, Formatter) {
	"use strict";
	var aSelectedMaterialItem = [];
	return Controller.extend("com.vSimpleApp.controller.CreateContract", {
		formatter: Formatter,
		
		onInit: function() {
			this.DateService = dateServices.getInstance();
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("Home").attachPatternMatched(this._onRouteMatched, this);
			this.oRouter.getRoute("ViewContract").attachPatternMatched(this._onRouteMatched2, this);
			this.oRouter.getRoute("CreateContract").attachPatternMatched(this._onRouteMatched2, this);

		},
		
		_onRouteMatched2: function() {
			var oView = this.getView();
			console.log("kahdkjhdkashdakjhdaksdhjakhd"+oView.sViewName);
			//	this.getVendorList();
							
			},
		_onRouteMatched: function() {
			//alert("sdasd");
		//	this.getVendorList();
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			//oTempContract.setData({modelData:{}});
			//oTempContract.Accrual.Accrual = [];
			//oTempContract.Settlement = [];
			console.log(oTempContract);
			//	this.getVendorList();
		/*	setTimeout(function (){
					$("body").find("input").each(function(){
									var id = $(this).attr("id");
									if(id!==undefined)
									{
										if(id.indexOf("idVendorInput")!==-1)
										{
											var v = $(this).val();
											$(this).val("");
										}
										if(id.indexOf("idDesc")!==-1)
										{
											$(this).val("");
										}	
									}
								});
			}, 5000); */
	var oUserModel = this.getOwnerComponent().getModel("User");
			var sUsername = oUserModel.getProperty("/Username");
			if(sUsername !== "") {
				this.getVendorList();
			} else {
				this.oRouter.navTo("Login");
			}
				
		},
		
		onChangeTab: function(oEvent) {
			var oSelectedKey = oEvent.getParameter("selectedKey");
			if(oSelectedKey === "eligibleData") {
				this.getEligibleData();
			} else if(oSelectedKey === "accrual") {
				this.getAccruals();
			} else if(oSelectedKey === "settlement") {
				this.getSettlementData();
			}
		},
		
		onChangeDocumentDate: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
		},
		
		onChangeAccrualPostingDate: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
		},
		
		onChangeReferenceText: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
		},
		
		onChangeSettlementPostingDate: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
		},
		
		getSettlementData: function() {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oModel = this.getOwnerComponent().getModel("RebatePostSet");
			var sContractId = oVendorModel.getProperty("/TempContract/ContractNo");
			if(sContractId.indexOf(" ")!==-1)
			{
				sContractId = sContractId.replace(" ","");
			}
			var sPostingDate = "08/2020";//oVendorModel.getProperty("/TempContract/Settlement/PostingPeriod");
			var aDateSubString = sPostingDate.split("/");
			var sPostingPeriod = aDateSubString[1] + aDateSubString[2];
			BusyIndicator.show(0);
			oModel.read("/HeaderDocSet('" + sContractId + "," + sPostingPeriod + "')", {
				urlParameters: {
			        "$expand": "SettlementSet"
			    },
				success: function(oData) {
					BusyIndicator.hide();
					oVendorModel.setProperty("/TempContract/Settlement/SettlementSet", []);
					var oSettlement = oVendorModel.getProperty("/TempContract/Settlement");
					for(var i = 0; i < oData.SettlementSet.results.length; i++) {
						var oSettlementItem = new SettlementItem(oData.SettlementSet.results[i]);
						oSettlement.SettlementSet.push(oSettlementItem);
					}
					oVendorModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		onChangePostingPeriod: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue) {
				oControl.setValueState("None");
				this.getAccruals();
			} else {
				oControl.setValueState("Error");
			}
		},
		
		getAccruals: function() {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oModel = this.getOwnerComponent().getModel("RebatePostSet");
			var sContractId = oVendorModel.getProperty("/TempContract/ContractNo");
			if(sContractId.indexOf(" ")!==-1)
			{
				sContractId = sContractId.replace(" ","");
			}
			var sPostingDate = "08/2020";//oVendorModel.getProperty("/TempContract/Accrual/PostingPeriod");
			var aDateSubString = sPostingDate.split("/");
			var sPostingPeriod = aDateSubString[1] + aDateSubString[2];
			BusyIndicator.show(0);
			oModel.read("/HeaderDocSet('" + sContractId + "," + sPostingPeriod + "')", {
				urlParameters: {
			        "$expand": "AccrualSet"
			    },
				success: function(oData) {
					BusyIndicator.hide();
					oVendorModel.setProperty("/TempContract/Accrual/AccrualSet", []);
					var oAccrual = oVendorModel.getProperty("/TempContract/Accrual");
					oAccrual.AccrualSet = [];
					for(var i = 0; i < oData.AccrualSet.results.length; i++) {
						var oAccrualItem = new AccrualItem(oData.AccrualSet.results[i]);
						oAccrual.AccrualSet.push(oAccrualItem);
					}
					oVendorModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		getEligibleData: function() {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oModel = this.getOwnerComponent().getModel();
			var sContractId = oVendorModel.getProperty("/TempContract/ContractNo");
			if(sContractId.indexOf(" ")!==-1)
			{
				sContractId = sContractId.replace(" ","");
			}
			var aFilters = [];
			var oContractFilter = new sap.ui.model.Filter({
                     path: "Type",
                     operator: sap.ui.model.FilterOperator.EQ,
                     value1: sContractId
              });
			aFilters.push(oContractFilter);
			BusyIndicator.show(0);
			oModel.read("/EligibleSet", {
				filters: aFilters,
				success: function(oData) {
					BusyIndicator.hide();
					oVendorModel.setProperty("/TempContract/EligibleData", []);
					var aEligibleData = oVendorModel.getProperty("/TempContract/EligibleData");
					for(var i = 0; i < oData.results.length; i++) {
						var oEligibleData = new EligibleData(oData.results[i]);
						aEligibleData.push(oEligibleData);
					}
					oVendorModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		onChangeVendor: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			var sSelectedKey = oControl.getSelectedKey();
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			oVendorModel.setProperty("/TempContract/VendorNo", sSelectedKey);
			oVendorModel.setProperty("/TempContract/VendorName", sValue);
			if(sValue === "") {
				oVendorModel.setProperty("/TempContract/CompanyCode", "");
				oVendorModel.setProperty("/TempContract/PurchaseOrg", "");
				oVendorModel.setProperty("/TempContract/Currency", "");
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
			oVendorModel.refresh(true);
		},
		
		onChangeDescription: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
			} else {
				oControl.setValueState("None");
			}
		},
		
		onChangeValidFrom: function(oEvent) {
			var oControl = oEvent.getSource();
			var sDateValue = oControl.getProperty("dateValue");
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var sValidTo = oVendorModel.getProperty("/TempContract/ValidTo");
			if(sDateValue) {
				if(sValidTo) {
					var iValidFromTimeValue = sDateValue.getTime();
					var aDateSubString = sValidTo.split("/");
					var iValidToTimeValue = Date.parse(aDateSubString[1] + "/" + aDateSubString[0] + "/" + aDateSubString[2]);
					if(iValidToTimeValue < iValidFromTimeValue) {
						oControl.setValueState("Error");
						oControl.setValueStateText("Valid From should be less than Valid To");
						oControl.setValue(null);
					} else {
						oControl.setValueState("None");
						oControl.setValueStateText("");
					}
				} else {
					oControl.setValueState("None");
					oControl.setValueStateText("");
				}
			} else {
				oControl.setValueState("Error");
				oControl.setValueStateText("Valid From is required");
			}
		},
			
		onChangeValidTo: function(oEvent) {
			var oControl = oEvent.getSource();
			var sDateValue = oControl.getProperty("dateValue");
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var sValidFrom = oVendorModel.getProperty("/TempContract/ValidFrom");
			if(sDateValue) {
				if(sValidFrom) {
					var iValidToTimeValue = sDateValue.getTime();
					var aDateSubString = sValidFrom.split("/");
					var iValidFromTimeValue = Date.parse(aDateSubString[1] + "/" + aDateSubString[0] + "/" + aDateSubString[2]);
					if(iValidToTimeValue < iValidFromTimeValue) {
						oControl.setValueState("Error");
						oControl.setValueStateText("Valid To should be greater than Valid From");
						oControl.setValue(null);
					} else {
						oControl.setValueState("None");
						oControl.setValueStateText("");
					}
				} else {
					oControl.setValueState("None");
					oControl.setValueStateText("");
				}
			} else {
				oControl.setValueState("Error");
				oControl.setValueStateText("Valid To is required");
			}
		},
		
		onChangeRebateItemRate: function(oEvent) {
			var oControl = oEvent.getSource();
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
				oControl.setValueStateText("Rate is required");
			} else {
				oControl.setValueState("None");
				oControl.setValueStateText("");
			}
		},
		
		onChangeItemValidFrom: function(oEvent) {
			var oControl = oEvent.getSource();
			var sDateValue = oControl.getProperty("dateValue");
			var sPath = oControl.getBindingContext("Vendor").getPath();
			var aPathSubString = sPath.split("/");
			var iIndex = parseInt(aPathSubString[aPathSubString.length - 1], 10);
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var sHeaderValidTo = oVendorModel.getProperty("/TempContract/ValidTo");
			var sHeaderValidFrom = oVendorModel.getProperty("/TempContract/ValidFrom");
			var sCurrentItemValidTo = oVendorModel.getProperty(sPath + "/ValidTo");
			var sRebateType = oVendorModel.getProperty(sPath + "/RebateType");
			var aItems = oVendorModel.getProperty("/TempContract/RebateConditionItems");
			if(sHeaderValidFrom === "") {
				 oVendorModel.setProperty("/TempContract/ValidFromValueState", "Error");
				 MessageToast.show("Header Valid From is required");
				 oControl.setValueState("Error");
				 oControl.setValue(null);
				 return;
			}
			if(sHeaderValidTo === "") {
				 oVendorModel.setProperty("/TempContract/ValidToValueState", "Error");
				 MessageToast.show("Header Valid To is required");
				 oControl.setValueState("Error");
				 oControl.setValue(null);
				 return;
			}
			if(sDateValue) {
				if(this.checkValueAgainstHeader(sHeaderValidFrom, sHeaderValidTo, sDateValue) &&
				   this.checkValueAgainstItem(aItems, sDateValue, sRebateType, iIndex)) {
					if(sCurrentItemValidTo) {
						var iValidFromTimeValue = sDateValue.getTime();
						var aDateSubString = sCurrentItemValidTo.split("/");
						var iValidToTimeValue = Date.parse(aDateSubString[1] + "/" + aDateSubString[0] + "/" + aDateSubString[2]);
						if(iValidToTimeValue < iValidFromTimeValue) {
							oControl.setValueState("Error");
							oControl.setValueStateText("Valid From should be less than Valid To");
							oControl.setValue(null);
						} else {
							oControl.setValueState("None");
							oControl.setValueStateText("");
						}
					} else {
						oControl.setValueState("None");
						oControl.setValueStateText("");
					}
				} else {
					oControl.setValueState("Error");
					oControl.setValueStateText("Value is overlaaping with other lines");
					oControl.setValue(null);
				}
			} else {
				oControl.setValueState("Error");
				oControl.setValueStateText("Valid From is required");
			}
		},
		
		onChangeItemValidTo: function(oEvent) {
			var oControl = oEvent.getSource();
			var sDateValue = oControl.getProperty("dateValue");
			var sPath = oControl.getBindingContext("Vendor").getPath();
			var aPathSubString = sPath.split("/");
			var iIndex = parseInt(aPathSubString[aPathSubString.length - 1], 10);
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var sHeaderValidTo = oVendorModel.getProperty("/TempContract/ValidTo");
			var sHeaderValidFrom = oVendorModel.getProperty("/TempContract/ValidFrom");
			var sCurrentItemValidFrom = oVendorModel.getProperty(sPath + "/ValidFrom");
			var sRebateType = oVendorModel.getProperty(sPath + "/RebateType");
			var aItems = oVendorModel.getProperty("/TempContract/RebateConditionItems");
			if(sHeaderValidFrom === "") {
				 oVendorModel.setProperty("/TempContract/ValidFromValueState", "Error");
				 MessageToast.show("Header Valid From is required");
				 oControl.setValueState("Error");
				 oControl.setValue(null);
				 return;
			}
			if(sHeaderValidTo === "") {
				 oVendorModel.setProperty("/TempContract/ValidToValueState", "Error");
				 MessageToast.show("Header Valid To is required");
				 oControl.setValueState("Error");
				 oControl.setValue(null);
				 return;
			}
			if(sDateValue) {
				if(this.checkValueAgainstHeader(sHeaderValidFrom, sHeaderValidTo, sDateValue) &&
				   this.checkValueAgainstItem(aItems, sDateValue, sRebateType, iIndex)) {
					if(sCurrentItemValidFrom) {
						var iValidToTimeValue = sDateValue.getTime();
						var aDateSubString = sCurrentItemValidFrom.split("/");
						var iValidFromTimeValue = Date.parse(aDateSubString[1] + "/" + aDateSubString[0] + "/" + aDateSubString[2]);
						if(iValidToTimeValue < iValidFromTimeValue) {
							oControl.setValueState("Error");
							oControl.setValueStateText("Valid To should be greater than Valid From");
							oControl.setValue(null);
						} else {
							oControl.setValueState("None");
							oControl.setValueStateText("");
						}
					} else {
						oControl.setValueState("None");
						oControl.setValueStateText("");
					}
				} else {
					oControl.setValueState("Error");
					oControl.setValueStateText("Value is overlaaping with other lines");
					oControl.setValue(null);
				}
			} else {
				oControl.setValueState("Error");
				oControl.setValueStateText("Valid To is required");
			}
		},
		
		checkValueAgainstHeader: function(sHeaderValidFrom, sHeaderValidTo, sCurremtValue) {
			var bValid = true;
			var iCurentTimeValue = sCurremtValue.getTime();
			var aValidFromDateSubString = sHeaderValidFrom.split("/");
			var iValidFromTimeValue = Date.parse(aValidFromDateSubString[1] + "/" + aValidFromDateSubString[0] + "/" + aValidFromDateSubString[2]);
			var aValidToDateSubString = sHeaderValidTo.split("/");
			var iValidToTimeValue = Date.parse(aValidToDateSubString[1] + "/" + aValidToDateSubString[0] + "/" + aValidToDateSubString[2]);
			if(iCurentTimeValue < iValidFromTimeValue || iCurentTimeValue > iValidToTimeValue) {
				MessageToast.show("Selected date should be in between header duration");
				bValid = false;
			}
			return bValid;
		},
		
		checkValueAgainstItem: function(aItems, sCurremtValue, sRebateType, iCurrentIndex) {
			var bValid = true;
			for (var i = 0; i < aItems.length; i++) {
				if(i !== iCurrentIndex) {
					var iCurentTimeValue = sCurremtValue.getTime();
					var aValidFromDateSubString = aItems[i].ValidFrom.split("/");
					var iValidFromTimeValue = Date.parse(aValidFromDateSubString[1] + "/" + aValidFromDateSubString[0] + "/" + aValidFromDateSubString[2]);
					var aValidToDateSubString = aItems[i].ValidTo.split("/");
					var iValidToTimeValue = Date.parse(aValidToDateSubString[1] + "/" + aValidToDateSubString[0] + "/" + aValidToDateSubString[2]);
					if(iCurentTimeValue >= iValidFromTimeValue && iCurentTimeValue <= iValidToTimeValue && aItems[i].RebateType === sRebateType) {
						MessageToast.show("Selected date is overlapping with the duration of Line No: " + (i + 1));
						bValid = false;
						break;
					}
				}
			}
			return bValid;
		},

		handleValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"com.vSimpleApp.view.fragment.Vendor.fragment.VendorSuggestionHelpDialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}
			if(sInputValue.includes(")")) {
				var sSubString = sInputValue.split(")")[1];
				sInputValue = sSubString.trim();
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter(new Filter([new Filter(
				"Vendorname",
				FilterOperator.Contains, sInputValue
			),new Filter(
				"Vendorno",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter([new Filter(
				"Vendorname",
				FilterOperator.Contains, sValue
			),new Filter(
				"Vendorno",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter(oFilter);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.byId(this.inputId),
					sDescription = oSelectedItem.getInfo(),
					sTitle = oSelectedItem.getTitle();
				productInput.setSelectedKey(sDescription);
				productInput.setValue("(" + sDescription + ") " + sTitle);
				if (sDescription !== "") {
					this.getVendorDetails(sDescription);
				}
			}
			evt.getSource().getBinding("items").filter([]);
		},

		suggestionItemSelected: function(evt) {
			var oItem = evt.getParameter("selectedItem"),
				sKey = oItem ? oItem.getKey() : "";
			if (sKey !== "") {
				this.getVendorDetails(sKey);
			}
		},
		
		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			BusyIndicator.show(0);
			oModel.read("/VendorListSet", {
		//	oModel.read("/Fetch_Vendor_DetailsSet", {
		
				success: function(oData) {
					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/VendorList", oData.results);
					oLookupModel.refresh(true);
					that.getMaterialList();
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		getVendorDetails: function(sVendorNumber) {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			BusyIndicator.show(0);
			oModel.read("/ZVendorDetSet('" + sVendorNumber + "')", {
				success: function(oData) {
					BusyIndicator.hide();
					var oVendorModel = that.getOwnerComponent().getModel("Vendor");
					var oTempContract = oVendorModel.getProperty("/TempContract");
					oTempContract.VendorName = oData.Vendorname;
					oTempContract.VendorNo = oData.Vendorno;
					oTempContract.PurchaseOrg = oData.Purorg;
					oTempContract.CompanyCode = oData.Compcode;
					oTempContract.Currency = oData.Currency;
					oVendorModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		handleMaterialValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			// create value help dialog
			if (!this._valueMaterialHelpDialog) {
				Fragment.load({
					id: "valueMaterialHelpDialog",
					name: "com.cassini.Rebate.view.fragment.MaterialSuggestionHelpDialog",
					controller: this
				}).then(function (oValueMaterialHelpDialog) {
					this._valueMaterialHelpDialog = oValueMaterialHelpDialog;
					this.getView().addDependent(this._valueMaterialHelpDialog);
					this._openMaterialValueHelpDialog(sInputValue);
				}.bind(this));
			} else {
				this._openMaterialValueHelpDialog(sInputValue);
			}
		},

		_openMaterialValueHelpDialog: function (sInputValue) {
			// create a filter for the binding
			this._valueMaterialHelpDialog.getBinding("items").filter(new Filter([new Filter(
				"Description",
				FilterOperator.Contains, sInputValue
			),new Filter(
				"MaterialNo",
				FilterOperator.Contains, sInputValue
			)]));

			// open value help dialog filtered by the input value
			this._valueMaterialHelpDialog.open(sInputValue);
		},

		_handleMaterialValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			this._InputMaterialValue = sValue;
			var oFilter = new Filter([new Filter(
				"Description",
				FilterOperator.Contains, sValue
			),new Filter(
				"MaterialNo",
				FilterOperator.Contains, sValue
			)]);
			evt.getSource().getBinding("items").filter([oFilter]);
			evt.getSource().getAggregation("_dialog").getAggregation("content")[1].attachSelectionChange(this._onChangeMaterialSelection);
		},
		
		_onChangeMaterialSelection: function(oEvent) {
			var aSelectedItem = oEvent.getSource().getSelectedItems();
			aSelectedMaterialItem = [];
			aSelectedItem.forEach(function(item) {
				aSelectedMaterialItem.push(item.getBindingContextPath());	
			});
		},

		_handleMaterialValueHelpClose: function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.byId("idSKUMultiInput");
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var aSKUExclusion = oVendorModel.getProperty("/TempContract/SKUExclusion");
			if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
						key: oItem.getInfo(),
						text: oItem.getTitle()
					}));
					var aMaterials = oLookupModel.getProperty("/MaterialList");
					var oMaterial = aMaterials.find(function(material) {
						return material.MaterialNo.toString() === oItem.getInfo().toString();
					});
					if (oMaterial) {
						aSKUExclusion.push(oMaterial);
					}
				});
			} else {
				aSelectedItems = aSelectedMaterialItem;
				aSelectedItems.forEach(function (path) {
					var oMaterial = oLookupModel.getProperty(path);
					oMultiInput.addToken(new Token({
						key: oMaterial.MaterialNo,
						text: oMaterial.Description
					}));
					if (oMaterial) {
						aSKUExclusion.push(oMaterial);
					}
				});
			}
			aSelectedMaterialItem = [];
			oVendorModel.refresh(true);
		},
		
		getMaterialList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			BusyIndicator.show(0);
			oModel.read("/MaterialNoSet", {
				success: function(oData) {
					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					var aMaterials = [];
					oData.results.forEach(function(data) {
						aMaterials.push(new Material(data));	
					});
					oLookupModel.setProperty("/MaterialList", aMaterials);
					oLookupModel.refresh(true);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		
		onChangeSKUExclusion: function(oEvent) {
			var sType = oEvent.getParameter("type");
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var aSKUExclusion = oVendorModel.getProperty("/TempContract/SKUExclusion");
			var sMaterialNo;
			if (sType === "added") {
				sMaterialNo = oEvent.getParameter("addedTokens")[0].getKey();
				var aMaterials = oLookupModel.getProperty("/MaterialList");
				var oMaterial = aMaterials.find(function(material) {
					return material.MaterialNo.toString() === sMaterialNo.toString();
				});
				if (oMaterial) {
					aSKUExclusion.push(oMaterial);
				}
			} else {
				sMaterialNo = oEvent.getParameter("removedTokens")[0].getKey();
				var iMaterialIndex = aSKUExclusion.findIndex(function(material) {
					return material.MaterialNo.toString() === sMaterialNo.toString();
				});
				if (iMaterialIndex !== -1) {
					aSKUExclusion.splice(iMaterialIndex, 1);
				}
			}
			oVendorModel.refresh(true);
		},
		
		onAddNewConditionItem: function() {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var aRebateContionItems = oVendorModel.getProperty("/TempContract/RebateConditionItems");
			aRebateContionItems.push(new RebateConditionItem({ ItemNo: (aRebateContionItems.length + 1).toString() }));
			oVendorModel.refresh(true);
		},
		
		onDeleteConditionItem: function() {
			var oRebateConditionItemTable = this.byId("idRebateConditionItemTable");
			var aSelectedIndex = oRebateConditionItemTable.getSelectedIndices().reverse();
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var aRebateContionItems = oVendorModel.getProperty("/TempContract/RebateConditionItems");
			for (var i = 0; i < aSelectedIndex.length; i++) {
				aRebateContionItems.splice(aSelectedIndex[i], 1);
			}
			oRebateConditionItemTable.clearSelection();
			oVendorModel.refresh(true);
		},
		
		onChangeRebateType: function(oEvent) {
			var oCtx = oEvent.getSource().getBindingInfo("selectedKey").binding.getContext();
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			var oModel = oCtx.getModel();
			var oItem = oModel.getProperty(oCtx.getPath());
			oItem.Rate = "";
			oItem.IsRateEnabled = true;
			oItem.IsScaleSelected = false;
			oItem.Scales.forEach(function(scale) {
				scale.Value = "";
				scale.RebateType = sSelectedKey;
				scale.RebatePercent = "";
			});
		},
		
		onSelectScale: function(oEvent) {
			var bSelected = oEvent.getParameter("selected");
			var oCtx = oEvent.getSource().getBindingInfo("selected").binding.getContext(),
				oControl = oEvent.getSource();
				this._sItemPath = oCtx.getPath();
			if (bSelected) {
				if (!this._oPopover) {
					Fragment.load({
						id: "idScalePopOver",
						name: "com.cassini.Rebate.view.fragment.ScalePopOver",
						controller: this
					}).then(function (oPopover) {
						this._oPopover = oPopover;
						this.getView().addDependent(this._oPopover);
						this._oPopover.bindElement({ path: oCtx.getPath(), model: "Vendor" });
						this._oPopover.openBy(oControl);
					}.bind(this));
				} else {
					this._oPopover.bindElement({ path: oCtx.getPath(), model: "Vendor" });
					this._oPopover.openBy(oControl);
				}
			} else {
				var oModel = oCtx.getModel();
				var oItem = oModel.getProperty(oCtx.getPath());
				oItem.Rate = "";
				oItem.IsRateEnabled = true;
			}
		},
		
		handleClosePress: function () {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oItem = oVendorModel.getProperty(this._sItemPath);
			
			var aFilteredScales = oItem.Scales.filter(function(scale) {
				return scale.validate();	
			});
			if(aFilteredScales.length !== oItem.Scales.length) {
				oVendorModel.refresh(true);
				return;
			}
			
			var aFilteredEmptyScales = oItem.Scales.filter(function(scale) {
				return scale.isEmpty();	
			});
			if(aFilteredEmptyScales.length === oItem.Scales.length) {
				oItem.IsScaleSelected = false;
			}
			
			for (var i = 0; i < oItem.Scales.length; i++) {
				if (oItem.Scales[i].Value !== "" || oItem.Scales[i].RebatePercent !== "") {
					oItem.IsRateEnabled = false;
				}
			}
			var maxRate = Math.max.apply(Math, oItem.Scales.map(function(scale) { return scale.RebatePercent; }));
			oItem.Rate = (maxRate !== 0) ? maxRate.toString() : "";
			oItem.RateValueState = "None";
			oVendorModel.refresh(true);
			this._oPopover.close();
		},
		
		onAddNewScaleItem: function(oEvent) {
			var oVendorModel = this._oPopover.getElementBinding("Vendor").getModel();
			var sPath = this._oPopover.getElementBinding("Vendor").getPath();
			var oItem = oVendorModel.getProperty(sPath);
			oItem.Scales.push(new Scale({ ScaleNo: (oItem.Scales.length + 1).toString(), RebateType: oItem.RebateType }));
			oVendorModel.refresh(true);
		},
		
		onDeleteScaleItem: function(oEvent) {
			var oScaleTable = oEvent.getSource().getParent().getParent();
			var aSelectedIndex = oScaleTable.getSelectedIndices().reverse();
			var oVendorModel = this._oPopover.getElementBinding("Vendor").getModel();
			var sPath = this._oPopover.getElementBinding("Vendor").getPath();
			var oItem = oVendorModel.getProperty(sPath);
			for (var i = 0; i < aSelectedIndex.length; i++) {
				oItem.Scales.splice(aSelectedIndex[i], 1);
			}
			oScaleTable.clearSelection();
			oVendorModel.refresh(true);
		},
		editCode: function(){
			var oComponent1 = this.getOwnerComponent();
				oComponent1.getRouter().navTo("ChangeContract");
		}
	});
});