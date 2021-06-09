sap.ui.define([
	
	"com/vSimpleApp/model/BaseObject",
		"com/vSimpleApp/service/Application"
], function(BaseObject,Application) {
	"use strict";
	var RebateConditionItem = BaseObject.extend("com.vSimpleApp.model.VendorRebateCondition", {
		constructor: function(oData) {
			BaseObject.call(this);
		
			this.setData(oData);
		},

		setData: function(oData) {
		this.ItemNo = (oData && oData.ItemNo) ? oData.ItemNo : "";
	
	//	this.Ebelp = (oData && oData.Ebelp) ? oData.Ebelp : "";
		this.Materialno = (oData && oData.Materialno) ? oData.Materialno : "";
		this.Werks = (oData && oData.Plant) ? oData.Plant : "";   
		this.Menge = (oData && oData.POQuantity) ? oData.POQuantity : "";              
		},
		
	getRequestPayload: function() {
			return {
		
			//	Rcont: sContractNo,
				Ebelp: this.ItemNo,
				Matnr: this.Materialno,
				Menge: this.POQuantity,      
				Werks: this.Plant
				
			};
		}
	
	});
	return RebateConditionItem;
});