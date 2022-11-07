from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from doSql import doSql
import os
from utils import sqlAlconn
import sys

class DBconn:
    def __init__(self, ptype):
        #dbadd = os.environ['OPENSHIFT_POSTGRESQL_DB_HOST']
        #dbport = os.environ['OPENSHIFT_POSTGRESQL_DB_PORT']
        #dbloc = dbadd + ":" + dbport
        #engine = create_engine("postgresql://myeskwela2:letmein@"+dbloc+"/myeskwela", echo=False)
        self.engine = create_engine(sqlAlconn(ptype),
                                    poolclass=NullPool)

        self.conn = self.engine.connect()
        self.trans = self.conn.begin()

    def getcursor(self):
        cursor = self.conn.connection.cursor()
        return cursor

    def dbcommit(self):
        self.trans.commit()

    def close(self):
        self.conn.close()
        self.engine.dispose()

class DBConn2:
    def __init__(self, type):
        self.db = doSql(type)

    def execQry(self, qry, commit=False):
        return self.db.execqry(qry, commit)


def spcall(qry, param, ptype="super",commit=False):
    try:
        dbo = DBconn(ptype)
        cursor = dbo.getcursor()
        cursor.callproc(qry, param)
        res = cursor.fetchall()
        if commit:
            dbo.dbcommit()
        dbo.close()
        return res
    except:
        res = [("Error: " + str(sys.exc_info()[0]) +
                " " + str(sys.exc_info()[1]),)]
    return res