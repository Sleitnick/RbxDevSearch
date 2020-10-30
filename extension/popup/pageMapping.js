const pageMapping = (() => {

	const STORAGE_KEY = "page_mapping";
	const MAPPING_URL = "https://dk135eecbplh9.cloudfront.net/static/page_mappings.json";
	const MAX_CACHE_AGE = 1000 * 60 * 60 * 24 * 5; // 5 days (milliseconds)

	const pageMappingLib = {};
	let loadedMapping = null;
	let loaderPromise = null;

	const transformMapping = (mapping) => {
		const newMapping = {
			mapping: {},
			created: new Date()
		};
		for (const categoryKey in mapping) {
			const category = [];
			newMapping.mapping[categoryKey] = category;
			for (const categoryItemKey in mapping[categoryKey]) {
				const item = mapping[categoryKey][categoryItemKey];
				category.push(item);
			}
		}
		return newMapping;
	};

	const saveMapping = (mapping) => {
		return new Promise((resolve, reject) => {
			try {
				const data = JSON.stringify(mapping);
				chrome.storage.local.set({[STORAGE_KEY]: data}, () => {
					resolve(mapping);
				});
			} catch(e) {
				reject(e);
			}
		});
	};

	const fetchMapping = () => {
		return fetch(MAPPING_URL).then((res) => res.json()).then(transformMapping).then(saveMapping);
	};

	const getMappingFromStorage = () => {
		return new Promise((resolve, reject) => {
			try {
				chrome.storage.local.get(STORAGE_KEY, (items) => {
					if (STORAGE_KEY in items) {
						const data = JSON.parse(items[STORAGE_KEY]);
						const deltaTime = (new Date() - new Date(data.created));
						if (deltaTime > MAX_CACHE_AGE) {
							resolve(null);
						} else {
							resolve(data);
						}
					} else {
						resolve(null);
					}
				});
			} catch(e) {
				reject(e);
			}
		});
	};

	pageMappingLib.load = () => {
		if (loaderPromise) {
			return loaderPromise;
		}
		if (loadedMapping) {
			return Promise.resolve(loadedMapping);
		}
		loaderPromise = getMappingFromStorage().then((mapping) => {
			if (!mapping) {
				return fetchMapping();
			} else {
				return mapping;
			}
		}).then((mapping) => {
			loadedMapping = mapping.mapping;
			return loadedMapping;
		}).catch((e) => console.error(e)).finally(() => {
			loaderPromise = null;
		});
		return loaderPromise;
	};

	return pageMappingLib;

})();