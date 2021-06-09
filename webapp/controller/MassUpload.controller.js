sap.ui.define([
	"jquery.sap.global",
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
], function(jQuery, Controller, JSONModel, Filter, Button, Dialog, List, History, StandardListItem, Text, mobileLibrary, BusyIndicator, MessageToast, MessageBox, FilterOperator, AccrualItem) {
	"use strict";
	var oView, oController, oComponent;
	return Controller.extend("com.vSimpleApp.controller.MassUpload", {

		onInit: function () {
			var oUserModel = this.getOwnerComponent().getModel("User");
			var sUsername = oUserModel.getProperty("/Username");
			if(sUsername === "") {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("Login");
			}
			oController = this;
			oView = this.getView();
			oComponent = this.getOwnerComponent();

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("utils/Massupload.json");
			this.getView().setModel(oModel, "MassuploadModel");

			/*	var sPath = jQuery.sap.getModulePath("demonewcassini.data", "/Massupload.json");
			var oModel = new JSONModel(sPath);
			this.getView().setModel(oModel, "MassuploadModel");
	*/
			var model = new JSONModel({
				items: []
			});
			this.getView().setModel(model, "UploadModel");

			//this.getRouter().getRoute("massupload").attachPatternMatched(this._onObjectMatched, this);
		},
			getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;

			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Dashboard", {}, true /*no history*/ );
			}
		},
		_onObjectMatched: function (oEvent) {
			var globalKeys = oComponent.getModel("GlobalKeys");
			globalKeys.getData().page = "massupload";
			globalKeys.refresh(true);

			$("#nav-icon1").addClass("back");
			$("#nav-icon1").removeClass("open");
		},

		onUpload: function (e) {
			BusyIndicator.show(0);
			var feda = [];
			var xldata = {};
				var agdata = [];
				var tt = [];
				var agl = {};
				var flag = 1;
			//this.getView().byId("idTable").setVisible(true);
			//this.getView().byId("idTable").getColumns()[0].setVisible(false);
			var fU = this.getView().byId("idfileUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			console.log(file);
			var filename = file.name;
			if(filename.indexOf("contract")!=-1)
			{
				console.log("its a contract template");
					// Create a File Reader object
	var reader = new FileReader();
	var t = this;
	var cntr = 1;
	var tcntr = [];
	var strag = [];
	var tmpcnt = 0;
	var Rate01Set = [];
	var HeaderToMaterial = [];
	var scalecnt = 0;
	reader.onload = function(e) {
	
					var myFunction=function(){
					var agreement = [];
					
					var newArray = {}; //new Array();
			  	
					var x = file; //document.getElementById("myFile");
					    //console.log(x.files[0]);
					  
					  //var reader = new FileReader();
					 // reader.onload = function(e) {
				    var data = e.target.result;
				   
				    var workbook = XLSX.read(data, {type: 'binary' });
					
					 //   console.log(workbook);
					 var first_sheet_name = workbook.SheetNames[0];
					  /* Get worksheet */
					 var worksheet = workbook.Sheets[first_sheet_name];
					 xldata = XLSX.utils.sheet_to_json(worksheet,{raw:true});
					 console.log(xldata);
			 
			}; 
				myFunction();
				 
				function onlyUnique(value, index, self) { 
			    return self.indexOf(value) === index;
			} 
								var uniqueAgCount = [];
								for (var iRowIndex = 0; iRowIndex < xldata.length; iRowIndex++) {
										uniqueAgCount.push(xldata[iRowIndex].VENDORNO);
									}
									
								uniqueAgCount = uniqueAgCount.filter( onlyUnique );
								tcntr = uniqueAgCount;
								console.log(uniqueAgCount);
								//return false;
								for (var j = 0;j < uniqueAgCount.length; j++)
								{ var HeaderToItem = [];
										var agreement = {};
										var agcnt = 1;
									for(var i = 0; i < xldata.length; i++)
									{
										var x1 = xldata[i].VENDORNO;
										if(x1=="" || x1==undefined)
										{
											alert("Vendor number field connot be empty");
											flag = 0;
											return false;
										}
										var x2 = uniqueAgCount[j];
										console.log(x1+"*****"+x2);
										if(x1==x2)
										{ 	
											if(agcnt==1)
											{
													var vFrom = "2020-01-01T00:00:00";
													var vTo = "2020-12-31T00:00:00";
													//agreement.ValidFrom = vFrom;
													//agreement.ValidTo = vTo;
												var vid = xldata[i].VENDORNO;
												var sg = xldata[i].PURORG;
												agreement.Rcont = "1";
												agreement.Vendorno = vid.toString();
												agreement.Vendorname = "";//xldata[i].CUSTOMER_NAME;
												agreement.Purorg = sg.toString();
												agreement.Compcode = "0001";
												agreement.Currency = xldata[i].CURR;
												agreement.Kdatb = xldata[i].KDATB; //xldata.VALID_FROM;
												agreement.Kdate = xldata[i].KDATE; //xldata.VALID_TO;
												agreement.Aedtm = vFrom;
												agreement.Ernam = xldata[i].ERNAM;
												agreement.Erdat = xldata[i].ERDAT;
												agreement.Description = xldata[i].DESC;
												agreement.Uname = "prasad";
										//push the items to entityset		
											}
										//	else{
													var scale = xldata[i].SCALE;
													var r =  xldata[i].RATE;
													if(r=="" || r==undefined)
													{
														alert("Rate field connot be empty");
														flag = 0;
														return false;
														
													}
													var item =  xldata[i].ITEM;//agreement.getProperty("/MergeList/" + iRowIndex + "/FlexibleGrpNo");
													item = item.toString();
													if(item=="" || item==undefined)
													{
														alert("Item number field connot be empty");
														flag = 0;
														return false;
														
													}
													
													
													var rtype = xldata[i].RTYPE;//"LUMP SUM";//agreement.getProperty("/MergeList/" + iRowIndex + "/TopazAccID");
													//var l_Settlement =  xldata[i].SETTLEMENT_METHOD;//agreement.getProperty("/MergeList/" + iRowIndex + "/SettleMentID");
													if(rtype=="" || rtype==undefined)
													{
														alert("Rebate type field connot be empty");
														flag = 0;
														return false;
													}
													var rate = r.toString();//agreement.getProperty("/MergeList/" + iRowIndex + "/Rate");
													if(rate=="" || rate==undefined)
													{
														alert("Rate field connot be empty");
														flag = 0;
														return false;
													}
													var base = xldata[i].BASE;//agreement.getProperty("/MergeList/" + iRowIndex + "/EstimatedSales");
													var ikdatb = xldata[i].IKDATB;//agreement.getProperty("/MergeList/" + iRowIndex + "/EstimatedVol");
													var ikdate = xldata[i].IKDATE;//agreement.getProperty("/MergeList/" + iRowIndex + "/UnitoFMesaure");
													if(scale=="x")
													{ scale = "X";
														scalecnt++;
														var spend = xldata[i].SPEND;
														spend = spend.toString();
														Rate01Set.push({
															Rcont: "",
															Spend: spend,
															Item: item,
															Rate: rate,
															Rtype: rtype,
															Srno: scalecnt.toString(),
															Scale : "X"
								
														});
													
													}else { scale = ""; }
														
														HeaderToItem.push({
														Item: item,
														Scale: scale,
														Rate: rate,
														Rtype: rtype,
														Base: base,
														Kdatb: xldata[i].IKDATB,
														Kdate: xldata[i].IKDATE,
														Rcont: ""
							
													});	
													
													
													
										//	}
											agcnt = 0;
									agreement.HeaderToItem = HeaderToItem;
									agreement.Rate01Set = Rate01Set;
									agreement.HeaderToMaterial = HeaderToMaterial;
										}
										
									}
									agdata.push(agreement);
									if(flag!==0)
									{
										//alert(flag);
										testy(agreement);
									}
									
								}
								
				//console.log(agdata);
			
				};
				reader.readAsBinaryString(file);
				var oModel = this.getOwnerComponent().getModel("HeaderSet");
				function testy(qq)
				{
					var mcnt = qq.HeaderToItem;
					var mxstr = [];
					var mxstr2 = [];
					var tmp = qq.HeaderToItem;
					for(var y = 0;y<tmp.length;y++)
					{
						if(tmp[y].Scale!=="X")
						mxstr2.push(tmp[y]);	
					}
					
					for(var x = 0; x < mcnt.length; x++)
					{
						if(mcnt[x].Scale=="X")
						{
							mxstr.push(mcnt[x].Rate);
						}
					}
					var max = Math.max.apply(Math,mxstr);
					var mcnt = $.grep(mcnt, function(e){ 
					     return e.Rate == max; 
					});
					mxstr2.push(mcnt[0]);
					qq.HeaderToItem = mxstr2;
					
									oModel.setHeaders({
										  "Content-Type" : "application/json"
										  });
								setTimeout(function (){
									oModel.create("/HeaderSet", qq, {
										contentType: "application/json",
										success: function(oData) {
											//BusyIndicator.hide();
											//MessageToast.show("Contract Saved Successfully");
											strag.push(oData.Rcont);
											
											//oTempContract.ContractNo =  oData.Rcont;
											//oLookupModel.setProperty("/IsContractItemSaved", true);
											//oLookupModel.refresh(true);
											//oVendorModel.refresh(true);
										},
										error: function(oError) {
											//BusyIndicator.hide();
											var errorMsg = oError.statusCode + " " + oError.statusText + ":" + JSON.parse(oError.responseText).error.message.value;
											MessageToast.show(errorMsg);
										}
									});	
								}, 3000);
					cntr++;
				}

				setInterval(function (){
					if(tcntr.length == strag.length && tmpcnt == 0)
						{
							BusyIndicator.hide();
							var tostr = strag.toString();
							var msg = "Contract No.: " + tostr + " created successfully";
							MessageToast.show(msg);
							tmpcnt=1;
						}
				},500);
			/*	$.ajax({
				    	url: "/sap/opu/odata/sap/ZRBT_CONTRACT_MUPLOAD_SRV/CONTRACT_HEADERSet",
				    	type: "POST",
				    	data: agdata,
			        	cache: false,
			        	crossDomain: true,
				    	//contentType : "application/json",
				    	//dataType : "json",
			            async: false,
			            success : function(data1) {
			                console.log(data1);
			               // console.log(textStatus);
			               // console.log(jqXHR);
			            }
				    })*/
	
			}
			else
			if(filename.indexOf("product")!=-1)
			{
				var reader = new FileReader();
	var t = this;
	
	reader.onload = function(e) {
	
					var myFunction=function(){
					var agreement = [];
					var newArray = {}; //new Array();
			  	
					var x = file; //document.getElementById("myFile");
					    //console.log(x.files[0]);
					  
					  //var reader = new FileReader();
					 // reader.onload = function(e) {
				    var data = e.target.result;
				   
				    var workbook = XLSX.read(data, {type: 'binary' });
					
					 //   console.log(workbook);
					 var first_sheet_name = workbook.SheetNames[0];
					  /* Get worksheet */
					 var worksheet = workbook.Sheets[first_sheet_name];
					 xldata = XLSX.utils.sheet_to_json(worksheet,{raw:true});
					 console.log(xldata);
			 
			}; 
				myFunction();
				 
				function onlyUnique(value, index, self) { 
			    return self.indexOf(value) === index;
			} 
								var uniqueAgCount = [];
								for (var iRowIndex = 0; iRowIndex < xldata.length; iRowIndex++) {
										uniqueAgCount.push(xldata[iRowIndex].HDESCRIPTION);
									}
									
								uniqueAgCount = uniqueAgCount.filter( onlyUnique );
								console.log(uniqueAgCount);
								//return false;
								for (var j = 0;j < uniqueAgCount.length; j++)
								{ var itemData = [];
										var agreement = {};
										var agcnt = 1;
									for(var i = 0; i < xldata.length; i++)
									{
										var x1 = xldata[i].HDESCRIPTION;
										if(x1=="" || x1==undefined)
										{
											alert("Header Description field connot be empty");
											flag = 0;
											return false;
										}
										var x2 = uniqueAgCount[j];
										console.log(x1+"*****"+x2);
										if(x1==x2)
										{ 	
											if(agcnt==1)
											{
												agreement.Createdby = "DIPENDEV";
												agreement.Description = xldata[i].HDESCRIPTION; //this.getView().byId("grpDesc").getValue();
												 var d = new Date();
												 var n = d.toISOString();
												 n = n.split(".");
												//agreement.Createdon = n[0];//new Date().toLocaleDateString();
												//console.log(n[0]);
												//return false;
												/*	var vFrom = "2020-01-01T00:00:00";
													var vTo = "2020-12-31T00:00:00";
													//agreement.ValidFrom = vFrom;
													//agreement.ValidTo = vTo;
												var custid = xldata[i].CUSTOMER_NO;
												var sg = xldata[i].SALESORG;
												agreement.Custid = custid.toString();
												agreement.Custname = xldata[i].CUSTOMER_NAME;
												agreement.Salesorg = sg.toString();
												agreement.Country = xldata[i].COUNTRY;
												agreement.Currency = xldata[i].CURRENCY;
												agreement.ValidFrom = vFrom; //xldata.VALID_FROM;
												agreement.ValidTo = vTo; //xldata.VALID_TO;
												agreement.Division = xldata[i].DIVISION;
												agreement.Dchannel = xldata[i].DCHANNEL;
												agreement.Createdby = "DIPENDEV";*/
										//push the items to entityset		
											}
										//	else{
														var l_Spras = "E";
														var l_Prodh1 = xldata[i].MAINGROUP;//oModel.getProperty("/" + iRowIndex + "/Prodh1");
														var l_Prodh2 = xldata[i].GROUP;//oModel.getProperty("/" + iRowIndex + "/Prodh2");
														var l_Prodh3 = xldata[i].SUBGROUP;//oModel.getProperty("/" + iRowIndex + "/Prodh3");
														var l_Prodh4 = "";//oModel.getProperty("/" + iRowIndex + "/Prodh4");
														var l_Vtext1 = "";//oModel.getProperty("/" + iRowIndex + "/Vtext1");
														var l_Vtext2 = "";//oModel.getProperty("/" + iRowIndex + "/Vtext2");
														var l_Vtext3 = "";//oModel.getProperty("/" + iRowIndex + "/Vtext3");
														var l_Vtext4 = "";//oModel.getProperty("/" + iRowIndex + "/Vtext4");
														var l_material = xldata[i].MATERIAL;//oModel.getProperty("/" + iRowIndex + "/Matnr");
														if(l_Prodh1==undefined && l_material==undefined)
															{
																alert("Main Group field and Material field connot be empty at the same time");
																flag = 0;
																return false;
															}
														var l_Bname = "DIPENDEV";
													var l_date = new Date().toLocaleDateString();
												
														itemData.push({
															Prodh1: l_Prodh1,
															Prodh2: l_Prodh2,
															Prodh3: l_Prodh3,
															Prodh4: l_Prodh4,
															Vtext1: l_Vtext1,
															Vtext2: l_Vtext2,
															Vtext3: l_Vtext3,
															Vtext4: l_Vtext4,
															Matnr: l_material,
															Spras: l_Spras,
															Bname: l_Bname
													
														});
														
														//var agreement = {};

			
			agreement.PROD_HEADERTOPROD_HIERARCHY = itemData;
										//	}
											agcnt = 0;
								
										}
									}
									agdata.push(agreement);
									if(flag!==0)
									{
										//alert(flag);
										//alert(x1+"*****"+x2);
										testy(agreement);
									}
								}
								
				//console.log(agdata);
			
				};
				reader.readAsBinaryString(file);
					//method for creating the prod
					var oModelCreate = this.getView().getModel("prodH");
					//this.getView().getModel("UpdateModel").setProperty("/currentStat",false);
									 
									// var OperationModel = this.getView().getModel("OperationModel");
								//OperationModel.setProperty("/standalone", true);
									//OperationModel.setProperty("/save", false);
				function testy(qq)
				{
						
										oModelCreate.setHeaders({
										  "Content-Type" : "application/json"
										  });
										
									oModelCreate.create("/PROD_HEADERSet", qq, {
										success: console.log("success"),
										error: console.log("error")
									});
									
									 
				}	
				
				
				
				
				
				/* *********************************************** prod code starts *********************************************** */
				console.log("its a product template");
		/*	var sGrpDescI = this.getView().byId("grpDesc");
			if(sGrpDescI.getValue()){
			//Create all the records added to table via Json model
			var oTable = this.getView().byId("ColletionItems");
			// Get Items of the Table
			var oModel = oComponent.getModel("productHierarchySets");
			var aItems = oTable.getItems();
			// Define an empty Array
			var itemData = [];

			for (var iRowIndex = 0; iRowIndex < aItems.length; iRowIndex++) {
			
			}*/
			
			
		
			
			 
		/*	} else {
				this.getView().byId("grpDesc").setValueState(sap.ui.core.ValueState.Error);
				MessageToast.show("Description is Mandatory");
			  }*/
			}
			//return false;

		},
		onSavePress: function () {
			this.getView().byId("idTable").getColumns()[0].setVisible(true);
		},
		onCopyExcel: function () {
			// create value help dialog
			if (!this._flexHelpDialog) {
				this._flexHelpDialog = sap.ui.xmlfragment(
					"com.vSimpleApp.fragment.UploadFile",
					this
				);
				this.getView().addDependent(this._flexHelpDialog);
			}
			this._flexHelpDialog.open();

		}
	});

});