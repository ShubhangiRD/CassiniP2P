sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"com/vSimpleApp/service/dateServices"
], function(BaseObject, Application, dateServices) {
	"use strict";
	var AccrualItem = BaseObject.extend("com.vSimpleApp.model.AccrualItem", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.ContractNo = (oData && oData.Rcont) ? oData.Rcont : "";
			this.PostingDate = (oData && oData.Posting) ? oData.Posting : "";
			this.DocumentDate = (oData && oData.Document) ? oData.Document : "";
			this.Account = (oData && oData.Account) ? oData.Account : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			this.Amount = (oData && oData.Amount) ? this.DateService.formatAmount(oData.Amount) : "";
			this.Material = (oData && oData.Material) ? oData.Material : "";
			this.Profit = (oData && oData.Profit) ? oData.Profit : "";
			this.Center = (oData && oData.Center) ? oData.Center : "";
			this.Assignment = (oData && oData.Assignment) ? oData.Assignment : "";
			this.RebateType = (oData && oData.Rebate) ? this.checkRebateType(oData.Rebate) : "";
			this.Reserved1 = (oData && oData.Reserved1) ? oData.Reserved1 : "";
			this.Reserved2 = (oData && oData.Reserved2) ? oData.Reserved2 : "";
			this.Reserved3 = (oData && oData.Reserved3) ? oData.Reserved3 : "";
			this.Reserved4 = (oData && oData.Reserved4) ? oData.Reserved4 : "";
		},
		
		checkRebateType: function(sValue) {
			if(sValue.toLowerCase() === "g") {
				return "Growth Rebate";
			} else if(sValue.toLowerCase() === "v") {
				return "Value Rebate";
			} if(sValue.toLowerCase() === "") {
				return "";
			}
		},
		
		getRequestPayload: function(sContractNo, PostingDate, DocumentDate) {
			return {
				Rcont: sContractNo,
				Posting: PostingDate,
				Document: DocumentDate,
				Account: this.Account,
				Vendor: this.Vendor,
				Amount: this.Amount,
				Material: this.Material,
				Profit: this.Profit,
				Center: this.Center,
				Assignment: this.Assignment,
				Rebate: this.Rebate,
				Reserved1: this.Reserved1,
				Reserved2: this.Reserved2,
				Reserved3: this.Reserved3,
				Reserved4: this.Reserved4
			};
		}
	});
	return AccrualItem;
});