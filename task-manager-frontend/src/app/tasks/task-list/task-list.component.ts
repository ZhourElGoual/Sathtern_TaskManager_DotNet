import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  newTitle = '';
  newDescription = '';
  newPriority = 'Medium';
  newCategory = '';
  newDueDate = '';

  searchTerm = '';
  filterStatus = 'all';
  filterPriority = 'all';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilters();
      },
      error: (err) => console.error('Erreur chargement tâches', err)
    });
  }

  applyFilters() {
    let result = [...this.tasks];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(term) ||
        (t.description?.toLowerCase().includes(term) ?? false) ||
        (t.category?.toLowerCase().includes(term) ?? false)
      );
    }

    if (this.filterStatus === 'completed') {
      result = result.filter(t => t.isCompleted);
    } else if (this.filterStatus === 'pending') {
      result = result.filter(t => !t.isCompleted);
    }

    if (this.filterPriority !== 'all') {
      result = result.filter(t => t.priority === this.filterPriority);
    }

    this.filteredTasks = result;
  }

  addTask() {
    if (!this.newTitle.trim()) return;

    const task: Task = {
      title: this.newTitle,
      description: this.newDescription,
      isCompleted: false,
      priority: this.newPriority,
      category: this.newCategory || undefined,
      dueDate: this.newDueDate || undefined
    };

    this.taskService.create(task).subscribe({
      next: () => {
        this.newTitle = '';
        this.newDescription = '';
        this.newCategory = '';
        this.newDueDate = '';
        this.newPriority = 'Medium';
        this.loadTasks();
      },
      error: (err) => console.error('Erreur création tâche', err)
    });
  }

  toggleComplete(task: Task) {
    const updated = { ...task, isCompleted: !task.isCompleted };
    this.taskService.update(task.id!, updated).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur mise à jour', err)
    });
  }

  deleteTask(id: number) {
    if (!confirm('Supprimer cette tâche ?')) return;
    this.taskService.delete(id).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erreur suppression', err)
    });
  }

  get totalCount() { return this.tasks.length; }
  get completedCount() { return this.tasks.filter(t => t.isCompleted).length; }
  get pendingCount() { return this.tasks.filter(t => !t.isCompleted).length; }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}