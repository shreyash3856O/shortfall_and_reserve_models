/**
 * Universal In-DOM Live Auto-Translator for MIDAS Mining Dashboard.
 * Traverses all rendered text nodes in the DOM and translates any English
 * words/phrases into the target language across all 37 supported languages.
 */

import { getLanguageConfig } from './languages';
import { applyGoogleTranslate } from './googleTranslate';

// Common mining dashboard phrases dictionary translated across primary languages
export const PHRASE_DICTIONARY: Record<string, Record<string, string>> = {
  // Navigation & Actions
  'Sync Telemetry': {
    hi: 'टेलीमेट्री सिंक करें',
    mr: 'टेलिमेट्री सिंक करा',
    bn: 'টেলিমেট্রি সিঙ্ক করুন',
    te: 'టెలిమెట్రీని సింక్ చేయండి',
    ta: 'டெலிமெட்ரியை ஒத்திசைக்கவும்',
    gu: 'ટેલિમેટ્રી સિંક કરો',
    ur: 'ٹیلی میٹری سنک کریں',
    kn: 'ಟೆಲಿಮೆಟ್ರಿ ಸಿಂಕ್ ಮಾಡಿ',
    or: 'ଟେଲିମେଟ୍ରି ସିଙ୍କ୍ କରନ୍ତୁ',
    ml: 'ടെലിമെട്രി സിങ്ക് ചെയ്യുക',
    pa: 'ਟੈਲੀਮੈਟਰੀ ਸਿੰਕ ਕਰੋ',
  },
  'Syncing...': {
    hi: 'सिंक हो रहा है...',
    mr: 'सिंक होत आहे...',
    bn: 'সিঙ্ক হচ্ছে...',
    te: 'సింక్ అవుతోంది...',
    ta: 'ஒத்திசைக்கப்படுகிறது...',
    gu: 'સિંક થઈ રહ્યું છે...',
    ur: 'ہم آہنگ ہو رہا ہے...',
  },
  'Export CSV': {
    hi: 'सीएसवी निर्यात करें',
    mr: 'CSV निर्यात करा',
    bn: 'সিএসভি রপ্তানি করুন',
    te: 'CSV ఎగుమతి చేయండి',
    ta: 'CSV ஏற்றுமதி செய்',
    gu: 'CSV નિકાસ કરો',
    ur: 'CSV برآمد کریں',
    kn: 'CSV ರಫ್ತು ಮಾಡಿ',
    or: 'CSV ରପ୍ତାନି କରନ୍ତୁ',
    ml: 'CSV എക്സ്പോർട്ട് ചെയ്യുക',
    pa: 'CSV ਨਿਰਯਾਤ ਕਰੋ',
  },
  'Active Shift A': {
    hi: 'सक्रिय शिफ्ट ए',
    mr: 'सक्रिय शिफ्ट ए',
    bn: 'সক্রিয় শিফট এ',
    te: 'యాక్టివ్ షిఫ్ట్ A',
    ta: 'செயலில் உள்ள ஷிப்ட் A',
    gu: 'સક્રિય શિફ્ટ A',
    ur: 'فعال شفٹ A',
  },
  'Fleet Telemetry:': {
    hi: 'वाहन टेलीमेट्री:',
    mr: 'फ्लीट टेलिमेट्री:',
    bn: 'যানবাহন টেলিমেট্রি:',
    te: 'ఫ్లీట్ టెలిమెట్రీ:',
    ta: 'வாகன டெலிமெட்ரி:',
    gu: 'કાફલો ટેલિમેટ્રી:',
    ur: 'گاڑیوں کی ٹیلی میٹری:',
  },
  'Online': {
    hi: 'ऑनलाइन',
    mr: 'ऑनलाइन',
    bn: 'অনলাইন',
    te: 'ఆన్‌లైన్',
    ta: 'ஆன்லைன்',
    gu: 'ઓનલાઈન',
    ur: 'آن لائن',
  },
  'Balaghat Weather:': {
    hi: 'बालाघाट मौसम:',
    mr: 'बालाघाट हवामान:',
    bn: 'বালাঘাট আবহাওয়া:',
    te: 'బాలాఘాట్ వాతావరణం:',
    ta: 'பாலாಘಾட் வானிலை:',
    gu: 'બાલાઘાટ હવામાન:',
    ur: 'بالاگھاٹ موسم:',
  },
  'Rain': {
    hi: 'बारिश',
    mr: 'पाऊस',
    bn: 'বৃষ্টি',
    te: 'వర్షం',
    ta: 'மழை',
    gu: 'વરસાદ',
    ur: 'بارش',
  },
  'Sausar Manganese Belt': {
    hi: 'सौसर मैंगनीज बेल्ट',
    mr: 'सौसर मँगनीज पट्टा',
    bn: 'সৌসর ম্যাঙ্গানিজ বেল্ট',
    te: 'సౌసర్ మాంగనీస్ బెల్ట్',
    ta: 'சௌசர் மாங்கனீசு மண்டலம்',
    gu: 'સૌસર મેંગેનીઝ પટ્ટો',
    ur: 'سوسر مینگنیز بیلٹ',
  },
  'pace': {
    hi: 'गति',
    mr: 'गती',
    bn: 'গতি',
    te: 'వేగం',
    ta: 'வேகம்',
    gu: 'ઝડપ',
    ur: 'رفتار',
  },
  'Flagged': {
    hi: 'चिह्नित',
    mr: 'चिन्हांकित',
    bn: 'চিহ্নিত',
    te: 'గుర్తించబడింది',
    ta: 'குறியிடப்பட்டது',
    gu: 'ચિહ્નિત',
    ur: 'نشان زد',
  },
  'All Clean': {
    hi: 'सभी सामान्य',
    mr: 'सर्व सामान्य',
    bn: 'সব স্বাভাবিক',
    te: 'అన్నీ సాధారణం',
    ta: 'அனைத்தும் இயல்பு',
    gu: 'બધું સામાન્ય',
    ur: 'سب محفوظ',
  },
  'High Risk': {
    hi: 'उच्च जोखिम',
    mr: 'उच्च धोका',
    bn: 'উচ্চ ঝুঁকি',
    te: 'అధిక ప్రమాదం',
    ta: 'அதிக ஆபத்து',
    gu: 'ઉચ્ચ જોખમ',
    ur: 'زیادہ خطرہ',
  },
  'Moderate Risk': {
    hi: 'मध्यम जोखिम',
    mr: 'मध्यम धोका',
    bn: 'মাঝারি ঝুঁকি',
    te: 'మధ్యస్థ ప్రమాదం',
    ta: 'மிதமான ஆபத்து',
    gu: 'મધ્યમ જોખમ',
    ur: 'درمیانہ خطرہ',
  },
  'On Track': {
    hi: 'सामान्य स्थिति',
    mr: 'ट्रॅकवर',
    bn: 'স্বাভাবিক',
    te: 'ట్రాక్‌లో ఉంది',
    ta: 'சரியான பாதையில்',
    gu: 'ટ્રેક પર',
    ur: 'ٹریک پر',
  },
  'Proved 111': {
    hi: 'प्रमाणित 111',
    mr: 'प्रमाणित 111',
    bn: 'প্রমাণিত ১১১',
    te: 'రుజువైన 111',
    ta: 'நிரூபிக்கப்பட்ட 111',
    gu: 'સાબિત 111',
    ur: 'تصدیق شدہ 111',
  },
  'In-situ Cutoff ≥32% Mn • Kriging Mesh': {
    hi: 'इन-सिटू कटऑफ ≥32% Mn • क्रिगिंग मेश',
    mr: 'इन-सिटू कटऑफ ≥32% Mn • क्रिगिंग मेश',
    bn: 'ইন-সিটু কাটঅফ ≥৩২% Mn • ক্রিগিং জাল',
    te: 'ఇన్-సిటు కటాఫ్ ≥32% Mn • క్రిగింగ్ మెష్',
    ta: 'கனிம வெட்டு ≥32% Mn • கிரிகிங் வலை',
    gu: 'ઇન-સિટુ કટઓફ ≥32% Mn • ક્રિગિંગ મેશ',
    ur: 'ان-سیٹو کٹ آف ≥32% Mn • کرِگنگ میش',
  },
  '133/135 Deficits Detected (Test Holdout)': {
    hi: '133/135 कमियां पहचानी गईं (परीक्षण परिणाम)',
    mr: '133/135 तूट ओळखली (चाचणी निकाल)',
    bn: '১৩৩/১৩৫ ঘাটতি সনাক্ত (টেস্ট ফলাফল)',
    te: '133/135 కొరతలు గుర్తించబడ్డాయి (పరీక్ష ఫలితం)',
    ta: '133/135 பற்றாக்குறைகள் கண்டறியப்பட்டன',
    gu: '133/135 ખામીઓ ઓળખાઈ (પરીક્ષણ પરિણામ)',
    ur: '133/135 کمی کی شناخت ہوئی (ٹیسٹ نتیجہ)',
  },
  'production units require immediate attention': {
    hi: 'उत्पादन इकाइयों पर तत्काल ध्यान देने की आवश्यकता है',
    mr: 'उत्पादन युनिट्सकडे त्वरित लक्ष देणे आवश्यक आहे',
    bn: 'উৎপাদন ইউনিটে অবিলম্বে মনোযোগ প্রয়োজন',
    te: 'ఉత్పత్తి యూనిట్లకు తక్షణ శ్రద్ధ అవసరం',
    ta: 'உற்பத்தி பிரிவுகளுக்கு உடனடி கவனம் தேவை',
    gu: 'ઉત્પાદન એકમો પર તાત્કાલિક ધ્યાન આપવાની જરૂર છે',
    ur: 'پیداواری یونٹوں پر فوری توجہ کی ضرورت ہے',
  },
  'Production pace is lagging due to equipment downtime and precipitation.': {
    hi: 'उपकरण विफलता और वर्षा के कारण उत्पादन गति धीमी है।',
    mr: 'उपकरण बिघाड आणि पावसामुळे उत्पादन गती मागे पडत आहे.',
    bn: 'সরঞ্জাম ব্যর্থতা এবং বৃষ্টির কারণে উৎপাদন গতি পিছিয়ে আছে।',
    te: 'పరికరాల లోపం మరియు వర్షపాతం కారణంగా ఉత్పత్తి వేగం వెనుకబడి ఉంది.',
    ta: 'உபகரண பழுது மற்றும் மழை காரணமாக உற்பத்தி வேகம் பின்தங்கியுள்ளது.',
    gu: 'સાધનસામગ્રીની ખામી અને વરસાદને કારણે ઉત્પાદન ધીમું છે.',
    ur: 'سامان کی خرابی اور بارش کی وجہ سے پیداواری رفتار سست ہے۔',
  },
  'Filter Flagged Units →': {
    hi: 'चिह्नित खदानें देखें →',
    mr: 'चिन्हांकित युनिट्स पहा →',
    bn: 'চিহ্নিত খনি ফিল্টার করুন →',
    te: 'గుర్తించబడిన గనులను ఫిల్టర్ చేయండి →',
    ta: 'குறியிடப்பட்ட பிரிவுகளைப் பார்க்கவும் →',
    gu: 'ચિહ્નિત એકમો ફિલ્ટર કરો →',
    ur: 'نشان زدہ یونٹس دیکھیں →',
  },
  'Search mine, ID, or root cause...': {
    hi: 'खान, आईडी या कारण खोजें...',
    mr: 'खाण, आयडी किंवा कारण शोधा...',
    bn: 'খনি, আইডি বা কারণ খুঁজুন...',
    te: 'గని, ID లేదా కారణం శోధించండి...',
    ta: 'சுரங்கம், ஐடி அல்லது காரணத்தைத் தேடுங்கள்...',
    gu: 'ખાણ, આઈડી અથવા કારણ શોધો...',
    ur: 'کان، شناختی کارڈ یا وجہ تلاش کریں...',
  },
  'All (10)': {
    hi: 'सभी (10)',
    mr: 'सर्व (10)',
    bn: 'সব (১০)',
    te: 'అన్నీ (10)',
    ta: 'அனைத்தும் (10)',
    gu: 'બધા (10)',
    ur: 'تمام (10)',
  },
  'Needs Attention (2)': {
    hi: 'ध्यान योग्य (2)',
    mr: 'लक्ष देणे आवश्यक (2)',
    bn: 'মনোযোগ প্রয়োজন (২)',
    te: 'శ్రద్ధ అవసరం (2)',
    ta: 'கவனம் தேவை (2)',
    gu: 'ધ્યાન જરૂરી (2)',
    ur: 'توجہ طلب (2)',
  },
  'On Track (8)': {
    hi: 'सामान्य (8)',
    mr: 'ट्रॅकवर (8)',
    bn: 'স্বাভাবিক (৮)',
    te: 'ట్రాక్‌లో ఉంది (8)',
    ta: 'சரியான பாதையில் (8)',
    gu: 'સામાન્ય (8)',
    ur: 'ٹھیک (8)',
  },
  'Extracted:': {
    hi: 'निकासी:',
    mr: 'उत्पादन:',
    bn: 'উত্তোলন:',
    te: 'వెలికితీత:',
    ta: 'உற்பத்தி:',
    gu: 'ઉત્પાદન:',
    ur: 'پیداوار:',
  },
  'Target:': {
    hi: 'लक्ष्य:',
    mr: 'उद्दिष्ट:',
    bn: 'লক্ষ্যমাত্রা:',
    te: 'లక్ష్యం:',
    ta: 'இலக்கு:',
    gu: 'લક્ષ્યાંક:',
    ur: 'ہدف:',
  },
  'achieved': {
    hi: 'प्राप्त',
    mr: 'पूर्ण',
    bn: 'অর্জিত',
    te: 'సాధించారు',
    ta: 'அடையப்பட்டது',
    gu: 'પ્રાપ્ત',
    ur: 'حاصل شدہ',
  },
  'Driver:': {
    hi: 'कारण:',
    mr: 'मूळ कारण:',
    bn: 'কারণ:',
    te: 'డ్రైవర్:',
    ta: 'காரணம்:',
    gu: 'મુખ્ય કારણ:',
    ur: 'بنیادی وجہ:',
  },
  'Preview': {
    hi: 'पूर्वावलोकन',
    mr: 'पूर्वावलोकन',
    bn: 'প্রিভিউ',
    te: 'ప్రివ్యూ',
    ta: 'முன்னோட்டம்',
    gu: 'પૂર્વાવલોકન',
    ur: 'پیش نظارہ',
  },
  'Diagnose →': {
    hi: 'निदान करें →',
    mr: 'निदान करा →',
    bn: 'নির্ণয় করুন →',
    te: 'నిర్ధారించండి →',
    ta: 'பகுப்பாய்வு செய் →',
    gu: 'નિદાન કરો →',
    ur: 'تشخیص کریں →',
  },
  'QUICK QUERIES:': {
    hi: 'त्वरित प्रश्न:',
    mr: 'जलद प्रश्न:',
    bn: 'দ্রুত প্রশ্ন:',
    te: 'త్వరిత ప్రశ్నలు:',
    ta: 'விரைவான கேள்விகள்:',
    gu: 'ઝડપી પ્રશ્નો:',
    ur: 'فوری سوالات:',
  },
  'Why is Mine MN01 at risk this month?': {
    hi: 'खान MN01 इस महीने जोखिम में क्यों है?',
    mr: 'खाण MN01 या महिन्यात धोक्यात का आहे?',
    bn: 'খনি MN01 এই মাসে ঝুঁকিতে কেন?',
    te: 'ఈ నెలలో గని MN01 ఎందుకు ప్రమాదంలో ఉంది?',
    ta: 'இந்த மாதம் சுரங்கம் MN01 ஏன் ஆபத்தில் உள்ளது?',
    gu: 'ખાણ MN01 આ મહિને કેમ જોખમમાં છે?',
    ur: 'کان MN01 اس مہینے خطرے میں کیوں ہے؟',
  },
  'What is our total estimated tonnage in the high-grade zone?': {
    hi: 'उच्च ग्रेड क्षेत्र में हमारा कुल अनुमानित टनभार कितना है?',
    mr: 'उच्च दर्जाच्या क्षेत्रात एकूण अंदाजित साठा किती आहे?',
    bn: 'উচ্চ গ্রেড অঞ্চলে মোট আনুমানিক মজুদ কত?',
    te: 'అధిక గ్రేడ్ జోన్‌లో మన మొత్తం అంచనా టన్నులు ఎంత?',
    ta: 'உயர் தர மண்டலத்தில் நமது மொத்த மதிப்பிடப்பட்ட இருப்பு எவ்வளவு?',
    gu: 'ઉચ્ચ ગ્રેડ ઝોનમાં આપણો કુલ અંદાજિત જથ્થો કેટલો છે?',
    ur: 'اعلیٰ گریڈ والے زون میں ہمارا کل تخمینہ شدہ ٹن کتنا ہے؟',
  },
  'Show model validation accuracy and recall metrics': {
    hi: 'मॉडल सत्यापन सटीकता और रिकॉल मेट्रिक्स दिखाएं',
    mr: 'मॉडेल अचूकता आणि रिकॉल मेट्रिक्स दाखवा',
    bn: 'মডেল নির্ভুলতা এবং রিকল মেট্রিক্স দেখান',
    te: 'మోడల్ ధృవీకరణ ఖచ్చితత్వం మరియు రీకాల్ మెట్రిక్‌లను చూపండి',
    ta: 'மாதிரி துல்லியம் மற்றும் ரீகால் அளவீடுகளைக் காட்டு',
    gu: 'મોડેલ ચોકસાઈ અને રિકોલ મેટ્રિક્સ બતાવો',
    ur: 'ماڈل کی درستگی اور ریکال میٹرکس دکھائیں',
  },
  'Which spare parts should we requisition immediately for Balaghat?': {
    hi: 'बालाघाट के लिए कौन से स्पेयर पार्ट्स तुरंत मंगवाने चाहिए?',
    mr: 'बालाघाटसाठी कोणते स्पेअर्स त्वरित मागवावेत?',
    bn: 'বালাঘাটের জন্য কোন খুচরা যন্ত্রাংশ অবিলম্বে অর্ডার করা উচিত?',
    te: 'బాలాఘాట్ కోసం ఏ విడిభాగాలను వెంటనే ఆర్డర్ చేయాలి?',
    ta: 'பாலாघाटிற்கு எந்த உதிரிபாகங்களை உடனடியாக கோர வேண்டும்?',
    gu: 'બાલાઘાટ માટે કયા સ્પેરપાર્ટ્સ તાત્કાલિક મંગાવવા જોઈએ?',
    ur: 'بالاگھاٹ کے لیے کون سے اسپیئر پارٹس فوری طور پر طلب کیے جائیں؟',
  },
  'MIDAS AI Assistant active. I provide real-time mine shortfall risk assessments, SHAP root-cause attributions, prescriptive rules, equipment dispatch forecasts, and geological reserve block estimates.': {
    hi: 'MIDAS एआई सहायक सक्रिय है। मैं वास्तविक समय खान कमी जोखिम, SHAP मूल कारण, उपचारात्मक नियम, उपकरण प्रेषण पूर्वानुमान और भूवैज्ञानिक भंडार ब्लॉक अनुमान प्रदान करता हूं।',
    mr: 'MIDAS एआय सहाय्यक सक्रिय आहे. मी थेट खाण तुटवडा धोका, SHAP मूळ कारणे, सुधारात्मक नियम, उपकरणे प्रेषण अंदाज आणि भूगर्भीय साठा अंदाज प्रदान करतो.',
    bn: 'MIDAS এআই সহকারী সক্রিয়। আমি রিয়েল-টাইম খনি ঘাটতি ঝুঁকি, SHAP মূল কারণ, প্রেসক্রিপটিভ নিয়ম এবং ভূতাত্ত্বিক মজুদ অনুমান প্রদান করি।',
    te: 'MIDAS AI సహాయకుడు చురుకుగా ఉంది. నేను నిజ-సమయ గని కొరత ప్రమాద అంచనాలు, SHAP మూల కారణాలు మరియు భూగర్భ నిల్వల అంచనాలను అందిస్తాను.',
    ta: 'MIDAS AI உதவியாளர் செயலில் உள்ளது. நான் நேரலை சுரங்க பற்றாக்குறை ஆபத்து மதிப்பீடுகள், மூலக் காரணங்கள் மற்றும் புவியியல் இருப்பு மதிப்பீடுகளை வழங்குகிறேன்.',
    gu: 'MIDAS AI સહાયક સક્રિય છે. હું રીઅલ-ટાઇમ ખાણ જોખમ આકારણી, SHAP મૂળ કારણો અને ભૂસ્તરશાસ્ત્રીય ભંડાર અંદાજ પૂરો પાડું છું.',
    ur: 'MIDAS AI اسسٹنٹ فعال ہے۔ میں ریئل ٹائم مائن شارٹ فال رسک اسسمنٹ، بنیادی وجوہات اور ارضیاتی ذخائر کے بلاک کے تخمینے فراہم کرتا ہوں۔',
  },
};

