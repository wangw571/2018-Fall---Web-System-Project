# Get Started
## Required Tools
 - [Mongodb](https://www.mongodb.com/download-center/community)
 - [Nodejs](https://nodejs.org/en/download/)
 
## Installation
 - git clone https://github.com/CSCC01/Team19.git
 - cd ./Back-end
 - npm install
 - mongorestore --port 27017 -d greencare ./src/test/db (Althought it's only the test database, its a good start)
###### You would need an .env file for this to work, refer to deliverable 5 for details (We keep it off the readme to keep our application secure)
###### Too much effort? Say no more! Our project can also be found live [here](https://cscc01backend.herokuapp.com). Running the newest version from our CI/CD scripts.

## Testing
For the proper testing configuration for .env, reference deliverable 5. To test, it's just a simple "npm test" and you're off to the races!

# End points: 
######  Note: all end points(except log in) require 'Authorization' to be existing in header with token inside. Token format: Bearer ${token}
## Authorization:
### /login
->{email, password}
##### Success:
200
with json {data: {token: token for further operations, _sys: 1}}<-
##### Failure:
* 403

### /logout
##### Success:
200
##### Failure:
* 409

## Orgnization: 
### /orgs
#### GET
##### Success:
200
with json {data: all Orgnizations' data}<-
##### Failure:
* 403

#### POST
->{name, _sys, permissions}
##### Success:
200          
##### Failure:
* 401
* 403
* 409

### /orgs/${org_id}
#### GET
##### Success:
200
with json {data: desinated Orgnization}<-
##### Failure:
* 401
* 403

#### POST
->{name, _sys, permissions}
##### Success:
200
with json {data: desinated Orgnization}<-
##### Failure:
* 401
* 403
* 409

#### DELETE
##### Success:
200
with json {data: { _org: organization id, usersDeleted: deleted #  of users }}<-
##### Failure:
* 401
* 403
* 409

## User:
### /users
#### GET
##### Success:
200
with json {data: desinated Orgnization}<-
### /users/me
#### GET
##### Success:
200
with json {data: { firstname, lastname, admin}}<-
##### Failure:
* 401
* 403
* 409

#### POST
->{password, firstname, lastname, email}
##### Success:
200
##### Failure:
* 401
* 403
* 409

### /users/${org_id}
#### GET
##### Success:
200
with json {data: users under this org }<-
##### Failure:
* 401
* 403
* 409

#### POST
->{password, firstname, lastname, email, admin}
##### Success:
200
##### Failure:
* 401
* 403
* 409

### /users/${org_id}/${user_id}
#### GET
##### Success:
200
with json {data: { id, firstname, lastname, admin, email}}<-
##### Failure:
* 403

#### POST
->{password, firstname, lastname, email, admin}
##### Success:
200
##### Failure:
* 403

#### DELETE
##### Success:
200
##### Failure:
* 403
* 404

## Tempelate:
### /temp
#### GET
##### Success:
200
with json {templates' data corresponding to org}<-
#### POST
->Template xlsx file
##### Success:
200
with json {data:insert id}<-
##### Failure:
* 403
* 406
* 415

### /temp/${temp_id}
#### GET
##### Success:
200
with json {template's data}<-
##### Failure:
* 401
* 404

#### POST
##### File: {any data that want to be updated}
##### Success:
200
##### Failure:
* 401
* 403
* 409

#### DELETE
##### Success:
200
##### Failure:
* 401
* 403
* 404

## Submit:
### /submit
#### GET
##### Success:
200
with json {Submission data correspond to org}<-
### /submit/${tid}
#### GET
##### Success:
200
with json {data: requested data}<-
##### Failure:
* 401
* 403
* 404

#### POST
upload: {data}
##### Success:
200
with json {_id: inserted ID, data}<-
##### Failure:
* 403
* 404
* 406
* 409

#### PATCH
->{data to be set}
##### Success:
200
with json {_id: inserted ID, data}<-
##### Failure:
* 401

#### DELETE
##### Success:
200
with json {_id: inserted ID, data}<-
##### Failure:
* 401

## Query:
### /queries
#### GET
##### Success:
200
with json {data of queries}<-
##### Failure:
* 403

#### POST
with json {query, name} // Query will be in the format of a json of a mongodb aggregate
##### Success:
200
with json {_id: query ID, data of query}<-
##### Failure:
* 403
* 406

### /queries/${query_id}
#### GET
##### Success:
200
with json {data of query}<-
##### Failure:
* 403
* 404

#### POST
->{query to be updated}
##### Success:
200
with json {data: query data}<-
##### Failure:
* 401
* 403
* 406

#### PUT
##### Success:
200
with json {data: query result}<-
##### Failure:
* 403
* 404
* 406

#### DELETE
##### Success:
200
##### Failure:
* 401
* 403
