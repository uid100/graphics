using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace graphics.Models
{
    public class Contact
    {
        public int ID { get; set; }
        public string FirstName { get; set; }
        public string Middle { get; set; }
        public string LastName { get; set; }
        public Address Address { get; set; }
    }
}
