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

    def tokenGenerator(username:str, password:str) -> str:
        return hashCoding(username+password)


    def test_login(self):
        jr1 = account.login("testuser1", "testpassword1")
        assertEquals(tokenGenerator("testuser1", "testpassword1"), jr1.get("token"))
        jr2 = account.login("testuser2", "testpassword2")
        assertEquals(tokenGenerator("testuser2", "testpassword2"), jr2.get("token"))
        jr3 = account.login("testuser1", "testpassword1")
        assertEquals(tokenGenerator("testuser1", "testpassword1"), jr3.get("token"))
        pass

    def test_login_failed(self):
        jr1 = account.login("testuser1", "falsepassword")
        assertEquals("Incorrect Password Or Username", jr1.get("error"))
        jr2 = account.login("testuser2", "testpassword2")
        assertEquals(tokenGenerator("testuser2", "testpassword2"), jr2.get("token"))
        jr3 = account.login("testuser3", "falsepassword")
        assertEquals("Incorrect Password Or Username", jr3.get("error"))
        pass
