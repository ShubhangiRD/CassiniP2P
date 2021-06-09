sap.ui.define([
	"com/vSimpleApp/model/BaseObject"
], function (BaseObject) {
	"use strict";
	return BaseObject.extend("com.vSimpleApp.model.Product", {
		constructor: function (data) {
			BaseObject.call(this);
			if (data) {
				this.Product = data.Product;
				this.Volume = data.Volume;
			}
		}
	});
});