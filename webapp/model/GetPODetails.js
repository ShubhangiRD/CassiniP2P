sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"

], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.vSimpleApp.model.GetPODetails", {
		constructor: function(data) {
			this.Bsart = (data) ? data.Bsart : "";
			this.Bstyp = "F";
			this.CompanyCode = (data) ? data.Bukrs : "";
			this.Ebeln = (data) ? data.Ebeln : "";
			this.PurchaseGroup = (data) ? data.Ekgrp : "";
			this.PurchaseOrg = (data) ? data.Ekorg : "";
			this.VendorNo = (data) ? data.Lifnr : "";
			this.PurchaseConditionItems = (data && data.ConditionItems) ? data.ConditionItems : [];
			this.model = new JSONModel();
			this.model.setData(this);
		},
			getRequestPayload: function() {
				var that = this;
			var aRebateConditionItems = [];
		
			
			
			this.PurchaseConditionItems.forEach(function(item) {
		//		aRebateConditionItems.push(item.getRequestPayload(that.ContractNo));
			aRebateConditionItems.push(item.getRequestPayload());
			
			});
			return {
			//	Rcont: this.ContractNo,
				Bukrs: this.CompanyCode,
				Bsart : "EC",
				Lifnr: this.VendorNo,
				Ekorg: this.PurchaseOrg,
				Ekgrp: this.PurchaseGroup,
				Waers: this.Currency,
				POItem: aRebateConditionItems
		
			};
			
		
		},
		isBlank: function() {
			return this.CustomerName === "";
		},

		getModel: function() {
			return this.model;
		}
	});
});