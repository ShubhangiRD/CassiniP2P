sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/List",
	"sap/ui/core/routing/History",
	"sap/m/StandardListItem",
	"sap/m/Text",
	"sap/m/library",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"com/vSimpleApp/model/RebateConditionItem",
	"com/vSimpleApp/model/Scale",
	"com/vSimpleApp/model/Material",
	"com/vSimpleApp/model/EligibleData",
	"com/vSimpleApp/model/AccrualItem",
	"com/vSimpleApp/model/SettlementItem",
	"com/vSimpleApp/model/Contract",
	"com/vSimpleApp/service/dateServices",
	"com/vSimpleApp/model/Formatter"
], function(Controller, JSONModel, Filter, Button, Dialog, List, History, StandardListItem, Text, mobileLibrary, BusyIndicator, MessageToast, MessageBox, FilterOperator, AccrualItem) {
	"use strict";
	var DialogType = mobileLibrary.DialogType;
	// shortcut for sap.m.ButtonType
	var ButtonType = mobileLibrary.ButtonType;

	var oView, Controller;
	return Controller.extend("com.vSimpleApp.controller.MassAccrualPost", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf demonewcassini.view.MassAccrualPost
		 */
		onInit: function () {
			var oUserModel = this.getOwnerComponent().getModel("User");
			var sUsername = oUserModel.getProperty("/Username");
			if(sUsername === "") {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("Login");
			}
			//	oController = this;
			oView = this.getView();

			this._oPnl = this.byId("idPnl");

			//define the model

			var MassAgreement = new JSONModel();
			this.getView().setModel(MassAgreement, "AddAgreementAcc");

			var agreement = new JSONModel();
			this.getView().setModel(agreement, "Agreement");

			//get the all nature from json  and set the model
			var oCalculationType = new sap.ui.model.json.JSONModel();
			oCalculationType.loadData("utils/CalculationType.json");
			this.getView().setModel(oCalculationType, "CalculationType");

		},
		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.vSimpleApp.fragment.MassAgreement");
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},
		onOpenDialog: function () {
			this._getDialog().open();
		},
		addRow: function (arg) {
			this._data.Products.push({
				Name: '',
				size: ''
			});
			this.jModel.refresh(); //which will add the new record

		},
		mfunc: function()
			{
					var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oModel = this.getOwnerComponent().getModel("RebatePostSet");
			var oModel1 = this.getOwnerComponent().getModel("RebatePostSet");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			oTempContract.ContractNo = oVendorModel.oData.TempContract.Rcont;
				//var oRequestPayload = oTempContract.getAccrualRequestPayload();
				var oRequestPayload = new sap.ui.model.json.JSONModel();
			oRequestPayload.loadData(sap.ui.require.toUrl("com/cassini/Rebate/model") + "/AccrualModel.json", null, false);
			var test = oRequestPayload.oData;
			/*	oRequestPayload.Rcont = oVendorModel.oData.TempContract.Rcont,
				oRequestPayload.Vendorno = oVendorModel.oData.TempContract.Vendorno,
				oRequestPayload.Vendorname = oVendorModel.oData.TempContract.Vendorname,
				oRequestPayload.Compcode = oVendorModel.oData.TempContract.Compcode,
				oRequestPayload.Purorg = oVendorModel.oData.TempContract.Purorg,
				oRequestPayload.Currency = oVendorModel.oData.TempContract.Currency,
				oRequestPayload.Kdatb = oVendorModel.oData.TempContract.Kdatb,
				oRequestPayload.Kdate = oVendorModel.oData.TempContract.Kdate,
				oRequestPayload.Ernam = oVendorModel.oData.TempContract.Ernam,
				oRequestPayload.Erdat = oVendorModel.oData.TempContract.Erdat,
				oRequestPayload.Uname = oVendorModel.oData.TempContract.Uname,
				oRequestPayload.Aedtm = oVendorModel.oData.TempContract.Aedtm,
				oRequestPayload.Description = oVendorModel.oData.TempContract.Description,
				oRequestPayload.AccrualSet = oVendorModel.oData.TempContract.Accrual.AccrualSet;
				var dt = oRequestPayload.Aedtm;
				dt = dt.split("T");
				var dt1 = dt[0];
				var dt2 = dt[1];
				dt1 = dt1+"-01";*/
				//oRequestPayload.Aedtm = dt1+"T"+dt2;
				
				//BusyIndicator.show(0);
				oModel1.create("/HeaderDocSet", oRequestPayload, {
					success: function(oData1) {
						//BusyIndicator.hide();
						//MessageBox.success("Document No.: " + oData.Rcont + " posted successfully");
						MessageToast.show("Document No.: " + oData1.Rcont + " posted successfully");
						//sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
					},
					error: function(oError) {
						//BusyIndicator.hide();
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			},
		getAccrual: function(){
			BusyIndicator.show(0);
			var that = this;
			var ag = [];
			var oVendorModel = this.getOwnerComponent().getModel("Vendor");
			var oModel = this.getOwnerComponent().getModel("RebatePostSet");
			var oModel1 = this.getOwnerComponent().getModel("RebatePostSet");
			var oLookupModel = this.getOwnerComponent().getModel("Lookup");
			var oTempContract = oVendorModel.getProperty("/TempContract");
			var oRequestPayload = new sap.ui.model.json.JSONModel();
			oRequestPayload.loadData(sap.ui.require.toUrl("com/cassini/Rebate/model") + "/AccrualModel.json", null, false);
			var chk1 = oView.byId("perid").getValue();
			var chk2 = oView.byId("peridate").getValue();
			var chk3 = oView.byId("contid").getValue();
			var test = oRequestPayload.oData;
			var test1 = oRequestPayload.oData;
			var ag = [];
			var ag1 = [];
			var cnt = 0;
			var tmpcnt = 0;
			function exe()
			{
				var x = ag[cnt];
				test.Rcont = x;
							var len = test.AccrualSet.length;
							for(var j=0;j<len;j++)
							{
								test.AccrualSet[j].Rcont = x;
								test.AccrualSet[j].Assignment = x;
							}
				oModel1.create("/HeaderDocSet", test, {
					success: function(oData1) {
						cnt++;
						if(cnt<ag.length)
						{
							exe(cnt);	
						}
						//MessageBox.success("Document No.: " + oData.Rcont + " posted successfully");
						ag1.push(oData1.Rcont);
					
						//sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
					},
					error: function(oError) {
						//BusyIndicator.hide();
						var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
						MessageToast.show(errorMsg);
					}
				});
			}
			if(chk3.indexOf(",")!==-1)
			{
				var arr = chk3.split(",");
				for(var i = 0; i<arr.length; i++)
				{
					//setTimeout(function (){
					
					ag.push(arr[i]);	
						//ag1[i] = ag[i];
					//},3000);
				}
				exe();
			}
			else{
				if(chk3.indexOf(" ")!==-1)
				{
					chk3 = chk3.replace(" ","");
				}
					test.Rcont = chk3;
						var len = test.AccrualSet.length;
						for(var j=0;j<len;j++)
						{
							test.AccrualSet[j].Rcont = chk3;
							test.AccrualSet[j].Assignment = chk3;
						}
						//ag.push(test);
						oModel1.create("/HeaderDocSet", test, {
									success: function(oData1) {
										//BusyIndicator.hide();
										//MessageBox.success("Document No.: " + oData.Rcont + " posted successfully");
										MessageToast.show("Document No.: " + oData1.Rcont + " posted successfully");
										//sap.ui.getCore().byId("__xmlview4--tabid").setSelectedKey("item");
									},
									error: function(oError) {
										//BusyIndicator.hide();
										var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
										MessageToast.show(errorMsg);
									}
								});
			}
			setInterval(function (){
					if(ag.length == ag1.length && tmpcnt==0)
						{
							BusyIndicator.hide();
							MessageToast.show("Document No: " + ag1.toString() + " posted successfully");
							tmpcnt=1;
						}
						//ag1[i] = ag[i];
					},500);
			
		},
		
		OnInputFuction: function () {
			//  var MassAccru = oView.getModel("MassAgreement");
			var Accrual = oView.byId("mas").getValue();
			var res = Accrual.split(",");
			//	console.log(res);
			//	var StoreAgree = [];
			//	var Storing = new Array();
			var i = 0;
			for (var i = 0; i < res.length; i++) {
				Accrual.addContent(new sap.m.Text({
					text: "text"
				}));
				/*if (res[i] != "" && res[i].indexOf('-') > 1) {
		 Storing[j] = res[i].split('-');
    	j++;*/
			}
		},
		changeDateFormat: function (valDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var date = new Date(valDate);
			var dateStr = dateFormat.format(date);
			return (dateStr + "T00:00:00");
		},
		_onCreateEntrySuccess: function () {
			//shows the create entry when the data is posted and refresh the model
		//	sap.ui.core.BusyIndicator.hide();
		//	MessageBox.information("Accrual Document Number # " + oResponse.data.Message.substr(0, 10) + " successfully posted.");
		//	MessageToast.show("Successfully posted!" + oResponse.data.Message);
			MessageToast.show("Success");
			//refresh the values
			//oView.byId("perid").setValue("");
			//oView.byId("peridate").setValue("");
			//oView.byId("contid").setValue("");
		
		},
		_onCreateEntryError: function (oError) {
			//if getting the issue while posting the accruls call the _onCreateEntryError
			//sap.ui.core.BusyIndicator.hide();
			MessageBox.error(
				"Error creating entry: " + oError.statusCode + " (" + oError.statusText + ")", {
					details: oError.responseText
				}
			);
		},
		handleLiveChange: function (oEvent) {

			//	var oPage = this.getView().byId("ListDialog");
			const oInput = sap.ui.getCore().byId("inpuhear");
			const sValue = oInput.getValue();

			const res = sValue.split(" ");
			console.log(res);
			const stor = [];
			var ll = res.length;
			/*	var oInput1 = new sap.m.Input({
					id: 'inputHidden',
					value :ll,
					visible:false
					});*/
			var i = 0;
			for (i = 0; i < res.length; i++) {
				if (i === 0) {
					oInput.setValue(res[i]);
				} else {
					var oNewInput = new sap.m.Input({
						// sId: "inpuhear",
						// id : this.getView().createId("idExtensionInput"+i),
						value: res[i]

					});

					oEvent.getSource().getParent().addContent(oNewInput);
				}

			}
			//	onSaveAccrual: this.onSaveAccrual.bind(this);
			this.onSaveAccrual(res);
			return res[i];
		},
		onCreateItem: function (oEvent) {
			var massagreement = oView.getModel("Agreement");
			const oInput = sap.ui.getCore().byId("inpuhear");
			const sValue = oInput.getValue();

			const res = sValue.split(" ");
			console.log(res);
			const stor = [];
			var ll = res.length;
			/*	var oInput1 = new sap.m.Input({
					id: 'inputHidden',
					value :ll,
					visible:false
					});*/
			var i = 0;
			for (i = 0; i < res.length; i++) {
				if (i === 0) {
					oInput.setValue(res[i]);
				} else {
					var oNewInput = new sap.m.Input({
						// sId: "inpuhear",
						// id : this.getView().createId("idExtensionInput"+i),

						value: res[i]

					});
					var _oCcLayout = new sap.m.FlexBox({
						alignItems: "Center",
						justifyContent: "Center",
						items: [oNewInput]
					});
					//   this._oPnl.addContent();
					oEvent.getSource().getParent().addContent(_oCcLayout);

					var st = this.getView().byId("contid").setValue(res);
					console.log(st);

					this.oDialogFragment.close();
					this.oDialogFragment.destroy();
					this.oDialogFragment = null;
				}

			}
		},
		/*	getValue: function(){
		  debugger;
    		 var values = "";
			 var pnlDom = this._oPnl.getDomRef()
    		$(pnlDom).find('input').each(function(index, elem) {
        		 debugger;
        	 values += ", " + $(elem)[0].value;          
      });
      alert(values);
    }*/
		onSaveMassAcrual: function (evt) {
			var chk1 = oView.byId("perid").getValue();
			var chk2 = oView.byId("peridate").getValue();
			var chk3 = oView.byId("contid").getValue();
			if(chk1=="" || chk2=="" || chk3=="" || chk3==" ")
			{
				alert("Please enter all the values");
				return false;
			}
			else{ 
				
			//onPostAccrual is used to post the Accrual data to contS model
			
			//var vdocdate = oView.byId("DP2").getValue();
			//var vdocdate1 = new Date(vdocdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
			var vpostdate = oView.byId("peridate").getValue();
			var fpostdate = this.changeDateFormat(vpostdate);
			var periodd = oView.byId("perid").getValue();
			var fakeperiod = periodd.substr(0, 2)+"/01/2020";
			var ldate = new Date(fakeperiod);
			var lastDay = new Date(ldate.getFullYear(), ldate.getMonth() + 1, 0);
			var flastdate = this.changeDateFormat(lastDay);
			var currdate = new Date();
			currdate = this.changeDateFormat(currdate);
			if(fpostdate > currdate)
			{
				alert("Posting date should be less than current date!");
				return false;
			}
			//var vpostdate1 = new Date(vpostdate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
			var multiconts = oView.byId("contid").getValue();
			var divcont = multiconts.split(",");
			var i = 0;                  //  set your counter to 1
			var oModelCreate = this.getView().getModel("contS");
			var that = this;
			function myLoop() {         //  create a loop function
			 // setTimeout(function() {   //  call a 3s setTimeout when the loop is called
			    //console.log(divcont[i]);
				var oEntry1 = {};
				oEntry1.Contractno = divcont[i]; //"CN0000000278";//oView.getModel("AgreementN").getProperty("/ContractNo");
				oEntry1.Period = periodd.substr(0, 2); //"08";//oView.byId("postingPerd").getValue().substr(0, 2);
				oEntry1.Message = "";
				oEntry1.Docdate =  flastdate;//"2020-08-31T00:00:00";
				oEntry1.Postdate = fpostdate;//"2020-08-31T00:00:00";
				console.log(oEntry1);
			//	var oContext = oModelCreate.create("/AccrualsSet", oEntry1, {
		
					 oModelCreate.create("/AccrualsSet", oEntry1, {
			
					success: MessageToast.show(i+1+" of "+divcont.length+" completed"),//that._onCreateEntrySuccess.bind(that),
					error: that._onCreateEntryError.bind(that)
				}); 
			    i++;                    //  increment the counter
			    if (i < divcont.length) {           //  if the counter < 10, call the loop function
			      myLoop();             //  ..  again which will trigger another 
			    }                       //  ..  setTimeout()
			 // }, 3000)
			}
			
			myLoop(); 
		}
			/*for(var i = 0; i < divcont.length; i++)
			{ 
				//console.log(divcont[i]);
				var oEntry1 = {};
				oEntry1.Contractno = divcont[i]; //"CN0000000278";//oView.getModel("AgreementN").getProperty("/ContractNo");
				oEntry1.Period = fpostdate.substr(5, 2); //"08";//oView.byId("postingPerd").getValue().substr(0, 2);
				oEntry1.Message = "";
				oEntry1.Docdate =  flastdate;//"2020-08-31T00:00:00";
				oEntry1.Postdate = fpostdate;//"2020-08-31T00:00:00";
				console.log(oEntry1);
			//	var oContext = oModelCreate.create("/AccrualsSet", oEntry1, {
					 oModelCreate.create("/AccrualsSet", oEntry1, {
			
					success: console.log("success"),//this._onCreateEntrySuccess.bind(this),
					error: console.log("fail")//this._onCreateEntryError.bind(this)
				});
			}*/
			//console.log(multiconts);
		
/*
			var massagreement = oView.getModel("Agreement");
			var vPeriod = oView.byId("perid").getValue();
			var vPerioddate = oView.byId("peridate").getValue();
			var vContid = oView.byId("contid").getValue();
			massagreement.getData().vPeriod = vPeriod;
			massagreement.getData().vPerioddate = vPerioddate;
			massagreement.getData().vContid = vContid;
			const IdLenght = vContid.split(",");
			console.log(IdLenght);

			//define the arrarys
			var itemData = [];
			var oRows = IdLenght.length;
			for (var i = 0; i < oRows; i++) {
				var l_ContractNo = IdLenght[i];
				itemData.push({
					ContractNo: l_ContractNo
				});

			}
			//define the array/
			var oEntry1 = {};
			//bind the values to array
		//		var vPeriod = oView.byId("perid").getValue();
		
			oEntry1.vPeriod = massagreement.getData().vPeriod;
			oEntry1.vPerioddate = massagreement.getData().vPerioddate;
			oEntry1.CONT_ACCRUAL_ITEM = itemData;
			var oModelCreate = this.getView().getModel("contS");
			oModelCreate.create("/AccrualsSet", oEntry1, {
				method: "POST",

				success: this._onCreateEntrySuccess.bind(this),
				error: this._onCreateEntryError.bind(this)
			});
					*/
		},
		

		onSaveAccrual: function (res) {
			console.log(res);

			var st = this.getView().byId("contid").setValue(res);
			var s = st;

			/*	var arr=[];
				for (var i = 0; i < res.length; i++) {
			
					this.getView().byId("contid").setValue(res[i]);
				
				}
				console.log(res);
			*/

			/*const oInput2 = sap.ui.getCore().byId("inpuhear");
			const sValue = oInput2.getValue();	*/
			//	const oInput1 = sap.ui.getCore().byId("inputHidden");
			//	const sValue1 = oInput1.getValue();

			/*	const res = sValue.split(" ");
				console.log(res);*/
			//	const stor = [];

			//	var GetValue = 	this.handleLiveChange();
			/*	var oInputAll = [];
				
				for(var i=0 ; i<oInputAll.length; i++){
					
					var s= oInputAll[i];
					
				}*/

		},

		OnCancelMassAcrual: function (event) {
			//clear all the selected values.
			MessageToast.show("Cancel Acrrual");
			oView.byId("perid").setValue("");
			oView.byId("peridate").setValue("");
			oView.byId("contid").setValue("");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("appHome");

		},

		onResponsivePaddingDialog: function () {
			if (!this.responsivePaddingDialog) {
				this.responsivePaddingDialog = new Dialog({
					title: "On SAP Quartz themes, the padding will adjust based on the width of the Dialog",
					contentWidth: "680px",
					contentHeight: "450px",
					resizable: true,
					draggable: true,
					subHeader: new sap.m.OverflowToolbar({
						content: new Text({
							text: "Experiment with the responsive padding by resizing this Dialog."
						})
					}),

					/*	content: new List({
							items: {
								path: "/ProductCollection",
								template: new StandardListItem({
									title: "{Name}",
									counter: "{Quantity}"
								})
							}
						}),*/
					beginButton: new Button({
						type: ButtonType.Emphasized,
						text: "OK",
						press: function () {
							this.responsivePaddingDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Close",
						press: function () {
							this.responsivePaddingDialog.close();
						}.bind(this)
					})
				});

				// Enable responsive padding by adding the appropriate classes to the control
				this.responsivePaddingDialog.addStyleClass(
					"sapUiResponsivePadding--content sapUiResponsivePadding--header sapUiResponsivePadding--footer sapUiResponsivePadding--subHeader"
				);

				//to get access to the global model
				this.getView().addDependent(this.responsivePaddingDialog);
			}

			this.responsivePaddingDialog.open();
		},
		addMultiple: function () {
			if (!this.oDialogFragment) {

				this.oDialogFragment = sap.ui.xmlfragment("com.vSimpleApp.fragment.MassAgreement", this);
				var i18nModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});

				this.oDialogFragment.setModel(i18nModel, "i18n");
			}
			this.oDialogFragment.open();
		},
		onSave: function (oEvent) {
			var msg = 'Saved successfully';
			MessageToast.show(msg);
			this.oDialogFragment.close();
			this.oDialogFragment.destroy();
			this.oDialogFragment = null;
		},
		onClose: function () {
			//	oView.byId("inpuhear").setValue(" ");
			this.oDialogFragment.close();
			this.oDialogFragment.destroy();
			this.oDialogFragment = null;
		},
		onCloseFragment: function () {
			this.oDialogFragment.close();
		},
		navAgreement: function () {
			//	this.getRouter().initialize();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("AddmultipleAgreement");

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
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.cassini.Rebate.view.MassAccrualPost
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.cassini.Rebate.view.MassAccrualPost
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf demonewcassini.view.MassAccrualPost
		 */
		//	onExit: function() {
		//
		//	}


	});

});