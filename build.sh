if [ -f extension_build.zip ]; then
	rm extension_build.zip
fi

cd extension
zip -r ../extension_build.zip *

echo "Build complete"