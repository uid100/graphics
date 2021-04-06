using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace graphics.Models
{
    public class Appointment
    {
        public int ID { get; set; }
        public string Owner { get; set; }
        public int ClientID { get; set; }
        public DateTime Appt { get; set; }
        public int Minutes { get; set; }
        public string Memo { get; set; }
    }
}
