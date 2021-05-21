sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
  "use strict" ;
  return Object.extend("com.cassiniProcureToPay.model.VendorMaster", {
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
      return	this.VendorNumber === "" &&
				this.AccountGrp === "" &&
				this.CompCode === "" &&
				this.PurchaseOrg === "" &&
				this.Country === "" &&
				this.Region === "";
			
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
    getModel: function() {
      return this.model ;
    }
  });
});














