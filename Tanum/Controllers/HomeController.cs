using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Web;
using System.Web.Mvc;
using Tanum.Models;

namespace Tanum.Controllers
{
    
    public class HomeController : Controller
    {
        string errorMessage = "";
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult LogIn()
        {
            UserModel user = new UserModel();

            ViewBag.ErrorMessage = errorMessage;
            return View(user);
        }

        [HttpPost]
        //Tar emot ett ärende (från formuläret) och skickar till WebService
        public ActionResult AddCase(ProjektService.CaseData iCase)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();

            
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

        [HttpPost]
        public ActionResult LogIn(UserModel u)
        {
            ProjektService.Service1Client client = new ProjektService.Service1Client();

            bool x = client.logIn(u.username, u.password);

            if(client.logIn(u.username, u.password) == true)
            {
                System.Web.Security.FormsAuthentication.RedirectFromLoginPage(u.username, false);
                return RedirectToAction("Admin", "Home");
            }

            errorMessage = "Fel användarnamn eller lösenord";
            ViewBag.ErrorMessage = errorMessage;
            return LogIn();
        }
    }
}