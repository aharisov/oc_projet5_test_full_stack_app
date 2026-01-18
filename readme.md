# 🇫🇷 Projet pédagogique : Testing & Assurance Qualité
(Formation « Développeur Full-Stack – Java et Angular »)

## Présentation
Ce projet consiste à assurer le testing complet d’une application avant son lancement en production.
Le périmètre couvre :

- les **tests back-end**
- les **tests front-end**
- les **tests end-to-end (E2E)**

L’objectif est de garantir une qualité optimale, conformément au plan de test fourni, avec :

- au moins 80 % de couverture de code
- au moins 30 % de tests d’intégration

## Prérequis techniques

Avant de commencer, assurez-vous d’avoir installé :

- Java 8
- Maven
- Node.js et npm
- Base de données MySQL

## Installation et lancement

### 1. Cloner le dépôt

### 2. Créer une base de données MySQL (exemple de guide) : 
https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql

### 3. Configuration et lancement du front-end :

- Se placer dans le dossier /front et installer les dépendances :
```bash
cd /front
npm install
```
- Lancer l’application front-end :
```bash
npm run start
```
- L’application est accessible à l’adresse :
```bash
http://localhost:4200
```
### 4. Configuration et lancement du back-end
- Renseigner les informations de connexion dans le fichier : 
```text
/back/src/main/resources/application.properties
```
Exemple :
```bash
spring.datasource.url=jdbc:mysql://localhost:3307/angular_test?allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=mysqlpwd
```
- Lancer le back-end avec Maven :
```bash
./mvnw spring-boot:run
```
- Ou lancer le back-end depuis l’IDE (Eclipse / IntelliJ) :
```text
Clic droit sur la classe principale 
(com.openclassrooms.api.Application) → Run as → Spring Boot App.
```
- L’API est accessible à l’adresse :
```bash
http://localhost:8080
```

## Lancer les tests
### Tests back-end
- Se placer dans le dossier /back :
```bash
cd /back
```
- Lancer les tests unitaires :
```bash
mvn test
```
- Lancer les tests d’intégration :
```bash
mvn test verify
```
- Depuis l’IDE Eclipse :
```text
Clic droit sur src/main/java 
→ Run as → JUnit Test
ou 
→ Run as → Maven test
ou
→ Run as → Maven verify
```
**Si les tests SessionMapperTest et SpringBootSecurityJwtApplicationTestIT échouent, il faut :**
- installer dans Eclipse le plugin m2e-apt ;
- supprimer le dossier back/target/generated-sources ;
- effectuer Project → Clean dans Eclipse ;
- relancer les tests.

### Tests front-end
- Se placer dans le dossier /front :
```bash
cd /front
npm run test
```
### Tests End-to-End (E2E) avec Cypress
- Se placer dans le dossier /front :
```bash
cd /front
npm run e2e
```
- Dans la fenêtre Cypress :
    - choisir un navigateur
    - cliquer sur “**Start E2E Testing**”
    - sélectionner un fichier de test
    - les tests s’exécutent automatiquement

