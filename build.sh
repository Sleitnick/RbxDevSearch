echo "Starting build"

if [ -f chrome_extension_build.zip ]; then
	rm chrome_extension_build.zip
fi
if [ -f firefox_extension_build.zip ]; then
	rm firefox_extension_build.zip
fi

echo "Distributing manifest"
cp manifest.json chrome_extension/manifest.json
cp manifest.json firefox_extension/manifest.json

echo "Fetching page mapping"
python3 fetch_page_mapping.py

echo "Zipping Chrome extension"
cd chrome_extension
zip -r ../chrome_extension_build.zip *

echo "Zipping Firefox extension"
cd firefox_extension
zip -r ../firefox_extension_build.zip *

echo "Build complete"