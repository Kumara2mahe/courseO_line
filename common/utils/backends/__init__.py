# local
from commandValidator import BACKEND_NAMES
from backends.tools import copyFile


def createNewRecord(db_name, cursor, tablename, data):
    """
        Function to directly inserting records into the Database for only empty tables

        Parameters:
            db_name (str): must be from [sqlite, postgresql], backend names of the django supported database
            cursor (Cursor): cursor object to current database
            tablename (str): name of the table to insert a new record
            data (dict): contains the fields and records of data to be inserted into table
    """

    # Sqlite
    if db_name == BACKEND_NAMES[0]:
        if "auth_user" in tablename:
            cursor.execute(f"INSERT INTO {tablename} VALUES (:id, :password, :last_login, :is_superuser, :username, :last_name, :email, :is_staff, :is_active, :date_joined, :first_name)",
                           {
                               "id": data["id"],
                               "password": data["password"],
                               "last_login": data["last_login"],
                               "is_superuser": data["is_superuser"],
                               "username": data["username"],
                               "last_name": data["last_name"],
                               "email": data["email"],
                               "is_staff": data["is_staff"],
                               "is_active": data["is_active"],
                               "date_joined": data["date_joined"],
                               "first_name": data["first_name"]
                           })
        elif "administrator_verificationotp" in tablename:
            cursor.execute(f"INSERT INTO {tablename} VALUES (:email, :username, :otp, :expires_on, :attemptleft, :blocked_till)",
                           {
                               "email": data["email"],
                               "username": data["username"],
                               "otp": data["otp"],
                               "expires_on": data["expires_on"],
                               "attemptleft": data["attemptleft"],
                               "blocked_till": data["blocked_till"]
                           })
        elif "courseWebsite_coursecategory" in tablename:
            image = copyFile(obj=data["category_image"],
                             dbname=db_name,
                             create=True)  # Uploading files
            cursor.execute(f"INSERT INTO {tablename} VALUES (:id, :category_name, :category_image)",
                           {
                               "id": data["id"],
                               "category_name": data["category_name"],
                               "category_image": image
                           })
        elif "courseWebsite_coursedetail" in tablename:
            pdf = copyFile(obj=data["course_pdf"],
                           dbname=db_name,
                           create=True)  # Uploading files
            cursor.execute(f"INSERT INTO {tablename} VALUES (:id, :course_title, :course_link, :course_pdf, :course_category_id)",
                           {
                               "id": data["id"],
                               "course_title": data["course_title"],
                               "course_link": data["course_link"],
                               "course_pdf": pdf,
                               "course_category_id": data["course_category_id"]
                           })
        elif "django_session" in tablename:
            cursor.execute(f"INSERT INTO {tablename} VALUES (:session_key, :session_data, :expire_date)",
                           {
                               "session_key": data["session_key"],
                               "session_data": data["session_data"],
                               "expire_date": data["expire_date"]
                           })
    # Postgresql
    elif db_name == BACKEND_NAMES[1]:
        if "auth_user" in tablename:
            cursor.execute(f'INSERT INTO {tablename} VALUES (%(id)s, %(password)s, %(last_login)s, %(is_superuser)s, %(username)s, %(first_name)s, %(last_name)s, %(email)s, %(is_staff)s, %(is_active)s, %(date_joined)s)',
                           {
                               "id": data["id"],
                               "password": data["password"],
                               "last_login": data["last_login"],
                               "is_superuser": bool(data["is_superuser"]),
                               "username": data["username"],
                               "first_name": data["first_name"],
                               "last_name": data["last_name"],
                               "email": data["email"],
                               "is_staff": bool(data["is_staff"]),
                               "is_active": bool(data["is_active"]),
                               "date_joined": data["date_joined"]
                           })
            update_ID(cursor, tablename) # update id sequence

        elif "administrator_verificationotp" in tablename:
            cursor.execute(f'INSERT INTO {tablename} VALUES (%(email)s, %(username)s, %(otp)s, %(expires_on)s, %(attemptleft)s, %(blocked_till)s)',
                           {
                               "email": data["email"],
                               "username": data["username"],
                               "otp": data["otp"],
                               "expires_on": data["expires_on"],
                               "attemptleft": data["attemptleft"],
                               "blocked_till": data["blocked_till"]
                           })
        elif "courseWebsite_coursecategory" in tablename:
            image = copyFile(obj=data["category_image"],
                             dbname=db_name,
                             create=True,
                             storeOnline=True)  # Uploading files
            cursor.execute(f'INSERT INTO {tablename} VALUES (%(id)s, %(category_name)s, %(category_image)s)',
                           {
                               "id": data["id"],
                               "category_name": data["category_name"],
                               "category_image": image
                           })
            update_ID(cursor, tablename) # update id sequence

        elif "courseWebsite_coursedetail" in tablename:
            pdf = copyFile(obj=data["course_pdf"],
                           dbname=db_name,
                           create=True,
                           storeOnline=True)  # Uploading files
            cursor.execute(f'INSERT INTO {tablename} VALUES (%(id)s, %(course_title)s, %(course_link)s, %(course_pdf)s, %(course_category_id)s)',
                           {
                               "id": data["id"],
                               "course_title": data["course_title"],
                               "course_link": data["course_link"],
                               "course_pdf": pdf,
                               "course_category_id": data["course_category_id"]
                           })
            update_ID(cursor, tablename) # update id sequence
        
        elif "django_session" in tablename:
            cursor.execute(f"INSERT INTO {tablename} VALUES (%(session_key)s, %(session_data)s, %(expire_date)s)",
                           {
                               "session_key": data["session_key"],
                               "session_data": data["session_data"],
                               "expire_date": data["expire_date"]
                           })


def update_ID(cursor, table:str):
    """ Update sequence of a autoincrement-id fields in PostgreSql
    """
    tablename = table.replace("\"", "")
    cursor.execute(f"""SELECT setval('"{tablename}_id_seq"', MAX(id)) FROM {table};""")
