# Standard libraries
import sys
import re
from pathlib import Path

# -----------------------------------------------------------
USAGE = f"""\nUsage:\n\t{"%s %s %s"}
            \n\tpathtodb - (path/URL) to Database,
            \t\t\t\tHint:
            \t\t\t\t sqlite     example.sqlite3
            \t\t\t\t postgresql {{PROTOCOL}}://{{USER}}:{{PASSWORD}}@{{HOSTNAME}}:{{PORT}}/{{DATABASE}}"""
SEP = "_" * 60
EXT = ".json"
DJ_BACKENDS = {
    ".sqlite3": [
        ".sqlite",
        ".sqlite3",
        ".db",
        ".db3",
        ".s3db",
        ".sl3"
    ],
    ".postgresql": {
        "connector": [
            "postgres",
            "postgresql"
        ],
        "pattern": "://[a-z]+:[A-Za-z0-9\\S]+@((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+((?!-)[A-Za-z0-9-]{1,63}(?<!-))(:(\\d{1,5}))?/[a-z]+"
    },
}
BACKEND_NAMES = list(DJ_BACKENDS.keys())


def validateArgs(params: tuple[str, str, str], minargs: int):
    """
        Validating the command line arguments

        Parameters:
            params (tuple[str, str, str]): takes the name of file and parameter names for Usage-Hint as tuple[0] - nameoffile, tuple[1] - parameter1, tuple[2] - parameter2
            minargs (int): decides the length of positional arguments must be[1 or 2]

        Returns:
            tuple[int, list[str], str|None]: a tuple of argument length, arguments and database backend name

    """
    # Modifying Usage Hint
    filename = Path(params[0]).name
    if filename == "__init__.py":
        filename = "commandValidator.py"
    HINT = USAGE % (filename, params[1], params[2])

    # Command line arguments
    args = sys.argv[1:]
    arglen = len(args)
    db_name = None

    if arglen <= minargs - 1:
        sys.exit(f"Missing required positional arguments!!{HINT}")
    elif minargs == 2 and arglen > minargs or minargs == 1 and arglen > minargs + 1:
        sys.exit(f"Exceeds argument limits!!{HINT}")

    # Checking argument1 a valid url/path
    elif args[0] != "":
        if [True for ext in DJ_BACKENDS[BACKEND_NAMES[0]] if args[0].endswith(ext)]:
            if not Path(args[0]).exists():
                sys.exit(f"Database file: '{args[0]}' not exists{HINT}")
            db_name = BACKEND_NAMES[0]

        elif connector := [ext for ext in DJ_BACKENDS[BACKEND_NAMES[1]]["connector"] if args[0].split(":")[0] == ext]:
            urlpattern = connector[0] + DJ_BACKENDS[BACKEND_NAMES[1]]["pattern"]
            if not re.match(urlpattern, args[0]):
                sys.exit(
                    f"Database URL: '{args[0]}' not valid, see Hint{HINT}")
            db_name = BACKEND_NAMES[1]

        else:
            sys.exit(
                f"DBError: '{args[0]}' is not (path/URL) to Database{HINT}")

    # Checking argument2 a valid json path
    if arglen == 2:
        if not args[1].endswith(EXT):
            sys.exit(f"FileError: '{args[1]}' is not a json file")
        elif args[1].removesuffix(EXT) == "":
            sys.exit(f"FileError: '{args[1]}' is not valid name for json file")

    return arglen, args, db_name


if __name__ == "__main__":

    validateArgs(
        params=(__file__, "pathtodb", "jsonpath"),
        minargs=2
    )