## Génération des rapports de couverture
### Back-end (JaCoCo)
- Le rapport de couverture (tests unitaires et d'integration) est généré dans :
```text
/back/target/site/jacoco-merged/index.html
```
- Exemple de résultat global :
```text
yoga-app
Element	Missed Instructions	Cov.	Missed Branches	Cov.	Missed	Cxty	Missed	Lines	Missed	Methods	Missed	Classes
Total	275 of 1 498	81 %	29 of 88	67 %	25	138	67	378	8	94	0	23
com.openclassrooms.starterjwt.mapper	275221	44 %	2620	43 %	22	42	67	115	8	19	0	4
com.openclassrooms.starterjwt.controllers	370	100 %	115	93 %	1	26	0	100	0	18	0	4
com.openclassrooms.starterjwt.security.jwt	223	100 %	17	87 %	1	16	0	57	0	12	0	3
com.openclassrooms.starterjwt.services	191	100 %	12	100 %	0	23	0	41	0	17	0	3
com.openclassrooms.starterjwt.security.services	79	100 %	15	83 %	1	12	0	24	0	9	0	2
com.openclassrooms.starterjwt.security	71	100 %		n/a	0	6	0	14	0	6	0	1
com.openclassrooms.starterjwt.payload.response	37	100 %		n/a	0	4	0	15	0	4	0	2
com.openclassrooms.starterjwt.payload.request	17	100 %		n/a	0	5	0	7	0	5	0	1
com.openclassrooms.starterjwt	8	100 %		n/a	0	2	0	3	0	2	0	1
com.openclassrooms.starterjwt.exception	6	100 %		n/a	0	2	0	2	0	2	0	2
```

Un rapport alternatif peut également être consulté directement dans Eclipse après installation du plugin EclEmma.

### Front-end
- Se placer dans le dossier /front :
```bash
cd /front
npm run test:cover
```
- Résumé de couverture :
```text
 PASS  src/app/features/auth/services/auth.service.spec.ts (57.602 s)
 PASS  src/app/features/sessions/services/session-api.service.spec.ts (57.648 s)
 PASS  src/app/app.component.spec.ts (59.269 s)
 PASS  src/app/services/session.service.spec.ts
 PASS  src/app/services/teacher.service.spec.ts
 PASS  src/app/services/user.service.spec.ts
 PASS  src/app/components/not-found/not-found.component.spec.ts
 PASS  src/app/features/sessions/components/list/list.component.spec.ts (83.611 s)
 PASS  src/app/features/auth/components/login/login.component.spec.ts (94.434 s)
 PASS  src/app/components/me/me.component.spec.ts (94.473 s)
 PASS  src/app/features/sessions/components/detail/detail.component.spec.ts (94.54 s)
 PASS  src/app/features/auth/components/register/register.component.spec.ts (94.971 s)
 PASS  src/app/features/sessions/components/form/form.component.spec.ts (95.023 s)

-----------------------------------------|---------|----------|---------|---------|-------------------
File                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------------------------|---------|----------|---------|---------|-------------------
All files                                |     100 |      100 |     100 |     100 |                   
 app                                     |     100 |      100 |     100 |     100 |                   
  app.component.html                     |     100 |      100 |     100 |     100 |                   
  app.component.ts                       |     100 |      100 |     100 |     100 |                   
 app/components/me                       |     100 |      100 |     100 |     100 |                   
  me.component.html                      |     100 |      100 |     100 |     100 |                   
  me.component.ts                        |     100 |      100 |     100 |     100 |                   
 app/components/not-found                |     100 |      100 |     100 |     100 |                   
  not-found.component.html               |     100 |      100 |     100 |     100 |                   
  not-found.component.ts                 |     100 |      100 |     100 |     100 |                   
 app/features/auth/components/login      |     100 |      100 |     100 |     100 |                   
  login.component.html                   |     100 |      100 |     100 |     100 |                   
  login.component.ts                     |     100 |      100 |     100 |     100 |                   
 app/features/auth/components/register   |     100 |      100 |     100 |     100 |                   
  register.component.html                |     100 |      100 |     100 |     100 |                   
  register.component.ts                  |     100 |      100 |     100 |     100 |                   
 app/features/auth/services              |     100 |      100 |     100 |     100 |                   
  auth.service.ts                        |     100 |      100 |     100 |     100 |                   
 app/features/sessions/components/detail |     100 |      100 |     100 |     100 |                   
  detail.component.html                  |     100 |      100 |     100 |     100 |                   
  detail.component.ts                    |     100 |      100 |     100 |     100 |                   
 app/features/sessions/components/form   |     100 |      100 |     100 |     100 |                   
  form.component.html                    |     100 |      100 |     100 |     100 |                   
  form.component.ts                      |     100 |      100 |     100 |     100 |                   
 app/features/sessions/components/list   |     100 |      100 |     100 |     100 |                   
  list.component.html                    |     100 |      100 |     100 |     100 |                   
  list.component.ts                      |     100 |      100 |     100 |     100 |                   
 app/features/sessions/services          |     100 |      100 |     100 |     100 |                   
  session-api.service.ts                 |     100 |      100 |     100 |     100 |                   
 app/services                            |     100 |      100 |     100 |     100 |                   
  session.service.ts                     |     100 |      100 |     100 |     100 |                   
  teacher.service.ts                     |     100 |      100 |     100 |     100 |                   
  user.service.ts                        |     100 |      100 |     100 |     100 |                   
-----------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 13 passed, 13 total
Tests:       89 passed, 89 total
Snapshots:   0 total
Time:        96.289 s
```
### Tests end-to-end (E2E)
- Lancer la couverture E2E :
```bash
npm run e2e:coverage
```
- Résultat de couverture :
```text
=============================== Coverage summary ===============================
Statements   : 95.56% ( 194/203 )
Branches     : 90.9% ( 60/66 )
Functions    : 97.89% ( 93/95 )
Lines        : 95.45% ( 168/176 )
================================================================================
```

## Calcul du taux de tests
### Back-end
Par nombre de classes de test :
```bash
find back/src/test/java -name "*.java" | wc -l
find back/src/test/java -name "*TestIT.java" | wc -l
```
Résultat :

- 7 classes de tests d’intégration
- 23 classes de tests au total

Soit un ratio de :

**7 / 23 × 100 = 30,4 % de tests d’intégration**

Par nombre de tests exécutés (Surefire / Failsafe) :
```bash
grep -R --include="*.xml" -m1 "testsuite" back/target/surefire-reports | sed -E 's/.*tests="([0-9]+)".*/\1/' | awk '{sum+=$1} END {print sum+0}'
grep -R --include="*.xml" -m1 "testsuite" back/target/failsafe-reports | sed -E 's/.*tests="([0-9]+)".*/\1/' | awk '{sum+=$1} END {print sum+0}'
```

Résultat :

- 93 tests unitaires
- 41 tests d’intégration

Soit un ratio de :

**41 / (93 + 41) × 100 = 30,6 % de tests d’intégration**

### Front-end
Par nombre de tests exécutés :

- 54 tests unitaires
- 35 tests d’intégration

Soit un ratio de :

**35 / (54 + 35) × 100 = 39,3 % de tests d’intégration**

## Conformité avec le plan de test

Le travail réalisé est strictement conforme au plan de test fourni :

- respect du périmètre fonctionnel défini ;
- couverture de code supérieure à 80 %, conformément aux exigences de qualité ;
- proportion de tests d’intégration supérieure à 30 %, validée par plusieurs méthodes de calcul ;
- séparation claire entre tests unitaires et tests d’intégration ;
- exclusion volontaire des DTO côté back-end, conformément aux recommandations ;
- automatisation complète de l’exécution des tests (back-end, front-end et end-to-end).

# 🇬🇧 Educational Project: Testing & Quality Assurance
(Full-Stack Developer – Java & Angular Training Program)

## Overview
This project aims to ensure full testing coverage of an application before production release.
The scope includes:
- **Back-end tests**
- **Front-end tests**
- **End-to-End (E2E) tests**

The objective is to guarantee optimal quality, in accordance with the provided test plan, with:

- at least 80% code coverage
- at least 30% integration tests

## Technical prerequisites

Make sure the following tools are installed:

- Java 8
- Maven
- Node.js et npm
- MySQL database

## Installation and execution

### 1. Clone the repository

### 2. Create the MySQL database 
Example guide: 
https://openclassrooms.com/fr/courses/6971126-implementez-vos-bases-de-donnees-relationnelles-avec-sql/7152681-installez-le-sgbd-mysql

### 3. Front-end setup

```bash
cd /front
npm install
npm run start
```
Application available at:
```bash
http://localhost:4200
```
### 4. Back-end setup
- Configure the database connection in: 
```text
/back/src/main/resources/application.properties
```
- Then start the back-end:
```bash
./mvnw spring-boot:run
```
- API available at:
```bash
http://localhost:8080
```

## Running tests
### Back-end tests
```bash
cd /back
mvn test
mvn verify
```
### Front-end tests
```bash
cd /front
npm run test
```
### End-to-End (E2E) tests
```bash
cd /front
npm run e2e
```
## Coverage reports
### Back-end
```text
/back/target/site/jacoco-merged/index.html
```
### Front-end
```bash
cd /front
npm run test:cover
```
### E2E coverage
```bash
npm run e2e:coverage
```
## Compliance with the test plan

The work carried out is fully compliant with the provided test plan:

- adherence to the defined functional scope;
- code coverage exceeding 80%, in line with quality requirements;
- integration tests representing more than 30% of the total tests, validated using multiple calculation methods;
- clear separation between unit tests and integration tests;
- intentional exclusion of DTOs on the back-end, in accordance with best practices;
- full automation of test execution (back-end, front-end, and end-to-end).
