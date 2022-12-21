
# Standard library
from pathlib import Path

# Third party
import requests
from dotenv import load_dotenv
load_dotenv()

import cloudinary
import cloudinary.uploader
import cloudinary.api
cloudinary.config(secure=True)

# local
from commandValidator import BACKEND_NAMES

# Search for Tables names
TABLE_NAMES = ("courseWebsite_coursecategory", "courseWebsite_coursedetail")
KEY_TO_REPLACE = "course_category"
REPLACE_WITH = KEY_TO_REPLACE + "_id"
MEDIA_DIR = "ParsedMedia"
MEDIA = "Media"


def objToDict(listObjs: list, tableName: str, categorys: list[str], dbname: str):
    """
        Convert the Row objects into a iterable list of py-dicts with new key value pair,
        and also get the whole list of category names and its unique id

        Parameters:
            listObjs (list): an iterable list of Cursor's Row objects
            tableName (str): name of the table which the Row object belongs to
            categorys (list[str]): an iterable list of all category names
            dbname (str): must be from [sqlite, postgresql] to perform db specific operations

        Return:
            tuple[list[dict[str, object]], list[str]]: (list of dicts, list of all category names)
    """

    dictList = []
    for obj in listObjs:

        dictObj = dict(obj)
        lookfor = None
        if tableName == TABLE_NAMES[1]:
            dictObj = replaceKey(dictObj)
            lookfor = "course_pdf"

        elif tableName == TABLE_NAMES[0]:
            categorys.append(dictObj["category_name"])
            lookfor = "category_image"

        # Copying files from its stored in fields
        for key in dictObj:
            if lookfor and key == lookfor:
                copyFile(dictObj[key], dbname)

        # Adding dict to list
        dictList.append(dictObj)

    return dictList, categorys


def replaceKey(dictObj: dict):
    """
        Replace the name of old key with new key

        Parameters:
            dictObj (dict): a dict object with old key-value pair

        Return:
            (dict[str, object]): dict object of replaced key-value pair

    """
    return {REPLACE_WITH if key == KEY_TO_REPLACE else key: dictObj[key] for key in dictObj}


def copyFile(obj, dbname: str, create=None, storeOnline=False):
    """
        Copy file stored in specific field into backup storage

        Parameters:
            obj (FileField): gets the stored file details
            dbname (str): must be from [sqlite, postgresql] to perform db specific operations
            [create] (None|bool): which decides the operation is whether parsing from or populating to database
            [storeonline] (bool): True means store the copyied files to online in the cloud
    """
    if obj != "":
        fromDir, toDir, process = (MEDIA_DIR, MEDIA, "uploaded") if create else (MEDIA, MEDIA_DIR, "downloaded")

        # Generating new & old paths
        oldfile, newfile, extension = (Path(obj.replace(toDir, fromDir)), Path(obj.replace(fromDir, toDir)), True) if obj.startswith(
            MEDIA) else (Path(fromDir).joinpath(obj), Path(toDir).joinpath(obj), False)

        # Spliting dir path
        filename, path_to_file = newfile.name, newfile.as_posix()
        filedir = Path(path_to_file.split(filename)[0])
        name_of_file = None

        # Copying old file data to new
        if storeOnline and create:
            oldfile = getpath_with_ext(oldfile, filedir, root_dirs=(toDir, fromDir),
                                        file_name=filename,
                                        no_extension=extension)
            filename = sliceExt(filename)
            fileinfo = cloudinary.uploader.upload(file=oldfile.as_posix(),
                                                  folder=filedir.as_posix(),
                                                  public_id=filename,
                                                  overwrite=True)
            path_to_file, filename = fileinfo["public_id"], f'{filename}.{fileinfo["format"]}'
        else:
            if dbname == BACKEND_NAMES[1]:
                public_id = sliceExt(oldfile.as_posix())
                fileinfo = cloudinary.api.resource(public_id)
                formmat, secureurl = fileinfo["format"], fileinfo["secure_url"]
                path_to_file, filename = f"{path_to_file}.{formmat}", f"{filename}.{formmat}"
                oldfile = requests.get(secureurl).content
            else:
                if create:
                    oldfile = getpath_with_ext(oldfile, filedir, root_dirs=(toDir, fromDir),
                                               file_name=filename,
                                               no_extension=extension)
                    path_to_file = newfile.as_posix().replace(newfile.name, filename := oldfile.name)
                    name_of_file = path_to_file.removeprefix(f"{MEDIA}/")
                oldfile = oldfile.read_bytes()

            # Creating dir tree structure if not
            if not filedir.exists():
                makeDirTree(newfile.parts[0:-1])
            with open(path_to_file, "wb") as file:
                file.write(oldfile)

        print(f"\t({process}) -> ****{filename}")
        return name_of_file or path_to_file
    return ""


def getpath_with_ext(file: Path, parent_dir: Path, root_dirs: tuple[str, str], file_name: str, no_extension: bool):
    """ Get full path of the file with its extension, if not already there

        Parameters:
            file (Path): path of the file, with its file name
            parent_dir (Path): path to the file's parent dir
            root_dirs (tuple[str, str]): name of the file's root dir
            file_name (str): name of the file, which contains the extension part
            no_extension (bool): which decides to include extension with file name or not
        
        Return:
            Path: full path of the file with its extension
    """
    if no_extension:
        file = Path(str(parent_dir).replace(*root_dirs))
        file = list(file.glob(f"{file_name}.[a-z|A-Z]*"))[0]
    return file


def sliceExt(filename: str):
    """ Remove any extension from filename 

        Parameter:
            filename (str): name or path of the file which extension is removed

        Return:
            (str): filename without extension
    """
    if filename.rfind(".") > 0:
        index = filename.rindex(".")
        return filename[0:index]
    return filename


def makeDirTree(dirs: tuple[str, ...]):
    """
        Create the directory with the accurate tree structure,
        if not already exists

        Parameters:
            dirs (tuple[str, ..]): directory tree structure in a iterable

        Return:
            Path: complete path of the create dir from its child to ancestor
    """
    tree = Path()
    for d in dirs:
        tree = tree / d
        tree.mkdir(exist_ok=True)
    return tree
