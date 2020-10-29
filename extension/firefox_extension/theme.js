const setTheme = (isDark) => {
	if (isDark) {
		document.documentElement.setAttribute("theme", "dark");
	} else {
		document.documentElement.removeAttribute("theme");
	}
};

simpleStorage.onChanged.addListener((changes) => {
	if (typeof changes.darktheme !== "undefined") {
		setTheme(changes.darktheme.newValue);
	}
});

simpleStorage.get("darktheme", false).then(setTheme).catch((e) => console.error(e));