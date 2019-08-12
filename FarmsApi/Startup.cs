using System;
using System.Threading.Tasks;
using Microsoft.Owin;
using Owin;
using System.Web.Http;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using System.Linq;
using FarmsApi.DataModels;

[assembly: OwinStartup(typeof(FarmsApi.Startup))]

namespace FarmsApi
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();
            app.UseCors(CorsOptions.AllowAll);
            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;
            ConfigureOAuth(app);
            app.UseWebApi(config);
        }

        public void ConfigureOAuth(IAppBuilder app)
        {
            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(365),
                Provider = new SimpleAuthorizationServerProvider(),
            };

            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }
    }

    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            await Task.Run(() => { context.Validated(); });
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            await Task.Run(() =>
            {
                using (var Context = new Context())
                {
                    var user = Context.Users.SingleOrDefault(u => u.Email == context.UserName);
                    if (user == null || user.Password != context.Password)
                    {
                        context.SetError("invalid_grant", "שם משתמש או סיסמה אינם נכונים");
                        return;
                    }

                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim("sub", user.Email));
                    identity.AddClaim(new Claim(ClaimTypes.Role, user.Role));

                    context.Validated(identity);
                }
            });
        }
    }
}
