# Team Newline (Team19)
## Backend

### Main Backend Members
 - Jialiang Lin
 - Qingtian Wang
 - Chaoyue Xi
 
### End Points
#### Account Management
 - register
    ##### JsonIn - Header
        username
        password
        level // 0 for most powerful, and number increase cause power decrease
    ##### JsonOut
        {"success": "Creation successful"}
        {"error": "Account Already Exist"}
        {"error": "Method Incorrect"}

 - editAccount
    ##### JsonIn - Header
        token
    ##### JsonIn - Body
        newPassword
        newLevel // Leave blank if change is not needed
    ##### JsonOut
        {"success": "edition successful"}
        {"error": "Token Invalid"}
        {"error": "Method Incorrect"}

 - deleteAccount
    ##### JsonIn - Header
        token
    ##### JsonIn - Body
        usernameToBeDeleted
    ##### JsonOut
        {"success": "deletion successful"}
        {"error": "Account Level Oversized, deletion denied"}
        {"error": "Token Invalid"}
        {"error": "Method Incorrect"}

 - login
    ##### JsonIn
        username
        password
    ##### JsonOut
        {"success": "account correct", "token": sometoken}
        {"error": "Incorrect Password Or Username"}
        {"error": "Token Invalid"}
        {"error": "Method Incorrect"}
        
## Updates
  2018/10/24
  - Account management - Changed to Token verification for operations.
