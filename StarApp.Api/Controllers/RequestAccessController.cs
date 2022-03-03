using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StarApp.Core.Domain.DTOs;
using StarApp.Core.Domain.Entities;
using System.Security.Cryptography;
using System.Text;
using StarApp.Core.Interfaces.Repository;
using StarApp.Core.Interfaces.Service;
using static StarApp.Core.Domain.Enums.RolesEnum;
using static StarApp.Core.Domain.Enums.StatusEnum;

namespace StarApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RequestAccessController : ControllerBase
    {

        private readonly IEmployeeService _employeeService;
        private readonly IAuthService _authService;

        public RequestAccessController(IEmployeeService employeeService, IAuthService authService)
        {
            _employeeService = employeeService;
            _authService = authService;
        }

        [HttpPost]
        public async Task<IActionResult> RequestAccess(RequestAccessDto requestAccessDto)
        {
            if (await employeeAleadyExist(requestAccessDto.Email)) return BadRequest("This email is already registered");

            //using var hmac = new HMACSHA512();
            var (passwordHash, passwordSalt) = _authService.GetPasswordHash(requestAccessDto.Password);
            var employee = new Employee
            {
                UserName = requestAccessDto.UserName.ToLower(),
                Email = requestAccessDto.Email.ToLower(),
                Role = requestAccessDto.Role,
                Status = requestAccessDto.Role == Roles.Admin ? Status.Active : Status.Requested,
                ActiveFrom = DateTime.Now,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                //PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(requestAccessDto.Password)),
                //PasswordSalt = hmac.Key
            };

            _employeeService.Add(employee);

            return Ok("Your request has been submitted, you can log in once you are approved");
        }
        private async Task<bool> employeeAleadyExist(string email)
        {
            var employee = await _employeeService.GetByEmail(email);
            return employee != null;
        }
    }
}
