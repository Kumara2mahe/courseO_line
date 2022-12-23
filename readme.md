###
<h1 align="center">courseO_line</h1>

<b>courseO_line</b> is a online course website created on Django (a high-level Python web framework), with embedded youtube videos and also has related documents in downloadable pdf format. It has a nice Admin-Interface where admins can ADD/ UPDATE/ DELETE the course materials.

<br>

## Getting Started
<p>These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.</p>

### Prerequisites (Requirements)

- `python>=3.10`

<br>

First clone/download this repository from Github to your local machine and switch to the project (courseO_line) directory where 'manage.py' lives:

    $ git clone https://github.com/Kumara2mahe/courseO_line.git
    $ cd courseO_line

    
Install project dependencies using the 'requirements/local' file in the project directory:

    $ pip install -r requirements/local.txt


Rename the '.env.example' to '.env' and change the environment values with your own like below

    SECRET_KEY="your-secret-key-here-and-must-be-greater-than-50character"
    DEBUG=True
    ..
    
    
Then simply apply the migrations:

    $ python manage.py makemigrations
    $ python manage.py migrate
    

You can now run the development server:

    $ python manage.py runserver

<br>

## Features

- User can watch course video and also download the related materials in PDF format if available.

- Admins can do the CRUD operations in the nice Admin-Interface, which makes it easy to add/modify/delete courses.

- Admin-Settings (options):

    - ADD - to add new course under a category followed by course name, youtube video link and optionally materials as pdf document.
    - UPDATE - to update existing course title, youtube video link and also the material(pdf).
    - DELETE - for removing the existing course using its name and category. If a category has no more course under it, then category got deleted along with the course.

- Special Features (for only Admins):

    - They can create another admin accounts by entering unique username and email. And the password for the new admin account is sent directly to the email provided.

    - Admin's can change/reset their own password by using their registered email.
    
    - While changing password their account, a 6-digit OTP with 30 minutes validity is sent to email for an additional precaution. They need to verify before changing old password.

    - There is a limit of 5 attempts to reset admin password, if the admin exceeds the limit they can only retry after 24hrs and untill then no new OTPs can't sent.

- Some hand made modules are there for performing some operations like sending email, picking random course, category, placeholder image for home page, footer and course without videos. Some unique modules for validating inputted youtube link and generating random password for new admin accounts.

- Separate developer and production settings as well as requirements files.

<br>

### Custom Packages & Modules

<br>

> [DB-backup & restore](https://github.com/Kumara2mahe/courseO_line/blob/main/common/utils/)

- In addition to the project, a fully hand made database backup & restore command line python package is included, which backups specific tables in database as a '.json' file and downloads media files in the same structure inside a 'ParsedMedia' Directory

- Structure of backup & restore package

    ```
    # common/utils/
        |   dbParser.py                     (1) backup database to local machine as json
        |   dbPopulator.py                  (2) restore backuped database from json, back to sql
        |   __init__.py
        |
        +---backends
        |       tools.py                    (3) contains functions to download/upload media files
        |       __init__.py
        |
        \---commandValidator                (4) valids the command line arguments for both modules
                __init__.py
    ```

- dbParser.py - which backups specific tables in database as a '.json' file and downloads media files in the same structure inside a 'ParsedMedia' Directory

        USAGE:  dbParser.py pathtodb [jsonpath]

    HINT: pathtodb - (path/URL) to Database, could be [sqlite3 | postgresql]


- dbPopulator.py - which restores the tables in the backuped '.json' file and uploads media files from the 'ParsedMedia' Directory to root dir as 'Media' in same structure and it only populates when the table is completely empty

        USAGE:  dbPopulator.py pathtodb jsonpath

<br>

> [Envcast.py](https://github.com/Kumara2mahe/courseO_line/blob/main/common/envcast.py)

- One of the main custom python module, which is used to type cast the '.env' values into required datatypes

- List of functions available to type cast string value,

        toBool(key: str) -> bool                            (1) to boolean value, default is False
        toInt(key: str) -> int                              (2) to integer value, default is 0
        toStr(key: str) -> str                              (3) always returns a string, eventhough the key doesn't exists
        toTuple(key: str) -> tuple                          (4) to a python special data type, tuple


<br>

### License
[MIT](https://choosealicense.com/licenses/mit/)