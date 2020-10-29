import urllib.request
import io

URL = "https://dk135eecbplh9.cloudfront.net/static/page_mappings.json"
PAGE_MAPPING_FILE = "chrome_extension/pageMapping.js"

def write_page_mapping_file(page_mapping_json):
	print("Writing data")
	file_data = f"// {URL}\nconst pageMapping = {page_mapping_json}"
	with io.open(PAGE_MAPPING_FILE, "w", encoding="utf8") as f:
		f.write(file_data)

def fetch_page_mapping():
	print("Fetching page mapping data")
	with urllib.request.urlopen(URL) as f:
		data = f.read().decode("utf-8")
		return data
	return None

def init():
	page_mapping_data = fetch_page_mapping()
	if page_mapping_data:
		write_page_mapping_file(page_mapping_data)
		print("Done")
	else:
		print("Page mapping data not retrieved")

if __name__ == "__main__":
	init()