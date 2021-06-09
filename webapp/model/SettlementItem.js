sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"com/vSimpleApp/service/dateServices"
], function(BaseObject, Application, dateServices) {
	"use strict";
	var SettlementItem = BaseObject.extend("com.vSimpleApp.model.SettlementItem", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.PostingDate = (oData && oData.PostingDate) ? this.DateService.format(new Date(oData.PostingDate), "yyyy-MM-ddThh:mm:ss") : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.RebateType = (oData && oData.Rebate.toLowerCase() === "g") ? "Growth Rebate" : "Value Rebate";
			this.ContractNo = (oData && oData.Rcont) ? oData.Rcont : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			this.Document = (oData && oData.Document) ? oData.Document : "";
			this.Account = (oData && oData.Account) ? oData.Account : "";
			this.AccruedAmount = (oData && oData.Accruedamount) ? this.DateService.formatAmount(oData.Accruedamount) : "";
			this.SettleAmount = (oData && oData.Settleamount) ? this.DateService.formatAmount(oData.Settleamount) : "";
			this.SettleAmountValueState = "None";
			this.ValidFrom = (oData && oData.Kdate) ? this.DateService.format(oData.Kdate, "dd/MM/yyyy") : "";
			this.ValidTo = (oData && oData.Kdatb) ? this.DateService.format(oData.Kdatb, "dd/MM/yyyy") : "";
		},
		
		getRequestPayload: function(sContractNo) {
			return {
				Rcont: sContractNo,
				Posting: this.DateService.formatRequestPayloadDate(this.PostingDate),
				Document: "123",
				Account: this.Account,
				Vendor: this.Vendor,
				Accruedamount: this.AccruedAmount,
				Settleamount: (this.SettleAmount !== "") ? this.SettleAmount : this.AccruedAmount,
				Kdate: this.DateService.formatRequestPayloadDate(this.ValidFrom),
				Kdatb: this.DateService.formatRequestPayloadDate(this.ValidTo),
				Rebate: (this.RebateType === "Growth Rebate") ? "g" : "v"
			};
		},
		
		formatDateString: function(sValue) {
			if(sValue) {
				var year = sValue.substring(0,4);
				var month = sValue.substring(4, 6);
				var day = sValue.substring(6, 8);
				return new Date(month + "/" + day + "/" + year);
			} else {
				return "";
			}
		}
	});
	return SettlementItem;
});