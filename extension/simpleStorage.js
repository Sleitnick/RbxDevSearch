const simpleStorage = {};

simpleStorage.get = (key, defaultValue) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.get({[key]: defaultValue}, (value) => resolve(value[key]));
		} catch(e) {
			reject(e);
		}
	});
};

simpleStorage.set = (key, value) => {
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.set({[key]: value}, resolve);
		} catch(e) {
			reject(e);
		}
	});
};