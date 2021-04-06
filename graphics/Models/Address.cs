using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace graphics.Models
{
    public class Address
    {
        public int ID { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZIP { get; set; }
        public AddressType Type { get; set; }
    }
}
