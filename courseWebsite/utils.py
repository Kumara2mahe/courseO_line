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


def footerTopics(topics):
    """
        Collect four random topics for Footer section from the passed in topics list

        Parameters:
            topics (list[CourseCategory]): a sequence of all topics

        Return:
            list[CourseCategory] - list of shuffled items of length 4
    """
    if type(topics).__name__ != "list":
        topics = list(topics)
    topics = topics.copy()
    random.shuffle(topics)
    return topics[0:4]
