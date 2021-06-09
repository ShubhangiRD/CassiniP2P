sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"jquery.sap.global",
	"sap/m/Popover",
	"sap/m/Button",
	"sap/m/library",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"com/vSimpleApp/model/RebateConditionItem",
	"com/vSimpleApp/model/Scale",
	"com/vSimpleApp/model/Material",
	"com/vSimpleApp/model/EligibleData",
	"com/vSimpleApp/model/AccrualItem",
	"com/vSimpleApp/model/SettlementItem",
	"com/vSimpleApp/service/dateServices",
	"com/vSimpleApp/model/Formatter"
	], function(Controller, jQuery, Popover, Button, library, JSONModel, BusyIndicator,History, MessageToast, MessageBox, Dialog, RebateConditionItem, Scale, Material, EligibleData, AccrualItem, SettlementItem, dateServices, Formatter) {
	"use strict";
	var ButtonType = library.ButtonType,
		PlacementType = library.PlacementType;
	var oView;
	
	var nc = 1;
	setInterval(function (){	
		var u = window.location.href;
	var sep = u.split("/");
	var cnt = sep.length;
	var nm = sep[cnt-1];
//	console.log(nm);
			var vn = nm;//oView.sViewName;
		//	console.log(vn);
			if(vn!=="Home")
			{
					$("body").find("button").each(function(){
					
						
				    var id = $(this).attr("id");
				    //$(this).prop("disabled","disabled");
					    if(id.indexOf("addbtn")!==-1 || id.indexOf("delbtn")!==-1 || id.indexOf("postabtn")!==-1 || id.indexOf("postsbtn")!==-1 || id.indexOf("savbtn")!==-1)
					    {
					    	sap.ui.getCore().byId(id).setEnabled(false);
					    }
					});
					$("body").find("input").each(function(){
						var id = $(this).attr("id");
						if(id.indexOf("__xmlview4")!==-1)
					    {
					    	$(this).prop("disabled",true);
					    }
				    	
					});
					var oStore = jQuery.sap.storage(jQuery.sap.storage.Type.local);
					var oDate1 = oStore.get("id");
					if(oDate1!==undefined || oDate1!=="" || oDate1!==" ")
					{
						$("#__xmlview4--idVendorInput-inner").val(oDate1.vname1);
						$("#__xmlview4--idDesc-inner").val(oDate1.agdesc);

					}
			}
			else
			{
				if(nc==1)
				{
					$("body").find("input").each(function(){
							var id = $(this).attr("id");
							if(id!==undefined)
							{
								if(id.indexOf("idVendorInput")!==-1)
								{
									var v = $(this).val();
									$(this).val("");
								}
								if(id.indexOf("idDesc")!==-1)
								{
									$(this).val("");
								}	
							}
						});
						nc=0;
				}
			}
	}, 5000);
	
	//console.log(sap.ui.getCore().byId("idVendorInput").setValue("dfs"));
	return Controller.extend("com.vSimpleApp.controller.ViewContract", {
		onInit : function() {
			
			oView = this.getView();
			var oUserModel = this.getOwnerComponent().getModel("User");
			var sUsername = oUserModel.getProperty("/Username");
			var oStore1 = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oDate11 = oStore1.get("user");
			if(sUsername === "") {
				sUsername = oDate11.name;
				if(sUsername === "" || sUsername === undefined)
				{
					var oRouter = this.getOwnerComponent().getRouter();
					oRouter.navTo("Login");	
				}
			}
			this.oModel = new sap.ui.model.json.JSONModel();
			
			//var target = sap.ui.getCore().byId("__xmlview4--idVendorInput");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("ViewContract").attachPatternMatched(this._onRouteMatched1, this);
		},
		_onRouteMatched1: function() {
			BusyIndicator.show(0);
			var target;
			var that = this;
			var flag = 0;
			setInterval(function(){
				target = sap.ui.getCore().byId("__xmlview4--idVendorInput").getValue(); //sap.ui.getCore().byId("__xmlview4--idVendorInput");
				if(target!==undefined && target!=="" && flag==0)
				{
					BusyIndicator.hide();
					//alert(target);
					flag=1;
					sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
				}
			}, 5000);
			oView = this.getView();
			var vn = oView.sViewName;
			if(vn==="com.vSimpleApp.view.ChangeContract")
			{
				this.oModel.loadData(sap.ui.require.toUrl("com/vSimpleApp/model") + "/model.json", null, false);
				this.oModel.oData.selectedKey = "changeContract";
				this.getView().setModel(this.oModel);
			}
			else
			if(vn==="com.vSimpleApp.view.ViewContract")
			{
				this.oModel.loadData(sap.ui.require.toUrl("com/vSimpleApp/model") + "/model.json", null, false);
				this.oModel.oData.selectedKey = "displayContract";
				this.getView().setModel(this.oModel);
			}
			else
			if(vn==="com.vSimpleApp.view.Home")
			{
				this.oModel.loadData(sap.ui.require.toUrl("com/vSimpleApp/model") + "/model.json", null, false);
				this.oModel.oData.selectedKey = "createContract";
				this.getView().setModel(this.oModel);
			}
		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.vSimpleApp.fragment.Search");
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onOpenDialog: function () {
			this._getDialog().open();
		},
		onBeforeRendering: function(odata) {
			
		     var oVendorModel = this.getOwnerComponent().getModel("Vendor");
		     console.log(oVendorModel);
		     console.log("onBeforeRendering");
		  
		    },
		 
		    // hook gets invoked after the view is rendered  
		    onAfterRendering: function(odata) {
		  
		      var oVendorModel = this.getOwnerComponent().getModel("Vendor");
		     console.log(oVendorModel);
		     console.log("onAfterRendering");
		     
		  
		    },
		onUserNamePress: function (oEvent) {
			var that = this;
			var oPopover = new Popover({
				showHeader: false,
				placement: PlacementType.Bottom,
				content: [
					new Button({
						text: "Feedback",
						type: ButtonType.Transparent
					}),
					new Button({
						text: "Help",
						type: ButtonType.Transparent
					}),
					new Button({
						text: "Logout",
						type: ButtonType.Transparent,
						press: function() {
							var oRouter = that.getOwnerComponent().getRouter();
							oRouter.navTo("Login");
						}
					})
				]
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover");

			oPopover.openBy(oEvent.getSource());
		},

		onItemSelect : function(oEvent) {
			var item = oEvent.getParameter("item");
			this.byId("pageContainer").to(this.getView().createId(item.getKey()));
			var oComponent = this.getOwnerComponent();
			var key = item.getKey();
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			if(key==="createContract")
			{
				var oTempContract = oVendorModel.getProperty("/TempContract");
				oTempContract.setData({modelData:{}});
				oComponent.getRouter().navTo("Home");       
			}
			else
			if(key==="displayContract")
			{
				oComponent.getRouter().navTo("Dashboard");   
				//this._getDialog().open();
			}
			else
			if(key==="changeContract")
			{
				oComponent.getRouter().navTo("ChangeContract");       
			}
			else
			if(key==="dashboard")
			{
				oComponent.getRouter().navTo("Dashboard");       
			}
		},

		onMenuButtonPress : function() {
			var toolPage = this.byId("toolPage");

			toolPage.setSideExpanded(!toolPage.getSideExpanded());
		},
		
		onSaveWithItem: function(oEvent) {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			console.log(oVendorModel);
			if (oTempContract.validate()) {
				var oRequestPayload = oTempContract.getRequestPayload();
				oRequestPayload.Rcont = "1";
				var oModel = this.getOwnerComponent().getModel("HeaderSet");
				BusyIndicator.show(0);
				oModel.create("/HeaderSet", oRequestPayload, {
					success: function(oData) {
						BusyIndicator.hide();
						//MessageToast.show("Contract Saved Successfully");
						MessageBox.success("Contract No.: " + oData.Rcont + " created successfully");
						oTempContract.ContractNo =  oData.Rcont;
						oLookupModel.setProperty("/IsContractItemSaved", true);
						oLookupModel.refresh(true);
						oVendorModel.refresh(true);
					},
					error: function(oError) {
						BusyIndicator.hide();
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			}
			oVendorModel.refresh(true);
		},
		
		onPostAccrual: function(oEvent) {
			var that = this;
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			if (oTempContract.validateHeader() && oTempContract.Accrual.validate()) {
				var oRequestPayload = oTempContract.getAccrualRequestPayload();
				var dt = oRequestPayload.Aedtm;
				dt = dt.split("T");
				var dt1 = dt[0];
				var dt2 = dt[1];
				dt1 = dt1+"-01";
				oRequestPayload.Aedtm = dt1+"T"+dt2;
				var oModel = this.getOwnerComponent().getModel("RebatePostSet");
				BusyIndicator.show(0);
				oModel.create("/HeaderDocSet", oRequestPayload, {
					success: function(oData) {
						BusyIndicator.hide();
						MessageBox.success("Document No.: " + oData.Rcont + " posted successfully");
						oLookupModel.setProperty("/IsContractAccrualSaved", true);
						oLookupModel.refresh(true);
						oVendorModel.refresh(true);
						sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
					},
					error: function(oError) {
						BusyIndicator.hide();
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			}
			oVendorModel.refresh(true);
		},
		
		onPostSettlement: function() {
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			if (oTempContract.validateHeader() && oTempContract.Settlement.validate()) {
				var oRequestPayload = oTempContract.getSettlementRequestPayload();
				var oModel = this.getOwnerComponent().getModel("RebatePostSet");
				BusyIndicator.show(0);
				oModel.create("/HeaderDocSet", oRequestPayload, {
					success: function(oData) {
						BusyIndicator.hide();
						MessageBox.success("Document No.: " + oData.Rcont + " posted successfully");
						oLookupModel.setProperty("/IsContractSettlementSaved", true);
						oLookupModel.refresh(true);
						oVendorModel.refresh(true);
						sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
					},
					error: function(oError) {
						BusyIndicator.hide();
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			}
			oVendorModel.refresh(true);
		},
		onNavBack: function () {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("overview", true);
			}
		},
		editCode: function(){
			var oComponent = this.getOwnerComponent();
				oComponent.getRouter().navTo("ChangeContract");
		}
	});
});