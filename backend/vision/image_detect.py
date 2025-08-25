import base64
import os
import json

from google.cloud import vision
from typing import Sequence

# # set up the Goole API credentials keys
# key_json = json.load(open('./hci2023-team8-ac5c062c1993.json'))

# # # Use absolute path to avoid FileDoesNotExist error
# # Get the directory of the current script
# current_directory = os.path.dirname(os.path.abspath(__file__))
# # Construct the absolute path to the JSON file
# json_file_path = os.path.join(current_directory, 'hci2023-team8-ac5c062c1993.json')
# # Check if the file exists
# key_json = json.load(open(json_file_path))

# remove these labels
word_list = [
    "Food", "Ingredient", "Tableware", "Recipe", "Dish", "Cuisine", "Bowl", "Table", "Produce",
    "Cooking", "Art", "Shorts", "Hand", "Gesture", "Sky", "Staple food", "Plate"
]

def detect_labels(path):
    client = vision.ImageAnnotatorClient()

    with open(path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    detected_labels = []
    detected_name = ""
    is_first = True
    cnt = 0
    for label in labels:
        if label.description not in word_list:
            # get the list
            detected_labels.append(label.description)
            # get the string name
            detected_name = label.description if is_first else f"{detected_name}/{label.description}"
            is_first = False
            cnt += 1
        if cnt == 3:
            break
            

    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )

    return detected_name, detected_labels

# # test:
# image_path = "/Users/angelahsi/Downloads/209067.jpg"
# test_labels = detect_labels(image_path)
# print(test_labels)