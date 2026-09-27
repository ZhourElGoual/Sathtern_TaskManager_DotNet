using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TaskManager.Api.Data;
using TaskManager.Api.Models;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TasksController(AppDbContext context) => _context = context;

       private string GetUserId() => User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? "";

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _context.Tasks.Where(t => t.UserId == GetUserId()).ToListAsync();
            return Ok(tasks);
        }

       [HttpPost]
public async Task<IActionResult> Create(TaskItem task)
{
    var userId = GetUserId();
   
    
    task.UserId = userId;
    _context.Tasks.Add(task);
    await _context.SaveChangesAsync();
    return Ok(task);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TaskItem updated)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == GetUserId());
            if (task == null) return NotFound();

            task.Title = updated.Title;
            task.Description = updated.Description;
            task.IsCompleted = updated.IsCompleted;
            task.Priority = updated.Priority;
            task.Category = updated.Category;
            task.DueDate = updated.DueDate;

            await _context.SaveChangesAsync();
            return Ok(task);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == GetUserId());
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}