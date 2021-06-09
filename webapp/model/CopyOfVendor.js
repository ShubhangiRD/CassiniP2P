sap.ui.define([
	"com/vSimpleApp/model/BaseObject"
], function (BaseObject) {
	"use strict";
	return BaseObject.extend("com.vSimpleApp.model.Vendor", {
		constructor: function (data) {
			BaseObject.call(this);
			if (data) {
				this.Vendor = data.Vendor;
				this.Revenue = data.Revenue;
			}
		},
		getChartData: function () {
			return {
				Vendor: this.Vendor,
				Revenue: this.Revenue
			};
		}
	});
});