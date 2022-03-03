using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StarApp.Core.Domain.DTOs;
using StarApp.Core.Domain.Entities;
using StarApp.Core.Interfaces.Repository;
using StarApp.Core.Interfaces.Service;
using System.Security.Cryptography;
using System.Text;
using static StarApp.Core.Domain.Enums.StatusEnum;

namespace StarApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IEmployeeService _employeeService;
        private readonly IAuthService _authService;

        public LoginController(ITokenService tokenService, IEmployeeService employeeService, IAuthService authService)
        {
            _tokenService = tokenService;
            _employeeService = employeeService;
            _authService = authService;
        }

        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Login(LoginDto loginDto)
        {
            var employee = await _employeeService.GetByEmail(loginDto.Email.ToLower());

            if (employee == null) return Unauthorized("This user does not exist");

            if (employee.Status == Status.Requested) return Unauthorized("Your request Has not yet been approved, please be patient.");

            if (!_authService.VarifyPassword(employee, loginDto.Password)) return Unauthorized("Incorrect Password");

            EmployeeDto employeeDto = new EmployeeDto()
            {
                Id = employee.Id,
                UserName = employee.UserName,
                Email = employee.Email,
                Role = employee.Role,
                Status = employee.Status,
                Token = _tokenService.CreateToken(employee)
            };

            return Ok(employeeDto);
        }


        //private bool varifyPassword(Employee employee, string password)
        //{
        //    using var hmac = new HMACSHA512(employee.PasswordSalt);

        //    var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        //    for (int i = 0; i < computedHash.Length; i++)
        //    {
        //        if (computedHash[i] != employee.PasswordHash[i]) return false;
        //    }
        //    return true;
        //}
    }
}
