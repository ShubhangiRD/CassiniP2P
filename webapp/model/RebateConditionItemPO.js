sap.ui.define([
	"com/vSimpleApp/model/BaseObject"
], function(BaseObject) {
	"use strict";
	var RebateConditionItemPO = BaseObject.extend("com.vSimpleApp.model.RebateConditionItemPO", {
		constructor: function(oData) {
			BaseObject.call(this);
		
			this.setData(oData);
		},

		setData: function(oData) {
		this.Ebelp = (oData && oData.Ebelp) ? oData.Ebelp : ""; //5 digits
	
	//	this.Ebelp = (oData && oData.Ebelp) ? oData.Ebelp : "";
	/*	this.Materialno = (oData && oData.Materialno) ? oData.Materialno : "";
		this.Werks = (oData && oData.Plant) ? oData.Plant : "";   
		this.Menge = (oData && oData.POQuantity) ? oData.POQuantity : "";              
*/
		this.Matnr = (oData && oData.Matnr) ? oData.Matnr : "";     //18 digits
		this.Werks = (oData && oData.Werks) ? oData.Werks : "";   
		this.Menge = (oData && oData.Menge) ? oData.Menge : "";      
		this.Material = (oData && oData.Material) ? oData.Material: "";
	//	this.Ebelp = (oData && oData.Ebelp) ? oData.Ebelp : "";
	/*	this.Materialno = (oData && oData.Materialno) ? oData.Materialno : "";
		this.Werks = (oData && oData.Plant) ? oData.Plant : "";   
		this.Menge = (oData && oData.POQuantity) ? oData.POQuantity : "";              
*/
	
			
		},
		
	getRequestPayload: function() {
			return {
		
			//	Rcont: sContractNo,
				Ebelp: this.Ebelp,
		/*		Matnr: this.Materialno,
				Menge: this.POQuantity,      
				Werks: this.Plant
		*/
				Matnr: this.Matnr,
				Werks: this.Werks,
				Menge: this.Menge
			//	Material: this.Materialno
			
		};
		}
	
	});
	return RebateConditionItemPO;
});