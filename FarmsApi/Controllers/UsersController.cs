using FarmsApi.DataModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
            UploadFromAccess uac = new UploadFromAccess();
            uac.UpdateUsersLessons();
            return "sdsdsdsd";
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
        [Route("getUser/{id?}")]
        [HttpGet]
        public IHttpActionResult GetUser(int? id = null)
        {
            return Ok(UsersService.GetUser(id));
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

        [Authorize(Roles = "farmAdmin,sysAdmin")]
        [Route("deleteUser/{id}")]
        [HttpGet]
        public IHttpActionResult DeleteUser(int id)
        {
            UsersService.DeleteUser(id);
            return Ok();
        }

        [Authorize(Roles = "farmAdmin,sysAdmin")]
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
        [Route("getTransferData/{insructorId}/{dow}/{date}")]
        [HttpGet]
        public IHttpActionResult getTransferData([FromUri] string insructorId, [FromUri] string dow, [FromUri] string date)
        {

            return Ok(UsersService.GetTransferData(insructorId, dow,date));
        }




    }
}
