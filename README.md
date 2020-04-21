# drew_peters_p0
A new repository for my Project 0.
Project 0
For Project 0, you will be building a RESTful API using TypeScript and Express. Associates are allowed to come up with their own API idea, but it must be approved by the trainer.

My idea: Banking API that persists 3 data sets.
Users  { id, fn, ln, un, pw, role }
Accounts  { id, balance, type, ownerId }
Transactions  { id, amount, description, accountId }

Features
 RESTful API (At least Level 2 of the Richardson Maturity Model)
 Documentation (all methods have basic documentation)
 Unit testing (>= 80% coverage)
 SQL Data Persistance (at least 3 tables; all 3NF)
 Logging (extra)
 Authentication/Authorization (extra)

Tech Stack
 TypeScript
 PostGreSQL
 node-postgre
 Express
 Jest
 Git SCM (on GitHub)

Init Instructions
Select a project idea and submit it to trainer for approval. Be sure to include:
The 3 data entities that you will be persisting
Any external APIs that you will be using (not required if none are used)
Once approved, create a new repository within this organization (naming convention: firstname_lastname_p0)

Presentation
 5 minute live demonstration of endpoint consumption using Postman
