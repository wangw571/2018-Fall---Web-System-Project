from django.test import TestCase
from ../backend/ import account

import json

from django.http import JsonResponse
from django.http import HttpRequest

from ../backend/ import sqlite3Operations

class AccountTestCase(TestCase):

    def setUp(self):
        account.createAccountsTable(account.accountDatabaseName)
        sqlite3Operations.run_query(
                account.accountDatabaseName,
                "INSERT INTO ACCOUNTS (Username,PasswordHashCode,Level) VALUES (?, ?, ?)",
                ("testuser1", account.hashCoding("testpassword1"), 0),
                commit=True,
            )
        sqlite3Operations.run_query(
                account.accountDatabaseName,
                "INSERT INTO ACCOUNTS (Username,PasswordHashCode,Level) VALUES (?, ?, ?)",
                ("testuser2", account.hashCoding("testpassword2"), 2),
                commit=True,
            )
        sqlite3Operations.run_query(
                account.accountDatabaseName,
                "INSERT INTO ACCOUNTS (Username,PasswordHashCode,Level) VALUES (?, ?, ?)",
                ("testuser3", account.hashCoding("testpassword3"), 15),
                commit=True,
            )



    def test_login(self):
        pass
