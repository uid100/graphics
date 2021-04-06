using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using graphics.Models;

namespace graphics.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult BarGraph() => View();
        public IActionResult CircularProgress() => View();
        public IActionResult Timer() => View();
        public IActionResult Arc() => View();
        public IActionResult Clock() => View();
        public IActionResult Clock2() => View();
        public IActionResult WristWatch() => View();
        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";
            return View();
        }

        public IActionResult Privacy() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
