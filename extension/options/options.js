const optionsListDiv = document.getElementById("options-list");

const optionsMapping = [

	{
		title: "Search Preferences",
		type: "heading"
	},
	{
		title: "Articles",
		key: "articles",
		type: "checkbox",
		default: true
	},
	{
		title: "Videos",
		key: "videos",
		type: "checkbox",
		default: true
	},
	{
		title: "Code Samples",
		key: "codesamples",
		type: "checkbox",
		default: true
	},
	{
		title: "Data Types",
		key: "datatype",
		type: "checkbox",
		default: true
	},
	{
		title: "Recipes",
		key: "recipes",
		type: "checkbox",
		default: true
	},
	{
		title: "Enums",
		key: "enum",
		type: "checkbox",
		default: true
	},
	{
		title: "Resources",
		key: "resources",
		type: "checkbox",
		default: true
	},
	{
		title: "Other",
		key: "other",
		type: "checkbox",
		default: true
	},

];

const generateOptionsList = () => {
	const htmlFragments = [];
	for (const optionItem of optionsMapping) {
		if (optionItem.type === "heading") {
			htmlFragments.push(`<h2 class="category-heading">${optionItem.title}</h2>`);
		} else {
			htmlFragments.push(`<div class="option-item">`);
			if (optionItem.type === "checkbox") {
				htmlFragments.push(`<input id="${optionItem.key}" type="checkbox"${optionItem.default ? " checked" : ""}>`);
			} else {
				htmlFragments.push(`<input id="${optionItem.key}" type="${optionItem.type}" value="${optionItem.default}">`);
			}
			htmlFragments.push(`<label for="${optionItem.key}">${optionItem.title}</label><br>`);
			htmlFragments.push(`</div>`);
		}
	}
	optionsListDiv.innerHTML = htmlFragments.join("");
	for (const optionItem of optionsMapping) {
		if (optionItem.type === "heading") continue;
		const isCheckbox = (optionItem.type === "checkbox");
		simpleStorage.get(optionItem.key, optionItem.default).then((value) => {
			const element = document.getElementById(optionItem.key);
			if (isCheckbox) {
				element.checked = value;
			} else {
				element.value = value;
			}
			element.addEventListener("change", () => {
				const v = isCheckbox ? element.checked : element.value;
				simpleStorage.set(optionItem.key, v).catch((e) => console.error(e));
			});
		}).catch((e) => {
			console.error(e);
		});
	}
};

const init = () => {
	generateOptionsList();
};

init();