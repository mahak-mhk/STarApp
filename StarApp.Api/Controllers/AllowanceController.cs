using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarApp.Core.Domain.DTOs;
using StarApp.Core.Domain.Entities;
using StarApp.Core.Interfaces.Service;
using System.Security.Claims;
using System.Text;

namespace StarApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AllowanceController : ControllerBase
    {
        private readonly IAllowanceService _allowanceService;
        private readonly IExcelService _excelService;

        public AllowanceController(IAllowanceService allowanceService, IExcelService excelService)
        {
            _allowanceService = allowanceService;
            _excelService = excelService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<AllowancePageDto>> Get([FromQuery]AllowanceFilter filter)
        {
            //string UserName = null;
            //var identity = HttpContext.User.Identity as ClaimsIdentity;
            //if (identity != null)
            //{
            //    UserName = identity.FindFirst(ClaimTypes.NameIdentifier).Value;
            //}

            //if (filter.Name == null && UserName != null) filter.Name = UserName;

            var responseData = await _allowanceService.GetAll(filter);
            return Ok(responseData);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<Allowance>> Get(int id)
        {
            return await _allowanceService.GetById(id);
        }

        [HttpGet("Download")]
        public async Task<FileContentResult> Download([FromQuery] string? name)
        {
            var dataString = await _excelService.ToCsv(name);
            var fileName = $"Allowance_{DateTime.Now.ToString()}.csv";
            var fileType = "text/csv";
            return File(Encoding.ASCII.GetBytes(dataString), fileType, fileName);
        }

        [Authorize]
        [HttpGet("Upload")]
        public async Task<ActionResult> Upload()
        {
            var file = new FileInfo(@"C:\Users\asus\Desktop\test.xlsx");
            await _excelService.ReadFromExcel(file);
            return Ok();
        }

        [Authorize]
        [HttpPost]
        public ActionResult Post([FromBody] Allowance allowance)
        {
            _allowanceService.Post(allowance);
            return Ok();
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] Allowance allowance)
        {
            var allowanceData = await _allowanceService.Put(id, allowance);
            if (!allowanceData) return NotFound("Id not found");
            return Ok("Data updated successfully");
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var response = await _allowanceService.Delete(id);
            if (!response) return NotFound("Id not found");
            return Ok("Data deleted successfully");
        }
    }
}
