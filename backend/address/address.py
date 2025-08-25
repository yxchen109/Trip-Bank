import requests
import xml.etree.ElementTree as ET

class Address:
    def __init__(self, lat: float, lon: float):
        self.lat = lat
        self.lon = lon

    def get_address(self):
        base_url = "https://nominatim.openstreetmap.org/reverse?"
        params = {
            "lat": self.lat,
            "lon": self.lon,
        }

        # Use nominatum API to transform (latitude, longitude) to real address
        # DO NOT request too frequent!! (i.e. 1 time/sec)
        response = requests.get(base_url, params=params)
        if response.status_code == 200:
            content = response.text

            # Parse the XML content and extract the address information
            root = ET.fromstring(content)
            result_element = root.find(".//result")
            if result_element is not None:
                address = result_element.text
                return address
            else:
                return "Address not found"
        else:
            return "Address not found"