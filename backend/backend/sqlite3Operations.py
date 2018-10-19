import sqlite3


def run_query(db, query, args=None):
    '''Return the results of running query q on database db.
    If given, args contains the query arguments.'''

    con = sqlite3.connect(db)
    cur = con.cursor()
    if args is None:
        cur.execute(query)
    else:
        cur.execute(query, args)
    data = cur.fetchall()
    cur.close()
    con.close()
    return data


def createTable(db, tableCreateQuery):
    '''Create a table.'''
    # connect to the database
    con = sqlite3.connect(db)
    # create a cursor
    cur = con.cursor()

    # Create the table
    cur.execute(tableCreateQuery)

    # close the cursor
    cur.close()

    # commit the changes
    con.commit()

    # close the connection
    con.close()
