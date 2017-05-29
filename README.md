# Projet SR03
UV SR03 UTC - Architecture des Applications Web

## Description
Serveur applicatif JEE exposant une API REST pour consulter un trombinoscope d'étudiants et leurs emplois du temps.

## Architecture
* Serveur d'application : WildFly
* Base de donnée : MySQL
* ORM : Hibernate (JPA)
* Gestion des sessions : JJWT
* Trois projets créés via Eclipse :
  1. `Trombi_EAR` : l'EAR permettant de déployer tout le projet.
  2. `Trombi_Web` : le projet contenant les web-services exposant l'API.
  3. `Trombi_EJB_JPA` : le projet contenant les `Entity` mappées sur le schéma de la base de données, ainsi que les EJB permettant aux web-services d'interagir avec les données en base. Contient la logique Hibernate.
 
## Structure de l'arborescence
* `Trombi_EAR.ear` : L'archive de déploiement contenant tous les projets nécessaires.
* `sql` : Scripts SQL ou Python servant à générer du SQL.
* `datasource` : Fichiers utiles pour lier Hibernate à la base de données MySQL.
* `lib` : Fichiers JAR dont dépend le projet.
  
## Utilisation de l'API
Après avoir lancé l'application, toute l'API REST a pour racine `/rest/`. Excepté pour l'obtention du jeton, elle renvoie du JSON.
 
### Connexion
Tous les accès à l'API concernant les étudiants demandent une authentification. Les identifiants sont enregistrés dans la table `Compte` de la base de données. 
 
La gestion d'une session de connexion se fait à l'aide de [JSON Web Token](https://jwt.io/). L'endpoint pour se connecter et obtenir le token est `/login` ([Query Parameters](https://stackoverflow.com/questions/11552248/when-to-use-queryparam-vs-pathparam) : login, passwd, _e.g_ `<url>/rest/login?login=admin&passwd=admin`). Si l'authentification ne peut aboutir, le client reçoit un code `HTTP 401`. 
 
Si l'authentification réussit, le client reçoit un code `HTTP 200` ainsi que le jeton en plain text. Le jeton doit, pour tous les autres appels à l'API, être inséré dans le header HTTP `Authorization: Bearer <jeton>`.
 
 ### Etudiants
L'endpoint pour la consultation des étudiants est `/student`.
* **Liste** de tous les étudiants : aucun paramètre.
* Etudiant par **identifiant** : Path Parameter avec l'adresse mail (_e.g_ `/student/prenom.nom@etu.utc.fr`).
* Recherche par **nom** _ou_ **prenom** : Query Parameters `nom` et/ou `prenom` (_e.g_ `/student?prenom=Antoine`).

### Emploi du temps
L'endpoint pour la consultation des emplois du temps est `/edt`. Sans paramètres, on obtient tous les emplois du temps. Avec l'adresse mail de l'étudiant comme Path Parameter, on obtient son emploi du temps (similairement à l'endpoint `student`).

## Mise en place et configuration du serveur

> Note : Java 8 au minimum est requis.

### Base de données

1. Installer MySQL ou MariaDB.
    * Sur Linux, le paquet est en général `mysql-server`.
    * Si seulement MariaDB est disponible sur les repos officiels et que l'on veut MySQL, on peut télécharger le serveur communauté sur le site de MySQL, puis l'installer en suivant [ce tutoriel](https://dev.mysql.com/doc/refman/5.7/en/binary-installation.html).
2. Configurer le compte `root` avec comme mot de passe `chosty`. Si l'option n'est pas présente à l'installation, lancer le script `sudo mysql_secure_installation`.
3. Créer le schéma utilisé (`SR03Projet`). Le script SQL est dans le dossier `sql` (`createSchema.sql`).
4. Insérer les données des étudiants :
    * Soit en utilisant le script Python `genSQLInsert.py` qui génère le code SQL à partir de l'API de l'UTC ;
    * Soit en utilisant directement le SQL généré du fichier `insertSQL.sql`.

### Serveur d'application WildFly

1. Installation des outils JBoss : `Help` → `Eclipse Marketplace` → Installer `JBoss Tools 4.4.4 Final`
2. Installation de WildFly : `File` → `New` → `Server` → `WildFly 10.x` → Next, Next → `Download and install runtime` → `WildFly 10.1.0 Final` → Next, Next → **Bien noter le chemin d'installation**, chez moi `/usr/local` → Finish.

### Import des projets

1. Importer l'EAR, qui contient tout le reste : `File` → `Import` → `EAR File`. Choisir le fichier EAR téléchargé, ainsi que `Wildfly 10.x Runtime` pour le target runtime. Dans la fenêtre suivant, ne rien cocher, `Next`, puis bien cocher les modules à importer (`Trombi_EJB_JPA` et `Trombi_Web`), puis `Finish`.
2. Régler les problèmes de visibilité (le projet Web peut ne pas voir les classes métiers du projet EJB_JPA) : si un message du type `Compte cannot be resolved as a type`, cliquer sur `Fix Project Setup` et suivre le conseil. Si ça ne fonctionne pas, modifier le build path du projet Web pour référencer le projet EJB_JPA.
3. À ce stade, les trois projets devraient être visibles, sans erreur. Il faut maintenant lier le serveur d'application à la base de données.

### Configuration de la connexion à MySQL

Pour ce faire, il faut simplement aller à l'endroit où WildFly est installé (le chemin choisi plus haut, pour moi `/usr/local/...`), puis dans `modules`, et copier le dossier `datasource/com` à cet endroit. Il contient un module ainsi que le driver pour MySQL permettant à WildFly de communiquer avec la base.

Ensuite, il faut se rendre dans le dossier `standalone/configuration` et modifier le fichier `standalone.xml` au niveau de la section `<datasources>`. IL y a alors deux choses à ajouter, que l'on trouve dans le fichier `datasource/standalone.xml` du repo : la définition d'un `<datasource>` et la définition d'un `<driver>`.

### Lancement du serveur

Pour lancer le serveur, une fois configuré, il suffit de faire un clic droit sur le projet EAR et de choisir `Run` → `Run on Server`. On peut alors choisir le serveur WildFly déployé précédemment, ajouter si besoin le projet dans le volet de droite, et le lancer.

Après l'initialisation, on arrive sur la racine du site, vide, d'où le `Forbidden`. On peut alors tester le bon fonctionnement du serveur avec l'URL [de connexion](http://localhost:8080/Trombi_Web/rest/login?login=admin&passwd=admin). Si le token s'affiche en résultat, le serveur est fonctionnel et il faudra l'utiliser en en-tête HTTP pour accéder au reste de l'API.
