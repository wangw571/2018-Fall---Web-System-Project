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
        targetUser // Leave blank if change is on self
        newPassword // Leave blank if change is not needed
        newLevel // Leave blank if change is not needed
    ##### JsonOut
        {"success": "edition successful"}
        {"error": "access denied"}
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
    ##### JsonIn - Body
        username
        password
    ##### JsonOut
        {"success": "account correct", "token": sometoken} // Token will be a hash of SHA256
        {"error": "Incorrect Password Or Username"}
        {"error": "Token Invalid"}
        {"error": "Method Incorrect"}
        
## Updates
  2018/10/24
  - Account management - Changed to Token verification for operations.
