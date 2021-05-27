sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.cassiniProcureToPay.model.POItem", {
		constructor: function(oData) {

				this.CompCode = (oData && oData.CompCode) ? oData.CompCode : "";
			this.CreatDate = (oData && oData.CreatDate) ? oData.CreatDate : "";
			this.CreatedBy  = (oData && oData.CreatedBy) ? oData.CreatedBy : "";
			this.Currency = (oData && oData.Currency) ? oData.Currency : "";
			this.DocDate = (oData && oData.DocDate) ? oData.DocDate : "";
			this.DocType = (oData && oData.DocType) ? oData.DocType : "";
			this.Ind = (oData && oData.Ind) ? oData.Ind : "";
			this.PoNumber = (oData && oData.PoNumber) ? oData.PoNumber : "";
			this.PurGroup = (oData && oData.PurGroup) ? oData.PurGroup : "";
			this.PurchOrg = (oData && oData.PurchOrg) ? oData.PurchOrg : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			
		

		
		
		},

		setObjectData: function(oData) {

				this.CompCode = (oData && oData.CompCode) ? oData.CompCode : "";
			this.CreatDate = (oData && oData.CreatDate) ? oData.CreatDate : "";
			this.CreatedBy  = (oData && oData.CreatedBy) ? oData.CreatedBy : "";
			this.Currency = (oData && oData.Currency) ? oData.Currency : "";
			this.DocDate = (oData && oData.DocDate) ? oData.DocDate : "";
			this.DocType = (oData && oData.DocType) ? oData.DocType : "";
			this.Ind = (oData && oData.Ind) ? oData.Ind : "";
			this.PoNumber = (oData && oData.PoNumber) ? oData.PoNumber : "";
			this.PurGroup = (oData && oData.PurGroup) ? oData.PurGroup : "";
			this.PurchOrg = (oData && oData.PurchOrg) ? oData.PurchOrg : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			

		},
		getUpdateRequestPayload: function() {
			return {
				Akontb: this.ReconciliationAccount,
				Anreda: this.Title,
				Bankld: this.BankKey,
				Banknd: this.BankAcct,
				Banksd: this.BankCtry,
				Bkontd: this.BankControlKey,
				Bkrefd: this.BankRef,
				Brscha: this.Industrykey,
				Bukrsb: this.CompCode,
				Bvtypd: this.PartnerBankType,
				Ekgrpc: this.PurchasingGroup,
				Ekorgc: this.PurchasingOrg,
				Emnfra: this.ExternalManufacturer,
				Fdgrvb: this.PlanningGroup,
				Fitypa: this.Taxtype,
				Frgrpb: this.ReleaseApprovalGroup,
				Intadb: this.InternetAddrs,
				Koinhd: this.AccountHolderName,
				Ktokka: this.VendorAccountGroup,
				Land1a: this.Country,
				Lifnra: this.Vendor,
				Lzonea: this.TransportationZone,
				Meprfc: this.PriceDetermination,
				Name1a: this.Name,
				Name2a: this.Name2,
				Name3a: this.Name,
				Name4a: this.ExtraName,
				Ort01a: this.City,
				Ort02a: this.District,
				Pfacha: this.PoBox,
				Pforta: this.PobxCty,
				Pstl2a: this.POBoxPostalCode,
				Pstlza: this.PostlCode,
				Qssysa: this.VendorQMSystem,
				Regioa: this.Region,
				Scacda: this.StandardCode,
				Sortla: this.Sortfield,
				Sprasa: this.Langu,
				Stcd3a: this.TaxNumber3,
				Stcd4a: this.TaxNumber4,
				Stcdta: this.TaxNumberType,
				Stenra: this.TaxAuthority,
				Strasa: this.Street,
				Telbxa: this.TeleboxNumber,
				Telf1a: this.Telephone,
				Telf2a: this.Telephone2,
				Teltxa: this.FaxNumber,
				Telx1a: this.TelexNumber,
				Tlfnsb: this.AccountingClerkTelephone,
				Tlfxsb: this.AccountingClerkFax,
				Txjcda: this.TaxJurisdiction,
				Waersc: this.PurchaseOrderCurrency,
				Ztermb: this.TermsPaymentKey,
				Zwelsb: this.PaymentMethods

			};
		},
	
		getModel: function() {
			return this.model;
		}
	});

});