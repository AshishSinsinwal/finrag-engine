SECTION_PAGE_MAP = {
    "1": 1,
    "1A": 5,
    "1B": 17,
    "1C": 17,
    "2": 17,
    "3": 18,
    "4": 18,
    "5": 19,
    "7": 21,
    "7A": 27,
    "8": 28,
    "9": 52,
    "9A": 52,
    "9B": 53,
    "9C": 53,
    "10": 53,
    "11": 53,
    "12": 53,
    "13": 53,
    "14": 53,
    "15": 54,
    "16": 57
}

PAGE_OFFSET = 3  # Define the offset

import re

def get_section_page(section_name):
    if not section_name:
        return None

    match = re.search(
        r"Item\s+(\d+[A-Z]?)",
        section_name,
        re.IGNORECASE
    )

    if not match:
        return None

    item_number = match.group(1).upper()
    print(f"Extracted item number: {item_number} from section name: {section_name}")

    page_number = SECTION_PAGE_MAP.get(item_number)
    
    # Add offset if page number exists
    if page_number is not None:
        return page_number + PAGE_OFFSET
    
    return None