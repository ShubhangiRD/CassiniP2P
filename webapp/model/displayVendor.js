sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"

], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.vSimpleApp.model.GetContract", {
		constructor: function(data) {
			this.Lifnr = (data) ? data.Lifnr : "";
			this.CompCode = (data) ? data.Bukrs : "";
			this.PurchaseOrg = (data) ? data.Ekorg : "";
			this.PurchaseGrp = (data) ? data.Ekgrp : "";
			this.AccountGrp = (data) ? data.Ktokk : "";
			this.CountryKey = (data) ? data.Land1 : "";
			this.FirstName = (data) ? data.Name1 : "";
			this.LastName = (data) ? data.Name2 : "";
			this.City = (data) ? data.Ort01 : "";
			this.District = (data) ? data.Ort02 : "";
			this.PostalCode = (data) ? data.Pstlz : "";
			this.Region = (data) ? data.Regio : "";
			this.VendorValueState = "None";
			this.DescriptionValueState = "None";
			this.ValidFromValueState = "None";
			this.ValidToValueState = "None";
			//	this.setQuarterDates(oData);
			this.model = new JSONModel();
			this.model.setData(this);
		},

		isBlank: function() {
			return this.CustomerName === "";
		},

		getModel: function() {
			return this.model;
		}
	});
});