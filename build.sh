echo "Starting build"

if [ -f chrome_extension_build.zip ]; then
	echo "Cleaning up old build"
	rm chrome_extension_build.zip
fi

echo "Fetching page mapping"
python3 fetch_page_mapping.py

echo "Zipping Chrome extension"
cd chrome_extension
zip -r ../chrome_extension_build.zip *

echo "Build complete"