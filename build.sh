echo "Starting build"

if [ -f chrome_extension_build.zip ]; then
	rm chrome_extension_build.zip
fi
if [ -f firefox_extension_build.zip ]; then
	rm firefox_extension_build.zip
fi

echo "Distribute shared"
cp -a extension/shared/. extension/chrome_extension/
cp -a extension/shared/. extension/firefox_extension/

echo "Fetching page mapping"
python3 fetch_page_mapping.py

echo "Zipping Chrome extension"
cd extension/chrome_extension
zip -r ../../chrome_extension_build.zip *
cd ../..

echo "Zipping Firefox extension"
cd extension/firefox_extension
zip -r ../../firefox_extension_build.zip *
cd ../..

echo "Build complete"