sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	/* @type sap.ui.base.Object */
	var instance;
	/* @type sap.ui.base.Object */
	var DateServices = Object.extend("com.vSimpleApp.service.dateServices", {
		constructor: function () {},
		format: function (dDate, sFormat) {
			sFormat = sFormat.replace(/D/g, "d");
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: sFormat, calendarType: sap.ui.core.CalendarType.Gregorian});
			return oDateFormat.format(dDate);
		},
		formatStringDate: function (sDate, sFormat) {
			if(!sDate){
				return "";
			}
			var dDate = new Date(sDate.substring(0, 4) + "/" + sDate.substring(4, 6) + "/" + sDate.substring(6, 8));
			if(sFormat && sFormat !== "") {
				return this.format(dDate, sFormat);
			} else {
				return dDate;
			}
		},
		formatAmount: function(sValue) {
			if(sValue !== "") {
				/*var sTrimmedValue = sValue;
				if(sValue.includes("-")) {
					sTrimmedValue = "-" + sValue.split("-")[0].trim();
				}*/
				var fValue = parseFloat(sValue);
				return fValue.toFixed(2);
			} else {
				return "";
			}
		},
		formatRequestPayloadDate: function(sDate) {
			var aSubString = sDate.split("/");
			return (aSubString.reverse().join("-") + "T00:00:00");
		},
		getRequestDate: function(dDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "MM/dd/yyyy HH:mm:ss", calendarType: sap.ui.core.CalendarType.Gregorian});
			return oDateFormat.format(dDate);
		},
		getTimeStamp: function(dDate) {
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({pattern: "yyyy-MM-dd HH:mm:ss", calendarType: sap.ui.core.CalendarType.Gregorian});
			return oDateFormat.format(dDate);
		}
	});
	return {
		/**
		 * Method to create new instance of ODataUtility.
		 * @public
		 * @returns {sap.ui.base.Object} return new instance of ODataUtility
		 */
		getInstance: function () {
			if (!instance) {
				// create new instance of ODataUtility Object
				instance = new DateServices();
			}
			return instance;
		}
	};
});