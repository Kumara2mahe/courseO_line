# Standard libraries
import sqlite3
import datetime
import json

# Third Party
import psycopg2
import dj_database_url
from psycopg2.extras import DictCursor

# local
from commandValidator import *
from backends.tools import objToDict

# -----------------------------------------------------------
APP_NAMES = ("courseWebsite", "administrator")
JSON_FILE = f"courseO_line{EXT}"
TOINCLUDE = ("auth_user", "django_session")
TOEXCLUDE = ("courseWebsite_appcredential", )
REPLACEMENT = ("ourcourse", "coursedetail")
UNIQUETABLES = {"administrator_verificationotp": "expires_on",
                "django_session": "expire_date"}


def main():

    # Validating command line arguments
    args = validateArgs(
        params=(__file__, "pathtodb", "[jsonpath]"),
        minargs=1
    )

    # Checking existence of json path
    if args[0] == 2:
        json_file = checkJson(args[1][1], askIfExists=True)
    else:
        json_file = checkJson(JSON_FILE)

    # Copying DB data as a JSON
    sql_toJSON(args[2], args[1][0], json_file)


def checkJson(file: str, askIfExists: bool | None = None):
    """
        Check if the json file exists and generate new name for the json file if exists

        Parameters:
            file (str): takes the path to the existing json file
            [askIfExists] (bool|None): asks for confirmation before overwriting existing file

        Return:
            str: new name for the json file
    """

    json_file, count = file, 1
    while Path(json_file).exists():
        json_file = file.removesuffix(EXT) + str(count) + EXT
        count += 1

    if count != 1 and askIfExists:
        reply = input(
            f"Json file: '{file}' exists, do you want to overwrite (Y/N) create new one? ").capitalize()
        if reply and reply[0] == "Y":
            json_file = file

    return json_file


def sql_toJSON(db_name, urlORpath, json_path):
    """
        Connect the database file and copying the App specific tables with their data into a json file

        Parameters:
            db_name (str): takes the name of db from any of these [sqlite, postgresql]
            urlORpath (str): takes the path to the existing db file
            json_path (str): takes the path to the new json file
    """
    if db_name == BACKEND_NAMES[0]:
        with sqlite3.connect(urlORpath) as db:

            # Converting to Row Object
            db.row_factory = sqlite3.Row
            co = db.cursor()

            # Getting all tables of App
            co.execute("SELECT name FROM sqlite_master WHERE type='table'")
            dbData = sql_parser(co, db_name)

    elif db_name == BACKEND_NAMES[1]:

        # Collecting Database config
        credDict = dict(dj_database_url.config("DB_URL", urlORpath))
        db_config = {"host": credDict["HOST"],
                     "database": credDict["NAME"],
                     "user": credDict["USER"],
                     "password": credDict["PASSWORD"]}

        try:
            with psycopg2.connect(**db_config) as db:

                # Cursor as Dict
                co = db.cursor(cursor_factory=DictCursor)

                # Getting all tables of App
                co.execute(
                    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' and table_type='BASE TABLE'")
                dbData = sql_parser(co, db_name)

        except Exception as msg:
            sys.exit(f"OperationalError: {msg}")
    else:
        sys.exit(
            f"DBError: something went wrong, see the Usage and Try Again!{USAGE}")

    # Writing the dict object as json
    if dbData:
        with open(json_path, "w") as file:
            json.dump(dbData, file, indent=4,
                      sort_keys=False, default=jsonSerializer)
        message = f"Table data from '{urlORpath}' is exported to '{json_path}'"
    else:
        message = f"Nothing to export from '{urlORpath}'"
    print(f"\n>>> {message}\n{SEP}")


def sql_parser(cur, dbname):
    """
        Parse the database file and copying the App specific tables with their data into a Dict object

        Parameters:
            cur (Cursor|DictCursor): which helps to work with database
            dbname (str): must be from [sqlite, postgresql] to identify db specific keywords

        Return:
            dict[str, list[dict[str, object]]]: list of all specificed tables and its fields

    """
    IDX, dbData = 0, {}
    table_names = [t[IDX] for t in cur.fetchall()
                   if (t[IDX].startswith(APP_NAMES) or t[IDX] in TOINCLUDE) and t[IDX] not in TOEXCLUDE]

    categorys = []
    for name in table_names:
        print(".", name)
        table, field = f'"{name}"', "id"

        # Query everything from table
        if name in UNIQUETABLES.keys():
            field = UNIQUETABLES[name]
        elif name.endswith(REPLACEMENT[0]):
            name = name.replace(REPLACEMENT[0], REPLACEMENT[1])
        cur.execute(f"SELECT * FROM {table} ORDER BY {field}")

        # Converting cursor object to list of dicts
        dbData[name], categorys = objToDict(cur.fetchall(), name, categorys, dbname)

    return dbData


def jsonSerializer(obj):
    """
        Serializer for objects which cannot be serializable with the defaults
    """
    if isinstance(obj, (datetime.date, datetime.datetime)):
        return obj.isoformat()


if __name__ == "__main__":
    main()
