sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/dateServices",
	"com/vSimpleApp/service/Application",
	"sap/m/MessageToast",
	"com/vSimpleApp/model/Accrual",
	"com/vSimpleApp/model/Settlement"
], function(BaseObject, dateServices, Application, MessageToast, Accrual, Settlement) {
	"use strict";
	var Contract = BaseObject.extend("com.vSimpleApp.model.Contract", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.ContractNo = (oData && oData.ContractNo) ? oData.ContractNo : "";
			this.VendorNo = (oData && oData.Vendorno) ? oData.Vendorno : "";
			this.VendorName = (oData && oData.Vendorname) ? oData.Vendorname : "";
			this.Description = (oData && oData.Description) ? oData.Description : "";
			this.PurchaseOrg = (oData && oData.Purorg) ? oData.Purorg : "";
			this.CompanyCode = (oData && oData.Compcode) ? oData.Compcode : "";
			this.Currency = (oData && oData.Currency) ? oData.Currency : "";
			this.CreatedBy = (oData && oData.CreatedBy) ? oData.CreatedBy : "James Smith";
			this.CreatedOn = (oData && oData.CreatedOn) ? oData.CreatedOn : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.ChangedBy = (oData && oData.ChangedBy) ? oData.ChangedBy : "";
			this.ChangedOn = (oData && oData.ChangedOn) ? oData.ChangedOn : "";
			this.RebateConditionItems = (oData && oData.ConditionItems) ? oData.ConditionItems : [];
			this.SKUExclusion = (oData && oData.SKUExclusion) ? oData.SKUExclusion : [];
			this.EligibleData = (oData && oData.EligibleData) ? oData.EligibleData : [];
			this.Accrual = (oData && oData.Accrual) ? oData.Accrual : new Accrual();
			this.Settlement = (oData && oData.Settlement) ? oData.Settlement : new Settlement();
			this.VendorValueState = "None";
			this.DescriptionValueState = "None";
			this.ValidFromValueState = "None";
			this.ValidToValueState = "None";
			this.setQuarterDates(oData);
		},

		setQuarterDates: function(oData) {
			if (oData && oData.ValidFrom && oData.ValidFrom !== "" && oData.ValidTo && oData.ValidTo !== "") {
				this.ValidFrom = this.DateService.format(oData.ValidFrom, "dd/MM/yyyy");
				this.ValidTo = this.DateService.format(oData.ValidTo, "dd/MM/yyyy");
			} else {
				var now = new Date();
				var quarter = Math.floor((now.getMonth() / 3));
				var startDate = new Date(now.getFullYear(), quarter * 3, 1);
				var endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
				this.ValidFrom = this.DateService.format(startDate, "dd/MM/yyyy");
				this.ValidTo = this.DateService.format(endDate, "dd/MM/yyyy");
			}
		},

		getRequestPayload: function() {
			var that = this;
			var aRebateConditionItems = [];
			var aSKUExclusions = [];
			var aScales = [];
			
			this.SKUExclusion.forEach(function(material) {
				aSKUExclusions.push(material.getRequestPayload(that.ContractNo));
			});
			
			this.RebateConditionItems.forEach(function(item) {
				aRebateConditionItems.push(item.getRequestPayload(that.ContractNo));
				item.Scales.forEach(function(scale) {
					if(scale.Value !== "" && scale.RebatePercent !== "") {
						aScales.push(scale.getRequestPayload(that.ContractNo, item.ItemNo));
					}
				});
			});
			return {
				Rcont: this.ContractNo,
				Vendorno: this.VendorNo,
				Vendorname: this.VendorName,
				Compcode: this.CompanyCode,
				Purorg: this.PurchaseOrg,
				Currency: this.Currency,
				Kdatb: this.DateService.formatRequestPayloadDate(this.ValidFrom),
				Kdate: this.DateService.formatRequestPayloadDate(this.ValidTo),
				Ernam: this.CreatedBy,
				Erdat: this.DateService.formatRequestPayloadDate(this.CreatedOn),
				Uname: this.ChangedBy,
				Aedtm: this.DateService.format(new Date(), "yyyy-MM-ddThh:mm:ss"),
				Description: this.Description,
				HeaderToItem: aRebateConditionItems,
				HeaderToMaterial: aSKUExclusions,
				Rate01Set: aScales
			};
		},
		
		getAccrualRequestPayload: function() {
			var aAccrualSet = [];
			var sPostingPeriod = this.DateService.formatRequestPayloadDate(this.Accrual.PostingPeriod);
			var sPostingDate = this.DateService.formatRequestPayloadDate(this.Accrual.PostingDate);
			var sDocumentDate = this.DateService.formatRequestPayloadDate(this.Accrual.DocumentDate);
			for (var i = 0; i < this.Accrual.AccrualSet.length; i++) {
				aAccrualSet.push(this.Accrual.AccrualSet[i].getRequestPayload(this.ContractNo, sPostingDate, sDocumentDate));
			}
			return {
				Rcont: this.ContractNo,
				Vendorno: this.VendorNo,
				Vendorname: this.VendorName,
				Compcode: this.CompanyCode,
				Purorg: this.PurchaseOrg,
				Currency: this.Currency,
				Kdatb: sPostingDate,
				Kdate: sDocumentDate,
				Ernam: this.CreatedBy,
				Erdat: this.DateService.formatRequestPayloadDate(this.CreatedOn),
				Uname: this.ChangedBy,
				Aedtm: sPostingPeriod,
				Description: this.Description,
				AccrualSet: aAccrualSet
			};
		},
		
		getSettlementRequestPayload: function() {
			var aSettlementSet = [];
			var sPostingPeriod = this.DateService.formatRequestPayloadDate(this.Settlement.PostingPeriod);
			var sReferenceText = this.Settlement.ReferenceText;
			for (var i = 0; i < this.Settlement.SettlementSet.length; i++) {
				aSettlementSet.push(this.Settlement.SettlementSet[i].getRequestPayload(this.ContractNo));
			}
			return {
				Rcont: this.ContractNo,
				Vendorno: this.VendorNo,
				Vendorname: this.VendorName,
				Compcode: this.CompanyCode,
				Purorg: this.PurchaseOrg,
				Currency: this.Currency,
				Kdatb: this.DateService.formatRequestPayloadDate(this.ValidFrom),
				Kdate: this.DateService.formatRequestPayloadDate(this.ValidTo),
				Ernam: this.CreatedBy,
				Erdat: this.DateService.formatRequestPayloadDate(this.CreatedOn),
				Uname: this.ChangedBy,
				Aedtm: sPostingPeriod,
				Description: sReferenceText,
				SettlementSet: aSettlementSet
			};
		},
		
		validate: function() {
			var oComponent = Application.getInstance().Component;
			var oLookupModel = oComponent.getModel("Lookup");
			var sSelectedTabKey = oLookupModel.getProperty("/SelectedTabKey");
			var bValidHeaderData = this.validateHeader();
			var bValidSelectedTabData;
			switch(sSelectedTabKey) {
				case "item":
					bValidSelectedTabData = this.validateItemConditions();
					break;
				case "eligibleData":
					bValidSelectedTabData = this.validateEligibleData();
					break;
				case "accrual":
					bValidSelectedTabData = this.validateAccrual();
					break;
				case "settlement":
					bValidSelectedTabData = this.validateSettlement();
					break;
				default:
					return false;
			}
			return bValidHeaderData && bValidSelectedTabData;
		},
		
		validateHeader: function() {
			var bVendor = true, bDescription = true, bValidFrom = true, bValidTo = true;
			if (this.VendorName === "" || this.VendorNo === "") {
				this.VendorValueState = "Error";
				bVendor = false;
			} else {
				this.VendorValueState = "None";
				bVendor = true;
			}
			if (this.Description === "") {
				this.DescriptionValueState = "Error";
				bDescription = false;
			} else {
				this.DescriptionValueState = "None";
				bDescription = true;
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
			return (bVendor && bDescription && bValidFrom && bValidTo);
		},
		
		validateItemConditions: function() {
			var aValidItems = [];
			if(this.RebateConditionItems.length === 0) {
				MessageToast.show("Rebate Condition Table should have atleast 1 line item");
				return false;
			}
			this.RebateConditionItems.forEach(function(item) {
				aValidItems.push(item.validate());
			});
			var aNotValid = aValidItems.filter(function(item) {
				return item === false;
			});
			return (aNotValid.length > 0) ? false : true; 
		},
		
		validateEligibleData: function() {
			return true;
		},
		
		validateAccrual: function() {
			return true;
		},
		
		validateSettlement: function() {
			return true;
		}
	});
	return Contract;
});