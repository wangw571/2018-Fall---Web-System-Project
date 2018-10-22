# Team Newline (Team19)
## Backend

### Main Backend Members
 - Jialiang Lin
 - Qingtian Wang
 - Chaoyue Xi
 
### End Points
#### Account Management
- register
    ##### JsonIn
        username
        password
        level // 0 for most powerful, and number increase cause power decrease
    ##### JsonOut
        {"success": "creation successful"}
        {"error": "Account Already Exist"}
        {"error": "Method Incorrect"}

- editAccount
    ##### JsonIn
        username
        oldPassword
        newPassword
        newLevel
    ##### JsonOut
        {"success": "edition successful"}
        {"error": "Account Does Not Exist Or Old Password Incorrect"}
        {"error": "Method Incorrect"}

- deleteAccount
    ##### JsonIn
        username
        password
        usernameToBeDeleted
    ##### JsonOut
        {"success": "deletion successful"}
        {"error": "Account Level Oversized, deletion denied"}
        {"error": "Incorrect Password Or Username"}
        {"error": "Method Incorrect"}

- login
    ##### JsonIn
        username
        password
    ##### JsonOut
        {"success": "account correct"}
        {"error": "Incorrect Password Or Username"}
        {"error": "Method Incorrect"}
        
## Updates
  N/A
