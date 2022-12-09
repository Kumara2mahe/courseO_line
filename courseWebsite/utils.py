# Standard Library
import random
from pathlib import Path

# local Django
from mainserver.settings import STATIC_URL


# Placeholder Images
PLACEHOLDERS_PATH = f"{STATIC_URL}Assets/Images/Placeholders"
PLACEHOLDERS_IMGS = [img for img in Path(PLACEHOLDERS_PATH).glob("VID_*.jpg")]


def placeholderPicker() -> Path:
    """
        To shuffle and pick a placeholder image from a list

        Return:
            Path: path of the choosen placeholder image
    """
    random.shuffle(PLACEHOLDERS_IMGS)
    return random.choice(PLACEHOLDERS_IMGS)
