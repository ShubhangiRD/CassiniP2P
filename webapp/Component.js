sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/cassiniProcureToPay/model/models",
	"sap/ui/model/json/JSONModel",
	"com/cassiniProcureToPay/service/Application",
	"sap/ui/core/IconPool",
	"com/cassiniProcureToPay/model/GetPurchaseVendor",
	"com/cassiniProcureToPay/model/Vendor",

	"com/cassiniProcureToPay/model/PODetail",
		"com/cassiniProcureToPay/model/POItem",
			"sap/ui/core/BusyIndicator",
				"sap/m/MessageToast"

], function(UIComponent, Device, models, JSONModel, Application, IconPool, GetPurchaseVendor, Vendor, PODetail,POItem,BusyIndicator,MessageToast) {
	"use strict";
	var oComponent;
		var ListofVendor = [],	ListofPurchaseOrders = [];
	return UIComponent.extend("com.cassiniProcureToPay.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			oComponent = this;
			var oLookupData = {
				SelectedTabKey: "item",
				IsContractItemSaved: false,
				IsContractAccrualSaved: false,
				IsContractSettlementSaved: false,
				VendorList: [],
				DisplyaVendorList: [],
				POVendorList: [],
				POOrderList: [],
				MaterialList: [],
				POPlant: [],
				PurchaseOrganization: [],
				CountryCode: [],
				AccountGroup: [],
				CountryCodeRegion: [],
				StorageLocationList: [],
				MaterialDiscription: [],
				PurchaseGroupList: [],
				AdminPanelList: [],
				IndustrySet: [],
				CustomerList: [],
				BankKeyList: [],
				ExemptionAuthorityList: [],
				PaymentTermsList: [],
				ToleranceGroupList: [],
				HouseBankList: [],
				Tradingp: [],
				InterestlndicList: [],
				LanguageList: [],

				TransportZoneList: [],
				InstructionKeyList: [],
				ReleaseGroupList: [],
				OrderCurrencyList: [],
				IncotermsList: [],
				CustomerOfficeEntryList: [],
				ShippingConditionList: [],
				ActivityCodeList: [],
				ModeOfTransportList: [],
				PoDocumentNumber : [],
				PlanningGroups : []

			};
			var oLookupModel = new JSONModel(oLookupData);
			this.setModel(oLookupModel, "Lookup");

			var oPurchaseData = {
				TempContract: new GetPurchaseVendor()
					//	ContractList: new POrdersList()
			};
			var oPurchaseModel = new JSONModel(oPurchaseData);
			this.setModel(oPurchaseModel, "PurchaseModel");

			var oVendorData = {
				VendorTemp: new Vendor()

			};

			var VendorModel = new JSONModel(oVendorData);
			this.setModel(VendorModel, "VendorModel");
			
			var oGetCountryModel = new JSONModel();
			oGetCountryModel.setData([]);
			this.setModel(oGetCountryModel, "GetCountryModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();
		this.getVendorList();
	this.getPurchaseOrderList();
		},
			getVendorList: function() {
		
			var oModel = oComponent.getModel("VHeader");
		//	BusyIndicator.show(0);
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

				/*s*/
					//BusyIndicator.hide();
					var oLookupModel = oComponent.getModel("Lookup");
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
	getPurchaseOrderList: function() {
		
			var oModel = oComponent.getModel("VHeader");
			//	BusyIndicator.show(0);
			oModel.read("/openpo_headerSet ", {
				//	oModel.read("/just_poheaderSet", {
				success: function(oData) {
					
					console.log(oData);
					BusyIndicator.hide();
					var itemPO = oData.results.length;
				/*	var CountPo1 = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					this.setModel(CountPo1, "CountPo1");*/
					
				 ListofPurchaseOrders = [];

					for (var iRowIndex = 0; iRowIndex < itemPO; iRowIndex++) {
						var odataset = oData.results[iRowIndex];

						var Compcode = odataset.Bukrs;
				var	 Purchaseordernumber = odataset.Ebeln;
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

				/*	var CountPo = new sap.ui.model.json.JSONModel({
						item: itemPO

					});
					this.setModel(CountPo, "CountPo");
*/
					//	console.log(oData);
					BusyIndicator.hide();
					var oLookupModel = oComponent.getModel("Lookup");
					oLookupModel.setProperty("/PoDocumentNumber", ListofPurchaseOrders);
					oLookupModel.refresh(true);
					//that.getMaterialList();

				},
				error: function(oError) {
					BusyIndicator.hide();
					var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
					MessageToast.show(errorMsg);
				}
			});

		}		
		
	});
});