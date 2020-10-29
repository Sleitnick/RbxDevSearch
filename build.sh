echo "Starting build"

if [ -f extension_build.zip ]; then
	rm extension_build.zip
fi

echo "Fetching page mapping"
python3 fetch_page_mapping.py

echo "Zipping extension"
cd extension
zip -r ../extension_build.zip *
cd ..

echo "Build complete"