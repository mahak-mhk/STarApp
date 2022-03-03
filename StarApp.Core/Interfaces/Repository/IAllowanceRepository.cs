using StarApp.Core.Domain.DTOs;
using StarApp.Core.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StarApp.Core.Interfaces.Repository
{
    public interface IAllowanceRepository : IGenericRepository<Allowance>
    {
        Task<AllowancePageDto> GetAllowances(AllowanceFilter filter);
    }
}
