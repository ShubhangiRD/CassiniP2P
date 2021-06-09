sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"sap/m/MessageToast"

], function(BaseObject, Application, MessageToast) {
	"use strict";
	var Contract = BaseObject.extend("com.vSimpleApp.model.GetPurchaseVendor", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.setData(oData);
		},

		setData: function(oData) {
		
		/*	this.Bsart = "EC";
			this.VendorNo = (oData && oData.Lifnr) ? oData.Lifnr : "";
			this.Ebeln = (oData && oData.Ebeln) ? oData.Ebeln : "";
			this.PurchaseGroup  = (oData && oData.Ekgrp) ? oData.Ekgrp : "";
			this.CompanyCode = (oData && oData.Bukrs) ? oData.Bukrs : "";
			this.PurchaseOrg = (oData && oData.Ekorg) ? oData.Ekorg : "";
			this.Materialno = (oData && oData.Materialno) ? oData.Materialno : "";
			this.Currency = (oData && oData.Waers) ? oData.Waers : "";
		
		//	this.Description = (oData && oData.Description) ? oData.Description : "";
		//	this.UOMeasure = (oData && oData.UOM) ? oData.UOM : "";
			this.PurchaseConditionItems = (oData && oData.ConditionItems) ? oData.ConditionItems : [];

*/

			this.Bsart = "EC";
			this.Lifnr = (oData && oData.Lifnr) ? oData.Lifnr : "";
			this.Ebeln = (oData && oData.Ebeln) ? oData.Ebeln : "";
			this.Ekgrp  = (oData && oData.Ekgrp) ? oData.Ekgrp : "";
			this.Bukrs = (oData && oData.Bukrs) ? oData.Bukrs : "";
			this.Ekorg = (oData && oData.Ekorg) ? oData.Ekorg : "";
			this.Matnr = (oData && oData.Matnr) ? oData.Matnr : "";
			this.Waers = (oData && oData.Waers) ? oData.Waers : "";
			this.POItem = (oData && oData.ConditionItems) ? oData.ConditionItems : [];
			
			
			/*	this.Bsart = "EC";
			this.Lifnr = (oData && oData.Lifnr) ? oData.Lifnr : "";
			this.Ebeln = (oData && oData.Ebeln) ? oData.Ebeln : "";
			this.Ekgrp  = (oData && oData.Ekgrp) ? oData.Ekgrp : "";
			this.Bukrs = (oData && oData.Bukrs) ? oData.Bukrs : "";
			this.Ekorg = (oData && oData.Ekorg) ? oData.Ekorg : "";
			this.Matnr = (oData && oData.Matnr) ? oData.Matnr : "";
			this.Waers = (oData && oData.Waers) ? oData.Waers : "";
			this.POItem = (oData && oData.ConditionItems) ? oData.ConditionItems : [];
*/
			
			
		},

		getRequestPayload: function() {
				var that = this;
			var POItem = [];
			this.POItem.forEach(function(item) {
		//		aRebateConditionItems.push(item.getRequestPayload(that.ContractNo));
			POItem.push(item.getRequestPayload());
			
			});
			return {
			//	Rcont: this.ContractNo,
			/*	Ebeln: this.Ebeln,
				Bukrs: this.CompanyCode,
				Bsart : "EC",
				Lifnr: this.VendorNo,
				Ekorg: this.PurchaseOrg,
				Ekgrp: this.PurchaseGroup,
				Waers: this.Currency,
				POItem: aRebateConditionItems
		*/
				Ebeln: this.Ebeln,
				Bukrs: this.Bukrs,
				Bsart : "EC",
				Lifnr: this.Lifnr,
				Ekorg: this.Ekorg,
				Ekgrp: this.Ekgrp,
				Waers: this.Waers,
				POItem: POItem
		
		
		
			};
			
		
		},
		
		vendorNumberfun : function(VendorNo){
				var zero = "";
		//	var no;
			console.log($.isNumeric((VendorNo)));
			if ($.isNumeric((VendorNo)) === true) {
				var len = VendorNo.length;
				if (len !== undefined) {
					var z = 10 - len;
					for (var i = 0; i < z; i++) {
						zero += "0";
					}
				}
				console.log(len);
				console.log(zero);
				VendorNo = zero + VendorNo;
				console.log(VendorNo);
			}
		},

		validateHeader: function() {
			var bVendor = true;
			if (this.VendorName === "" || this.VendorNo === "") {
				this.VendorValueState = "Error";
				bVendor = false;
			}
			return (bVendor);
		},

		validateItemConditions: function() {
			var aValidItems = [];
			if (this.PurchaseConditionItems.length === 0) {
				MessageToast.show("Rebate Condition Table should have atleast 1 line item");
				return false;
			}
			this.PurchaseConditionItems.forEach(function(item) {
				aValidItems.push(item.validate());
			});
			var aNotValid = aValidItems.filter(function(item) {
				return item === false;
			});
			return (aNotValid.length > 0) ? false : true;
		}

	});
	return Contract;
});