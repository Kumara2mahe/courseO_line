# local
from commandValidator import BACKEND_NAMES
from backends.tools import copyFile, TABLE_NAMES, MEDIA_FIELDS

BOOL_FIELDS = ("is_superuser", "is_staff", "is_active")


def createNewRecord(db_name, cursor, tablename, data):
    """
        Function to directly inserting records into the Database for only empty tables

        Parameters:
            db_name (str): must be from [sqlite, postgresql], backend names of the django supported database
            cursor (Cursor): cursor object to current database
            tablename (str): name of the table to insert a new record
            data (dict): contains the fields and records of data to be inserted into table
    """

    # Collecting all keys from table and its respective values
    cursor.execute(f"SELECT * FROM {tablename}")
    values = []
    hasidkey, is_posgres = (False, db_name == BACKEND_NAMES[1])
    for d in cursor.description:
        value = data[(key := d[0])]
        if key == "id" and not hasidkey:
            hasidkey = True
        elif is_posgres and key in BOOL_FIELDS:
            value = bool(data[key])
        values.append(value)

    # Copying files
    if TABLE_NAMES[0] in tablename:
        values[2] = copyFile(obj=data[MEDIA_FIELDS[0]],
                    dbname=db_name,
                    create=True,
                    storeOnline=is_posgres)
    elif TABLE_NAMES[1] in tablename:
        values[3] = copyFile(obj=data[MEDIA_FIELDS[1]],
                    dbname=db_name,
                    create=True,
                    storeOnline=is_posgres)

    # Inserting tuple to table as a record
    cursor.execute(f"INSERT INTO {tablename} VALUES {*values,}")

    if hasidkey and is_posgres:
        update_ID(cursor, tablename) # update id sequence


def update_ID(cursor, table:str):
    """ Update sequence of a autoincrement-id fields in PostgreSql
    """
    tablename = table.replace("\"", "")
    cursor.execute(f"""SELECT setval('"{tablename}_id_seq"', MAX(id)) FROM {table};""")
