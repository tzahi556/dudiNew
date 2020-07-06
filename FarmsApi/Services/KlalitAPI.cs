using FarmsApi.DataModels;
using System.Collections.Generic;
using System.Linq;

namespace FarmsApi.Services
{
    public class KlalitAPIClass
    {
       
        public string SendKlalitAPIFunc()
        {
            using (var Context = new Context())
            {

                KlalitAPI.SupplierRequest kp = new KlalitAPI.SupplierRequest();

                string xml = @"
<XMLInput>
	<ActionCode>11</ActionCode>
	<UserName>sm09094</UserName>
	<Password>maya0906</Password>
	<SupplierID>9094</SupplierID>
	<ClinicID>0</ClinicID>
	<InsuredID>333570000</InsuredID>
	<InsuredFirstName>איל</InsuredFirstName>
	<InsuredLastName>בדיר</InsuredLastName>
	<SectionCode>10022</SectionCode>
	<CareCode>6</CareCode>
	<CareDate>25062020</CareDate>
	<DoctorID>85518</DoctorID>
	<OnlineServiceType>0</OnlineServiceType>
</XMLInput>";
                var res = kp.SendXML(xml);
                return res;


            }
                
        }

      
    }
}

//<XMLInput>
//	<ActionCode>11</ActionCode>
//	<UserName>sm09094</UserName>
//	<Password>kara1007</Password>
//	<SupplierID>09094</SupplierID>
//	<ClinicID>09094</ClinicID>
//	<InsuredID>223828823</InsuredID>
//	<InsuredFirstName>לילך</InsuredFirstName>
//	<InsuredLastName>לוי</InsuredLastName>
//	<SectionCode>10022</SectionCode>
//	<CareCode>6</CareCode>
//	<CareDate>13052020</CareDate>
//	<DoctorID>85518</DoctorID>
//	<OnlineServiceType>0</OnlineServiceType>
//</XMLInput>

    
//<?xml version="1.0" encoding="utf-8"?>
//<XMLInput>
//	<ActionCode>11</ActionCode>
//	<UserName>test</UserName>
//	<Password>123456</Password>
//	<SupplierID>99425</SupplierID>
//	<ClinicID>0</ClinicID>
//	<InsuredID>333570000</InsuredID>
//	<InsuredFirstName>איל</InsuredFirstName>
//	<InsuredLastName>בדיר</InsuredLastName>
//	<SectionCode>10022</SectionCode>
//	<CareCode>1</CareCode>
//	<CareDate>13052020</CareDate>
//	<DoctorID>99425</DoctorID>
//	<OnlineServiceType>0</OnlineServiceType>
//</XMLInput>
