export type LangCode = 'ar' | 'en';

export const lang: LangCode = $state('en');

export const langs: { [key in LangCode]: { name: string; dir: 'ltr' | 'rtl' } } = {
	ar: { name: 'Arabic', dir: 'rtl' },
	en: { name: 'English', dir: 'ltr' }
};
