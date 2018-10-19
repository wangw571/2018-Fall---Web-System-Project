from django.http import HttpResponse
from . import sqlite3Operations
import hashlib
import re

accountTableExisted = False
accountDatabaseName = 'account.db'

'''Note that passwords will be stored by SHA256'''

def registerAccount(request):
    registerRequest = request.get_full_path()  # get request which contains username and password
    if(re.match(r'^/register\?username\=[＼x80-＼xffa-zA-Z][＼x80-＼xffa-zA-Z0-9]{3,20}\&password\=[a-zA-Z0-9]{6,20}$', registerRequest)):
        # split username and password
        username = re.findall(
            r'username\=[＼x80-＼xffa-zA-Z][＼x80-＼xffa-zA-Z0-9]{3,20}', registerRequest)[0][9:]
        password = re.findall(r'password\=[a-zA-Z0-9]{6,20}', registerRequest)[0][9:]
        # storage
        if(not accountTableExisted):
            createAccountsTable(accountDatabaseName)
        sqlite3Operations.run_query(
            accountDatabaseName, "INSERT INTO ACCOUNTS VALUES(?,?)", (username, hashCoding(password)))
        return HttpResponse("T" + username + password)
    # Task: identify failure of username and password
    return HttpResponse("F" + registerRequest)


def hashCoding(toBeCoded):
    h = hashlib.sha256()
    passwordstr = toBeCoded
    h.update(bytes(passwordstr, encoding='utf-8'))
    return h.hexdigest()


def createAccountsTable(db):
    '''Create the accounts table.'''
    # Create the accounts table
    sqlite3Operations.createTable(db, '''CREATE TABLE IF NOT EXISTS ACCOUNTS(Username TEXT, PasswordHashCode TEXT)''')
    accountTableExisted = True