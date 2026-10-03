Gestionnaire de tâches

Application web Full-Stack de gestion de tâches

Le projet utilise Angular pour le frontend et ASP.NET Core Web API pour le backend, avec une API Gateway Ocelot, une authentification JWT et SQL Server.

-------------Technologies

**Frontend

* Angular
* TypeScript
* SCSS
* RxJS

**Backend

* ASP.NET Core Web API (.NET 9)
* Entity Framework Core
* ASP.NET Identity
* Ocelot API Gateway

**Base de données

* SQL Server

**Authentification

* JWT
* Access Token & Refresh Token

**Fonctionnalités

* Inscription et connexion
* Authentification JWT
* Gestion des tâches : ajout, modification et suppression
* Gestion du statut et de la priorité
* Recherche et filtrage des tâches
* Compteurs des tâches
* Mode clair / sombre
* Interface responsive
* Protection des routes et des requêtes API

**Architecture

  
Angular
   │
   ▼
Ocelot API Gateway
   │
   ▼
ASP.NET Core Web API
   │
   ▼
SQL Server


**Structure

  
TaskManager_DotNet_Angular/
├── ApiGateway/
├── TaskManager.Api/
├── task-manager-frontend/
└── README.md


**Installation

 1. Cloner le projet

```bash
git clone https://github.com/ZhourElGoual/Sathtern_TaskManager_DotNet.git
cd Sathtern_TaskManager_DotNet
```

 2. Backend

   bash
cd TaskManager.Api
dotnet restore
dotnet ef database update
dotnet run


 3. API Gateway

bash
cd ApiGateway
dotnet restore
dotnet run


 4. Frontend

bash
cd task-manager-frontend
npm install
ng serve


L'application Angular est disponible sur :

  
http://localhost:4200



**El Goual Zhour**

* GitHub : [@ZhourElGoual](https://github.com/ZhourElGoual)
* LinkedIn : [zhour-elgoual](https://www.linkedin.com/in/zhour-elgoual-36862627b/)

Projet réalisé dans le cadre du Sathtern Virtual Internship — Web Development.
