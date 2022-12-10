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


Rename the '.env.example' to '.env' and change the environment values with your own like below

    SECRET_KEY="your-secret-key-here-and-must-be-greater-than-50character"
    DEBUG=True
    ..
    
    
Then simply apply the migrations:

    $ python manage.py makemigrations
    $ python manage.py migrate
    

You can now run the development server:

    $ python manage.py runserver


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

<br>

### License
[MIT](https://choosealicense.com/licenses/mit/)