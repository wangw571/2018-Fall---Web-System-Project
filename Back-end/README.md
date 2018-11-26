###### Note: all end points(except log in) require 'Authorization' to be existing in header with token inside. Token format: Bearer ${token}

##End points: 
  ##Authorization:
     /login
      ->{email, password}
          Success:
          200
          {data: {token: token for further operations, _sys: 1}}<-
        Failure:
          403
     /logout
      Success:
          200
        Failure:
          409
          
  ##Orgnization: 
    /orgs
      GET
        Success:
          200
          {data: all Orgnizations' data}<-
        Failure:
          403
      POST
        ->{name, _sys, permissions}
        Success:
          200          
        Failure:
          401
          403
          409
    /orgs/${org_id}
      GET
        Success:
          200
          {data: desinated Orgnization}<-
        Failure:
          401
          403
      POST
        ->{name, _sys, permissions}
        Success:
          200
          {data: desinated Orgnization}<-
        Failure:
          401
          403
          409
      DELETE
        Success:
          200
          {data: { _org: organization id, usersDeleted: deleted # of users }}<-
        Failure:
          401
          403
          409
  ##User:
    /users
      GET
        Success:
          200
          {data: desinated Orgnization}<-
    /users/me
      GET
        Success:
          200
          {data: { firstname, lastname, admin}}<-
        Failure:
          401
          403
          409
      POST
        ->{password, firstname, lastname, email}
        Success:
          200
        Failure:
          401
          403
          409
    /users/${org_id}
      GET
        Success:
          200
          {data: users under this org }<-
        Failure:
          401
          403
          409
      POST
        ->{password, firstname, lastname, email, admin}
        Success:
          200
        Failure:
          401
          403
          409
    /users/${org_id}/${user_id}
      GET
        Success:
          200
          {data: { id, firstname, lastname, admin, email}}<-
        Failure:
          403
      POST
        ->{password, firstname, lastname, email, admin}
        Success:
          200
        Failure:
          403
      DELETE
        Success:
          200
        Failure:
          403
          404
  ##Tempelate:
    /temp
      GET
        Success:
          200
          {templates' data corresponding to org}<-
      POST
      ->Template xlsx file
        Success:
          200
          {data:insert id}<-
        Failure:
          403
          406
          415
    /temp/${temp_id}
      GET
        Success:
          200
          {template's data}<-
        Failure:
          401
          404
      POST
      file: {any data that want to be updated}
        Success:
          200
        Failure:
          401
          403
          409
      DELETE
        Success:
          200
        Failure:
          401
          403
          404
  ##Submit:
    /submit
      GET
        Success:
          200
          {Submission data correspond to org}<-
    /submit/${tid}
      GET
        Success:
          200
          {data: requested data}<-
        Failure:
          401
          403
          404
      POST
        upload: {data}
        Success:
          200
          {_id: inserted ID, data}<-
        Failure:
          403
          404
          406
          409
      PATCH
        ->{data to be set}
        Success:
          200
          {_id: inserted ID, data}<-
        Failure:
          401
      DELETE
        Success:
          200
          {_id: inserted ID, data}<-
        Failure:
          401
  ##Query:
    /queries
      GET
        Success:
          200
          {data of queries}<-
        Failure:
          403
      POST
        {query, name} // Query will be in the format of a json of a mongodb aggregate
        Success:
          200
          {_id: query ID, data of query}<-
        Failure:
          403
          406
    /queries/${query_id}
      GET
        Success:
          200
          {data of query}<-
        Failure:
          403
          404
      POST
        ->{query to be updated}
        Success:
          200
          {data: query data}<-
        Failure:
          401
          403
          406
      PUT
        Success:
          200
          {data: query result}<-
        Failure:
          403
          404
          406
      DELETE
        Success:
          200
        Failure:
          401
          403