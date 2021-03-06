# Project 0

For my Project 0, I will be building a functional banking API that persists 3 sets of data. Those data sets are comprised of users, accounts, and transactions. Below is an ERD of my API explaining the relationship between the entities. My API complies with all the below features, minus %10 points shy of unit testing. It has logging functionality, and requires authentication, and authorization for some functionality. I will be demonstrating my API consumption with Postman.


## My idea: Banking API that persists 3 data sets.
 - Users  { id, fn, ln, un, pw, role }
 - Accounts  { id, balance, type, ownerId }
 - Transactions  { id, amount, description, accountId }

## My ERD:
![](images/p_0%20Banking%20API%20ERD.jpeg)

## Features
 - [ ] RESTful API (At least Level 2 of the Richardson Maturity Model)
 - [ ] Documentation (all methods have basic documentation)
 - [ ] Unit testing (>= 80% coverage)
 - [ ] SQL Data Persistance (at least 3 tables; all 3NF)
 - [ ] Logging (extra)
 - [ ] Authentication/Authorization (extra)
 

## Tech Stack
 - [ ] TypeScript
 - [ ] PostGreSQL
 - [ ] node-postgre
 - [ ] Express
 - [ ] Jest
 - [ ] Git SCM (on GitHub)
 

## Init Instructions
- Select a project idea and submit it to trainer for approval. Be sure to include:
 - The 3 data entities that you will be persisting
 - Any external APIs that you will be using (not required if none are used)
- Once approved, create a new repository within this organization (naming convention: firstname_lastname_p0)

## Presentation
  5 minute live demonstration of endpoint consumption using Postman