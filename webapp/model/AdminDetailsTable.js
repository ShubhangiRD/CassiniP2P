sap.ui.define([
	"com/vSimpleApp/model/BaseObject",
	"com/vSimpleApp/service/Application",
	"sap/m/MessageToast",
		"com/vSimpleApp/model/AdminDetailsTable"

], function(BaseObject, Application, MessageToast,AdminDetailsTable) {
	"use strict";
	 AdminDetailsTable = BaseObject.extend("com.vSimpleApp.model.AdminDetailsTable", {
		constructor: function(oData) {
		
			this.setData(oData);
		},

		setData: function(oData) {
	
	
			this.HeaderItems = (oData && oData.column) ? oData.column : [];
			
			
		
		},

		getRequestPayload: function() {
				var that = this;
			var HeaderItems = [];
			this.HeaderItems.forEach(function(item) {
	
			HeaderItems.push(item.getRequestPayload());
			
			});
			return {
			
		
				HeaderItems: HeaderItems
		
		
		
			};
			
		
		}


	});
	return AdminDetailsTable;
});