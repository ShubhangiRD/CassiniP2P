sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel"
], function(Object, JSONModel) {
	"use strict";
	return Object.extend("com.vSimpleApp.model.PODetail", {
		constructor: function(oData) {

			this.Abgru = (oData && oData.Abgru) ? oData.Abgru : "";
			this.Absgr = (oData && oData.Absgr) ? oData.Absgr : "";
			this.Addnr = (oData && oData.Addnr) ? oData.Addnr : "";
			this.Adrnr = (oData && oData.Adrnr) ? oData.Adrnr : "";
			this.Angdt = (oData && oData.Angdt) ? oData.Angdt : "";
			this.Angnr = (oData && oData.Angnr) ? oData.Angnr : "";
			this.AurelAllow = (oData && oData.AurelAllow) ? oData.AurelAllow : "";
			this.Ausnr = (oData && oData.Ausnr) ? oData.Ausnr : "";
			this.Autlf = (oData && oData.Autlf) ? oData.Autlf : "";
			this.Bedat = (oData && oData.Bedat) ? oData.Bedat : "";
			this.Bnddt = (oData && oData.Bnddt) ? oData.Bnddt : "";
			this.Bsakz = (oData && oData.Bsakz) ? oData.Bsakz : "";
			this.Bsart = (oData && oData.Bsart) ? oData.Bsart : "";
			this.Bstyp = (oData && oData.Bstyp) ? oData.Bstyp : "";
			this.BudgType = (oData && oData.BudgType) ? oData.BudgType : "";
			this.Bukrs = (oData && oData.Bukrs) ? oData.Bukrs : "";
			this.Bwbdt = (oData && oData.Bwbdt) ? oData.Bwbdt : "";
			this.CheckType = (oData && oData.CheckType) ? oData.CheckType : "";
			this.ConDistrLev = (oData && oData.ConDistrLev) ? oData.ConDistrLev : "";
			this.ConOtbReq = (oData && oData.ConOtbReq) ? oData.ConOtbReq : "";
			this.ConPrebookLev = (oData && oData.ConPrebookLev) ? oData.ConPrebookLev : "";
			this.ContractAllow = (oData && oData.ContractAllow) ? oData.ContractAllow : "";
			this.DelperAllow = (oData && oData.DelperAllow) ? oData.DelperAllow : "";
			this.Description = (oData && oData.Description) ? oData.Description : "";
			this.Dpamt = (oData && oData.Dpamt) ? oData.Dpamt : "";
			this.Dpdat = (oData && oData.Dpdat) ? oData.Dpdat : "";
			this.Dppct = (oData && oData.Dppct) ? oData.Dppct : "";
			this.Dptyp = (oData && oData.Dptyp) ? oData.Dptyp : "";
			this.Ebeln = (oData && oData.Ebeln) ? oData.Ebeln : "";
			this.EindtAllow = (oData && oData.EindtAllow) ? oData.EindtAllow : "";
			this.Ekgrp = (oData && oData.Ekgrp) ? oData.Ekgrp : "";
			this.EkgrpAllow = (oData && oData.EkgrpAllow) ? oData.EkgrpAllow : "";
			this.Ekorg = (oData && oData.Ekorg) ? oData.Ekorg : "";
			this.EqEindt = (oData && oData.EqEindt) ? oData.EqEindt : "";
			this.EqWerks = (oData && oData.EqWerks) ? oData.EqWerks : "";
			this.Ernam = (oData && oData.Ernam) ? oData.Ernam : "";
			this.Exnum = (oData && oData.Exnum) ? oData.Exnum : "";
			this.Fixpo = (oData && oData.Fixpo) ? oData.Fixpo : "";
			this.FixpoAllow = (oData && oData.FixpoAllow) ? oData.FixpoAllow : "";
			this.ForceCnt = (oData && oData.ForceCnt) ? oData.ForceCnt : "";
			this.ForceId = (oData && oData.ForceId) ? oData.ForceId : "";
			this.Frggr = (oData && oData.Frggr) ? oData.Frggr : "";
			this.Frgke = (oData && oData.Frgke) ? oData.Frgke : "";
			this.Frgrl = (oData && oData.Frgrl) ? oData.Frgrl : "";
			this.Frgsx = (oData && oData.Frgsx) ? oData.Frgsx : "";
			this.Frgzu = (oData && oData.Frgzu) ? oData.Frgzu : "";
			this.Gwldt = (oData && oData.Gwldt) ? oData.Gwldt : "";
			this.Handoverloc = (oData && oData.Handoverloc) ? oData.Handoverloc : "";
			this.HierarchyExists = (oData && oData.HierarchyExists) ? oData.HierarchyExists : "";
			this.Ihran = (oData && oData.Ihran) ? oData.Ihran : "";
			this.Ihrez = (oData && oData.Ihrez) ? oData.Ihrez : "";
			this.Inco1 = (oData && oData.Inco1) ? oData.Inco1 : "";
			this.Inco2 = (oData && oData.Inco2) ? oData.Inco2 : "";
			this.Kalsm = (oData && oData.Kalsm) ? oData.Kalsm : "";
			this.Kdatb = (oData && oData.Kdatb) ? oData.Kdatb : "";
			this.Kdate = (oData && oData.Kdate) ? oData.Kdate : "";
			this.KeyId = (oData && oData.KeyId) ? oData.KeyId : "";
			this.KeyIdAllow = (oData && oData.KeyIdAllow) ? oData.KeyIdAllow : "";
			this.Knumv = (oData && oData.Knumv) ? oData.Knumv : "";
			this.Konnr = (oData && oData.Konnr) ? oData.Konnr : "";
			this.Kornr = (oData && oData.Kornr) ? oData.Kornr : "";
			this.Ktwrt = (oData && oData.Ktwrt) ? oData.Ktwrt : "";
			this.Kufix = (oData && oData.Kufix) ? oData.Kufix : "";
			this.Kunnr = (oData && oData.Kunnr) ? oData.Kunnr : "";
			this.Lands = (oData && oData.Lands) ? oData.Lands : "";
			this.Lblif = (oData && oData.Lblif) ? oData.Lblif : "";
			this.LegalContract = (oData && oData.LegalContract) ? oData.LegalContract : "";

			this.Lifnr = (oData && oData.Lifnr) ? oData.Lifnr : "";
			this.Lifre = (oData && oData.Lifre) ? oData.Lifre : "";
			this.Llief = (oData && oData.Llief) ? oData.Llief : "";
			this.Loekz = (oData && oData.Loekz) ? oData.Loekz : "";
			this.Logsy = (oData && oData.Logsy) ? oData.Logsy : "";
			this.Lphis = (oData && oData.Lphis) ? oData.Lphis : "";
			this.Lponr = (oData && oData.Lponr) ? oData.Lponr : "";
			this.LtsnrAllow = (oData && oData.LtsnrAllow) ? oData.LtsnrAllow : "";
			this.Memory = (oData && oData.Memory) ? oData.Memory : "";
			this.Memorytype = (oData && oData.Memorytype) ? oData.Memorytype : "";
			this.MsrId = (oData && oData.MsrId) ? oData.MsrId : "";
			this.OtbCondType = (oData && oData.OtbCondType) ? oData.OtbCondType : "";
			this.OtbCurr = (oData && oData.OtbCurr) ? oData.OtbCurr : "";
			this.OtbLevel = (oData && oData.OtbLevel) ? oData.OtbLevel : "";
			this.OtbReason = (oData && oData.OtbReason) ? oData.OtbReason : "";
			this.OtbResValue = (oData && oData.OtbResValue) ? oData.OtbResValue : "";
			this.OtbSpecValue = (oData && oData.OtbSpecValue) ? oData.OtbSpecValue : "";
			this.OtbStatus = (oData && oData.OtbStatus) ? oData.OtbStatus : "";
			this.OtbValue = (oData && oData.OtbValue) ? oData.OtbValue : "";
			this.Pincr = (oData && oData.Pincr) ? oData.Pincr : "";
			this.PohfType = (oData && oData.PohfType) ? oData.PohfType : "";
			this.Procstat = (oData && oData.Procstat) ? oData.Procstat : "";
			this.PstypAllow = (oData && oData.PstypAllow) ? oData.PstypAllow : "";
			this.ReasonCode = (oData && oData.ReasonCode) ? oData.ReasonCode : "";
			this.ReleaseDate = (oData && oData.ReleaseDate) ? oData.ReleaseDate : "";
			this.RelocId = (oData && oData.RelocId) ? oData.RelocId : "";
			this.RelocSeqId = (oData && oData.RelocSeqId) ? oData.RelocSeqId : "";
			this.Reswk = (oData && oData.Reswk) ? oData.Reswk : "";
			this.Retpc = (oData && oData.Retpc) ? oData.Retpc : "";
			this.Rettp = (oData && oData.Rettp) ? oData.Rettp : "";
			this.Revno = (oData && oData.Revno) ? oData.Revno : "";
			this.Rlwrt = (oData && oData.Rlwrt) ? oData.Rlwrt : "";
			this.Scmproc = (oData && oData.Scmproc) ? oData.Scmproc : "";
			this.Shipcond = (oData && oData.Shipcond) ? oData.Shipcond : "";
			this.SourceLogsys = (oData && oData.SourceLogsys) ? oData.SourceLogsys : "";
			this.SprRsnProfile = (oData && oData.SprRsnProfile) ? oData.SprRsnProfile : "";
			this.Spras = (oData && oData.Spras) ? oData.Spras : "";
			this.Stafo = (oData && oData.Stafo) ? oData.Stafo : "";
			this.Stako = (oData && oData.Stako) ? oData.Stako : "";
			this.Statu = (oData && oData.Statu) ? oData.Statu : "";
			this.Stceg = (oData && oData.Stceg) ? oData.Stceg : "";
			this.StcegL = (oData && oData.StcegL) ? oData.StcegL : "";
			this.Submi = (oData && oData.Submi) ? oData.Submi : "";
			this.Zbd1p = (oData && oData.Zbd1p) ? oData.Zbd1p : "";
			this.Zbd1t = (oData && oData.Zbd1t) ? oData.Zbd1t : "";
			this.Zbd2p = (oData && oData.Zbd2p) ? oData.Zbd2p : "";
			this.Zbd2t = (oData && oData.Zbd2t) ? oData.Zbd2t : "";
			this.Zterm = (oData && oData.Zterm) ? oData.Zterm : "";
			this.Zbd3t = (oData && oData.Zbd3t) ? oData.Zbd3t : "";




		},

		setObjectData: function(oData) {

		},
		getUpdateRequestPayload: function() {

		},
		getCreateRequestPayload: function() {

		},

		getRequestPayload: function(isCreate) {

		},
		getModel: function() {
			return this.model;
		}
	});

});