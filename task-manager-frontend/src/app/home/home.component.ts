import { Component, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private observer?: IntersectionObserver;

  features = [
    { icon: '🔐', title: 'Tes données protégées', text: 'Chaque utilisateur a son propre espace. Personne d’autre ne peut voir tes tâches.' },
    { icon: '⚡', title: 'Rapide', text: 'Ajoute, modifie et termine tes tâches en quelques clics.' },
    { icon: '🔍', title: 'Recherche & filtres', text: 'Retrouve n’importe quelle tâche par mot-clé, statut ou priorité.' },
    { icon: '🏷️', title: 'Catégories & échéances', text: 'Organise ton travail avec des catégories et des dates limites.' },
    { icon: '🌓', title: 'Dark / Light', text: 'Un thème clair ou sombre, mémorisé à chaque visite.' },
    { icon: '📱', title: 'Responsive', text: 'Une interface qui s’adapte au mobile, à la tablette et au PC.' }
  ];

  steps = [
    { n: '1', title: 'Crée ton compte', text: 'Inscription en 30 secondes.' },
    { n: '2', title: 'Ajoute tes tâches', text: 'Titre, priorité, catégorie, date.' },
    { n: '3', title: 'Reste organisé', text: 'Coche, filtre, et avance chaque jour.' }
  ];

  constructor(private el: ElementRef, public auth: AuthService) {}

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer?.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    this.el.nativeElement.querySelectorAll('.reveal').forEach((n: Element) => this.observer!.observe(n));
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }
}