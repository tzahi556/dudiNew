using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace FarmsApi.Controllers
{
    [RoutePrefix("files")]
    public class FilesController : ApiController
    {
        [Route("upload")]
        [HttpPost]
        public async Task<IHttpActionResult> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            string root = HttpContext.Current.Server.MapPath("~/Uploads/");
            var provider = new MultipartFormDataStreamProvider(root);

            var file = await Request.Content.ReadAsMultipartAsync(provider);

            var source = file.FileData[0].LocalFileName;
            var dest = root + file.FileData[0].Headers.ContentDisposition.FileName.Replace("\"", "");
            dest = filterFilename(dest);

            File.Move(source, dest);

            return Ok(Path.GetFileName(dest));
        }

        public string filterFilename(string filename)
        {
            var suffix = 0;

            while (true)
            {
                suffix++;
                var NewFileName = Path.GetFileNameWithoutExtension(filename) + "_" + suffix;
                var OldFileName = Path.GetFileNameWithoutExtension(filename);
                var TempFilePath = filename.Replace(OldFileName, NewFileName);

                if (!File.Exists(TempFilePath))
                {
                    filename = TempFilePath;
                    break;
                }

            }
            return filename;
        }

        [Route("delete")]
        [HttpGet]
        public IHttpActionResult Delete(string filename)
        {
            string root = HttpContext.Current.Server.MapPath("~/Uploads/");
            File.Delete(root + filename);
            return Ok();
        }
    }
}
