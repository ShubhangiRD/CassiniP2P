sap.ui.define([
	"com/vSimpleApp/model/BaseObject"
	], function(BaseObject){
		"use strict";
		
		return BaseObject.extend("com.vSimpleApp.model.Address",{
			constructor:function(data){
				BaseObject.call(this);
				if(data){
					this.BankAcct = data.BankAcct;
					this.BankCtry = data.BankCtry;
					this.BankKey = data.BankKey;
					this.BankRef = data.BankRef;
					this.City = data.City;
					this.CompCode = data.CompCode;
					this.CompanyCode = data.CompanyCode;
					this.Country = data.Country;
					this.Countryiso = data.Countryiso;
					this.CtrlKey = data.CtrlKey;
					this.District = data.District;
					this.Formofaddr = data.Formofaddr;
					this.Id = data.Id;
					this.Langu = data.Langu;
					this.LanguIso = data.LanguIso;
					this.Message = data.Message;
					this.MessageV1 = data.MessageV1;
					this.MessageV2 = data.MessageV2;
					this.MessageV3 = data.MessageV3;
					this.MessageV4 = data.MessageV4;
					this.Name = data.Name;
					this.Name2 = data.Name2;
					this.Number = data.Number;
					this.PartnerBk = data.PartnerBk;
					this.PaymentMethods = data.PaymentMethods;
					this.PoBox = data.PoBox;
					this.PobxCty = data.PobxCty;
					this.PostlCode = data.PostlCode;
					this.Region = data.Region;
					this.Street = data.Street;
					this.Telephone = data.Telephone;
					this.Telephone2 = data.Telephone2;
					this.Type = data.Type;
					this.Vendor = data.Vendor;
					this.Vendorno = data.Vendorno;
				}
			},
			getModel:function(){
				return this.model;
			}
		});
	});  