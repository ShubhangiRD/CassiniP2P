sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"sap/m/MessageToast"

], function(BaseObject, Application, MessageToast) {
	"use strict";
	var UpdatePO = BaseObject.extend("com.vSimpleApp.model.UpdatePO", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.setData(oData);
		},

		setData: function(oData) {

			this.Bsart = "EC";
			this.VendorNo = (oData && oData.Lifnr) ? oData.Lifnr : "";
			this.PurchaseGroup = (oData && oData.Ekgrp) ? oData.Ekgrp : "";
			this.CompanyCode = (oData && oData.Bukrs) ? oData.Bukrs : "";
			this.PurchaseOrg = (oData && oData.Ekorg) ? oData.Ekorg : "";
			this.Materialno = (oData && oData.Materialno) ? oData.Materialno : "";
			this.Currency = (oData && oData.Waers) ? oData.Waers : "";
			this.PurchaseConditionItems = (oData && oData.ConditionItems) ? oData.ConditionItems : [];

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
				Bsart: "EC",
				Lifnr: this.VendorNo,
				Ekorg: this.PurchaseOrg,
				Ekgrp: this.PurchaseGroup,
				Waers: this.Currency,
				POItem: aRebateConditionItems

			};

		},
		getRequestPayloadITem: function() {
			return {

				//	Rcont: sContractNo,
				Ebelp: this.ItemNo,
				Matnr: this.Materialno,
				Menge: this.POQuantity,
				Werks: this.Plant

				/*	Matnr: this.Matnr,
				Menge: this.Menge,      
				Werks: this.Werks
	*/
			};
		}

	});
	return UpdatePO;
});