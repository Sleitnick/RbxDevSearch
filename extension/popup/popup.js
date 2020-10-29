const MAX_RESULTS = 20;

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search");
const resultsDiv = document.getElementById("results");
const allItems = [];

const searchCategories = {
	"articles": true,
	"videos": true,
	"codesamples": true,
	"datatype": true,
	"recipes": true,
	"enum": true,
	"resources": true,
	"other": true
};

// --------------------------------------------------------------------------------
// Levenshtein distance: https://stackoverflow.com/a/36566052/2077120
const editDistance = (s1, s2) => {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();
	const costs = [];
	for (let i = 0; i <= s1.length; i++) {
		let lastValue = i;
		for (let j = 0; j <= s2.length; j++) {
			if (i === 0) {
				costs[j] = j;
			} else {
				if (j > 0) {
					let newValue = costs[j - 1];
					if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
						newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
		}
		if (i > 0) {
			costs[s2.length] = lastValue;
		}
	}
	return costs[s2.length];
};
const similarity = (s1, s2) => {
	if (s1 === s2) return 1;
	let longer = s1;
	let shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	const longerLength = longer.length;
	if (longerLength === 0) {
		return 1;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};
// --------------------------------------------------------------------------------

const search = () => {
	const input = searchInput.value.trim().toLowerCase();
	const result = [];
	if (input === "") {
		return result;
	}
	for (const item of allItems) {
		if (searchCategories[item.category]) {
			const title = item.titleLower;
			if (title.includes(input) || input.includes(title)) {
				item._sim = similarity(title, input);
				result.push(item);
			}
		}
	}
	result.sort((a, b) => {
		return (a._sim < b._sim ? 1 : -1);
	});
	return result;
};

const createResultChild = (item, index) => {
	return `
		<a href="${item.url}" class="result-item-link" target="_blank" data-index="${index}" id="result-item-${index}">
			<div class="result-item">
				<h3 class="result-title">${item.title}</h3>
				<p class="result-category">${item.category}</p>
			</div>
		</a>
	`.trim();
};

const onSearchInputChanged = () => {
	let result = search();
	if (result.length > MAX_RESULTS) {
		result = result.slice(0, MAX_RESULTS);
	}
	resultsDiv.innerHTML = "";
	if (result.length === 0) {
		if (searchInput.value.trim() !== "") {
			const resultChild = document.createElement("p");
			resultChild.innerHTML = "No results";
			resultsDiv.appendChild(resultChild);
		}
	} else {
		const resultHtml = [];
		for (let i = 0; i < result.length; i++) {
			const item = result[i];
			resultHtml.push(createResultChild(item, i));
		}
		resultsDiv.innerHTML = resultHtml.join("");
	}
};

const focusOnNextElement = () => {
	const focused = document.querySelector(":focus");
	if (!focused) return;
	let index = -1;
	if (focused === searchInput) {
		index = 0;
	} else {
		index = focused.dataset.index;
		if (typeof(index) === "undefined") {
			return;
		}
		index = parseInt(index) + 1;
	}
	const id = `result-item-${index}`;
	const nextFocused = document.getElementById(id);
	if (nextFocused) {
		nextFocused.focus();
	}
};

const focusOnPrevElement = () => {
	const focused = document.querySelector(":focus");
	if ((!focused) || focused === searchInput) return null;
	let index = focused.dataset.index;
	if (typeof(index) === "undefined") {
		return;
	}
	index = parseInt(index) - 1;
	if (index < 0) {
		searchInput.focus();
		return;
	}
	const id = `result-item-${index}`;
	const prevFocused = document.getElementById(id);
	if (prevFocused) {
		prevFocused.focus();
	}
};

const init = () => {

	for (const category in searchCategories) {
		simpleStorage.get(category, true).then((val) => {
			searchCategories[category] = val;
		}).catch((e) => console.error(e));
	}
	simpleStorage.onChanged.addListener((changes) => {
		for (const key in changes) {
			if (typeof searchCategories[key] !== "undefined") {
				searchCategories[key] = changes[key].newValue;
			}
		}
	});

	// Get all items:
	for (const categoryKey in pageMapping) {
		const category = pageMapping[categoryKey];
		for (const itemKey in category) {
			const item = category[itemKey];
			item.category = categoryKey;
			item.titleLower = item.title.toLowerCase();
			item.url = `https://developer.roblox.com/en-us${item.url}`;
			allItems.push(item);
		}
	}

	searchInput.addEventListener("input", onSearchInputChanged);
	searchForm.addEventListener("submit", (event) => {
		event.preventDefault();
		const result = search();
		if (result.length > 0) {
			const firstResult = result[0];
			window.open(firstResult.url, "_blank");
		}
	});
	onSearchInputChanged();

	document.addEventListener("keydown", (event) => {
		const key = event.key;
		let handled = false;
		if (key === "ArrowDown") {
			focusOnNextElement();
			handled = true;
		} else if (key === "ArrowUp") {
			focusOnPrevElement();
			handled = true;
		}
		if (handled) {
			event.preventDefault();
		}
	});

	searchInput.focus();

};

init();