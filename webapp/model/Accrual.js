sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"com/vSimpleApp/service/dateServices"
], function(BaseObject, Application, dateServices) {
	"use strict";
	var Accrual = BaseObject.extend("com.vSimpleApp.model.Accrual", {
		constructor: function(oData) {
			BaseObject.call(this);
			this.DateService = dateServices.getInstance();
			this.setData(oData);
		},

		setData: function(oData) {
			this.PostingPeriod = (oData && oData.PostingPeriod) ? this.DateService.format(new Date(oData.PostingPeriod), "dd/MM/yyyy") : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.PostingDate = (oData && oData.PostingDate) ? this.DateService.format(new Date(oData.PostingDate), "dd/MM/yyyy") : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.DocumentDate = (oData && oData.DocumentDate) ? this.DateService.format(new Date(oData.DocumentDate), "dd/MM/yyyy") : this.DateService.format(new Date(), "dd/MM/yyyy");
			this.AccrualSet = (oData && oData.AccrualSet) ? oData.AccrualSet : [];
			this.PostingPeriodValueState = "None";
			this.PostingDateValueState = "None";
			this.DocumentValueState = "None";
		},
		
		validate: function() {
			var bPostingPeriod = true, bPostingDate = true, bDocumentDate = true;
			if (this.PostingPeriod === "") {
				this.PostingPeriodValueState = "Error";
				bPostingPeriod = false;
			} else {
				this.PostingPeriodValueState = "None";
				bPostingPeriod = true;
			}
			if (this.PostingDate === "") {
				this.PostingDateValueState = "Error";
				bPostingDate = false;
			} else {
				this.PostingDateValueState = "None";
				bPostingDate = true;
			}
			if (this.DocumentDate === "") {
				this.DocumentValueState = "Error";
				bDocumentDate = false;
			} else {
				this.DocumentValueState = "None";
				bDocumentDate = true;
			}
			return (bPostingPeriod && bPostingDate && bDocumentDate);	
		}
	});
	return Accrual;
});