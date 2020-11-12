using FarmsApi.DataModels;
using System.Collections.Generic;
using System.Linq;

namespace FarmsApi.Services
{
    // https://sapaktest.clalit.co.il/mushlamsupplierservice/SupplierRequest.asmx
    //https://portalsapakim.mushlam.clalit.co.il/mushlamsupplierservice/RequestClaim.asmx
    //https://portalsapakim.mushlam.clalit.co.il/mushlamsupplierservice/SupplierRequest.asmx

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
	<CareDate>05072020</CareDate>
	<DoctorID>85518</DoctorID>
	<OnlineServiceType>0</OnlineServiceType>
</XMLInput>";
                var res = kp.SendXML(xml); //203700003 //203700007
                return res;


            }
                
        }

      
    }
}

//< XMLInput >
//	< ActionCode > 11 </ ActionCode >
//	< UserName > sm09094 </ UserName >
//	< Password > maya0906 </ Password >
//	< SupplierID > 9094 </ SupplierID >
//	< ClinicID > 0 </ ClinicID >
//	< InsuredID > 333570000 </ InsuredID >
//	< InsuredFirstName > איל </ InsuredFirstName >
//	< InsuredLastName > בדיר </ InsuredLastName >
//	< SectionCode > 10022 </ SectionCode >
//	< CareCode > 6 </ CareCode >
//	< CareDate > 05072020 </ CareDate >
//	< DoctorID > 85518 </ DoctorID >
//	< OnlineServiceType > 0 </ OnlineServiceType >
//</ XMLInput > ";