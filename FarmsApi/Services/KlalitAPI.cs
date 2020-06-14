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
	<Password>kara1007</Password>
	<SupplierID>85518</SupplierID>
	<ClinicID>0</ClinicID>
	<InsuredID>223828823</InsuredID>
	<InsuredFirstName>לילך</InsuredFirstName>
	<InsuredLastName>לוי</InsuredLastName>
	<SectionCode>10022</SectionCode>
	<CareCode>6</CareCode>
	<CareDate>13052020</CareDate>
	<DoctorID>85518</DoctorID>
	<OnlineServiceType>0</OnlineServiceType>
</XMLInput>



";




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