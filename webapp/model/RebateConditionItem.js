sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/model/Scale",
	"com/vSimpleApp/service/dateServices",
	"com/vSimpleApp/service/Application"
], function(BaseObject, Scale, dateServices, Application) {
	"use strict";
	var RebateConditionItem = BaseObject.extend("com.vSimpleApp.model.RebateConditionItem", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.ItemNo = (oData && oData.ItemNo) ? oData.ItemNo : "";
			this.RebateType = (oData && oData.RebateType) ? oData.RebateType : "v";
			this.IsScaleSelected = (oData && oData.IsScaleSelected) ? oData.IsScaleSelected : false;
			this.Scales = (oData && oData.Scales) ? oData.Scales : this.setScaleItems();
			this.Rate = (oData && oData.Rate) ? oData.Rate : "";
			this.Base = (oData && oData.Base) ? oData.Base : "po";
			this.ValidFrom = "";
			this.ValidTo = "";
			this.RateValueState = "None";
			this.ValidFromValueState = "None";
			this.ValidToValueState = "None";
			this.setDuration(oData);
			this.IsRateEnabled = true;
		},
		
		setScaleItems: function() {
			return [new Scale({ ScaleNo: "1", RebateType: this.RebateType }),
					new Scale({ ScaleNo: "2", RebateType: this.RebateType }),
					new Scale({ ScaleNo: "3", RebateType: this.RebateType })];
		},
		
		setDuration: function(oData) {
			if (oData && oData.ValidFrom && oData.ValidFrom !== "" && oData.ValidTo && oData.ValidTo !== "") {
				this.ValidFrom = this.DateService.format(oData.ValidFrom, "dd/MM/yyyy");
				this.ValidTo = this.DateService.format(oData.ValidTo, "dd/MM/yyyy");
			} else {
				var oComponent = Application.getInstance().Component;
				var oVendorModel = oComponent.getModel("Vendor");
				this.ValidFrom = oVendorModel.getProperty("/TempContract/ValidFrom");
				this.ValidTo = oVendorModel.getProperty("/TempContract/ValidTo");
			}
		},
		
		getRequestPayload: function(sContractNo) {
			return {
				Rcont: sContractNo,
				Item: this.ItemNo,
				Scale: (this.IsScaleSelected) ? "X" : "",
				Rate: this.Rate,
				Rtype: this.RebateType,
				Base: this.Base,
				Kdatb: this.DateService.formatRequestPayloadDate(this.ValidFrom),
				Kdate: this.DateService.formatRequestPayloadDate(this.ValidTo)
			};
		},
		
		validate: function() {
			var bRate = true, bValidFrom = true, bValidTo = true;
			if (this.Rate === "") {
				this.RateValueState = "Error";
				bRate = false;
			} else {
				this.RateValueState = "None";
				bRate = true;
			}
			if (this.ValidFrom === "") {
				this.ValidFromValueState = "Error";
				bValidFrom = false;
			} else {
				this.ValidFromValueState = "None";
				bValidFrom = true;
			}
			if (this.ValidTo === "") {
				this.ValidToValueState = "Error";
				bValidTo = false;
			} else {
				this.ValidToValueState = "None";
				bValidTo = true;
			}
			return (bRate && bValidFrom && bValidTo);
		}
	});
	return RebateConditionItem;
});