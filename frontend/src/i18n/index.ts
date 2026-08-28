import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ─────────────────────────────────────────────────────────────────────────
// Core translation strings (EN, HI, MR always bundled for fast load)
// All other languages are dynamically lazy-loaded on demand via loadLanguage()
// ─────────────────────────────────────────────────────────────────────────
const resources = {
  en: {
    translation: {
      nav: {
        landing: "Home & Overview",
        dashboard: "Operations Dashboard",
        reserveMap: "Reserve Estimation",
        productionTrends: "Production Trends",
        riskRootCause: "Risk & Root Causes",
        actions: "Recommended Actions",
        equipment: "Equipment & Spares Store",
        digitalTwin: "Digital Twin Map",
        dataHealth: "Data & System Health",
        chatbot: "AI Assistant",
      },
      common: {
        systemName: "MIDAS",
        subtitle: "Mine Decision Support System",
        org: "MOIL Limited",
        liveFeed: "Live Data Feed",
        cachedFeed: "Offline Cache",
        lastSync: "Last Synced",
        syncNow: "Sync Now",
        risk: "Risk Level",
        probability: "Shortfall Risk",
        target: "Monthly Target",
        actual: "Actual Extracted",
        grade: "Ore Grade",
        thickness: "Seam Thickness",
        tonnage: "Estimated Tonnage",
        confidence: "Confidence Interval",
        zone: "Geological Zone",
        actions: "Action Steps",
        status: "Status",
        loading: "Loading data...",
        error: "Failed to connect to MIDAS server",
        search: "Search mine name or ID...",
      },
      overview: {
        heading: "Operations Overview",
        subheading: "Real-time production tracking, shortfall risks, and reserve status across all 10 MOIL mines.",
        totalReserves: "Total Reserves",
        activeProduction: "Current Production",
        minesAtRisk: "Mines at Risk",
        modelReliability: "AI Prediction Accuracy",
        operationalAlerts: "Operational Alerts",
        allMinesTable: "Mine Production & Risk Status",
      },
      reserve: {
        heading: "Geological Reserve Estimation",
        subheading: "Estimate in-situ manganese ore grade, thickness, and tonnage across 100x100m blocks.",
        pointInspector: "Point Grade Estimator",
        inspectBlock: "Inspect Block",
        filterZone: "Filter Zone",
        allZones: "All Zones (Cutoff >=32% Mn)",
        greenZone: "High Grade (>=38% Mn)",
        yellowZone: "Medium Grade (32-38% Mn)",
        redZone: "Low Grade (<32% Mn)",
      },
      trends: {
        heading: "Production History & Forecast",
        subheading: "24-month production history, monthly shortfall risk, and demand signals.",
        selectMine: "Select Mine",
      },
      risk: {
        heading: "Risk Diagnosis & Root Causes",
        subheading: "Understand exactly why a mine may fall behind its production target.",
      },
      actions: {
        heading: "Recommended Action Plan",
        subheading: "Prioritized steps ranked by production impact to close the shortfall gap.",
      },
      equipment: {
        heading: "Equipment & Spares Store",
        subheading: "AI-powered equipment failure prediction with one-click depot dispatch.",
        emergencyRequisition: "Emergency Requisition Cart",
        checkout: "Submit Purchase Order",
      },
      digitalTwin: {
        heading: "Digital Twin Map",
        subheading: "Spatial visualization of ore reserves, fleet equipment, and risk zones.",
        layers: "Map Layers",
        layerReserves: "Reserve Zones",
        layerFleet: "Fleet Positions",
        layerRisk: "Risk Heatmap",
        layerDrone: "Drone Survey",
      },
      dataHealth: {
        heading: "Data & System Health",
        subheading: "Telemetry streams, satellite sync, and AI model operational status.",
      },
      chat: {
        title: "MIDAS AI Assistant",
        placeholder: "Ask about mine risks, reserve tonnage, or operational solutions...",
        disclaimer: "Answers are grounded in live telemetry and validated ML models.",
        suggested: "Suggested Queries",
      },
    },
  },

  hi: {
    translation: {
      nav: {
        landing: "मुख्य पृष्ठ",
        dashboard: "संचालन डैशबोर्ड",
        reserveMap: "भंडार अनुमान",
        productionTrends: "उत्पादन रुझान",
        riskRootCause: "जोखिम और मूल कारण",
        actions: "अनुशंसित कार्रवाई",
        equipment: "उपकरण और स्पेयर्स स्टोर",
        digitalTwin: "डिजिटल ट्विन नक्शा",
        dataHealth: "डेटा और प्रणाली स्वास्थ्य",
        chatbot: "एआई सहायक",
      },
      common: {
        systemName: "MIDAS",
        subtitle: "खनन निर्णय सहायक प्रणाली",
        org: "मॉयल लिमिटेड",
        liveFeed: "लाइव डेटा फ़ीड",
        cachedFeed: "ऑफलाइन कैश",
        lastSync: "अंतिम सिंक",
        syncNow: "अभी सिंक करें",
        risk: "जोखिम स्तर",
        probability: "कमी का जोखिम",
        target: "मासिक लक्ष्य",
        actual: "वास्तविक निकासी",
        grade: "अयस्क ग्रेड",
        thickness: "सीम मोटाई",
        tonnage: "अनुमानित टनभार",
        confidence: "विश्वास अंतराल",
        zone: "भूवैज्ञानिक क्षेत्र",
        actions: "कार्य चरण",
        status: "स्थिति",
        loading: "डेटा लोड हो रहा है...",
        error: "MIDAS सर्वर से कनेक्ट नहीं हो सका",
        search: "खान का नाम या आईडी खोजें...",
      },
      overview: {
        heading: "संचालन अवलोकन",
        subheading: "सभी 10 मॉयल खानों में वास्तविक समय उत्पादन, जोखिम और भंडार स्थिति।",
        totalReserves: "कुल भंडार",
        activeProduction: "वर्तमान उत्पादन",
        minesAtRisk: "जोखिम में खानें",
        modelReliability: "एआई सटीकता",
        operationalAlerts: "परिचालन अलर्ट",
        allMinesTable: "खान उत्पादन और जोखिम स्थिति",
      },
      reserve: {
        heading: "भूवैज्ञानिक भंडार अनुमान",
        subheading: "100x100 मीटर ब्लॉकों में मैंगनीज अयस्क ग्रेड, मोटाई और टनभार का अनुमान।",
        pointInspector: "बिंदु ग्रेड अनुमानक",
        inspectBlock: "ब्लॉक जांचें",
        filterZone: "ज़ोन फ़िल्टर",
        allZones: "सभी ज़ोन (कटऑफ >=32% Mn)",
        greenZone: "उच्च ग्रेड (>=38% Mn)",
        yellowZone: "मध्यम ग्रेड (32-38% Mn)",
        redZone: "निम्न ग्रेड (<32% Mn)",
      },
      trends: {
        heading: "उत्पादन इतिहास और पूर्वानुमान",
        subheading: "24 महीने का उत्पादन इतिहास और मासिक जोखिम आकलन।",
        selectMine: "खान चुनें",
      },
      risk: {
        heading: "जोखिम निदान और मूल कारण",
        subheading: "समझें कि खान अपने उत्पादन लक्ष्य से क्यों पिछड़ सकती है।",
      },
      actions: {
        heading: "अनुशंसित कार्य योजना",
        subheading: "उत्पादन प्रभाव के अनुसार प्राथमिकता से व्यवस्थित कार्य चरण।",
      },
      equipment: {
        heading: "उपकरण और स्पेयर्स स्टोर",
        subheading: "एआई-संचालित उपकरण विफलता पूर्वानुमान और एक-क्लिक डिपो प्रेषण।",
        emergencyRequisition: "आपातकालीन मांग कार्ट",
        checkout: "खरीद आदेश जमा करें",
      },
      digitalTwin: {
        heading: "डिजिटल ट्विन नक्शा",
        subheading: "अयस्क भंडार, वाहन बेड़े और जोखिम क्षेत्रों का स्थानिक दृश्य।",
        layers: "मानचित्र परतें",
        layerReserves: "भंडार क्षेत्र",
        layerFleet: "वाहन स्थिति",
        layerRisk: "जोखिम हीटमैप",
        layerDrone: "ड्रोन सर्वेक्षण",
      },
      dataHealth: {
        heading: "डेटा और प्रणाली स्वास्थ्य",
        subheading: "टेलीमेट्री स्ट्रीम, सैटेलाइट सिंक और एआई मॉडल स्थिति।",
      },
      chat: {
        title: "MIDAS एआई सहायक",
        placeholder: "खान जोखिम, भंडार टनभार या समाधान के बारे में पूछें...",
        disclaimer: "उत्तर लाइव टेलीमेट्री और मान्य एमएल मॉडल पर आधारित हैं।",
        suggested: "सुझावित प्रश्न",
      },
    },
  },

  mr: {
    translation: {
      nav: {
        landing: "मुख्य पृष्ठ",
        dashboard: "ऑपरेशन्स डॅशबोर्ड",
        reserveMap: "साठा अंदाज",
        productionTrends: "उत्पादन ट्रेंड",
        riskRootCause: "धोका आणि मूळ कारणे",
        actions: "सुचवलेल्या कृती",
        equipment: "उपकरणे व स्पेअर्स स्टोअर",
        digitalTwin: "डिजिटल ट्विन नकाशा",
        dataHealth: "डेटा व प्रणाली स्थिती",
        chatbot: "एआय सहाय्यक",
      },
      common: {
        systemName: "MIDAS",
        subtitle: "खाण निर्णय सहाय्य प्रणाली",
        org: "मॉयल लिमिटेड (MOIL)",
        liveFeed: "थेट डेटा फीड",
        cachedFeed: "ऑफलाइन मोड",
        lastSync: "शेवटचे सिंक",
        syncNow: "सिंक करा",
        risk: "धोका पातळी",
        probability: "तुटवडा धोका",
        target: "मासिक उद्दिष्ट",
        actual: "प्रत्यक्ष उत्पादन",
        grade: "धातू प्रत",
        thickness: "थराची जाडी",
        tonnage: "अंदाजित टन भार",
        confidence: "विश्वसनीयता",
        zone: "भूगर्भीय क्षेत्र",
        actions: "कृती योजना",
        status: "स्थिती",
        loading: "डेटा लोड होत आहे...",
        error: "सर्व्हरशी संपर्क अयशस्वी",
        search: "खाण शोधा...",
      },
      overview: {
        heading: "ऑपरेशन्स आढावा",
        subheading: "मॉयलच्या सर्व 10 खाणींमधील थेट उत्पादन आणि धोका स्थिती.",
        totalReserves: "एकूण साठा",
        activeProduction: "सध्याचे उत्पादन",
        minesAtRisk: "धोक्यात असलेल्या खाणी",
        modelReliability: "एआय अचूकता",
        operationalAlerts: "सक्रिय अलर्ट",
        allMinesTable: "खाण उत्पादन व धोका स्थिती",
      },
      reserve: {
        heading: "भूगर्भीय साठा अंदाज",
        subheading: "100x100m ब्लॉकमध्ये मॅंगनीज धातू प्रत, जाडी व टनेज अंदाज.",
        pointInspector: "स्थान अंदाजक",
        inspectBlock: "ब्लॉक तपासा",
        filterZone: "झोन निवडा",
        allZones: "सर्व झोन (कटऑफ >=32% Mn)",
        greenZone: "उच्च दर्जा (>=38% Mn)",
        yellowZone: "मध्यम दर्जा (32-38% Mn)",
        redZone: "कमी दर्जा (<32% Mn)",
      },
      trends: {
        heading: "उत्पादन इतिहास आणि अंदाज",
        subheading: "24 महिन्यांचा मासिक उत्पादन व धोका इतिहास.",
        selectMine: "खाण निवडा",
      },
      risk: {
        heading: "धोका निदान व मूळ कारणे",
        subheading: "खाण उद्दिष्टापेक्षा मागे का पडू शकते ते समजून घ्या.",
      },
      actions: {
        heading: "सुचवलेली कृती योजना",
        subheading: "उत्पादन सुधारणेच्या प्रभावानुसार प्राधान्यीकृत पावले.",
      },
      equipment: {
        heading: "उपकरणे व स्पेअर्स स्टोअर",
        subheading: "एआय उपकरण बिघाड अंदाज आणि वन-क्लिक डेपो डिस्पॅच.",
        emergencyRequisition: "तातडीचे प्रेषण कार्ट",
        checkout: "मागणी पत्र सादर करा",
      },
      digitalTwin: {
        heading: "डिजिटल ट्विन नकाशा",
        subheading: "धातू साठा, उपकरणे आणि धोका क्षेत्रांचा नकाशा.",
        layers: "नकाशा लेयर्स",
        layerReserves: "साठा क्षेत्र",
        layerFleet: "उपकरणे स्थिती",
        layerRisk: "धोका हीटमॅप",
        layerDrone: "ड्रोन सर्व्हे",
      },
      dataHealth: {
        heading: "डेटा व प्रणाली स्थिती",
        subheading: "टेलिमेट्री स्ट्रीम्स, सॅटेलाइट सिंक आणि एआय मॉडेल्स स्थिती.",
      },
      chat: {
        title: "MIDAS एआय सहाय्यक",
        placeholder: "खाण धोका किंवा उपायांविषयी विचारा...",
        disclaimer: "उत्तरे थेट डेटा आणि प्रमाणित एआय मॉडेलवर आधारित आहेत.",
        suggested: "सुचवलेले प्रश्न",
      },
    },
  },

  // ── The following languages are stub resources;
  //    full translations are lazy-loaded from /locales/{code}.json
  //    when the user switches to that language.
  //    The system falls back to 'en' for any missing key.

  te: { translation: { nav: { dashboard: "ఆపరేషన్స్ డాష్‌బోర్డ్" }, common: { systemName: "MIDAS", subtitle: "గని నిర్ణయ సహాయక వ్యవస్థ" }, chat: { title: "MIDAS AI సహాయకుడు", placeholder: "గని ప్రమాదాలు లేదా నిల్వల గురించి అడగండి..." } } },
  ta: { translation: { nav: { dashboard: "செயல்பாடுகள் டாஷ்போர்டு" }, common: { systemName: "MIDAS", subtitle: "சுரங்க முடிவு ஆதரவு அமைப்பு" }, chat: { title: "MIDAS AI உதவியாளர்", placeholder: "சுரங்க அபாயங்கள் அல்லது இருப்புக்கள் பற்றி கேளுங்கள்..." } } },
  gu: { translation: { nav: { dashboard: "ઓપરેશન્સ ડૅશબોર્ડ" }, common: { systemName: "MIDAS", subtitle: "ખાણ નિર્ણય સહાયક તંત્ર" }, chat: { title: "MIDAS AI સહાયક", placeholder: "ખાણ જોખમ અથવા ભંડારો વિશે પૂછો..." } } },
  ur: { translation: { nav: { dashboard: "آپریشنز ڈیش بورڈ" }, common: { systemName: "MIDAS", subtitle: "کان کنی فیصلہ سازی نظام" }, chat: { title: "MIDAS AI معاون", placeholder: "کان کے خطرات یا ذخائر کے بارے میں پوچھیں..." } } },
  kn: { translation: { nav: { dashboard: "ಕಾರ್ಯಾಚರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" }, common: { systemName: "MIDAS", subtitle: "ಗಣಿ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ" }, chat: { title: "MIDAS AI ಸಹಾಯಕ", placeholder: "ಗಣಿ ಅಪಾಯಗಳು ಅಥವಾ ಮೀಸಲು ಬಗ್ಗೆ ಕೇಳಿ..." } } },
  or: { translation: { nav: { dashboard: "ଅପରେସନ ଡ୍ୟାସ୍‌ବୋର୍ଡ" }, common: { systemName: "MIDAS", subtitle: "ଖଣି ନିର୍ଣ୍ଣୟ ସହଯୋଗ ସିଷ୍ଟମ" }, chat: { title: "MIDAS AI ସହାୟକ", placeholder: "ଖଣି ଜୋଖିମ ବା ଭଣ୍ଡାର ବିଷୟରେ ପଚାରନ୍ତୁ..." } } },
  ml: { translation: { nav: { dashboard: "ഓപ്പറേഷൻ ഡാഷ്‌ബോർഡ്" }, common: { systemName: "MIDAS", subtitle: "ഖനി തീരുമാന പിന്തുണ സംവിധാനം" }, chat: { title: "MIDAS AI സഹായകൻ", placeholder: "ഖനി അപകടങ്ങൾ അല്ലെങ്കിൽ കരുതൽ ശേഖരത്തെക്കുറിച്ച് ചോദിക്കുക..." } } },
  pa: { translation: { nav: { dashboard: "ਓਪਰੇਸ਼ਨ ਡੈਸ਼ਬੋਰਡ" }, common: { systemName: "MIDAS", subtitle: "ਖਾਣ ਫੈਸਲਾ ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀ" }, chat: { title: "MIDAS AI ਸਹਾਇਕ", placeholder: "ਖਾਣ ਦੇ ਜੋਖਮਾਂ ਜਾਂ ਭੰਡਾਰਾਂ ਬਾਰੇ ਪੁੱਛੋ..." } } },
  bn: { translation: { nav: { dashboard: "অপারেশনস ড্যাশবোর্ড" }, common: { systemName: "MIDAS", subtitle: "খনি সিদ্ধান্ত সহায়তা সিস্টেম" }, chat: { title: "MIDAS AI সহায়ক", placeholder: "খনির ঝুঁকি বা মজুদ সম্পর্কে জিজ্ঞাসা করুন..." } } },
  bho: { translation: { nav: { dashboard: "ऑपरेशन डैशबोर्ड" }, common: { systemName: "MIDAS", subtitle: "खान निर्णय सहायता प्रणाली" }, chat: { title: "MIDAS AI सहायक", placeholder: "खान के जोखिम या भंडार के बारे में पूछीं..." } } },
  raj: { translation: { nav: { dashboard: "ऑपरेशन डैशबोर्ड" }, common: { systemName: "MIDAS", subtitle: "खान निर्णय सहायता तंत्र" }, chat: { title: "MIDAS AI सहायक", placeholder: "खान जोखिम या भंडार बाबत पूछो..." } } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('midas_language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // Lazy-load additional language packs on demand
    partialBundledLanguages: true,
  });

/**
 * Dynamically load a language pack on demand.
 * Falls back to English silently if pack not available.
 */
export async function loadLanguage(langCode: string): Promise<void> {
  if (i18n.hasResourceBundle(langCode, 'translation')) return;

  try {
    const module = await import(`./${langCode}.json`);
    i18n.addResourceBundle(langCode, 'translation', module.default || module, true, true);
  } catch {
    // Language pack not found — English fallback is automatic via i18next
    console.info(`[i18n] No pack found for ${langCode}, using English fallback.`);
  }
}

/**
 * Switch language and persist selection.
 */
export async function switchLanguage(langCode: string): Promise<void> {
  await loadLanguage(langCode);
  await i18n.changeLanguage(langCode);

  // Apply RTL direction for Urdu, Kashmiri, Sindhi
  const rtlLangs = ['ur', 'ks', 'sd'];
  document.documentElement.dir = rtlLangs.includes(langCode) ? 'rtl' : 'ltr';
  document.documentElement.lang = langCode;
  localStorage.setItem('midas_language', langCode);
}

export default i18n;