/**
 * Traverses the DOM and translates matching English text nodes to the target language.
 */
export function translateDomTextNodes(targetLang: string): void {
  if (typeof document === 'undefined' || targetLang === 'en') return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        // Skip script and style tags
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toLowerCase();
        if (tag === 'script' || tag === 'style' || tag === 'noscript') {
          return NodeFilter.FILTER_REJECT;
        }
        const text = node.textContent?.trim();
        return text && text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    }
  );

  const nodesToUpdate: { node: Node; newText: string }[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const text = node.textContent?.trim() || '';

    // Exact or substring match in phrase dictionary
    for (const [englishPhrase, translations] of Object.entries(PHRASE_DICTIONARY)) {
      const translated = translations[targetLang] || translations['hi'];
      if (translated && text.includes(englishPhrase)) {
        nodesToUpdate.push({
          node,
          newText: (node.textContent || '').replace(englishPhrase, translated),
        });
      }
    }
  }

  // Apply text mutations
  nodesToUpdate.forEach(({ node, newText }) => {
    node.textContent = newText;
  });
}

/**
 * Master translate function: Executes in-DOM dictionary replacements
 * and activates Google Website Translator.
 */
export function executeWholePageTranslation(langCode: string): void {
  // 1. In-DOM instantaneous dictionary translation
  translateDomTextNodes(langCode);

  // 2. Google Translate whole-DOM translation
  applyGoogleTranslate(langCode);

  // 3. Set a brief observer so dynamic React re-renders are caught and translated
  let ticks = 0;
  const interval = setInterval(() => {
    ticks++;
    translateDomTextNodes(langCode);
    if (ticks > 5) clearInterval(interval);
  }, 300);
}
