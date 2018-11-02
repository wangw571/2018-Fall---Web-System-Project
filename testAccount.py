import json

from django.http import JsonResponse
from django.http import HttpRequest
from django.test import TestCase

from backend import account
from backend import sqlite3Operations

class AccountTestCase(TestCase):

    def getJRvalue(self, jr: JsonResponse, key:str):
        return json.loads(jr.content)[key]

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

    def tokenGenerator(self, username:str, password:str) -> str:
        return account.hashCoding(username+password)


    def test_login(self):
        jr1 = account.login("testuser1", "testpassword1")
        self.assertEquals(self.tokenGenerator("testuser1", "testpassword1"), self.getJRvalue(jr1, "token"))
        jr2 = account.login("testuser2", "testpassword2")
        self.assertEquals(self.tokenGenerator("testuser2", "testpassword2"), self.getJRvalue(jr2, "token"))
        jr3 = account.login("testuser1", "testpassword1")
        self.assertEquals(self.tokenGenerator("testuser1", "testpassword1"), self.getJRvalue(jr3, "token"))
        pass

    def test_login_failed(self):
        jr1 = account.login("testuser1", "falsepassword")
        self.assertEquals("Incorrect Password Or Username", self.getJRvalue(jr1, "error"))
        jr2 = account.login("testuser2", "testpassword2")
        self.assertEquals(self.tokenGenerator("testuser2", "testpassword2"), self.getJRvalue(jr2, "token"))
        jr3 = account.login("testuser3", "falsepassword")
        self.assertEquals("Incorrect Password Or Username", self.getJRvalue(jr3, "error"))
        pass

    def test_register(self):
        successMessage = "Creation successful"
        jr1 = account.registerAccount("testuserNewR", "testpasswordR", 0)
        self.assertEquals(successMessage, self.getJRvalue(jr1, "success"))
        jr2 = account.registerAccount("testuserNewR2", "testpasswordR", 2)
        self.assertEquals(successMessage, self.getJRvalue(jr2, "success"))
        pass

    def test_register_failed(self):
        successMessage = "Creation successful"
        failMessage = "Account Already Exist"
        jr1 = account.registerAccount("testuser1", "testpassword1", 0)
        self.assertEquals(failMessage, self.getJRvalue(jr1, "error"))
        jr2 = account.registerAccount("testuserNewR2", "testpasswordR", 2)
        self.assertEquals(successMessage, self.getJRvalue(jr2, "success"))
        jr3 = account.registerAccount("testuserNewR2", "testpasswordR", 0)
        self.assertEquals(failMessage, self.getJRvalue(jr3, "error"))
        jr4 = account.registerAccount("testuserNewR2", "testpasswordnotDup", 0)
        self.assertEquals(failMessage, self.getJRvalue(jr4, "error"))
        pass


    def test_existanceCheck(self):
        jr1 = account.existanceCheck("testuser1")
        self.assertEquals(True, self.getJRvalue(jr1, "existance"))
        jr2 = account.existanceCheck("testuserNewR2")
        self.assertEquals(False, self.getJRvalue(jr2, "existance"))
        pass