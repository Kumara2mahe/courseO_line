# Standard Library
import random
import string

OUR_SYMBOLS = ["!", "#", "$", "%", "&", "*", "+", "?", "@", "~"]
ALL_SYMBOLS = [c for c in string.punctuation]


def generatePassword(leng: int):
    """
        Generate a random password of passed in length, and the length should be minimum of 6.
        It caculates the other character(non-ascii) count from the length in 1:2 ratio

        Parameters:
            leng (int): takes the character length of password

        Return:
            str: randomly generated password with combination of letters, numbers and symbols
    """

    # Calculating the other character length
    non_asciilen = int(leng / 2)
    if non_asciilen < 3:
        raise ValueError("Password length should be a minimum value of 6")

    password = ""
    while len(password) < leng - non_asciilen:
        password += random.choice(string.ascii_letters)

    while len(password) < leng:
        random.shuffle(OUR_SYMBOLS)
        password += random.choice(OUR_SYMBOLS)
        password += random.choice(string.ascii_uppercase)
        password += random.choice(string.digits)

    return password


def validatePassword(password: str, minlength: int, hasUpper=True, hasSymbol=True, password2: str | None = None):
    """
        Validate the user entered password matches some critiria like,
            - must be mixture of alphanumeric character
            - should not contain whitespaces
            - should contain a minimum length according to the condition

        Parameters:
            password (str): holds the input password string
            minlength (int): takes the minimum length of password string
            [hasUpper] (bool): True means password string must atleast has one uppercase
            [hasSymbol] (bool): True means password string must atleast has any one symbol(special characters)
            [password2] (str | None): takes another string of password to check for equality if not None

    """
    errMsg = None

    if (password.isdigit()):
        errMsg = "Password shouldn't have only numbers"

    elif (password.isalpha()):
        errMsg = "Password shouldn't have only alphabets"

    elif (" " in password):
        errMsg = "Password shouldn't have spaces in it"

    elif (hasUpper and not [True for c in password if c.isupper()]):
        errMsg = "Password must atleast contain one uppercase letter"

    elif (hasSymbol and not [True for c in password if c in ALL_SYMBOLS]):
        errMsg = "Password must atleast have one symbol"

    elif (len(password) < minlength):
        errMsg = f"Password must contain minimum of {minlength} characters"

    elif (password2 and password2 != password):
        errMsg = "Passwords doesn't match"

    return errMsg
