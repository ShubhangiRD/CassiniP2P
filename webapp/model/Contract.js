sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"

], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.cassiniProcureToPay.model.Contract", {
		constructor: function(data) {

			this.BankAcct = (data) ? data.BankAcct : "";
			this.BankCtry = (data) ? data.BankCtry : "";
			this.BankKey = (data) ? data.BankKey : "";
			this.BankRef = (data) ? data.BankRef : "";
			this.City = (data) ? data.City : "";
			this.CompCode = (data) ? data.CompCode : "";
			this.CompanyCode = (data) ? data.CompanyCode : "";
			this.Country = (data) ? data.Country : "";
		
			this.CtrlKey = (data) ? data.CtrlKey : "";
			this.District = (data) ? data.District : "";
			this.Formofaddr = (data) ? data.Formofaddr : "";
			this.Id = (data) ? data.Id : "";
			this.Langu = (data) ? data.Langu : "";
			this.LanguIso = (data) ? data.LanguIso : "";
			this.Message = (data) ? data.Message : "";
			this.MessageV1 = (data) ? data.MessageV1 : "";
			this.MessageV2 = (data) ? data.MessageV2 : "";
			this.MessageV3 = (data) ? data.MessageV3 : "";
			this.MessageV4 = (data) ? data.MessageV4 : "";
			this.Name = (data) ? data.Name : "";
			this.Name2 = (data) ? data.Name2 : "";
			this.Number = (data) ? data.Number : "";
			this.PartnerBk = (data) ? data.PartnerBk : "";
			this.PaymentMethods = (data) ? data.PaymentMethods : "";
			this.PoBox = (data) ? data.PoBox : "";
			this.PobxCty = (data) ? data.PobxCty : "";
			this.PostlCode = (data) ? data.PostlCode : "";
			this.Region = (data) ? data.Region : "";
			this.Street = (data) ? data.Street : "";
			this.Telephone = (data) ? data.Telephone : "";
			this.Telephone2 = (data) ? data.Telephone2 : "";
			this.Type = (data) ? data.Type : "";
			this.Vendor = (data) ? data.Vendor : "";
			this.Vendorno = (data) ? data.Vendorno : "";

			this.ReconciliationAccount = (data) ? data.ReconciliationAccount : "";
			this.Title = (data) ? data.Title : "";
			this.ReferenceSpecifications = (data) ? data.ReferenceSpecifications : "";
			this.Industrykey = (data) ? data.Industrykey : "";
			this.PartnerBankType = (data) ? data.BvtyPartnerBankTypepd : "";
			this.PurchasingGroup = (data) ? data.PurchasingGroup : "";
			this.PurchasingOrg = (data) ? data.PurchasingOrg : "";
			this.ExternalManufacturer = (data) ? data.ExternalManufacturer : "";
			this.PlanningGroup = (data) ? data.PlanningGroup : "";
			this.Taxtype = (data) ? data.Taxtype : "";
			this.ReleaseApprovalGroup = (data) ? data.ReleaseApprovalGroup : "";
			this.InternetAddrs = (data) ? data.InternetAddrs : "";
			this.AccountHolderName = (data) ? data.AccountHolderName : "";
			this.VendorAccountGroup = (data) ? data.VendorAccountGroup : "";
			this.CountryKey = (data) ? data.CountryKey : "";
			this.TransportationZone = (data) ? data.TransportationZone : "";
			this.PriceDetermination = (data) ? data.PriceDetermination : "";
			this.MiddleName = (data) ? data.MiddleName : "";

			this.ExtraName = (data) ? data.ExtraName : "";

			this.POBoxPostalCode = (data) ? data.POBoxPostalCode : "";
			this.VendorQMSystem = (data) ? data.VendorQMSystem : "";
			this.StandardCode = (data) ? data.StandardCode : "";
			this.Sortfield = (data) ? data.Sortfield : "";
			this.TaxNumber3 = (data) ? data.TaxNumber3 : "";
			this.TaxNumber4 = (data) ? data.TaxNumber4 : "";
			this.TaxNumberType = (data) ? data.TaxNumberType : "";
			this.TaxAuthority = (data) ? data.TaxAuthority : "";
		
			this.TeleboxNumber = (data) ? data.TeleboxNumber : "";
			this.FaxNumber = (data) ? data.FaxNumber : "";
			this.TelexNumber = (data) ? data.Telx1a : "";
			this.AccountingClerkTelephone = (data) ? data.AccountingClerkTelephone : "";
			this.AccountingClerkFax = (data) ? data.AccountingClerkFax : "";
			this.TaxJurisdiction = (data) ? data.TaxJurisdiction : "";
			this.PurchaseOrderCurrency = (data) ? data.PurchaseOrderCurrency : "";
			this.TermsPaymentKey = (data) ? data.TermsPaymentKey : "";

			//	: "";setQuarterDates(oData);
			this.model = new JSONModel();
			this.model.setData(this);

		},
		setObjectData: function(data) {
		
			this.BankAcct = (data) ? data.BankAcct : "";
			this.BankCtry = (data) ? data.BankCtry : "";
			this.BankKey = (data) ? data.BankKey : "";
			this.BankRef = (data) ? data.BankRef : "";
			this.City = (data) ? data.City : "";
			this.CompCode = (data) ? data.CompCode : "";
			this.CompanyCode = (data) ? data.CompanyCode : "";
			this.Country = (data) ? data.Country : "";
		
			this.CtrlKey = (data) ? data.CtrlKey : "";
			this.District = (data) ? data.District : "";
			this.Formofaddr = (data) ? data.Formofaddr : "";
			this.Id = (data) ? data.Id : "";
			this.Langu = (data) ? data.Langu : "";
			this.LanguIso = (data) ? data.LanguIso : "";
			this.Message = (data) ? data.Message : "";
			this.MessageV1 = (data) ? data.MessageV1 : "";
			this.MessageV2 = (data) ? data.MessageV2 : "";
			this.MessageV3 = (data) ? data.MessageV3 : "";
			this.MessageV4 = (data) ? data.MessageV4 : "";
			this.Name = (data) ? data.Name : "";
			this.Name2 = (data) ? data.Name2 : "";
			this.Number = (data) ? data.Number : "";
			this.PartnerBk = (data) ? data.PartnerBk : "";
			this.PaymentMethods = (data) ? data.PaymentMethods : "";
			this.PoBox = (data) ? data.PoBox : "";
			this.PobxCty = (data) ? data.PobxCty : "";
			this.PostlCode = (data) ? data.PostlCode : "";
			this.Region = (data) ? data.Region : "";
			this.Street = (data) ? data.Street : "";
			this.Telephone = (data) ? data.Telephone : "";
			this.Telephone2 = (data) ? data.Telephone2 : "";
			this.Type = (data) ? data.Type : "";
			this.Vendor = (data) ? data.Vendor : "";
			this.Vendorno = (data) ? data.Vendorno : "";

			this.ReconciliationAccount = (data) ? data.ReconciliationAccount : "";
			this.Title = (data) ? data.Title : "";
			this.ReferenceSpecifications = (data) ? data.ReferenceSpecifications : "";
			this.Industrykey = (data) ? data.Industrykey : "";
			this.PartnerBankType = (data) ? data.BvtyPartnerBankTypepd : "";
			this.PurchasingGroup = (data) ? data.PurchasingGroup : "";
			this.PurchasingOrg = (data) ? data.PurchasingOrg : "";
			this.ExternalManufacturer = (data) ? data.ExternalManufacturer : "";
			this.PlanningGroup = (data) ? data.PlanningGroup : "";
			this.Taxtype = (data) ? data.Taxtype : "";
			this.ReleaseApprovalGroup = (data) ? data.ReleaseApprovalGroup : "";
			this.InternetAddrs = (data) ? data.InternetAddrs : "";
			this.AccountHolderName = (data) ? data.AccountHolderName : "";
			this.VendorAccountGroup = (data) ? data.VendorAccountGroup : "";
			this.CountryKey = (data) ? data.CountryKey : "";
			this.TransportationZone = (data) ? data.TransportationZone : "";
			this.PriceDetermination = (data) ? data.PriceDetermination : "";
			this.MiddleName = (data) ? data.MiddleName : "";
			this.ExtraName = (data) ? data.ExtraName : "";
			this.POBoxPostalCode = (data) ? data.POBoxPostalCode : "";
			this.VendorQMSystem = (data) ? data.VendorQMSystem : "";
			this.StandardCode = (data) ? data.StandardCode : "";
			this.Sortfield = (data) ? data.Sortfield : "";
			this.TaxNumber3 = (data) ? data.TaxNumber3 : "";
			this.TaxNumber4 = (data) ? data.TaxNumber4 : "";
			this.TaxNumberType = (data) ? data.TaxNumberType : "";
			this.TaxAuthority = (data) ? data.TaxAuthority : "";
	
			this.TeleboxNumber = (data) ? data.TeleboxNumber : "";
			this.FaxNumber = (data) ? data.FaxNumber : "";
			this.TelexNumber = (data) ? data.Telx1a : "";
			this.AccountingClerkTelephone = (data) ? data.AccountingClerkTelephone : "";
			this.AccountingClerkFax = (data) ? data.AccountingClerkFax : "";
			this.TaxJurisdiction = (data) ? data.TaxJurisdiction : "";
			this.PurchaseOrderCurrency = (data) ? data.PurchaseOrderCurrency : "";
			this.TermsPaymentKey = (data) ? data.TermsPaymentKey : "";
		},
		getCreateRequestPayload: function() {
			return {

				Akontb: this.ReconciliationAccount,
				Anreda: this.Title,
				Bankld: this.BankKey,
				Banknd: this.BankAcct,
				Banksd: this.BankCtry,
				Bkontd: this.BankControlKey,
				Bkrefd: this.BankRef,
				Brscha: this.Industrykey,
				Bukrsb: this.CompanyCode,
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
				Bukrsb: this.CompanyCode,
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
				Land1a: this.CountryKey,
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

		isBlank: function() {
			return null;
		},
		getModel: function() {
			return this.model;
		}
	});
});