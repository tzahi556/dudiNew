using FarmsApi.DataModels;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("farms")]
    public class FarmsController : ApiController
    {
        [Authorize]
        [Route("getFarms")]
        [HttpGet]
        public IHttpActionResult GetFarms(bool deleted = false)
        {
            return Ok(FarmsService.GetFarms(deleted));
        }

        [Authorize]
        [Route("getFarm/{id}")]
        [HttpGet]
        public IHttpActionResult GetFarm(int id)
        {
            return Ok(FarmsService.GetFarm(id));
        }

        [Authorize]
        [Route("newFarm")]
        [HttpGet]
        public IHttpActionResult NewFarm()
        {
            return Ok(new Farm());
        }

        [Authorize]
        [Route("deleteFarm/{id}")]
        [HttpGet]
        public IHttpActionResult DeleteFarm(int id)
        {
            FarmsService.DeleteFarm(id);
            return Ok();
        }

        [Authorize(Roles = "sysAdmin")]
        [Route("updateFarm")]
        [HttpPost]
        public IHttpActionResult UpdateFarm(Farm farm)
        {
            return Ok(FarmsService.UpdateFarm(farm));
        }

        [Authorize]
        [Route("updateFarmInvoice")]
        [HttpPost]
        public IHttpActionResult UpdateFarmInvoice(Farm farm)
        {
            return Ok();
            //var Farm = FarmsService.GetFarm(farm.Id);
            //Farm.Meta = farm.Meta;
            //return Ok(FarmsService.UpdateFarm(farm));
        }
    }
}
