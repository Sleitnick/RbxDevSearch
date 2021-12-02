const simpleStorage = {__mock: false};

if (chrome.storage === "undefined") {
	simpleStorage.__mock = true;
	simpleStorage.__mockStore = {};
	simpleStorage.__mockOnChangedCallbacks = [];
	console.warn("Using mock storage");
}

simpleStorage.get = (key, defaultValue) => {
	if (simpleStorage.__mock) {
		return new Promise((resolve) => {
			let v = simpleStorage.__mockStore[key];
			if (typeof v === "undefined") {
				v = defaultValue;
			}
			resolve(v);
		});
	}
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.get({[key]: defaultValue}, (value) => resolve(value[key]));
		} catch(e) {
			reject(e);
		}
	});
};

simpleStorage.set = (key, value) => {
	if (simpleStorage.__mock) {
		return new Promise((resolve) => {
			const oldValue = simpleStorage.__mockStore[key];
			if (oldValue !== value) {
				simpleStorage.__mockStore[key] = value;
				simpleStorage.onChanged.fireAll(key, value, oldValue);
			}
			resolve();
		});
	}
	return new Promise((resolve, reject) => {
		try {
			chrome.storage.sync.set({[key]: value}, resolve);
		} catch(e) {
			reject(e);
		}
	});
};

simpleStorage.clear = () => {
	if (simpleStorage.__mock) {
		return new Promise((resolve) => {
			for (const key in simpleStorage.__mockStore) {
				const oldValue = simpleStorage.__mockStore[key];
				delete simpleStorage.__mockStore[key];
				simpleStorage.onChanged.fireAll(key, null, oldValue);
			}
			resolve();
		});
	} else {
		return new Promise((resolve, reject) => {
			try {
				chrome.storage.sync.clear(resolve);
			} catch(e) {
				reject(e);
			}
		});
	}
};

if (simpleStorage.__mock) {
	simpleStorage.onChanged = {
		addListener: (listener) => {
			simpleStorage.__mockOnChangedCallbacks.push(listener);
		},
		fireAll: (key, newValue, oldValue) => {
			const v = {
				[key]: {newValue, oldValue}
			};
			for (const listener of simpleStorage.__mockOnChangedCallbacks) {
				listener(v);
			}
		}
	};
} else {
	simpleStorage.onChanged = chrome.storage.sync.onChanged;
	if (typeof simpleStorage.onChanged === "undefined") {
		simpleStorage.onChanged = chrome.storage.onChanged;
	}
}
