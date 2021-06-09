sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"com/vSimpleApp/service/dateServices"
], function(BaseObject, Application, dateServices) {
	"use strict";
	var EligibleData = BaseObject.extend("com.vSimpleApp.model.EligibleData", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.RebateType = (oData && oData.Type === "V") ? "Value Rebate" : "Growth Rabate";
			this.PurchaseOrder = (oData && oData.PurchaseOrder) ? oData.PurchaseOrder : "";
			this.GoodsReceipt = (oData && oData.GoodsReceipt) ? oData.GoodsReceipt : "";
			this.LineItemNo  = (oData && oData.LineItem) ? oData.LineItem : "";
			this.MaterialNo = (oData && oData.Material) ? oData.Material : "";
			this.MaterialDescription = (oData && oData.MaterialDescription) ? oData.MaterialDescription : "";
			this.NetPrice = (oData && oData.NetPrice) ? this.DateService.formatAmount(oData.NetPrice) : "";
			this.Rate = (oData && oData.Rate) ? oData.Rate : "";
			this.RebateAmount = (oData && oData.RebateAmount) ? this.DateService.formatAmount(oData.RebateAmount) : "";
			this.CreatedOn = (oData && oData.CreatedOn) ? this.DateService.format(new Date(oData.CreatedOn), "dd/MM/yyyy") : "";
		}
	});
	return EligibleData;
});