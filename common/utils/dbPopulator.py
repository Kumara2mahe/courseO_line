# Standard libraries
import json
import sqlite3

# Third Party
import psycopg2
import dj_database_url

# local
from commandValidator import (Path, sys, validateArgs,
                              SEP, BACKEND_NAMES, USAGE)
from backends import createNewRecord

# -----------------------------------------------------------


def main():

    # Validating command line arguments
    args = validateArgs(
        params=(__file__, "pathtodb", "jsonpath"),
        minargs=2
    )

    # Copying json data back to sql
    json_dataPopulator(
        jsonpath=args[1][1],
        urlORpath=args[1][0],
        db_name=args[2]
    )


def json_dataPopulator(jsonpath, urlORpath, db_name):
    """
        Populate empty tables in Database with data parsed from the json file

        Parameters:
            jsonpath (str): path to the json file which is the data to be parsed
            urlORpath (str): takes the path/url to the existing db file
            dbname (str): must be name of the django database backends
    """

    # Converting json to dict
    with open(jsonpath) as js:
        TABLE_CONFIG = json.load(js)
    TABLE_NAMES = list(TABLE_CONFIG.keys())

    # Getting Database configuration and connecting to it
    DB_CONFIG = getDB_config(db_name, urlORpath)
    with DB_CONFIG["adapter"].connect(**DB_CONFIG["details"]) as conn:

        # Cursor
        co = conn.cursor()

        # Getting only the empty tables
        empty_tables = getEmptyTables(cursor=co,
                                      tableNames=TABLE_NAMES,
                                      tableConfig=TABLE_CONFIG,
                                      dbname=db_name)

        # Filling Empty tables
        if empty_tables:
            for name, tablename, tableData in empty_tables:
                print(".", name)
                for dat in tableData:
                    createNewRecord(db_name, co, tablename, dat)
            message = f"Json data from '{jsonpath}' is imported to '{urlORpath}'"
        else:
            message = f"No empty tables in '{urlORpath}' to populate from '{jsonpath}'"
    print(f"\n>>> {message}\n{SEP}")


def getDB_config(db_name, urlORpath):
    """
        Get concurrent Database driver and its configuration to connect to the database

        Parameters:
            dbname (str): must be name of the django database backends
            urlORpath (str): takes the path/url to the existing db file
    """

    if db_name == BACKEND_NAMES[0]:

        # Adapter & config for Sqlite Database
        adapter = sqlite3
        db_config = {"database": str(urlORpath)}

    elif db_name == BACKEND_NAMES[1]:

        # Adapter & config for Postgresql Database
        adapter = psycopg2
        credDict = dict(dj_database_url.config("DB_URL", urlORpath))
        db_config = {"host": str(credDict["HOST"]),
                     "database": str(credDict["NAME"]),
                     "user": str(credDict["USER"]),
                     "password": str(credDict["PASSWORD"])}
    else:
        # Modifying Usage Hint
        filename = Path(__file__).name
        HINT = USAGE % (filename, "pathtodb", "jsonpath")
        sys.exit(f"\n>>> Not a valid DB in Django backends{HINT}")

    return {"adapter": adapter, "details": db_config}


def getEmptyTables(cursor, tableNames, tableConfig, dbname):
    """
        Get all the empty tables in the passed in database

        Parameters:
            cursor (Cursor): cursor object to current database
            tableNames (list[str,..]): holds all the name of tables to search for
            tableConfig (dict[str, object]): holds the name and configuration(data) for each tables in parameter(tableNames)
            dbname (str): must be name of the django database backends

        Returns:
            list[tuple[str, object]]: an iterable list of tuples containing the empty table name and their configuration
    """
    empty_tables = []
    for name in tableNames:
        table = f'"{name}"'

        # Querying everything from the empty table
        cursor.execute(f'SELECT * FROM {table}')
        if not cursor.fetchall():
            empty_tables.append((name, table, tableConfig[name]))

    return empty_tables


if __name__ == "__main__":
    main()
