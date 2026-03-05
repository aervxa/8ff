export const LANGS = ['ar', 'en'] as const;

export type LangCode = (typeof LANGS)[number];

export const langs: { [key in LangCode]: { name: string; dir: 'ltr' | 'rtl' } } = {
	ar: { name: 'Arabic', dir: 'rtl' },
	en: { name: 'English', dir: 'ltr' }
};

function useLang() {
	let lang: LangCode = $state('en');

	return {
		get value() {
			return lang;
		},
		set value(value: LangCode) {
			lang = value;
			console.log('set,', value);
			localStorage.setItem('8ff-app-lang', value);
		},
		init() {
			const localLang = localStorage.getItem('8ff-app-lang') as LangCode | null;
			if (localLang) {
				lang = localLang;
			}
		}
	};
}

export const lang = useLang();
