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
	<UserName>test</UserName>
	<Password>123456</Password>
	<SupplierID>99425</SupplierID>
	<ClinicID>0</ClinicID>
	<InsuredID>333570000</InsuredID>
	<InsuredFirstName>איל</InsuredFirstName>
	<InsuredLastName>בדיר</InsuredLastName>
	<SectionCode>10022</SectionCode>
	<CareCode>1</CareCode>
	<CareDate>13052020</CareDate>
	<DoctorID>99425</DoctorID>
	<OnlineServiceType>0</OnlineServiceType>
</XMLInput>



";




                var res = kp.SendXML(xml);
                return "גדגדגדג";


            }
                
        }

      
    }
}