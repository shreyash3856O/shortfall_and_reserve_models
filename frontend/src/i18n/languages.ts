/**
 * MIDAS Language Configuration
 * Supports 35+ Indian and regional languages with i18next lazy loading.
 */
export interface LanguageConfig {
  code: string;       // BCP-47 / i18next key
  locale: string;     // Full locale for date/number formatting
  name: string;       // Native name
  nameEn: string;     // English name
  script: string;     // Writing script
  rtl: boolean;       // Right-to-left
  region: string;     // Primary region
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en',    locale: 'en-IN',  name: 'English',         nameEn: 'English',        script: 'Latin',      rtl: false, region: 'Pan-India' },
  { code: 'hi',    locale: 'hi-IN',  name: 'हिन्दी',            nameEn: 'Hindi',          script: 'Devanagari', rtl: false, region: 'Central & Northern India' },
  { code: 'bn',    locale: 'bn-IN',  name: 'বাংলা',             nameEn: 'Bengali',        script: 'Bengali',    rtl: false, region: 'West Bengal, Assam' },
  { code: 'mr',    locale: 'mr-IN',  name: 'मराठी',             nameEn: 'Marathi',        script: 'Devanagari', rtl: false, region: 'Maharashtra' },
  { code: 'te',    locale: 'te-IN',  name: 'తెలుగు',            nameEn: 'Telugu',         script: 'Telugu',     rtl: false, region: 'Andhra Pradesh, Telangana' },
  { code: 'ta',    locale: 'ta-IN',  name: 'தமிழ்',             nameEn: 'Tamil',          script: 'Tamil',      rtl: false, region: 'Tamil Nadu' },
  { code: 'gu',    locale: 'gu-IN',  name: 'ગુજરાતી',          nameEn: 'Gujarati',       script: 'Gujarati',   rtl: false, region: 'Gujarat' },
  { code: 'ur',    locale: 'ur-IN',  name: 'اردو',              nameEn: 'Urdu',           script: 'Nastaliq',   rtl: true,  region: 'Jammu & Kashmir, Hyderabad' },
  { code: 'kn',    locale: 'kn-IN',  name: 'ಕನ್ನಡ',            nameEn: 'Kannada',        script: 'Kannada',    rtl: false, region: 'Karnataka' },
  { code: 'or',    locale: 'or-IN',  name: 'ଓଡ଼ିଆ',             nameEn: 'Odia',           script: 'Odia',       rtl: false, region: 'Odisha' },
  { code: 'ml',    locale: 'ml-IN',  name: 'മലയാളം',           nameEn: 'Malayalam',      script: 'Malayalam',  rtl: false, region: 'Kerala' },
  { code: 'pa',    locale: 'pa-IN',  name: 'ਪੰਜਾਬੀ',            nameEn: 'Punjabi',        script: 'Gurmukhi',   rtl: false, region: 'Punjab' },
  { code: 'as',    locale: 'as-IN',  name: 'অসমীয়া',           nameEn: 'Assamese',       script: 'Bengali',    rtl: false, region: 'Assam' },
  { code: 'mai',   locale: 'mai-IN', name: 'मैथिली',            nameEn: 'Maithili',       script: 'Devanagari', rtl: false, region: 'Bihar, Jharkhand' },
  { code: 'sa',    locale: 'sa-IN',  name: 'संस्कृतम्',          nameEn: 'Sanskrit',       script: 'Devanagari', rtl: false, region: 'Pan-India (Classical)' },
  { code: 'kok',   locale: 'kok-IN', name: 'कोंकणी',            nameEn: 'Konkani',        script: 'Devanagari', rtl: false, region: 'Goa, Coastal Karnataka' },
  { code: 'ks',    locale: 'ks-IN',  name: 'کٲشُر',             nameEn: 'Kashmiri',       script: 'Nastaliq',   rtl: true,  region: 'Jammu & Kashmir' },
  { code: 'ne',    locale: 'ne-IN',  name: 'नेपाली',            nameEn: 'Nepali',         script: 'Devanagari', rtl: false, region: 'Sikkim, Darjeeling' },
  { code: 'sd',    locale: 'sd-IN',  name: 'سنڌي',              nameEn: 'Sindhi',         script: 'Nastaliq',   rtl: true,  region: 'Sindh (Historical)' },
  { code: 'doi',   locale: 'doi-IN', name: 'डोगरी',             nameEn: 'Dogri',          script: 'Devanagari', rtl: false, region: 'Jammu' },
  { code: 'mni',   locale: 'mni-IN', name: 'মৈতৈলোন্',          nameEn: 'Manipuri (Meitei)', script: 'Meitei Mayek', rtl: false, region: 'Manipur' },
  { code: 'brx',   locale: 'brx-IN', name: 'बर\' (बड़ो)',       nameEn: 'Bodo',           script: 'Devanagari', rtl: false, region: 'Assam, Nagaland' },
  { code: 'sat',   locale: 'sat-IN', name: 'ᱥᱟᱱᱛᱟᱲᱤ',          nameEn: 'Santali',        script: 'Ol Chiki',   rtl: false, region: 'Jharkhand, Odisha' },
  { code: 'bho',   locale: 'bho-IN', name: 'भोजपुरी',           nameEn: 'Bhojpuri',       script: 'Devanagari', rtl: false, region: 'Bihar, Eastern UP' },
  { code: 'raj',   locale: 'raj-IN', name: 'राजस्थानी',         nameEn: 'Rajasthani',     script: 'Devanagari', rtl: false, region: 'Rajasthan' },
  { code: 'mag',   locale: 'mag-IN', name: 'मगही',              nameEn: 'Magahi',         script: 'Devanagari', rtl: false, region: 'Bihar, Jharkhand' },
  { code: 'cgg',   locale: 'cgg-IN', name: 'छत्तीसगढ़ी',        nameEn: 'Chhattisgarhi',  script: 'Devanagari', rtl: false, region: 'Chhattisgarh' },
  { code: 'bgc',   locale: 'bgc-IN', name: 'हरियाणवी',          nameEn: 'Haryanvi',       script: 'Devanagari', rtl: false, region: 'Haryana' },
  { code: 'awa',   locale: 'awa-IN', name: 'अवधी',              nameEn: 'Awadhi',         script: 'Devanagari', rtl: false, region: 'Uttar Pradesh' },
  { code: 'tcy',   locale: 'tcy-IN', name: 'ತುಳು',              nameEn: 'Tulu',           script: 'Kannada',    rtl: false, region: 'Coastal Karnataka, Kerala' },
  { code: 'gbm',   locale: 'gbm-IN', name: 'गढ़वाली',            nameEn: 'Garhwali',       script: 'Devanagari', rtl: false, region: 'Uttarakhand' },
  { code: 'kfy',   locale: 'kfy-IN', name: 'कुमाउँनी',           nameEn: 'Kumaoni',        script: 'Devanagari', rtl: false, region: 'Uttarakhand' },
  { code: 'mtr',   locale: 'mtr-IN', name: 'मेवाड़ी',            nameEn: 'Mewari',         script: 'Devanagari', rtl: false, region: 'Rajasthan (Mewar)' },
  { code: 'mwr',   locale: 'mwr-IN', name: 'मारवाड़ी',           nameEn: 'Marwari',        script: 'Devanagari', rtl: false, region: 'Rajasthan (Marwar)' },
  { code: 'bfy',   locale: 'bfy-IN', name: 'बुन्देली',           nameEn: 'Bundeli',        script: 'Devanagari', rtl: false, region: 'Bundelkhand (MP/UP)' },
  { code: 'bge',   locale: 'bge-IN', name: 'बघेली',             nameEn: 'Bagheli',        script: 'Devanagari', rtl: false, region: 'Vindhya Region, MP' },
  { code: 'kha',   locale: 'kha-IN', name: 'খাসি',              nameEn: 'Khasi',          script: 'Latin',      rtl: false, region: 'Meghalaya' },
];

export const DEFAULT_LANGUAGE = 'en';
export const RTL_LANGUAGES = SUPPORTED_LANGUAGES.filter((l) => l.rtl).map((l) => l.code);

export const getLanguageConfig = (code: string): LanguageConfig =>
  SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];

export const isRTL = (code: string): boolean => RTL_LANGUAGES.includes(code);
