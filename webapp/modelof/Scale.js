sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application"
], function(BaseObject, Application) {
	"use strict";
	var Scale = BaseObject.extend("com.vSimpleApp.model.Scale", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.setData(oData);
		},

		setData: function(oData) {
			this.ScaleNo = (oData && oData.ScaleNo) ? oData.ScaleNo : "";
			this.Value = (oData && oData.Value) ? oData.Value : "";
			this.ValueState = "None";
			this.RebatePercent = (oData && oData.RebatePercent) ? oData.RebatePercent : "";
			this.RebatePercentState = "None";
			this.RebateType = (oData && oData.RebateType) ? oData.RebateType : "";
		},
		
		validate: function() {
			var bIsValid = true;
			if (this.Value === "" && this.RebatePercent === "") {
				bIsValid = true;
			} else {
				if (this.Value === "") {
					bIsValid = false;
					this.ValueState = "Error";
				} else {
					this.ValueState = "None";
				}
				if (this.RebatePercent === "") {
					bIsValid = false;
					this.RebatePercentState = "Error";
				} else {
					this.RebatePercentState = "None";
				}
			}
			return bIsValid;
		},
		
		isEmpty: function() {
			var bIsEmpty = false;
			if (this.Value === "" && this.RebatePercent === "") {
				bIsEmpty = true;
			}
			return bIsEmpty;
		},
		
		getRequestPayload: function(sContractNo, sItemNo) {
			return { 
				Rcont: sContractNo,
				Spend: this.Value,
				Item: sItemNo,
				Srno: this.ScaleNo,
				Rtype: this.RebateType,
				Scale: "X",
				Rate: this.RebatePercent 
			};
		}
	});
	return Scale;
});