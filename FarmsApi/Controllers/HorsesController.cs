using FarmsApi.DataModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("horses")]
    public class HorsesController : ApiController
    {
        [Authorize]
        [Route("getHorses/{includeDeleted?}")]
        [HttpGet]
        public IHttpActionResult GetHorses(bool includeDeleted = false)
        {
            return Ok(HorsesService.GetHorses(includeDeleted));
        }

        [Authorize]
        [Route("getHorse/{id}")]
        [HttpGet]
        public IHttpActionResult GetHorse(int id)
        {
            return Ok(HorsesService.GetHorse(id));
        }

        [Authorize]
        [Route("newHorse")]
        [HttpGet]
        public IHttpActionResult NewHorse()
        {
            return Ok(new Horse());
        }

        [Authorize]
        [Route("deleteHorse/{id}")]
        [HttpGet]
        public IHttpActionResult DeleteHorse(int id)
        {
            HorsesService.DeleteHorse(id);
            return Ok();
        }

        [Authorize]
        [Route("updateHorse")]
        [HttpPost]
        public IHttpActionResult UpdateHorse(DataModels.Horse horse)
        {
            return Ok(HorsesService.UpdateHorse(horse));
        }
    }
}
