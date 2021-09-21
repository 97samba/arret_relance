# Application Web pour la création des scripts d'Arrêt/Relance
Paros (Procédures d'arrêt/relance et d'ouverture de services) est une application Web qui permet de créer un script pour arréter / relancer un applicatif windows, linux ou hybride.
Il s'agit d'une interface Web très intuitive pour permettre à quiconque de pouvoir créer un enchainement d'actions tels que:
* Lancer ou arreter une base de données
* arreter ou lancer un service 
* exécuter un script
* ... etc

En même temps que l'utilisateur saisie les informations, l'application fait aussi des vérifications comme :
* Pinger le serveur renseigné
* Vérifier si la base de données saisie existe
* Vérifies si le script à lancer est présent 
* ...
# Architecture Logique:
![DashBoard](https://github.com/97samba/arret_relance/blob/main/pars-architecture.PNG)


# Technologies:
MERN: Mongo db, Express, React, Node
Sélénium
Powershell
IIS
Bash
Jenkins

#Interface : 

##DashBoard:
![DashBoard](https://github.com/97samba/arret_relance/blob/main/Paros-dashboard.PNG)

## Création de scripts:
![Create](https://github.com/97samba/arret_relance/blob/main/paros-creation.PNG)

##Gestion
![Create](https://github.com/97samba/arret_relance/blob/main/paros-gestion.PNG)

A suivre
