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

    
Install project dependencies using the 'requirements' file in the project directory:

    $ pip install -r requirements.txt


Create a '.env' and add these line with your own secret key

    SECRET_KEY="your-secret-key-here-and-must-be-greater-than-50character"
    
    
Then simply apply the migrations:

    $ python manage.py migrate
    

You can now run the development server:

    $ python manage.py runserver


## Features

- User can watch and download the course materials in PDF format.

- Admins can do the CRUD operations in the nice Admin-Interface, which makes it easy to add/modify/delete courses.

<br>

### License
[MIT](https://choosealicense.com/licenses/mit/)