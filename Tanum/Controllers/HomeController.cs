using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Tanum.Models;

namespace Tanum.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }
        
        
        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult LogIn()
        {
            UserModel user = new UserModel();
            
            return View(user);
        }

        [HttpPost]
        //Tar emot ett ärende (från formuläret) och skickar till WebService
        public ActionResult AddCase(ProjektService.CaseData iCase)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();

            //Tillfälligt tills jag fixar switch case i uträkningen
            iCase.category = 1;


            client.addCase(iCase);
            return RedirectToAction("Index");
        }

        public ActionResult DeleteCase(int id)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();
            client.deleteCase(id);
            return RedirectToAction("Admin");
        }

        public ActionResult EditCase(int id, int category, string description, bool isActive)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();
            client.editCase(id, category, description, isActive);

            return RedirectToAction("Admin");
        }

        //Metoden som hämtar data från WebbService
        public ActionResult GetCases()
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();

            List<ProjektService.CaseData> caseList = client.getAllCases().ToList();

            //Gör om listan av objekt till en JSON sträng och returnerar det
            return Json(JsonSerializer.Serialize(caseList));
        }

        public ActionResult LogIn(string username, string password)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();
            
            if(client.logIn(username, password) == true)
            {
                System.Web.Security.FormsAuthentication.RedirectFromLoginPage(username, true);
            }

            return RedirectToAction("LogIn");
        }
    }
}