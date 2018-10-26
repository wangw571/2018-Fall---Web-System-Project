import hashlib
import json

from django.http import JsonResponse
from django.http import HttpRequest

from . import sqlite3Operations

accountDatabaseName = "account.db"

global TokenStorage
TokenStorage = {}

"""Note that passwords will be stored by SHA256"""
"""for account level, 0 for most powerful, and number increase cause power decrease"""

def AccountRequestDistribution(request : HttpRequest) -> JsonResponse:
    if request.method == "POST":
        body = request.POST.dict()
        pathh = request.path
        elif pathh == 'register':
            return registerAccount(body["username"], body["password"], body["level"])
        elif pathh == 'editAccount':
            username = getUserNameByToken(request)
            return editAccount(username, body["targetUser"], body["newPassword"], body["newLevel"])
        elif pathh == 'deleteAccount':
            username = getUserNameByToken(request)
            return deleteAccount(username, body["usernameToBeDeleted"],)
        elif pathh == 'login':
            return login(body["username"], body["password"])
        elif pathh == 'existanceCheck':
            return existanceCheck(body["username"])
    else:
        return JsonResponse({"error": "Method Incorrect"})



def registerAccount(username:str, password:str, level:str) -> JsonResponse:
    # storage
    createAccountsTable(accountDatabaseName)
    # existence check
    existenceSelection = sqlite3Operations.run_query(
        accountDatabaseName,
        "SELECT PasswordHashCode FROM ACCOUNTS WHERE Username = ?",
        (str(username),),
    )
    # Not existed? insert the new one
    if (len(existenceSelection) == 0):
        sqlite3Operations.run_query(
            accountDatabaseName,
            "INSERT INTO ACCOUNTS (Username,PasswordHashCode,Level) VALUES (?, ?, ?)",
            (str(username), hashCoding(password), str(level)),
            commit=True,
        )
        return JsonResponse({"success": "Creation successful"})
    # Existed
    return JsonResponse({"error": "Account Already Exist"})


def editAccount(username:str, targetUser:str, newPassword:str, newLevel:int) -> JsonResponse:
    # Token verification
    if(username != None):
        targetUser = username if targetUser == "" else targetUser
        # preventing exception, create the table
        createAccountsTable(accountDatabaseName)
        if(getUserLevel(username) <= 2 or (targetUser == "")): # either user has permission or user is editing self
            # update account level if needed
            if newLevel != "":
                if getUserLevel(username) <= 2:
                    sqlite3Operations.run_query(
                        accountDatabaseName,
                        "UPDATE ACCOUNTS set Level = ? WHERE Username=?",
                        (int(newLevel), targetUser),
                        commit=True,
                    )
                else:
                    # Access denied
                    return JsonResponse({"error": "level edition access denied"})
            # update account password if needed
            if newPassword != "":
                sqlite3Operations.run_query(
                    accountDatabaseName,
                    "UPDATE ACCOUNTS set PasswordHashCode = ? WHERE Username=?",
                    (hashCoding(newPassword), targetUser),
                    commit=True,
                )
            return JsonResponse({"success": "edition successful"})
        # Access denied
        return JsonResponse({"error": "Account Level Oversized, edition denied"})
    # Token Incorrect
    return JsonResponse({"error": "Token Invalid"})


def deleteAccount(username:str, userToBeDeleted:str) -> JsonResponse:
    # Token verification
    if(username != None):
        # storage
        # preventing exception, create the table
        createAccountsTable(accountDatabaseName)
        # user level check
        if getUserLevel(username) <= 2:
            # confirmed, deletion initiated
            sqlite3Operations.run_query(
                accountDatabaseName,
                "DELETE FROM ACCOUNTS WHERE Username = ?",
                (userToBeDeleted, ), commit=True,
            )
            return JsonResponse({"success": "deletion successful"})
        # Permission denied
        return JsonResponse({"error": "Account Level Oversized, deletion denied"})
    # Token Incorrect
    return JsonResponse({"error": "Token Invalid"})


def login(username:str, password:str) -> JsonResponse:
    # preventing exception, create the table
    createAccountsTable(accountDatabaseName)
    # existence check
    existenceSelection = sqlite3Operations.run_query(
        accountDatabaseName,
        "SELECT PasswordHashCode FROM ACCOUNTS WHERE Username = ?",
        (username,),
    )
    # verify
    hashCodedPassword = hashCoding(password)
    if (
        len(existenceSelection) > 0
        and existenceSelection[0][0] == hashCodedPassword
    ):
        token = hashCoding(username+password)
        TokenStorage[token] = username
        return JsonResponse({"success": "account correct", "token": token})
    # failed on verifyin:
    return JsonResponse({"error": "Incorrect Password Or Username"})

def existanceCheck(username:str) ->JsonResponse:
    # preventing exception, create the table
    createAccountsTable(accountDatabaseName)
    # existence check
    existenceSelection = sqlite3Operations.run_query(
        accountDatabaseName,
        "SELECT PasswordHashCode FROM ACCOUNTS WHERE Username = ?",
        (username,),
    )
    # existance check
    return JsonResponse({"existance": len(existenceSelection) != 0})

def hashCoding(toBeCoded: str) -> str:
    h = hashlib.sha256()
    passwordstr = toBeCoded
    h.update(bytes(passwordstr, encoding="utf-8"))
    return str(h.hexdigest())


def createAccountsTable(db:str):
    """Create the accounts table."""
    # Create the accounts table
    global accountTableExisted
    sqlite3Operations.createTable(
        db,
        """CREATE TABLE IF NOT EXISTS ACCOUNTS(Username TEXT, PasswordHashCode TEXT, Level INT)""",
    )
    accountTableExisted = True


def getUserNameByToken(request:HttpRequest) -> str:
    global TokenStorage
    tokeb = str(request.META.get("HTTP_TOKEN"))
    a = TokenStorage.get(tokeb)
    return a

def getUserLevel(username: str) -> int:
    return sqlite3Operations.run_query(
                accountDatabaseName,
                "SELECT Level FROM ACCOUNTS WHERE Username = ?",
                (username,),
            )[0][0]
