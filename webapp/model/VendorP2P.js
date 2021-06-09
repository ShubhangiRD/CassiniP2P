sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.vSimpleApp.model.VendorMaster", {
		constructor: function(oData) {

			this.BankAcct = (oData && oData.BankAcct) ? oData.BankAcct : "";
			this.BankCtry = (oData && oData.BankCtry) ? oData.BankCtry : "";
			this.BankKey = (oData && oData.BankKey) ? oData.BankKey : "";
			this.BankRef = (oData && oData.BankRef) ? oData.BankRef : "";
			this.City = (oData && oData.City) ? oData.City : "";
			this.CompCode = (oData && oData.CompCode) ? oData.CompCode : "";
			this.CompanyCode = (oData && oData.CompanyCode) ? oData.CompanyCode : "";
			this.Country = (oData && oData.Country) ? oData.Country : "";
			this.CtrlKey = (oData && oData.CtrlKey) ? oData.CtrlKey : "";
			this.District = (oData && oData.District) ? oData.District : "";
			this.Formofaddr = (oData && oData.Formofaddr) ? oData.Formofaddr : "";
			this.Id = (oData && oData.Id) ? oData.Id : "";
			this.Langu = (oData && oData.Langu) ? oData.Langu : "";
			this.LanguIso = (oData && oData.LanguIso) ? oData.LanguIso : "";
			this.Message = (oData && oData.Message) ? oData.Message : "";
			this.MessageV1 = (oData && oData.MessageV1) ? oData.MessageV1 : "";
			this.MessageV2 = (oData && oData.MessageV2) ? oData.MessageV2 : "";
			this.MessageV3 = (oData && oData.MessageV3) ? oData.MessageV3 : "";
			this.MessageV4 = (oData && oData.MessageV4) ? oData.MessageV4 : "";
			this.Name = (oData && oData.Name) ? oData.Name : "";
			this.Name2 = (oData && oData.Name2) ? oData.Name2 : "";
			this.Number = (oData && oData.Number) ? oData.Number : "";
			this.PartnerBk = (oData && oData.PartnerBk) ? oData.PartnerBk : "";
			this.PaymentMethods = (oData && oData.PaymentMethods) ? oData.PaymentMethods : "";
			this.PoBox = (oData && oData.PoBox) ? oData.PoBox : "";
			this.PobxCty = (oData && oData.PobxCty) ? oData.PobxCty : "";
			this.PostlCode = (oData && oData.PostlCode) ? oData.PostlCode : "";
			this.Region = (oData && oData.Region) ? oData.Region : "";
			this.Street = (oData && oData.Street) ? oData.Street : "";
			this.Telephone = (oData && oData.Telephone) ? oData.Telephone : "";
			this.Telephone2 = (oData && oData.Telephone2) ? oData.Telephone2 : "";
			this.Type = (oData && oData.Type) ? oData.Type : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			this.Vendorno = (oData && oData.Vendorno) ? oData.Vendorno : "";

			this.ReconciliationAccount = (oData && oData.ReconciliationAccount) ? oData.ReconciliationAccount : "";
			this.Title = (oData && oData.Title) ? oData.Title : "";
			this.ReferenceSpecifications = (oData && oData.ReferenceSpecifications) ? oData.ReferenceSpecifications : "";
			this.Industrykey = (oData && oData.Industrykey) ? oData.Industrykey : "";
			this.PartnerBk = (oData && oData.PartnerBk) ? oData.BvtyPartnerBkpd : "";
			this.PurchasingGroup = (oData && oData.PurchasingGroup) ? oData.PurchasingGroup : "";
			this.PurchasingOrg = (oData && oData.PurchasingOrg) ? oData.PurchasingOrg : "";
			this.ExternalManufacturer = (oData && oData.ExternalManufacturer) ? oData.ExternalManufacturer : "";
			this.PlanningGroup = (oData && oData.PlanningGroup) ? oData.PlanningGroup : "";
			this.Taxtype = (oData && oData.Taxtype) ? oData.Taxtype : "";
			this.ReleaseApprovalGroup = (oData && oData.ReleaseApprovalGroup) ? oData.ReleaseApprovalGroup : "";
			this.Internet = (oData && oData.Internet) ? oData.Internet : "";
			this.AccountHolderName = (oData && oData.AccountHolderName) ? oData.AccountHolderName : "";
			this.VendorAccountGroup = (oData && oData.VendorAccountGroup) ? oData.VendorAccountGroup : "";
			this.CountryKey = (oData && oData.CountryKey) ? oData.CountryKey : "";
			this.TransportationZone = (oData && oData.TransportationZone) ? oData.TransportationZone : "";
			this.PriceDetermination = (oData && oData.PriceDetermination) ? oData.PriceDetermination : "";
			this.MiddleName = (oData && oData.MiddleName) ? oData.MiddleName : "";
			this.ExtraName = (oData && oData.ExtraName) ? oData.ExtraName : "";
			this.POBoxPostalCode = (oData && oData.POBoxPostalCode) ? oData.POBoxPostalCode : "";
			this.VendorQMSystem = (oData && oData.VendorQMSystem) ? oData.VendorQMSystem : "";
			this.StandardCode = (oData && oData.StandardCode) ? oData.StandardCode : "";
			this.Sortfield = (oData && oData.Sortfield) ? oData.Sortfield : "";
			this.TaxNumber3 = (oData && oData.TaxNumber3) ? oData.TaxNumber3 : "";
			this.TaxNumber4 = (oData && oData.TaxNumber4) ? oData.TaxNumber4 : "";
			this.TaxNumberType = (oData && oData.TaxNumberType) ? oData.TaxNumberType : "";
			this.TaxAuthority = (oData && oData.TaxAuthority) ? oData.TaxAuthority : "";

			this.Tel = (oData && oData.Tel) ? oData.Tel : "";
			this.Fax = (oData && oData.Fax) ? oData.Fax : "";
			this.TelexNumber = (oData && oData.TelexNumber) ? oData.TelexNumber : "";
			this.AccountingClerkTelephone = (oData && oData.AccountingClerkTelephone) ? oData.AccountingClerkTelephone : "";
			this.AccountingClerkFax = (oData && oData.AccountingClerkFax) ? oData.AccountingClerkFax : "";
			this.TaxJurisdiction = (oData && oData.TaxJurisdiction) ? oData.TaxJurisdiction : "";
			this.PurchaseOrderCurrency = (oData && oData.PurchaseOrderCurrency) ? oData.PurchaseOrderCurrency : "";
			this.Pmnttrms = (oData && oData.Pmnttrms) ? oData.Pmnttrms : "";
			this.BankControlKey = (oData && oData.BankControlKey) ? oData.BankControlKey : "";

			this.HdOffice = (oData && oData.HdOffice) ? oData.HdOffice : "";
			this.AltPayee = (oData && oData.AltPayee) ? oData.AltPayee : "";
			this.PobxPcd = (oData && oData.PobxPcd) ? oData.PobxPcd : "";
			this.CollAuth = (oData && oData.CollAuth) ? oData.CollAuth : "";
			this.ActAtVen = (oData && oData.ActAtVen) ? oData.ActAtVen : "";
			this.Clerk = (oData && oData.Clerk) ? oData.Clerk : "";

		},

		setObjectData: function(oData) {

			this.BankAcct = (oData && oData.BankAcct) ? oData.BankAcct : "";
			this.BankCtry = (oData && oData.BankCtry) ? oData.BankCtry : "";
			this.BankKey = (oData && oData.BankKey) ? oData.BankKey : "";
			this.BankRef = (oData && oData.BankRef) ? oData.BankRef : "";
			this.City = (oData && oData.City) ? oData.City : "";
			this.CompCode = (oData && oData.CompCode) ? oData.CompCode : "";
			this.CompanyCode = (oData && oData.CompanyCode) ? oData.CompanyCode : "";
			this.Country = (oData && oData.Country) ? oData.Country : "";
			this.CtrlKey = (oData && oData.CtrlKey) ? oData.CtrlKey : "";
			this.District = (oData && oData.District) ? oData.District : "";
			this.Formofaddr = (oData && oData.Formofaddr) ? oData.Formofaddr : "";
			this.Id = (oData && oData.Id) ? oData.Id : "";
			this.Langu = (oData && oData.Langu) ? oData.Langu : "";
			this.LanguIso = (oData && oData.LanguIso) ? oData.LanguIso : "";
			this.Message = (oData && oData.Message) ? oData.Message : "";
			this.MessageV1 = (oData && oData.MessageV1) ? oData.MessageV1 : "";
			this.MessageV2 = (oData && oData.MessageV2) ? oData.MessageV2 : "";
			this.MessageV3 = (oData && oData.MessageV3) ? oData.MessageV3 : "";
			this.MessageV4 = (oData && oData.MessageV4) ? oData.MessageV4 : "";
			this.Name = (oData && oData.Name) ? oData.Name : "";
			this.Name2 = (oData && oData.Name2) ? oData.Name2 : "";
			this.Number = (oData && oData.Number) ? oData.Number : "";
			this.PartnerBk = (oData && oData.PartnerBk) ? oData.PartnerBk : "";
			this.PaymentMethods = (oData && oData.PaymentMethods) ? oData.PaymentMethods : "";
			this.PoBox = (oData && oData.PoBox) ? oData.PoBox : "";
			this.PobxCty = (oData && oData.PobxCty) ? oData.PobxCty : "";
			this.PostlCode = (oData && oData.PostlCode) ? oData.PostlCode : "";
			this.Region = (oData && oData.Region) ? oData.Region : "";
			this.Street = (oData && oData.Street) ? oData.Street : "";
			this.Telephone = (oData && oData.Telephone) ? oData.Telephone : "";
			this.Telephone2 = (oData && oData.Telephone2) ? oData.Telephone2 : "";
			this.Type = (oData && oData.Type) ? oData.Type : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			this.Vendorno = (oData && oData.Vendorno) ? oData.Vendorno : "";

			this.ReconciliationAccount = (oData && oData.ReconciliationAccount) ? oData.ReconciliationAccount : "";
			this.Title = (oData && oData.Title) ? oData.Title : "";
			this.ReferenceSpecifications = (oData && oData.ReferenceSpecifications) ? oData.ReferenceSpecifications : "";
			this.Industrykey = (oData && oData.Industrykey) ? oData.Industrykey : "";
			this.PartnerBk = (oData && oData.PartnerBk) ? oData.PartnerBk : "";
			this.PurchasingGroup = (oData && oData.PurchasingGroup) ? oData.PurchasingGroup : "";
			this.PurchasingOrg = (oData && oData.PurchasingOrg) ? oData.PurchasingOrg : "";
			this.ExternalManufacturer = (oData && oData.ExternalManufacturer) ? oData.ExternalManufacturer : "";
			this.PlanningGroup = (oData && oData.PlanningGroup) ? oData.PlanningGroup : "";
			this.Taxtype = (oData && oData.Taxtype) ? oData.Taxtype : "";
			this.ReleaseApprovalGroup = (oData && oData.ReleaseApprovalGroup) ? oData.ReleaseApprovalGroup : "";
			this.Internet = (oData && oData.Internet) ? oData.Internet : "";
			this.AccountHolderName = (oData && oData.AccountHolderName) ? oData.AccountHolderName : "";
			this.VendorAccountGroup = (oData && oData.VendorAccountGroup) ? oData.VendorAccountGroup : "";
			this.CountryKey = (oData && oData.CountryKey) ? oData.CountryKey : "";
			this.TransportationZone = (oData && oData.TransportationZone) ? oData.TransportationZone : "";
			this.PriceDetermination = (oData && oData.PriceDetermination) ? oData.PriceDetermination : "";
			this.MiddleName = (oData && oData.MiddleName) ? oData.MiddleName : "";
			this.ExtraName = (oData && oData.ExtraName) ? oData.ExtraName : "";
			this.POBoxPostalCode = (oData && oData.POBoxPostalCode) ? oData.POBoxPostalCode : "";
			this.VendorQMSystem = (oData && oData.VendorQMSystem) ? oData.VendorQMSystem : "";
			this.StandardCode = (oData && oData.StandardCode) ? oData.StandardCode : "";
			this.Sortfield = (oData && oData.Sortfield) ? oData.Sortfield : "";
			this.TaxNumber3 = (oData && oData.TaxNumber3) ? oData.TaxNumber3 : "";
			this.TaxNumber4 = (oData && oData.TaxNumber4) ? oData.TaxNumber4 : "";
			this.TaxNumberType = (oData && oData.TaxNumberType) ? oData.TaxNumberType : "";
			this.TaxAuthority = (oData && oData.TaxAuthority) ? oData.TaxAuthority : "";

			this.Tel = (oData && oData.Tel) ? oData.Tel : "";
			this.Fax = (oData && oData.Fax) ? oData.Fax : "";
			this.TelexNumber = (oData && oData.TelexNumber) ? oData.TelexNumber : "";
			this.AccountingClerkTelephone = (oData && oData.AccountingClerkTelephone) ? oData.AccountingClerkTelephone : "";
			this.AccountingClerkFax = (oData && oData.AccountingClerkFax) ? oData.AccountingClerkFax : "";
			this.TaxJurisdiction = (oData && oData.TaxJurisdiction) ? oData.TaxJurisdiction : "";
			this.PurchaseOrderCurrency = (oData && oData.PurchaseOrderCurrency) ? oData.PurchaseOrderCurrency : "";
			this.Pmnttrms = (oData && oData.Pmnttrms) ? oData.Pmnttrms : "";
			this.BankControlKey = (oData && oData.BankControlKey) ? oData.BankControlKey : "";
			this.HdOffice = (oData && oData.HdOffice) ? oData.HdOffice : "";
			this.AltPayee = (oData && oData.AltPayee) ? oData.AltPayee : "";
			this.PobxPcd = (oData && oData.PobxPcd) ? oData.PobxPcd : "";
			this.CollAuth = (oData && oData.CollAuth) ? oData.CollAuth : "";
			this.ActAtVen = (oData && oData.ActAtVen) ? oData.ActAtVen : "";
			this.Clerk = (oData && oData.Clerk) ? oData.Clerk : "";

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
				Bvtypd: this.PartnerBk,
				Ekgrpc: this.PurchasingGroup,
				Ekorgc: this.PurchasingOrg,
				Emnfra: this.ExternalManufacturer,
				Fdgrvb: this.PlanningGroup,
				Fitypa: this.Taxtype,
				Frgrpb: this.ReleaseApprovalGroup,
				Intadb: this.Internet,
				Koinhd: this.AccountHolderName,
				Ktokka: this.VendorAccountGroup,
				Land1a: this.Country,
				Lifnra: this.Vendorno,
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
				Telbxa: this.Tel,
				Telf1a: this.Telephone,
				Telf2a: this.Telephone2,
				Teltxa: this.Fax,
				Telx1a: this.TelexNumber,
				Tlfnsb: this.AccountingClerkTelephone,
				Tlfxsb: this.AccountingClerkFax,
				Txjcda: this.TaxJurisdiction,
				Waersc: this.PurchaseOrderCurrency,
				Ztermb: this.Pmnttrms,
				Zwelsb: this.PaymentMethods

			};
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
				Bukrsb: this.CompCode,
				Bvtypd: this.PartnerBk,
				Ekgrpc: this.PurchasingGroup,
				Ekorgc: this.PurchasingOrg,
				Emnfra: this.ExternalManufacturer,
				Fdgrvb: this.PlanningGroup,
				Fitypa: this.Taxtype,
				Frgrpb: this.ReleaseApprovalGroup,
				Intadb: this.Internet,
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
				Telbxa: this.Tel,
				Telf1a: this.Telephone,
				Telf2a: this.Telephone2,
				Teltxa: this.Fax,
				Telx1a: this.TelexNumber,
				Tlfnsb: this.AccountingClerkTelephone,
				Tlfxsb: this.AccountingClerkFax,
				Txjcda: this.TaxJurisdiction,
				Waersc: this.PurchaseOrderCurrency,
				Ztermb: this.Pmnttrms,
				Zwelsb: this.PaymentMethods

			};

		},

		getRequestPayload: function(isCreate) {
			var oRequest = {

				Akontb: this.ReconciliationAccount,
				Anreda: this.Title,
				Bankld: this.BankKey,
				Banknd: this.BankAcct,
				Banksd: this.BankCtry,
				Bkontd: this.BankControlKey,
				Bkrefd: this.BankRef,
				Brscha: this.Industrykey,
				Bukrsb: this.CompCode,
				Bvtypd: this.PartnerBk,
				Ekgrpc: this.PurchasingGroup,
				Ekorgc: this.PurchasingOrg,
				Emnfra: this.ExternalManufacturer,
				Fdgrvb: this.PlanningGroup,
				Fitypa: this.Taxtype,
				Frgrpb: this.ReleaseApprovalGroup,
				Intadb: this.Internet,
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
				Telbxa: this.Tel,
				Telf1a: this.Telephone,
				Telf2a: this.Telephone2,
				Teltxa: this.Fax,
				Telx1a: this.TelexNumber,
				Tlfnsb: this.AccountingClerkTelephone,
				Tlfxsb: this.AccountingClerkFax,
				Txjcda: this.TaxJurisdiction,
				Waersc: this.PurchaseOrderCurrency,
				Ztermb: this.Pmnttrms,
				Zwelsb: this.PaymentMethods

			};
			if (!isCreate) {
				oRequest.Lifnra = this.Vendorno;
			}
			return oRequest;

		},
		getModel: function() {
			return this.model;
		}
	});

});