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
  newTitle = '';
  newDescription = '';
  newPriority = 'Medium';

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
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Erreur chargement tâches', err)
    });
  }

  addTask() {
    if (!this.newTitle.trim()) return;

    const task: Task = {
      title: this.newTitle,
      description: this.newDescription,
      isCompleted: false,
      priority: this.newPriority
    };

    this.taskService.create(task).subscribe({
      next: () => {
        this.newTitle = '';
        this.newDescription = '';
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

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']) // même en cas d'erreur, on déconnecte localement
    });
  }
}