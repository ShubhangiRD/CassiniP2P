sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.cassiniProcureToPay.model.Vendor", {
		constructor: function(data) {
		
		
		
			this.BankAcct = (data) ? data.BankAcct : "";
			this.BankCtry = (data) ? data.BankCtry : "";
			this.BankKey = (data) ? data.BankKey : "";
			this.BankRef = (data) ? data.BankRef : "";
			this.City = (data) ? data.City : "";
			this.CompCode = (data) ? data.CompCode : "";
			this.CompanyCode = (data) ? data.CompanyCode : "";
			this.Country = (data) ? data.Country : "";
			this.Countryiso = (data) ? data.Countryiso : "";
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
			this.model = new JSONModel();
			this.model.setData(this);
		},
		isBlank: function() {
			return null;
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
			this.Countryiso = (data) ? data.Countryiso : "";
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
		},

		getVendorRequestPayload: function() {
			return {

				BankAcct: this.BankAcct,
				BankCtry: this.BankCtry,
				BankKey: this.BankKey,
				BankRef: this.BankRef,
				City: this.City,
				CompCode: this.CompCode,
				CompanyCode: this.CompanyCode,
				Country: this.Country,
				Countryiso: this.Countryiso,
				CtrlKey: this.CtrlKey,
				District: this.District,
				Formofaddr: this.Formofaddr,
				Id: this.Id,
				Langu: this.Langu,
				LanguIso: this.LanguIso,
				Message: this.Message,
				MessageV1: this.MessageV1,
				MessageV2: this.MessageV2,
				MessageV3: this.MessageV3,
				MessageV4: this.MessageV4,

				Name2: this.Name2,
				Number: this.Number,
				PartnerBk: this.PartnerBk,
				PaymentMethods: this.PaymentMethods,
				PoBox: this.PoBox,
				PobxCty: this.PobxCty,
				PostlCode: this.PostlCode,
				Region: this.Region,
				Street: this.Street,
				Telephone: this.Telephone,
				Telephone2: this.Telephone2,
				Type: this.Type,
				Vendor: this.Vendor,
				Vendorno: this.Vendorno

			};
		},
		/*	getRequestPayloadVendor: function() {
				Akontb: this.Reconciliation Account in General Ledger
				Anreda: this.
				Bankld: this.
				Banknd: this.
				Banksd: this.
				Bkontd: this.
				Bkrefd: this.
				Brscha: this.
				Bukrsb: this.
				Bvtypd: this.
				Ekgrpc: this.
				Ekorgc: this.
				Emnfra: this.
				Fdgrvb: this.
				Fitypa: this.
				Frgrpb: this.
				Intadb: this.
				Koinhd: this.
				Ktokka: this.
				Land1a: this.
				Lzonea: this.
				Meprfc: this.
				Name1a: this.
				Name2a: this.
				Name3a: this.
				Name4a: this.
				Ort01a: this.
				Ort02a: this.
				Pfacha: this.
				Pforta: this.
				Pstl2a: this.
				Pstlza: this.
				Qssysa: this.
				Regioa: this.
				Scacda: this.
				Sortla: this.
				Sprasa: this.
				Stcd3a: this.
				Stcd4a: this.
				Stcdta: this.
				Stenra: this.
				Strasa: this.
				Telbxa: this.
				Telf1a: this.
				Telf2a: this.
				Teltxa: this.
				Telx1a: this.
				Tlfnsb: this.
				Tlfxsb: this.
				Txjcda: this.
				Waersc: this.
				Ztermb: this.
				Zwelsb: this.
			},
		*/
		getModel: function() {
			return this.model;
		}
	});
});