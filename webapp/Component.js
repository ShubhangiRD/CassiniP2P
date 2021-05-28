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
		"com/cassiniProcureToPay/model/POItem"

], function(UIComponent, Device, models, JSONModel, Application, IconPool, GetPurchaseVendor, Vendor, PODetail,POItem) {
	"use strict";

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
				PoDocumentNumber : []

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
			
			
			
	
			
			
			
			

			/*			this.loadIconLibraries();
						Application.getInstance().Component = this;
			*/
			//getCountrymodel defined here

			var oGetCountryModel = new JSONModel();
			oGetCountryModel.setData([]);
			this.setModel(oGetCountryModel, "GetCountryModel");

			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// create the views based on the url/hash
			this.getRouter().initialize();

		}
	});
});