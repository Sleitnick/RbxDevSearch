if [ -f chrome_extension_build.zip ]; then
	rm chrome_extension_build.zip
fi

cd chrome_extension
zip -r ../chrome_extension_build.zip *

echo "Build complete"