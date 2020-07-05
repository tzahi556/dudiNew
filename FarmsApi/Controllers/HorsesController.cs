using FarmsApi.DataModels;
using System.Web.Http;

namespace FarmsApi.Services
{
    [RoutePrefix("horses")]
    public class HorsesController : ApiController
    {


        [Route("UpdateMetaHorsses")]
        [HttpGet]
        public string UpdateMetaHorsses()
        {
            HorsesService.UpdateMetaHorsses();
            return "sdsdsdsd";
        }





        [Authorize]
        [Route("getHorses/{includeDeleted?}")]
        [HttpGet]
        public IHttpActionResult GetHorses(bool includeDeleted = false)
        {
            return Ok(HorsesService.GetHorses(includeDeleted));
        }

        [Authorize]
        [Route("getHorse/{id}/{type}")]
        [HttpGet]
        public IHttpActionResult GetHorse(int id,int type)
        {
            if(type==2)
                return Ok(HorsesService.GetHorseFiles(id));
            if (type == 3)
                return Ok(HorsesService.GetHorseHozeFiles(id));
            if (type == 4)
                return Ok(HorsesService.GetHorsePundekautFiles(id));
            if (type == 5)
                return Ok(HorsesService.GetHorseTreatments(id));
            if (type == 6)
                return Ok(HorsesService.GetHorseVaccinations(id));
            if (type == 7)
                return Ok(HorsesService.GetHorseShoeings(id));
            if (type == 8)
                return Ok(HorsesService.GetHorseTilufings(id));
            if (type == 9)
                return Ok(HorsesService.GetHorsePregnancies(id));
            if (type == 10)
                return Ok(HorsesService.GetHorsePregnanciesStates(id));
            if (type == 11)
                return Ok(HorsesService.GetHorseInseminations(id));
            


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


        [Authorize]
        [Route("checkifhorsework")]
        [HttpGet]
        public IHttpActionResult Checkifhorsework(int? id = null, string start = null, string end = null)
        {

            return Ok(HorsesService.CheckIfHorseWork(id, start, end));
        }


    }
}
