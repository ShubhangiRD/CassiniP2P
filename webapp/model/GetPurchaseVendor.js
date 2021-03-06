sap.ui.define([
	"com/cassiniProcureToPay/model/BaseObject",
	"com/cassiniProcureToPay/service/Application",
	"sap/m/MessageToast"

], function(BaseObject, Application, MessageToast) {
	"use strict";
	var Contract = BaseObject.extend("com.cassiniProcureToPay.model.GetPurchaseVendor", {
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
			
			
		

				this.CompCode = (oData && oData.CompCode) ? oData.CompCode : "";
			this.CreatDate = (oData && oData.CreatDate) ? oData.CreatDate : "";
			this.CreatedBy  = (oData && oData.CreatedBy) ? oData.CreatedBy : "";
			this.Currency = (oData && oData.Currency) ? oData.Currency : "";
			this.DocDate = (oData && oData.DocDate) ? oData.DocDate : "";
			this.DocType = (oData && oData.DocType) ? oData.DocType : "";
			this.Ind = (oData && oData.Ind) ? oData.Ind : "";
			this.PoNumber = (oData && oData.PoNumber) ? oData.PoNumber : "";
			this.PurGroup = (oData && oData.PurGroup) ? oData.PurGroup : "";
			this.PurchOrg = (oData && oData.PurchOrg) ? oData.PurchOrg : "";
			this.Vendor = (oData && oData.Vendor) ? oData.Vendor : "";
			
		
			
			
			
			
			
			
			
			
			
			
			
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