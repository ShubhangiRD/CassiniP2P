sap.ui.define([
  "sap/ui/base/Object",
  "sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
  "use strict";
  return Object.extend("com.vSimpleApp.model.AgreementFixedAmount", {
    constructor: function(data) {
    	this.VendorNumber = (data) ? data.VendorNumber : "";
		this.AccountGrp = (data) ? data.AccountGrp : "";
		this.CompCode = (data) ? data.CompCode : "";
		this.PurchaseOrg = (data) ? data.PurchaseOrg : "";
		this.BirthPlace = (data) ? data.BirthPlace : "";
		this.FirstName = (data) ? data.FirstName : "";
		this.LastName = (data) ? data.LastName : "";
		this.OrderCurrency = (data) ? data.OrderCurrency : "";
		this.Street = (data) ? data.Street : "";
		this.Address = (data) ? data.Address : "";
		this.PostalCode = (data) ? data.PostalCode : "";
		this.Country = (data) ? data.Country : "";
		this.AddressNum = (data) ? data.AddressNum : "";
		this.Telephone = (data) ? data.Telephone : "";
		this.Distinct = (data) ? data.Distinct : "";
		this.City = (data) ? data.City : "";
		this.Region = (data) ? data.Region : "";
		
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
    	this.VendorNumber = (data) ? data.VendorNumber : "";
		this.AccountGrp = (data) ? data.AccountGrp : "";
		this.CompCode = (data) ? data.CompCode : "";
		this.PurchaseOrg = (data) ? data.PurchaseOrg : "";
		this.BirthPlace = (data) ? data.BirthPlace : "";
		this.FirstName = (data) ? data.FirstName : "";
		this.LastName = (data) ? data.LastName : "";
		this.OrderCurrency = (data) ? data.OrderCurrency : "";
		this.Street = (data) ? data.Street : "";
		this.Address = (data) ? data.Address : "";
		this.PostalCode = (data) ? data.PostalCode : "";
		this.Country = (data) ? data.Country : "";
		this.AddressNum = (data) ? data.AddressNum : "";
		this.Telephone = (data) ? data.Telephone : "";
		this.City = (data) ? data.City : "";
		this.Region = (data) ? data.Region : "";
		this.Distinct = (data) ? data.Distinct : "";
    },
    getModel: function() {
      return this.model;
    }
  });
});