sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.vSimpleApp.controller.LoginPage", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.vSimpleApp.view.view.LoginPage
		 */
			onInit: function() {
		
			},
			
				onChangeValue: function(oEvent) {
			var oControl = oEvent.getSource();
			var sPlaceholder = oControl.getProperty("placeholder");
			var sValue = oControl.getValue();
			if(sValue === "") {
				oControl.setValueState("Error");
				var sValueType = (sPlaceholder === "Username") ? "Username" : "Password";
				oControl.setValueStateText(sValueType + " is required");
			} else {
				oControl.setValueState("None");
				oControl.setValueStateText("");
			}
		},
		onLogin: function() {
			var oUserNameControl = this.byId("idInput");
			var sUserName = oUserNameControl.getValue();
			var oPasswordControl = this.byId("idPassword");
			var sPassword = oPasswordControl.getValue();
			if(sUserName === "" && sPassword === "") {
				oUserNameControl.setValueState("Error");
				oUserNameControl.setValueStateText("Username is required");
				oPasswordControl.setValueState("Error");
				oPasswordControl.setValueStateText("Password is required");
				return;
			}
			if(sUserName === "admin" && sPassword === "admin") {
					var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("ShowTiles");
				return;
			} else if(sUserName === "cassini" && sPassword === "123") {
			
				var oRouter1 = this.getOwnerComponent().getRouter();
				oRouter1.navTo("AdminPanel");
		
				return;
			} /*else {
				var oUserModel = this.getOwnerComponent().getModel("User");
				oUserModel.setProperty("/Username", sUserName);
				var oRouter = this.getOwnerComponent().getRouter();
		//	oRouter.navTo("ShowTiles");
			oRouter.navTo("AdminPanel");
			//oRouter.navTo("Dashboard2");
				oUserNameControl.setValue("");
				oPasswordControl.setValue("");
				oUserModel.refresh(true);
			}*/
		}


		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.vSimpleApp.view.view.LoginPage
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.vSimpleApp.view.view.LoginPage
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.vSimpleApp.view.view.LoginPage
		 */
		//	onExit: function() {
		//
		//	}

	});

});