import account

import json

from django.http import JsonResponse
from django.http import HttpRequest
import unittest

import sqlite3Operations

class AccountTestCase(unittest.TestCase):

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

        def tearDown(self):
            sqlite3Operations.run_query(
                account.accountDatabaseName,
                "DROP TABLE ACCOUNTS",
                commit=True,
            )

    def tokenGenerator(username:str, password:str) -> str:
        return hashCoding(username+password)


    def test_login(self):
        jr1 = account.login("testuser1", "testpassword1")
        self.assertEquals(tokenGenerator("testuser1", "testpassword1"), jr1.get("token"))
        jr2 = account.login("testuser2", "testpassword2")
        self.assertEquals(tokenGenerator("testuser2", "testpassword2"), jr2.get("token"))
        jr3 = account.login("testuser1", "testpassword1")
        self.assertEquals(tokenGenerator("testuser1", "testpassword1"), jr3.get("token"))
        pass

    def test_login_failed(self):
        jr1 = account.login("testuser1", "falsepassword")
        self.assertEquals("Incorrect Password Or Username", jr1.get("error"))
        jr2 = account.login("testuser2", "testpassword2")
        self.assertEquals(tokenGenerator("testuser2", "testpassword2"), jr2.get("token"))
        jr3 = account.login("testuser3", "falsepassword")
        self.assertEquals("Incorrect Password Or Username", jr3.get("error"))
        pass

    def test_register(self):
        successMessage = "Creation successful"
        jr1 = account.registerAccount("testuserNewR", "testpasswordR", 0)
        self.assertEquals(successMessage, jr1.get("success"))
        jr2 = account.registerAccount("testuserNewR2", "testpasswordR", 2)
        self.assertEquals(successMessage, jr2.get("success"))
        pass

    def test_register_failed(self):
        successMessage = "Creation successful"
        failMessage = "Account Already Exist"
        jr1 = account.registerAccount("testuser1", "testpassword1", 0)
        self.assertEquals(failMessage, jr1.get("error"))
        jr2 = account.registerAccount("testuserNewR2", "testpasswordR", 2)
        self.assertEquals(successMessage, jr2.get("success"))
        jr3 = account.registerAccount("testuserNewR2", "testpasswordR", 0)
        self.assertEquals(failMessage, jr3.get("error"))
        jr4 = account.registerAccount("testuserNewR2", "testpasswordnotDup", 0)
        self.assertEquals(failMessage, jr4.get("error"))
        pass


    def test_existanceCheck(self):
        jr1 = account.existanceCheck("testuser1")
        self.assertEquals(True, jr1.get("existance"))
        jr2 = account.existanceCheck("testuserNewR2")
        self.assertEquals(False, jr2.get("existance"))
        pass

if __name__ == "__main__":
    unittest.main(exit=False)