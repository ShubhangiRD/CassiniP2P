sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageBox",
	"sap/ui/model/Sorter",
	"sap/ui/table/library",
	"sap/ui/thirdparty/jquery",
	"sap/ui/table/RowAction",
	"sap/ui/table/RowActionItem",
	"sap/ui/table/RowSettings",
	"sap/ui/core/Fragment",

	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library",
	"com/cassiniProcureToPay/model/Vendor"

], function(Controller, JSONModel, Filter, FilterOperator, BusyIndicator, MessageToast, Export, ExportTypeCSV, MessageBox, Sorter,
	library, jQuery, RowAction, RowActionItem, RowSettings, Fragment, Spreadsheet, exportLibrary, Vendor) {
	"use strict";
	var Purchaseordernumber;
	var oView, oComponent, oController;
	var SortOrder = library.SortOrder;

	var ListofVendor = [],
		ListofPurchaseOrders = [];
	return Controller.extend("com.cassiniProcureToPay.controller.ShowTiles", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.cassiniProcureToPay.view.view.ShowTiles
		 */
		onInit: function() {
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();
			this.oSF = oView.byId("searchField");
			var sRootPath = jQuery.sap.getModulePath("com.cassiniProcureToPay");
		/*	var oVendorModel = this.getOwnerComponent().getModel("VendorModel");
			 oVendorModel.setData([]);
	
			oVendorModel.refresh(true);	*/
			//get the json data model.
			var oModel = new JSONModel([sRootPath, "data/LandingPageData.json"].join("/"));
			this.getView().setModel(oModel, "LandingPageModel");

			/*	var manifests = new sap.ui.model.json.JSONModel();
			manifests.loadData("model/cardManifests.json");
			this.getView().setModel(manifests, "manifests");
			console.log(manifests);
*/
	
		
			var CountModel = new JSONModel();
			oView.setModel(CountModel, "CountModel");

			var jsonData = new sap.ui.model.json.JSONModel();
			jsonData.loadData("data/Data.json");
			this.getView().setModel(jsonData, "jsonData");
			console.log(jsonData);
			var inputModel = new JSONModel({
				expression: ""
			});
			this.getView().setModel(inputModel, "inputModel");

			//Visible disable model
			var onVisiblemodel = new JSONModel({
				isEditable: false
			});

			this.getView().setModel(onVisiblemodel, "Visiblemodel");
			//	this.headercolumn();

	this.getVendorList();
		this.getPurchaseOrderList();
			this.getVendorCountListByPO();
			//		this.getOpenPurchaseOrder();
			this.getTopFiveVendorsNames();
			this.getTopProductsFirst();
			//	this.getpur();

			// set explored app's demo model on this sample

			oView.setModel(new JSONModel({
				globalFilter: "",
				availabilityFilterOn: false,
				cellFilterOn: false
			}), "ui");
			this._oGlobalFilter = null;
			this._oPriceFilter = null;

			var fnPress = this.handleActionPress.bind(this);

			this.modes = [{
					key: "Navigation",
					text: "Navigation",
					handler: function() {
						var oTemplate = new RowAction({
							items: [
								new RowActionItem({
									type: "Navigation",
									press: fnPress,
									visible: "{Available}"
								})
							]
						});
						return [1, oTemplate];
					}
				}

			];

			this.getView().setModel(new JSONModel({
				items: this.modes
			}), "modes");
			this.switchState("Navigation");
			
			
			  	this.bDescending = false;
				this.sSearchQuery = 0;
				this.bGrouped = false;

		},

		switchState: function(sKey) {
			var oTable = this.byId("tablePoorders");
			var iCount = 0;
			var oTemplate = oTable.getRowActionTemplate();
			if (oTemplate) {
				oTemplate.destroy();
				oTemplate = null;
			}

			for (var i = 0; i < this.modes.length; i++) {
				if (sKey == this.modes[i].key) {
					var aRes = this.modes[i].handler();
					iCount = aRes[0];
					oTemplate = aRes[1];
					break;
				}
			}

			oTable.setRowActionTemplate(oTemplate);
			oTable.setRowActionCount(iCount);

		},

		handleActionPress: function(oEvent) {
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");

			var PurchaseNumber = oEvent.getParameter("row").getRowBindingContext().getProperty("Ebeln");

			/*	MessageToast.show("Item " + (oItem.getText() || oItem.getType()) + " pressed for Po with id " +
					oEvent.getParameter("row").getRowBindingContext().getProperty("Ebeln"));*/

			try {
				//	var PurchaseNumber = oEvent.getSource().data("Ebeln");
				oComponent.getRouter().navTo("PurchaseItemDetails", {
					PoNumber: PurchaseNumber
				});
			} catch (ex) {
				MessageBox.error(ex);
			}

		},
			OnNavigateVendorDetails: function(oEvent) {
		
		
			//clear the data model
			try {
				var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			//get the Prodno from this model
			var oModel = oView.getModel("Lookup");
			var oVendorpath = oModel.getProperty(sPath);
			var oVendor = oVendorpath.Lifnr;
				oComponent.getRouter().navTo("DisplayVendor", {
					VendorNo: oVendor
				});
			} catch (ex) {
				MessageBox.error(ex);
			}

			//oComponent.getRouter().navTo("Dashboard2");
		},
		NavigatePurchaseItemDetails: function(oEvent) {

			try {
				var PurchaseNumber = oEvent.getSource().data("Ebeln");
				oComponent.getRouter().navTo("PurchaseItemDetails", {
					PoNumber: PurchaseNumber
				});
			} catch (ex) {
				MessageBox.error(ex);
			}

			//oComponent.getRouter().navTo("Dashboard2");
		},
		pressGenericTile: function(evt) {
			//navigate the property is selected subheader.
			if (evt.getSource().getProperty("header") === "Vendor Master") {
				oComponent.getRouter().navTo("VM");
			} else if (evt.getSource().getProperty("header") === "Purchase Order") {
				oComponent.getRouter().navTo("PODetails");
			} else if (evt.getSource().getProperty("header") === "Post Goods Receipt") {
				oComponent.getRouter().navTo("GoodReceipt");
			} else if (evt.getSource().getProperty("header") === "Book Vendor Invoice") {
				oComponent.getRouter().navTo("Dashboard");
			} else if (evt.getSource().getProperty("header") === "Vendor Rebate Management") {
				oComponent.getRouter().navTo("DashboardVendor");
			}

		},

		tile: function(oEvent) {
			oComponent.getRouter().navTo("TileDashboard");
		},
		// Get  Top five vendor and get their counts

		getVendorCountListByPO: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(true);
			return new Promise(function(resolve1, reject1) {
				oModel.read("/POHeaderSet", {
					//	oModel.read("/POItemSet",{
					success: function(oData) {
						BusyIndicator.hide(false);
						//		console.log(oData);
						var item = oData.results.length;
						var ListofVendoritem = [];

						var ListofVendoritemTwo = [];
						for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
							//		console.log(iRowIndex);
							var Lifnrr = oData.results[iRowIndex].Lifnr;

							ListofVendoritem.push({
								Lifnr: Lifnrr

							});
						}

						//			console.log(ListofVendoritem);

						var index = {};
						var result = [];

						ListofVendoritem.forEach(function(point) {
							var key = "" + point.Lifnr + " ";

							if (key in index) {
								index[key].count++;
							} else {
								var newEntry = {
									Lifnr: point.Lifnr,
									//	Name1 : vendorname,
									count: 1
								};
								index[key] = newEntry;
								result.push(newEntry);

							}
						});
						//	console.log(result);

						result.sort(function(a, b) {
							return b.count - a.count;
						});
						//		console.log(result);
						var resultlengrh = result.length;
						var ListofVendoritemTwo = [];
						for (var iRowIndex = 1; iRowIndex <= 5; iRowIndex++) {

							var Lifnrr = result[iRowIndex].Lifnr;
							var counts = result[iRowIndex].count;
							var name = result[iRowIndex].VendorNameee;
							if (Lifnrr !== "" || Lifnrr !== undefined) {
								for (var x = 0; x < ListofVendor.length; x++) {
									if (Lifnrr == ListofVendor[x].Lifnr) {
										var vendorname = ListofVendor[x].Name1;
										console.log(vendorname);
										name = vendorname;
									}
								}
							}
							ListofVendoritemTwo.push({
								Lifnr: Lifnrr,
								count: counts,
								name: name

							});
						}

						console.log(ListofVendoritemTwo);

						//top five vendor model with the count
						var CountModel = oView.getModel("CountModel");
						CountModel.setData(ListofVendoritemTwo);
						//	oView.setModel(CountModel, "CountModel");
						console.log(CountModel);

						//show popover in chart 
						/*	 var oPopOverBar = oView.byId("idPopOverBar");
            oPopOverBar.connect(CountModel.getVizUid());*/

						var itemsc = CountModel.oData.length;
						for (var iRowIndex = 0; iRowIndex < itemsc; iRowIndex++) {
							var Lifnrr = CountModel.oData[iRowIndex].Lifnr;
							var aFilter = [
								new sap.ui.model.Filter({
									path: "Lifnr",
									operator: sap.ui.model.FilterOperator.EQ,
									value1: Lifnrr
								})

							];

						}

						var ListofVendorTopThree = [];

						for (var iRowIndex = 1; iRowIndex <= 3; iRowIndex++) {
							//		console.log(iRowIndex);
							var Lifnrr = result[iRowIndex].Lifnr;
							var Count = result[iRowIndex].count;
							ListofVendorTopThree.push({
								Lifnr: Lifnrr,
								count: Count

							});
						}

						console.log(ListofVendorTopThree);
						var ListofVendorTopThreeModel = new JSONModel();
						ListofVendorTopThreeModel.setData(ListofVendorTopThree);
						oView.setModel(ListofVendorTopThreeModel, "ListofVendorTopThreeModel");
						console.log(ListofVendorTopThreeModel);
					},
					error: function(oError) {
						BusyIndicator.hide(false);
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			});
		},

		getTopFiveVendorsNames: function() {
			var oModel = this.getOwnerComponent().getModel("VHeader");
			var CountModels = oView.getModel("CountModel");
			console.log(CountModels);
			var itemsc = CountModels.oData;
			var VendorssList = [];
			//	var Lifnrr = 1005;
			for (var iRowIndex = 0; iRowIndex < itemsc; iRowIndex++) {
				var Lifnrr = CountModels.oData[iRowIndex].Lifnr;
				var aFilter = [
					new sap.ui.model.Filter({
						path: "Lifnr",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Lifnrr
					})

				];
				oModel.read("/Fetch_Vendor_DetailsSet", {
					filters: aFilter,
					success: function(suc) {
						BusyIndicator.hide();
						console.log(suc);
						var item = suc.results.length;

						for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {

							var lifnr = suc.results[iRowIndex].Lifnr;

							var vendorname = suc.results[iRowIndex].Name1;
							if (Lifnrr == lifnr) {
								oView.getModel("CountModel").setProperty("Vendorname", vendorname); // setData(oData.results);

								VendorssList.push({
									Lifnr: lifnr,
									Name1: vendorname

								});
							}
							console.log(vendorname);

						}

						console.log(VendorssList);
					},
					error: function(err) {
						console.log(err);
					}
				});
			}
		},

		getVendorList: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/Fetch_Vendor_DetailsSet", {
				success: function(oData) {
					var item = oData.results.length;

					for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
						var odata = oData.results[iRowIndex];
						if (odata !== undefined) {
							var Lifnrr = odata.Lifnr;
							var Name1r = odata.Name1;
							var Bukrs = odata.Bukrs;
							var Ekgrp = odata.Ekgrp;
							var Ekorg = odata.Ekorg;
							var Gbort = odata.Gbort;
							var Ktokk = odata.Ktokk;
							var Kunnr = odata.Kunnr;
							var Land1 = odata.Land1;
							var Ort01 = odata.Ort01;
							var Pstlz = odata.Pstlz;
							var Stras = odata.Stras;
							var Regio = odata.Regio;
							var Telf1 = odata.Telf1;
							var Waers = odata.Waers;
							var Sexkz = odata.Sexkz;
							var Adrnr = odata.Adrnr;

							ListofVendor.push({
								Lifnr: Lifnrr,
								Name1: Name1r,
								Adrnr: Adrnr,
								Bukrs: Bukrs,
								Ekgrp: Ekgrp,
								Ekorg: Ekorg,
								Gbort: Gbort,
								Ktokk: Ktokk,
								Kunnr: Kunnr,
								Land1: Land1,
								Ort01: Ort01,
								Pstlz: Pstlz,
								Regio: Regio,
								Sexkz: Sexkz,
								Stras: Stras,
								Telf1: Telf1,
								Waers: Waers
							});
						}

					}
					//	console.log(ListofVendor);

					var Count = new sap.ui.model.json.JSONModel({
						item: item

					});
					oView.setModel(Count, "Count");

					//BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
			var lengthpo = 	oLookupModel.oData.PoDocumentNumber.length;
				var CountPoooo = new sap.ui.model.json.JSONModel({
						item: lengthpo
					
					});
					oView.setModel(CountPoooo, "CountPoooo");

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
		searchFieldVendor: function(evt) {
			var sValue = evt.getSource().getValue();

			var oFilter = new Filter([new Filter(
				"Name1",
				FilterOperator.Contains, sValue
			), new Filter(
				"Lifnr",
				FilterOperator.Contains, sValue
			)]);

			var list = this.getView().byId("VendorList");
			var binding = list.getBinding("items");
			binding.filter(oFilter, "Application");

		},
		onSelectionChange: function(oEvent) {
			var oModelRe = this.getOwnerComponent().getModel("VHeader");
			var oModel = oView.getModel("Lookup");
			var oSelectedItem = oEvent.getParameter("listItem");
			if (oSelectedItem) {
				var VendorNumber = oSelectedItem.getTitle();

				console.log(VendorNumber);

				var zero = "";
				//	var no;

				var len = VendorNumber.length;
				if (len !== undefined) {
					var z = 10 - len;
					for (var i = 0; i < z; i++) {
						zero += "0";
					}
				}

				console.log(len);
				console.log(zero);
				VendorNumber = zero + VendorNumber;
				console.log(VendorNumber);

				var sBindPath = oSelectedItem.getBindingContext("Lookup").sPath;

				var ComCode = oModel.getProperty(sBindPath + "/Bukrs");
				console.log(VendorNumber);
				console.log(ComCode)

				var aFilter = [
					new sap.ui.model.Filter({
						path: "Vendorno",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: VendorNumber
					}),
					new sap.ui.model.Filter({
						path: "Companycode",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: ComCode
					})

				];

				oModelRe.read("/bapi_vendor_getdetailSet", {
					//oModel.read("/POItemSet", {
					filters: aFilter,
					success: function(oData) {
						console.log(oData);
						var item = oData.results.length;
						//	oView.getModel("VendorModel").setData(oData.results[0]);

						var oVendor = new Vendor(oData.results[0]);
						oComponent.getModel("Vendor").setData(oData.results[0]);
				
					//	oComponent.getModel("Vendor").setProperty("/VendorTemp", oVendor); // setData(oData.results);
						oComponent.getRouter().navTo("VM");
					},
					error: function(oError) {
						//console.log(oError);
					}
				});

			}

		},
		headercolumn: function() {

			var Columnheadermodel = this.getOwnerComponent().getModel("HeaderModel");

			//	var Columnheadermodel = oView.getModel("HeaderModel");
			console.log(Columnheadermodel);
			var value = [];
			var ColumnHeadername = [];

			var countofmodelheader = Columnheadermodel.oData.length;

			for (var sta = 0; sta < countofmodelheader; sta++) {
				var headerstatus = Columnheadermodel.oData[sta].status;

				if (headerstatus === "enable") {
					var headername = Columnheadermodel.oData[sta].header;

					ColumnHeadername.push({
						Columns: headername
					});
				}
				console.log(ColumnHeadername)
			}

			var table = this.getView().byId("tablePoorders").getColumns();

			for (var i = 0; i < table.length; i++) {
				var ColumnHeader = table[i].mProperties.filterProperty;

				for (var val = 0; val < ColumnHeadername.length; val++) {
					var headerva = ColumnHeadername[val].Columns;
					if (headerva === ColumnHeader) {
						table[i].setVisible(true);
						break;

					} else {
						table[i].setVisible(false);
					}

				}

			}

		},
		headercolumn1: function(evt) {
			var Columnheadermodel = this.getOwnerComponent().getModel("colHeader");
			console.log(Columnheadermodel);
			var value = [];
			var ColumnHeadername = [];

			var chkboxitems = Columnheadermodel.oData.column;
			for (var k = 0; k < chkboxitems.length; k++) {
				value.push(chkboxitems[k]);
			}
			console.log(value);
			var top5psModel = new JSONModel();
			top5psModel.setData(value);
			oView.setModel(top5psModel, "top5psModel");
			console.log(top5psModel);
			var valuecount = top5psModel.oData.length;

			var table = this.getView().byId("tablePoorders").getColumns();
			for (var i = 0; i < table.length; i++) {
				var ColumnHeader = table[i].mProperties.filterProperty;

				for (var val = 0; val < valuecount; val++) {
					var headerva = top5psModel.oData[val].column;
					if (headerva === ColumnHeader) {
						table[i].setVisible(true);
						break;

					} else {
						table[i].setVisible(false);
					}

				}

			}

		},

		getPurchaseOrderList: function() {
			var that = this;

			var oModel = this.getOwnerComponent().getModel("VHeader");
			//BusyIndicator.show(0);
			oModel.read("/just_poheader2Set ", {
				//	oModel.read("/just_poheaderSet", {
				success: function(oData) {

					console.log(oData);
					BusyIndicator.hide();
					var itemPO = oData.results.length;
					var CountPo1 = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					oView.setModel(CountPo1, "CountPo1");

					ListofPurchaseOrders = [];

					for (var iRowIndex = 0; iRowIndex < itemPO; iRowIndex++) {
						var odataset = oData.results[iRowIndex];

						var Compcode = odataset.Bukrs;
						Purchaseordernumber = odataset.Ebeln;
						var pogrp = odataset.Ekgrp;
						var poorg = odataset.Ekorg;
						var lifnrr = odataset.Lifnr;
						var currency = odataset.Waers;
						var createddate = odataset.Bedat;
						var Createdby = odataset.Ernam;

						var Absgr = odataset.Absgr;
						var Addnr = odataset.Addnr;
						var Adrnr = odataset.Adrnr;
						var Angdt = odataset.Angdt;
						var Angnr = odataset.Angnr;
						var Ausnr = odataset.Ausnr;
						var Autlf = odataset.Autlf;
						var Bnddt = odataset.Bnddt;

						var Bsakz = odataset.Bsakz;
						var Bsart = odataset.Bsart;
						var Bstyp = odataset.Bstyp;
						var Bwbdt = odataset.Bwbdt;
						var Description = odataset.Description;
						var Dpamt = odataset.Dpamt;
						var Dpdat = odataset.Dpdat;
						var Dppct = odataset.Dppct;

						var Dptyp = odataset.Dptyp;
						var Exnum = odataset.Exnum;
						var Frggr = odataset.Frggr;
						var Frgke = odataset.Frgke;
						var Frgrl = odataset.Frgrl;
						var Frgsx = odataset.Frgsx;
						var Frgzu = odataset.Frgzu;
						var Gwldt = odataset.Gwldt;

						var HierarchyExists = odataset.HierarchyExists;
						var Ihran = odataset.Ihran;
						var Ihrez = odataset.Ihrez;
						var Inco1 = odataset.Inco1;
						var Inco2 = odataset.Inco2;
						var Kalsm = odataset.Kalsm;
						var Kdatb = odataset.Kdatb;
						var Kdate = odataset.Kdate;

						var Knumv = odataset.Knumv;
						var Konnr = odataset.Konnr;
						var Kornr = odataset.Kornr;
						var Ktwrt = odataset.Ktwrt;
						var Kufix = odataset.Kufix;
						var Kunnr = odataset.Kunnr;
						var Lands = odataset.Lands;
						var Lblif = odataset.Lblif;

						var LegalContract = odataset.LegalContract;
						var Lifre = odataset.Lifre;
						var Llief = odataset.Llief;
						var Loekz = odataset.Loekz;
						var Lphis = odataset.Lphis;
						var Lponr = odataset.Lponr;
						var Memory = odataset.Memory;
						var Memorytype = odataset.Memorytype;

						var MsrId = odataset.LegalContract;
						var Pincr = odataset.Pincr;
						var PohfType = odataset.PohfType;
						var Procstat = odataset.Procstat;
						var ReasonCode = odataset.ReasonCode;
						var ReleaseDate = odataset.ReleaseDate;
						var RelocId = odataset.RelocId;
						var RelocSeqId = odataset.RelocSeqId;

						var Reswk = odataset.Reswk;
						var Retpc = odataset.Retpc;
						var Rettp = odataset.Rettp;
						var Revno = odataset.Revno;
						var Rlwrt = odataset.Rlwrt;
						var Shipcond = odataset.Shipcond;
						var Spras = odataset.Spras;
						var Stafo = odataset.Stafo;

						var Stako = odataset.Stako;
						var Statu = odataset.Statu;
						var Stceg = odataset.Stceg;
						var Submi = odataset.Submi;
						var Zbd1p = odataset.Zbd1p;
						var Zbd1t = odataset.Zbd1t;
						var Zbd2p = odataset.Zbd2p;
						var Zbd2t = odataset.Zbd2t;
						var Zbd3t = odataset.Zbd3t;
						var Zterm = odataset.Zterm;

						if (lifnrr !== "" || lifnrr !== undefined) {
							for (var y = 0; y < ListofVendor.length; y++) {
								if (lifnrr == ListofVendor[y].Lifnr) {
									var venname = ListofVendor[y].Name1;
									//	console.log(venname);

								}
							}
						}

						ListofPurchaseOrders.push({
							Bukrs: Compcode,
							Ebeln: Purchaseordernumber,
							Ekgrp: pogrp,
							Ekorg: poorg,
							Lifnr: lifnrr,
							Name: venname,
							Waers: currency,
							Bedat: createddate,
							Ernam: Createdby,

							Absgr: Absgr,
							Addnr: Addnr,
							Adrnr: Adrnr,
							Angdt: Angdt,
							Angnr: Angnr,
							Ausnr: Ausnr,
							Autlf: Autlf,
							Bnddt: Bnddt,

							Bsakz: Bsakz,
							Bsart: Bsart,
							Bstyp: Bstyp,
							Bwbdt: Bwbdt,
							Description: Description,
							Dpamt: Dpamt,
							Dpdat: Dpdat,
							Dppct: Dppct,
							Dptyp: Dptyp,
							Exnum: Exnum,
							Frggr: Frggr,
							Frgke: Frgke,
							Frgrl: Frgrl,
							Frgsx: Frgsx,
							Frgzu: Frgzu,
							Gwldt: Gwldt,
							HierarchyExists: HierarchyExists,
							Ihran: Ihran,
							Ihrez: Ihrez,
							Inco1: Inco1,
							Inco2: Inco2,
							Kalsm: Kalsm,
							Kdatb: Kdatb,
							Kdate: Kdate,
							Knumv: Knumv,
							Konnr: Konnr,
							Kornr: Kornr,
							Ktwrt: Ktwrt,
							Kufix: Kufix,
							Kunnr: Kunnr,
							Lands: Lands,
							Lblif: Lblif,
							LegalContract: LegalContract,
							Lifre: Lifre,
							Llief: Llief,
							Loekz: Loekz,
							Lphis: Lphis,
							Lponr: Lponr,
							Memory: Memory,
							Memorytype: Memorytype,
							MsrId: MsrId,
							Pincr: Pincr,
							PohfType: PohfType,
							Procstat: Procstat,
							ReasonCode: ReasonCode,
							ReleaseDate: ReleaseDate,
							RelocId: RelocId,
							RelocSeqId: RelocSeqId,
							Reswk: Reswk,
							Retpc: Retpc,
							Rettp: Rettp,
							Revno: Revno,
							Rlwrt: Rlwrt,
							Shipcond: Shipcond,
							Spras: Spras,
							Stafo: Stafo,
							Stako: Stako,
							Statu: Statu,
							Stceg: Stceg,
							Submi: Submi,
							Zbd1p: Zbd1p,
							Zbd1t: Zbd1t,
							Zbd2p: Zbd2p,
							Zbd2t: Zbd2t,
							Zbd3t: Zbd3t,
							Zterm: Zterm

						});

					}
					//		console.log(ListofPurchaseOrders);

					var CountPo = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					oView.setModel(CountPo, "CountPo");

					//	console.log(oData);
					BusyIndicator.hide();
					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/POOrderList", ListofPurchaseOrders);
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

		getpur: function() {
			var that = this;

			var oModel = this.getOwnerComponent().getModel("VHeader");
			BusyIndicator.show(0);
			oModel.read("/just_poheader2Set ", {
				//	oModel.read("/just_poheaderSet", {
				success: function(oData) {
					console.log(oData);
					BusyIndicator.hide();
					var itemPO = oData.results.length;

					console.log(oData);

					var ListofPurchaseOrde = [];

					for (var iRowIndex = 0; iRowIndex < itemPO; iRowIndex++) {
						var odataset = oData.results[iRowIndex];

						var Ebeln = odataset.Ebeln;
						break;
					}

					var Purchaseorder = Ebeln;
					BusyIndicator.show(0);
					oModel.read("/fetch_openPOSet(Purchaseorder='" + Purchaseorder + "')", {
						urlParameters: {
							"$expand": "fpoItemSet"
						},
						success: function(oDatas) {
							BusyIndicator.hide();
							console.log(oDatas);
						},
						error: function(oError) {
							BusyIndicator.hide();
							console.log(oError);
						}
					});

					var CountPo = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					oView.setModel(CountPo, "CountPo");

					//	console.log(oData);

					var oLookupModel = that.getOwnerComponent().getModel("Lookup");
					oLookupModel.setProperty("/POOrderList", ListofPurchaseOrde);
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

		getTopProductsSecond: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");
		//	BusyIndicator.show(0);
			oModel.read("/POHeaderSet", {
				//	oModel.read("/POItemSet",{
				success: function(oData) {
					//		console.log(oData);
					BusyIndicator.hide();
					var item = oData.results.length;
					var ListofVendoritem = [];

					var ListofVendoritemTwo = [];
					for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
						//		console.log(iRowIndex);
						var Lifnrr = oData.results[iRowIndex].Lifnr;

						ListofVendoritem.push({
							Lifnr: Lifnrr

						});
					}

					//			console.log(ListofVendoritem);

					var index = {};
					var result = [];

					ListofVendoritem.forEach(function(point) {
						var key = "" + point.Lifnr + " "

						if (key in index) {
							index[key].count++;
						} else {
							var newEntry = {
								Lifnr: point.Lifnr,
								//	Name1 : vendorname,
								count: 1
							};
							index[key] = newEntry;
							result.push(newEntry);

						}
					});
					//	console.log(result);

					result.sort(function(a, b) {
						return b.count - a.count;
					});
					//		console.log(result);
					var resultlengrh = result.length;
					var ListofVendoritemTwo = [];
					for (var iRowIndex = 1; iRowIndex <= 5; iRowIndex++) {

						var Lifnrr = result[iRowIndex].Lifnr;
						var counts = result[iRowIndex].count;

						ListofVendoritemTwo.push({
							Lifnr: Lifnrr,
							count: counts

						});
					}

					console.log(ListofVendoritemTwo);

					var CountModel = oView.getModel("CountModel");
					CountModel.setData(ListofVendoritemTwo);
					//	oView.setModel(CountModel, "CountModel");
					console.log(CountModel);

					//show popover in chart 
					/*	 var oPopOverBar = oView.byId("idPopOverBar");
            oPopOverBar.connect(CountModel.getVizUid());*/

					var itemsc = CountModel.oData.length;
					for (var iRowIndex = 0; iRowIndex < itemsc; iRowIndex++) {
						var Lifnrr = CountModel.oData[iRowIndex].Lifnr;
						var aFilter = [
							new sap.ui.model.Filter({
								path: "Lifnr",
								operator: sap.ui.model.FilterOperator.EQ,
								value1: Lifnrr
							})

						];
						/*		oModel.read("/Fetch_Vendor_DetailsSet", {
									filters: aFilter,
									success: function(suc) {
										console.log(suc);
										var item = suc.results.length;
												var VendorssList = [];
												var itemsc = CountModel.oData.length;
											for (var iRowIndex = 0; iRowIndex < item; iRowIndex++) {
												var i=0 
									//		for (; i<itemsc ; i++ ){
											var lifnr = suc.results[iRowIndex].Lifnr;
											var vendorname = suc.results[iRowIndex].Name1;
											
															
															while (i < itemsc) {
																	if (Lifnrr == lifnr) {
													 	VendorssList.push({
																	Lifnr: lifnr,
																	Name1: vendorname
									
																});
															
																	}
																	  i++;
															}
											
											
										
											console.log(vendorname);

										
									}
										console.log(VendorssList);
									},
									error: function(err) {
										console.log(err);
									}
								});*/
					}

					var ListofVendorTopThree = [];

					for (var iRowIndex = 1; iRowIndex <= 3; iRowIndex++) {
						//		console.log(iRowIndex);
						var Lifnrr = result[iRowIndex].Lifnr;
						var Count = result[iRowIndex].count;
						ListofVendorTopThree.push({
							Lifnr: Lifnrr,
							count: Count

						});
					}

					console.log(ListofVendorTopThree);
					var ListofVendorTopThreeModel = new JSONModel();
					ListofVendorTopThreeModel.setData(ListofVendorTopThree);
					oView.setModel(ListofVendorTopThreeModel, "ListofVendorTopThreeModel");
					console.log(ListofVendorTopThreeModel);
				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		getTopProductsFirst: function() {
			var oModel1 = this.getOwnerComponent().getModel("VHeader");

		//	BusyIndicator.show(0);
			oModel1.read("/Max_MaterialSet", {

				//	oModel.read("/PO_DetailsSet()", {
				//filters: aFilter,
				success: function(odata) {
					BusyIndicator.hide();
				//	console.log(odata);
					var arr = [];
					arr = odata.results;
				//	console.log(arr);

					function foo(arr) {
						var a = [],
							b = [],
							prev;
						arr.sort();
						for (var i = 0; i < arr.length; i++) {
							if (arr[i].Txz01 !== prev) {
								a.push(arr[i].Txz01);
								b.push(1);
							} else {
								b[b.length - 1]++;
							}
							prev = arr[i].Txz01;
						}

						return [a, b];
					}

					var result = foo(arr);
					//console.log('[' + result[0] + ']','[' + result[1] + ']')
					var final = [];
					for (var z = 0; z < result[1].length; z++) {
						if (result[1][z] !== 1) {
							//result[0][z].pop();
							//result[1][z].pop();
							final.push([result[0][z], result[1][z]]);
							//final[1].push(result[1][z]);
						}
					}
					//console.log(final);
					function compareSecondColumn(a, b) {
						if (a[1] === b[1]) {
							return 0;
						} else {
							return (a[1] > b[1]) ? -1 : 1;
						}
					}
					final.sort(compareSecondColumn);
					//	console.log(final);
					var top5products = [];
					for (var zz = 0; zz <= 4; zz++) {
						top5products.push({
							prod: final[zz][0],
							count: final[zz][1]
						});
					}
					//		console.log(top5products);
					var top5productsModel = new JSONModel();
					top5productsModel.setData(top5products);
					oView.setModel(top5productsModel, "top5products");
					//		console.log(top5productsModel);
				},
				error: function(er) {
					BusyIndicator.hide();
					console.log(er);
				}
			});

		},

		getServiceHeader: function() {
			var that = this;
			var oModel = this.getOwnerComponent().getModel("VHeader");

			var po = "4500004837";

			// Mi ithe po chi value hard code ghetli ahe, but tula ithe loop firvaych ahe.  count, material and disription eka model made print kar.
			// baki mi bind karte. console la print kar
			//count cha code below mension kela ahe.. 
			/*	oModel.read("/PO_DetailsSet(Purchaseorder eq '" + odataset + "')", {}

				//	oModel.read("/PO_DetailsSet()", {}
		*/

			var aFilter = [
				new sap.ui.model.Filter({
					path: "Purchaseorder",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: po
				})

			];
BusyIndicator.show(false);
			oModel.read("/PO_DetailsSet", {
				filters: aFilter,
				success: function(oData) {
					BusyIndicator.hide(false);
					console.log(oData);

					var resultlengrh = oData.results.length;
					var MaterialListForCurrentPo = [];
					for (var iRowIndex = 0; iRowIndex <= resultlengrh; iRowIndex++) {
						var materno = oData.results[iRowIndex].Material;
						var matdis = oData.results[iRowIndex].ShortText;

						MaterialListForCurrentPo.push({
							Material: materno,
							ShortText: matdis

						});
					}

					console.log(MaterialListForCurrentPo);

					var index = {};
					var result = [];

					MaterialListForCurrentPo.forEach(function(point) {
						var key = "" + point.Material + " "

						if (key in index) {
							index[key].count++;
						} else {
							var newEntry = {
								Material: point.Material,
								//	Name1 : vendorname,
								count: 1
							};
							index[key] = newEntry;
							result.push(newEntry);

						}
					});
					console.log(result);

					result.sort(function(a, b) {
						return b.count - a.count;
					});
					//		console.log(result);
					var resultlength = result.length;
					var MatListWithCount = [];
					for (var iRowIndex = 0; iRowIndex <= resultlength; iRowIndex++) {

						var Material = result[iRowIndex].Material;
						var counts = result[iRowIndex].count;
						var MatDis = result[iRowIndex].ShortText;
						MatListWithCount.push({
							Material: Material,
							ShortText: ShortText,
							count: counts

						});
					}

					console.log(MatListWithCount);

				},

				error: function(oError) {
					BusyIndicator.hide(false);
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});
		},
		_filter: function() {
			var oFilter = null;

			if (this._oGlobalFilter && this._oPriceFilter) {
				oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				oFilter = this._oPriceFilter;
			}

			this.byId("tablePoorders").getBinding().filter(oFilter, "Application");
		},
		clearAllFiltersPOtable: function(oEvent) {
			var oTable = oView.byId("tablePoorders");

			var oUiModel = oView.getModel("ui");
			oUiModel.setProperty("/globalFilter", "");
			oUiModel.setProperty("/availabilityFilterOn", false);

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			this._filter();

			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				oTable.filter(aColumns[i], null);
			}

			oTable.getBinding().sort(null);
			this._resetPOTableSortingState();
		},
		_resetPOTableSortingState: function() {
			var oTable = this.byId("tablePoorders");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
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
			var list = this.getView().byId("awaitingTable");
			var binding = list.getBinding("items");
			binding.filter(aFilter, "Application");

		},
		onSortTable: function() {
			var oView = this.getView(),
				aStates = [undefined, "asc", "desc"],
				aStateTextIds = ["sortNone", "sortAscending", "sortDescending"],
				sMessage,
				//	iOrder = oView.getModel("appView").getProperty("/order");
				iOrder = this.getOwnerComponent().getModel("Lookup").getProperty("/POOrderList");

			// Cycle between the states
			iOrder = (iOrder + 1) % aStates.length;
			var sOrder = aStates[iOrder];

			oView.getModel("Lookup").setProperty("/POOrderList", iOrder);
			oView.byId("awaitingTable").getBinding("items").sort(sOrder && new Sorter("Waers", sOrder === "desc"));

		},

		createColumns: function() {
			return [{
				label: "Not Nested",
				property: "{Ebeln}"
			}, {
				label: "From Nested Property",
				property: "{Lifnr}"
			}];
		},
		onDataExpor1t: function(oEvent) {
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			console.log(oLookupModel);
			var data = oLookupModel.oData.POOrderList;
			var localdata = new JSONModel();
			localdata.setData(data);
			oView.setModel(localdata, "localdata");
			console.log(localdata);
			jQuery.sap.require("sap.ui.core.util.Export");
			jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
			var binding = this.byId("tablePoorders").getBinding("rows");
			new Spreadsheet({
				workbook: {
					columns: this.createColumns()
				},
				dataSource: binding.getModel().getProperty(binding.getPath()),
				fileName: "myExportedDataFromPlainJSON.xlsx"
			}).build();
		},
		onDataExport: function(oEvent) {
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			console.log(oLookupModel);
			var data = oLookupModel.oData.POOrderList;
			var localdata = new JSONModel();
			localdata.setData(data);
			oView.setModel(localdata, "localdata");
			console.log(localdata);
			jQuery.sap.require("sap.ui.core.util.Export");
			jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
			var oExport = new Export({

				// Type that will be used to generate the content. Own ExportType's can be created to support other formats
				exportType: new ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t"
				}),

				// Pass in the model created above
				models: localdata,
				//this.getView().getModel("Lookup"),

				// binding information for the rows aggregation
				rows: {
					path: "/"
				},

				// column definitions with column name and binding info for the content

				columns: [{
					name: "Company Code",
					template: {
						content: "{Bukrs}"
					}
				}, {
					name: "Purchase Order",
					template: {
						content: "{Ebeln}"
					}
				}, {
					name: "Vendor Details",
					template: {
						content: "{Lifnr}"
					}
				}, {
					name: "Purchase Organization",
					template: {
						content: "{Ekgrp}"
					}
				}, {
					name: "Created Date",
					template: {
						content: "{Bedat}"

					}
				}, {
					name: "Created By",
					template: {
						content: "{Ernam}"

					}
				}]
			});

			// download exported file
			oExport.saveFile().catch(function(oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function() {
				oExport.destroy();
			});
		},

		TableFullScreen: function() {

			this._oDialoga = this.getView().byId("hellodailog");
			if (!this._oDialoga) {
				this._oDialoga = sap.ui.xmlfragment("com.cassiniProcureToPay.view.fullscreenview", this);
				//this.getView().addDependent(pressDialogcal);
				//  this.pressDialogcal.setModel(this.getView().getModel());
				this._oDialoga.open();
			}

		},

		CloseFullScreenTable: function() {
			this._oDialoga.close();
			this._oDialoga.destroy();
		},
		onExitTableFullScreen: function() {
			if (this._oDialoga) {
				this._oDialoga.destroy();
			}
		},
		getOpenPosORderss: function(oEvent) {

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

				var Ebeln = oModellookup.getProperty(sBindPath + "/Ebeln");

				var aFilter = [
					new sap.ui.model.Filter({
						path: "Purchaseorder",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: Ebeln
					})

				];

				var Purchaseorder = Ebeln;
			BusyIndicator.show(true);
				oModel.read("/fetch_openPOSet(Purchaseorder='" + Purchaseorder + "')", {
					urlParameters: {
						"$expand": "fpoItemSet"
					},
					success: function(oData) {
						BusyIndicator.hide(false);
						console.log(oData);

					},
					error: function(oError) {
						BusyIndicator.hide(false);
						console.log(oError);
					}
				});
				//	this.byId("idPOItemsTab").setModel(oView.getModel("POItemsModel"), "POItemsModel");

			}
			oEvent.getSource().getBinding("items").filter([]);

		},
			/*vendor action list sorting */	
	ListSort: function (oEvent) {
			this.bDescending = !this.bDescending;
			this.fnApplyFiltersAndOrdering();
		},
		
		
		_fnGroup : function (oContext){
			var oVendorList = oContext.getProperty("Lookup>Lifnr");

			return {
				key : oVendorList,
				text : oVendorList
			};
		},
			fnApplyFiltersAndOrdering: function (oEvent){
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter("Lookup>Lifnr", this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter("Lookup>Name1", this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter("Lookup>Name1", FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("VendorList").getBinding("items").filter(aFilters).sort(aSorters);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassiniProcureToPay.view.view.ShowTiles
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassiniProcureToPay.view.view.ShowTiles
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.cassiniProcureToPay.view.view.ShowTiles
		 */
		//	onExit: function() {
		//
		//	}

	});

});