sap.ui.define([], function () {
	"use strict";
	
	var Formatter = {
		
		isRateEnabled: function(aScales) {
			var hasValue = false;
			if(aScales) {
				for (var i = 0; i < aScales.length; i++) {
					if (aScales[i].Value !== "" || aScales[i].RebatePercent !== "") {
						hasValue = true;
					}
				}
			}
			return !hasValue;
		}
			
	};

	return Formatter;

}, true);