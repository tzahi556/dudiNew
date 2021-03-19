using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("users")]
    public class UsersController : ApiController
    {

        [Route("UpdateUsersLessons")]
        [HttpGet]
        public string UpdateUsersLessons()
        {
            //using (var Context = new Context())
            //{
            //    var ddd = Context.AvailableHours.Toli;
            //    Context.Lessons.Where(l => l.ParentId == LessonId).ToList();
            //}
            //  string sdsd = UsersService.CreateLoopLessons();




            // return Ok(UsersService.getAvailablehours(5));

            UploadFromAccess uac = new UploadFromAccess();
            uac.UpdateUsersLessons();
            return "sdsdsdsd";

            //



            //   string sdsd = UsersService.CreateLoopLessons();

            //  string sdsd = UsersService.CreateLoopLessons();
           // return "צחיאל";
        }


        [Route("SendKlalitApi")]
        [HttpGet]
        public string SendKlalitApi()
        {
            KlalitAPIClass uac = new KlalitAPIClass();
            return uac.SendKlalitAPIFunc();

        }





        //[Route("UpdateUsers")]
        //[HttpGet]
        //public string UpdateUsers()
        //{
        //    UsersService.UpdateUsers();
        //    return "sdsdsdsd";
        //}




        [Route("getAvailablehours/{id?}")]
        [HttpGet]
        public IHttpActionResult getAvailablehours(int? id = null)
        {
            return Ok(UsersService.getAvailablehours(id));
        }


        [Route("getpaymentsbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getpaymentsbyuserid(int? id = null)
        {
            return Ok(UsersService.getpaymentsbyuserid(id));
        }


        [Authorize]
        [Route("getuseruserhorsesbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getuseruserhorsesbyuserid(int? id = null)
        {
            return Ok(UsersService.getuseruserhorsesbyuserid(id));
        }


        [Authorize]
        [Route("getAllFarmsuseruserhorses")]
        [HttpGet]
        public IHttpActionResult getAllFarmsuseruserhorses()
        {
            return Ok(UsersService.getAllFarmsuseruserhorses());
        }




        [Authorize]
        [Route("getuserfilesbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getuserfilesbyuserid(int? id = null)
        {
            return Ok(UsersService.getuserfilesbyuserid(id));
        }
        [Authorize]
        [Route("getusercommitmentsbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getusercommitmentsbyuserid(int? id = null)
        {
            return Ok(UsersService.getusercommitmentsbyuserid(id));
        }
        [Authorize]
        [Route("getuserexpensesbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getuserexpensesbyuserid(int? id = null)
        {
            return Ok(UsersService.getuserexpensesbyuserid(id));
        }

        [Authorize]
        [Route("getuserusermakavbyuserid/{id?}")]
        [HttpGet]
        public IHttpActionResult getuserusermakavbyuserid(int? id = null)
        {
            return Ok(UsersService.getuserusermakavbyuserid(id));
        }



        [Authorize]
        [Route("getUsers/{role?}/{includeDeleted?}")]
        [HttpGet]
        public IHttpActionResult GetUsers(string role = null, bool includeDeleted = false)
        {
            return Ok(UsersService.GetUsers(role, includeDeleted));
        }

        [Authorize]
        [Route("getStudents")]
        [HttpGet]
        public IHttpActionResult GetStudents()
        {
            return Ok(UsersService.GetStudents());
        }





        [Authorize]
        [Route("getUser/{id?}")]
        [HttpGet]
        public IHttpActionResult GetUser(int? id = null)
        {
            return Ok(UsersService.GetUser(id));
        }

        [Authorize]
        [Route("getsetUserEnter/{isForCartis}/{id?}")]
        [HttpGet]
        public IHttpActionResult GetSetUserEnter(int? id = null, bool isForCartis = false)
        {
            return Ok(UsersService.GetSetUserEnter(id, isForCartis));
        }



        [Authorize]
        [Route("newUser")]
        [HttpGet]
        public IHttpActionResult NewUser()
        {
            return Ok(new User());
        }

        [Authorize]
        [Route("getUserIdByEmail/{email}")]
        [HttpGet]
        public IHttpActionResult GetUserIdByEmail(string email)
        {
            return Ok(UsersService.GetUserIdByEmail(email));
        }

        [Authorize(Roles = "farmAdmin,farmAdminHorse,sysAdmin,vetrinar,shoeing")]
        [Route("deleteUser/{id}")]
        [HttpGet]
        public IHttpActionResult DeleteUser(int id)
        {
            UsersService.DeleteUser(id);
            return Ok();
        }

        [Authorize(Roles = "farmAdmin,farmAdminHorse,sysAdmin,vetrinar,shoeing")]
        [Route("destroyUser")]
        [HttpGet]
        public IHttpActionResult DestroyUser([FromUri] string email)
        {
            UsersService.DestroyUser(email);
            return Ok();
        }

        [Authorize]
        [Route("updateUser")]
        [HttpPost]
        public IHttpActionResult UpdateUser(DataModels.User user)
        {
            return Ok(UsersService.UpdateUser(user));
        }


        [Authorize]
        [Route("updateusermultitables")]
        [HttpPost]
        public IHttpActionResult UpdateUserMultiTables(JArray dataobj)
        {
            //  return Ok(UsersService.UpdateUser(dataobj));
            return Ok(UsersService.UpdateUserMultiTables(dataobj));
        }




        [Authorize]
        [Route("importusers")]
        [HttpPost]
        public IHttpActionResult ImportUsers(List<DataModels.User> users)
        {
            foreach (var user in users)
            {
                UsersService.UpdateUser(user);
            }
            return Ok();
        }


        [Authorize]
        [Route("getReport/{type}/{fromDate}/{toDate}")]
        [HttpGet]
        public IHttpActionResult getReport([FromUri] string type, [FromUri] string fromDate, [FromUri] string toDate)
        {

            return Ok(UsersService.ManagerReport(type, fromDate, toDate));
        }

        [Authorize]
        [Route("getReportHMO/{fromDate}/{toDate}")]
        [HttpGet]
        public IHttpActionResult getReportHMO([FromUri] string fromDate, [FromUri] string toDate)
        {

            return Ok(UsersService.HMOReport(fromDate, toDate));
        }

        [Authorize]
        [Route("getReportDebt")]
        [HttpGet]
        public IHttpActionResult getReportDebt()
        {

            return Ok(UsersService.DebtReport());
        }




        [Authorize]
        [Route("getTransferData/{insructorId}/{dow}/{date}")]
        [HttpGet]
        public IHttpActionResult getTransferData([FromUri] string insructorId, [FromUri] string dow, [FromUri] string date)
        {

            return Ok(UsersService.GetTransferData(insructorId, dow, date));
        }




    }
}
