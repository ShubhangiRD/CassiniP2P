sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"com/vSimpleApp/service/dateServices"
], function(BaseObject, Application, dateServices) {
	"use strict";
	var Settlement = BaseObject.extend("com.vSimpleApp.model.Settlement", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.PostingPeriod = (oData && oData.PostingPeriod) ? this.DateService.format(new Date(oData.PostingPeriod), "dd/MM/yyyy") : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.PostingPeriodValueState = "None";
			this.ReferenceText = (oData && oData.ReferenceText) ? oData.ReferenceText : "";
			this.ReferenceTextValueState = "None";
			this.SettlementSet = (oData && oData.SettlementSet) ? oData.SettlementSet : [];
		},
		
		validate: function() {
			var bPostingPeriod = true, bReferenceText = true;
			if (this.PostingPeriod === "") {
				this.PostingPeriodValueState = "Error";
				bPostingPeriod = false;
			} else {
				this.PostingPeriodValueState = "None";
				bPostingPeriod = true;
			}
			if (this.ReferenceText === "") {
				this.ReferenceTextValueState = "Error";
				bReferenceText = false;
			} else {
				this.ReferenceTextValueState = "None";
				bReferenceText = true;
			}
			
			return (bPostingPeriod && bReferenceText);	
		}
	});
	return Settlement;
});