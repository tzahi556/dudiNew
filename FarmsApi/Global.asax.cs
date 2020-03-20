using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.Security;
using System.Web.SessionState;
using FarmsApi.Services;

namespace FarmsApi
{
    public class Global : System.Web.HttpApplication
    {
        private static CacheItemRemovedCallback OnCacheRemove = null;
        protected void Application_Start(object sender, EventArgs e)
        {
            //StartMailChecker();
         //  AddTask("DoStuff",3600);
           AddTask("DoStuff", 30);
        }

        private void AddTask(string name, int seconds)
        {
            OnCacheRemove = new CacheItemRemovedCallback(CacheItemRemoved);
            HttpRuntime.Cache.Insert(name, seconds, null,
                DateTime.Now.AddSeconds(seconds), Cache.NoSlidingExpiration,
                CacheItemPriority.NotRemovable, OnCacheRemove);
        }

        public void CacheItemRemoved(string k, object v, CacheItemRemovedReason r)
        {
            // do stuff here if it matches our taskname, like WebRequest


            // re-add our task so it recurs
            try
            {
                DateTime moment = DateTime.Now;
                int day = moment.Day;
                int hour = moment.Hour;


                if (hour == 14)
                {
                    CommonTasks Tasking = new CommonTasks();

                    if (day == 1) Tasking.AddExpenseToHorseLanders();
                   
                    Tasking.InsertChecksToMas();

                    Tasking.InsertSchedularToken();

                }

            }
            catch(Exception ex)
            {


            }


            AddTask(k, Convert.ToInt32(v));
        }
        public static void StartMailChecker()
        {
            HttpRuntime.Cache.Add(
                // String that represents the name of the cache item,
                // could be any string
                "ScheduledTask",
                // Something to store in the cache
                "1",
                // No cache dependencies
                null,
                // Will not use absolute cache expiration
                Cache.NoAbsoluteExpiration,
                // Cache will expire after one hour
                // You can change this time interval according 
                // to your requriements
                TimeSpan.FromMinutes(1),
                // Cache will not be removed before expired
                CacheItemPriority.NotRemovable,
                // SetTimer function will be called when cache expire
                SetTimer);
        }

        private static void SetTimer(string key, object value, CacheItemRemovedReason reason)
        {
            try
            {
                DateTime moment = DateTime.Now;
                int day = moment.Day;

                int hour = moment.Hour;

                
                if (hour == 9)
                {
                    CommonTasks Tasking = new CommonTasks();

                    if (day == 1) Tasking.AddExpenseToHorseLanders();
                    Tasking.InsertChecksToMas();


                }
              
            }
            catch
            {


            }
            finally
            {
              //  StartMailChecker();
            }
        }
        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}