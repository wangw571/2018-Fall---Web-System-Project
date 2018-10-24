import hashlib
import json
import re

from django.http import JsonResponse
from django.http import HttpRequest

from . import sqlite3Operations

accountDatabaseName = "account.db"

TokenStorage = {}

"""Note that passwords will be stored by SHA256"""


def registerAccount(request : HttpRequest) -> JsonResponse:
    if request.method == "POST":
        # get data
        body = request.POST.dict()
        username = body["username"]
        password = body["password"]
        level = body["level"]
        # 0 for most powerful, and number increase cause power decrease
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
    else:
        return JsonResponse({"error": "Method Incorrect"})


def editAccount(request:HttpRequest) -> JsonResponse:
    if request.method == "POST":
        # get data
        username = getUserNameByToken(request)
        # Token verification
        if(username != None):
            body = request.POST.dict()
            newPassword = body["newPassword"]
            newLevel = body["newLevel"]  # leave blank when no edition is needed
            # preventing exception, create the table
            createAccountsTable(accountDatabaseName)
            # update
            sqlite3Operations.run_query(
                accountDatabaseName,
                "UPDATE ACCOUNTS set PasswordHashCode = ? WHERE Username=?",
                (hashCoding(newPassword), username),
                commit=True,
            )
            # update account level if needed
            if newLevel != "":
                sqlite3Operations.run_query(
                    accountDatabaseName,
                    "UPDATE ACCOUNTS set Level = ? WHERE Username=?",
                    (int(newLevel), username),
                    commit=True,
                )
            return JsonResponse({"success": "edition successful"})
        # Token Incorrect
        return JsonResponse({"error": "Token Invalid"})
    else:
        return JsonResponse({"error": "Method Incorrect"})


def deleteAccount(request:HttpRequest) -> JsonResponse:
    if request.method == "POST":
        # get data
        username = getUserNameByToken(request)
        # Token verification
        if(username != None):
            body = request.POST.dict()
            userToBeDeleted = body["usernameToBeDeleted"]
            # storage
            # preventing exception, create the table
            createAccountsTable(accountDatabaseName)
            # user level check
            existenceSelection = sqlite3Operations.run_query(
                accountDatabaseName,
                "SELECT Level FROM ACCOUNTS WHERE Username = ?",
                (username,),
            )
            if existenceSelection[0][0] <= 2:
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
    else:
        return JsonResponse({"error": "Method Incorrect"})


def login(request:HttpRequest) -> JsonResponse:
    if request.method == "POST":
        # get data
        body = request.POST.dict()
        username = body["username"]
        password = body["password"]
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
            TokenStorage[username] = hashCoding(username+password)
            return JsonResponse({"success": "account correct"})
        # failed on verifying
        return JsonResponse({"error": "Incorrect Password Or Username"})
    else:
        return JsonResponse({"error": "Method Incorrect"})


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
    return TokenStorage.get(request.META.get("token"))