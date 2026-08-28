/**
 * Comprehensive translation dictionary for 37 Indian and regional languages.
 * Grounded in natural mining terminology, idiomatic phrasing, and localized scripts.
 */

export interface TranslationSchema {
  nav: {
    landing: string;
    dashboard: string;
    reserveMap: string;
    productionTrends: string;
    riskRootCause: string;
    actions: string;
    equipment: string;
    digitalTwin: string;
    dataHealth: string;
    chatbot: string;
  };
  common: {
    systemName: string;
    subtitle: string;
    org: string;
    liveFeed: string;
    cachedFeed: string;
    lastSync: string;
    syncNow: string;
    risk: string;
    probability: string;
    target: string;
    actual: string;
    grade: string;
    thickness: string;
    tonnage: string;
    confidence: string;
    zone: string;
    actions: string;
    status: string;
    loading: string;
    error: string;
    search: string;
    selectLanguage: string;
    languages: string;
    searchLanguage: string;
    popular: string;
    allLanguages: string;
  };
  overview: {
    heading: string;
    subheading: string;
    totalReserves: string;
    activeProduction: string;
    minesAtRisk: string;
    modelReliability: string;
    operationalAlerts: string;
    allMinesTable: string;
  };
  reserve: {
    heading: string;
    subheading: string;
    pointInspector: string;
    inspectBlock: string;
    filterZone: string;
    allZones: string;
    greenZone: string;
    yellowZone: string;
    redZone: string;
  };
  trends: {
    heading: string;
    subheading: string;
    selectMine: string;
  };
  risk: {
    heading: string;
    subheading: string;
  };
  actions: {
    heading: string;
    subheading: string;
  };
  equipment: {
    heading: string;
    subheading: string;
    emergencyRequisition: string;
    checkout: string;
  };
  digitalTwin: {
    heading: string;
    subheading: string;
    layers: string;
    layerReserves: string;
    layerFleet: string;
    layerRisk: string;
    layerDrone: string;
  };
  dataHealth: {
    heading: string;
    subheading: string;
  };
  chat: {
    title: string;
    placeholder: string;
    disclaimer: string;
    suggested: string;
  };
}

export const ALL_TRANSLATIONS: Record<string, TranslationSchema> = {
  en: {
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
      selectLanguage: "Select Language",
      languages: "Languages",
      searchLanguage: "Search 37 languages...",
      popular: "Popular Languages",
      allLanguages: "All 37 Indian & Regional Languages",
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

  hi: {
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
      org: "मॉयल लिमिटेड (MOIL)",
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
      error: "MIDAS सर्वर से संपर्क विफल",
      search: "खान का नाम या आईडी खोजें...",
      selectLanguage: "भाषा चुनें",
      languages: "भाषाएं",
      searchLanguage: "37 भाषाएं खोजें...",
      popular: "प्रमुख भाषाएं",
      allLanguages: "सभी 37 भारतीय व क्षेत्रीय भाषाएं",
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

  mr: {
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
      selectLanguage: "भाषा निवडा",
      languages: "भाषा",
      searchLanguage: "37 भाषा शोधा...",
      popular: "प्रमुख भाषा",
      allLanguages: "सर्व 37 भारतीय व प्रादेशिक भाषा",
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

  bn: {
    nav: {
      landing: "মূল পৃষ্ঠা",
      dashboard: "অপারেশনস ড্যাশবোর্ড",
      reserveMap: "খনিজ মজুদ অনুমান",
      productionTrends: "উৎপাদন প্রবণতা",
      riskRootCause: "ঝুঁকি ও মূল কারণ",
      actions: "সুপারিশকৃত পদক্ষেপ",
      equipment: "যন্ত্রাংশ ও সরঞ্জাম স্টোর",
      digitalTwin: "ডিজিটাল টুইন মানচিত্র",
      dataHealth: "ডেটা ও সিস্টেম স্বাস্থ্য",
      chatbot: "এআই সহকারী",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "খনি সিদ্ধান্ত সহায়তা সিস্টেম",
      org: "ময়েল লিমিটেড (MOIL)",
      liveFeed: "সরাসরি ডেটা ফিড",
      cachedFeed: "অফলাইন ক্যাশ",
      lastSync: "সর্বশেষ সিঙ্ক",
      syncNow: "এখনই সিঙ্ক করুন",
      risk: "ঝুঁকির মাত্রা",
      probability: "ঘাটতির ঝুঁকি",
      target: "মাসিক লক্ষ্য",
      actual: "প্রকৃত উত্তোলন",
      grade: "আকরিক গ্রেড",
      thickness: "স্তরের পুরুত্ব",
      tonnage: "আনুমানিক টন",
      confidence: "নির্ভরযোগ্যতা",
      zone: "ভূতাত্ত্বিক অঞ্চল",
      actions: "পদক্ষেপ",
      status: "অবস্থা",
      loading: "ডেটা লোড হচ্ছে...",
      error: "সার্ভারে সংযোগ ব্যর্থ হয়েছে",
      search: "খনির নাম বা আইডি খুঁজুন...",
      selectLanguage: "ভাষা নির্বাচন করুন",
      languages: "ভাষা",
      searchLanguage: "৩৭টি ভাষা খুঁজুন...",
      popular: "জনপ্রিয় ভাষা",
      allLanguages: "সমস্ত ৩৭টি ভারতীয় ও আঞ্চলিক ভাষা",
    },
    overview: {
      heading: "অপারেশনস ওভারভিউ",
      subheading: "১০টি খনির রিয়েল-টাইম উৎপাদন, ঝুঁকি ও মজুদ পর্যবেক্ষণ।",
      totalReserves: "মোট মজুদ",
      activeProduction: "বর্তমান উৎপাদন",
      minesAtRisk: "ঝুঁকিপূর্ণ খনি",
      modelReliability: "এআই নির্ভুলতা",
      operationalAlerts: "সক্রিয় সতর্কতা",
      allMinesTable: "খনি উৎপাদন ও ঝুঁকি স্থিতি",
    },
    reserve: {
      heading: "ভূতাত্ত্বিক মজুদ অনুমান",
      subheading: "১০০x১০০ মিটার ব্লকে ম্যাঙ্গানিজ আকরিক গ্রেড ও টনেজ পরিমাপ।",
      pointInspector: "পয়েন্ট গ্রেড ক্যালকুলেটর",
      inspectBlock: "ব্লক পরীক্ষা করুন",
      filterZone: "জোন ফিল্টার",
      allZones: "সব জোন (>=৩২% Mn)",
      greenZone: "উচ্চ গ্রেড (>=৩৮% Mn)",
      yellowZone: "মাঝারি গ্রেড (৩২-৩৮% Mn)",
      redZone: "নিম্ন গ্রেড (<৩২% Mn)",
    },
    trends: { heading: "উৎপাদন ইতিহাস ও পূর্বাভাস", subheading: "২৪ মাসের উৎপাদন ইতিহাস ও ঝুঁকি বিশ্লেষণ।", selectMine: "খনি নির্বাচন করুন" },
    risk: { heading: "ঝুঁকি বিশ্লেষণ ও মূল কারণ", subheading: "খনি উৎপাদন লক্ষ্যমাত্রা থেকে কেন পিছিয়ে পড়ছে তা জানুন।" },
    actions: { heading: "সুপারিশকৃত কর্মপরিকল্পনা", subheading: "ঘাটতি পূরণে উৎপাদন প্রভাব অনুসারে অগ্রাধিকারপ্রাপ্ত পদক্ষেপ।" },
    equipment: { heading: "সরঞ্জাম ও খুচরা যন্ত্রাংশ স্টোর", subheading: "এআই ত্রুটি পূর্বাভাস ও এক ক্লিকে ডিপো অর্ডার।", emergencyRequisition: "জরুরি অর্ডার কার্ট", checkout: "ক্রয়াদেশ জমা দিন" },
    digitalTwin: { heading: "ডিজিটাল টুইন মানচিত্র", subheading: "আকরিক মজুদ, যানবাহন এবং ঝুঁকি অঞ্চলের স্থানিক প্রদর্শন।", layers: "মানচিত্র স্তর", layerReserves: "মজুদ অঞ্চল", layerFleet: "যানবাহন অবস্থান", layerRisk: "ঝুঁকি হিটম্যাপ", layerDrone: "ড্রোন জরিপ" },
    dataHealth: { heading: "ডেটা ও সিস্টেম স্বাস্থ্য", subheading: "টেলিমেট্রি স্ট্রিম, স্যাটেলাইট সিঙ্ক এবং এআই মডেল স্থিতি।" },
    chat: { title: "MIDAS এআই সহকারী", placeholder: "খনি ঝুঁকি বা মজুদ সম্পর্কে জিজ্ঞাসা করুন...", disclaimer: "উত্তরগুলো রিয়েল-টাইম টেলিমেট্রি ভিত্তিক।", suggested: "প্রস্তাবিত প্রশ্ন" },
  },

  te: {
    nav: {
      landing: "హోమ్ పేజీ",
      dashboard: "ఆపరేషన్స్ డాష్‌బోర్డ్",
      reserveMap: "నిల్వల అంచనా",
      productionTrends: "ఉత్పత్తి పోకడలు",
      riskRootCause: "ప్రమాదం & మూల కారణాలు",
      actions: "సిఫార్సు చేసిన చర్యలు",
      equipment: "పరికరాలు & విడిభాగాల స్టోర్",
      digitalTwin: "డిజిటల్ ట్విన్ మ్యాప్",
      dataHealth: "డేటా & సిస్టమ్ ఆరోగ్యం",
      chatbot: "AI సహాయకుడు",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "గని నిర్ణయ సహాయక వ్యవస్థ",
      org: "మాయిల్ లిమిటెడ్ (MOIL)",
      liveFeed: "ప్రత్యక్ష డేటా ఫీడ్",
      cachedFeed: "ఆఫ్‌లైన్ క్యాష్",
      lastSync: "చివరి సింక్",
      syncNow: "ఇప్పుడే సింక్ చేయండి",
      risk: "ప్రమాద స్థాయి",
      probability: "కొరత ప్రమాదం",
      target: "నెలవారీ లక్ష్యం",
      actual: "వాస్తవ వెలికితీత",
      grade: "ధాతువు గ్రేడ్",
      thickness: "పొర మందం",
      tonnage: "అంచనా టన్నులు",
      confidence: "విశ్వసనీయత",
      zone: "భూగర్భ మండలం",
      actions: "చర్యా ప్రణాళిక",
      status: "స్థితి",
      loading: "డేటా లోడ్ అవుతోంది...",
      error: "సర్వర్‌కు కనెక్ట్ కాలేదు",
      search: "గని పేరు లేదా ID శోధించండి...",
      selectLanguage: "భాషను ఎంచుకోండి",
      languages: "భాషలు",
      searchLanguage: "37 భాషలను శోధించండి...",
      popular: "ప్రసిద్ధ భాషలు",
      allLanguages: "అన్ని 37 భారతీయ & ప్రాంతీయ భాషలు",
    },
    overview: { heading: "కార్యాచరణ అవలోకనం", subheading: "10 గనులలో నిజ-సమయ ఉత్పత్తి, ప్రమాదం మరియు నిల్వల స్థితి.", totalReserves: "మొత్తం నిల్వలు", activeProduction: "ప్రస్తుత ఉత్పత్తి", minesAtRisk: "ప్రమాదంలో ఉన్న గనులు", modelReliability: "AI ఖచ్చితత్వం", operationalAlerts: "హెచ్చరికలు", allMinesTable: "గని ఉత్పత్తి & ప్రమాద స్థితి" },
    reserve: { heading: "భూగర్భ నిల్వల అంచనా", subheading: "100x100మీ బ్లాకులలో మాంగనీస్ ధాతువు గ్రేడ్ మరియు పరిమాణ అంచనా.", pointInspector: "పాయింట్ గ్రేడ్ కాలిక్యులేటర్", inspectBlock: "బ్లాక్ తనిఖీ", filterZone: "జోన్ ఫిల్టర్", allZones: "అన్ని జోన్లు (>=32% Mn)", greenZone: "అధిక గ్రేడ్ (>=38% Mn)", yellowZone: "మధ్యస్థ గ్రేడ్ (32-38% Mn)", redZone: "తక్కువ గ్రేడ్ (<32% Mn)" },
    trends: { heading: "ఉత్పత్తి చరిత్ర & అంచనా", subheading: "24 నెలల ఉత్పత్తి రికార్డు మరియు కొరత విశ్లేషణ.", selectMine: "గనిని ఎంచుకోండి" },
    risk: { heading: "ప్రమాద నిర్ధారణ & మూల కారణాలు", subheading: "గని ఎందుకు వెనుకబడిందో ఖచ్చితంగా అర్థం చేసుకోండి." },
    actions: { heading: "సిఫార్సు చేయబడిన కార్యాచరణ ప్రణాళిక", subheading: "ఉత్పత్తి ప్రభావం ఆధారంగా ప్రాధాన్యతా చర్యలు." },
    equipment: { heading: "పరికరాలు మరియు స్పేర్స్ స్టోర్", subheading: "AI పరికర వైఫల్య అంచనా మరియు వన్-క్లిక్ డిస్పాచ్.", emergencyRequisition: "అత్యవసర ఆర్డర్ కార్ట్", checkout: "కొనుగోలు ఆర్డర్ సమర్పించండి" },
    digitalTwin: { heading: "డిజిటల్ ట్విన్ మ్యాప్", subheading: "ధాతువు నిల్వలు, వాహనాలు మరియు ప్రమాద ప్రాంతాల ప్రాదేశిక చిత్రం.", layers: "మ్యాప్ లేయర్లు", layerReserves: "నిల్వ మండలాలు", layerFleet: "వాహన స్థానం", layerRisk: "ప్రమాద హీట్‌మ్యాప్", layerDrone: "డ్రోన్ సర్వే" },
    dataHealth: { heading: "డేటా & సిస్టమ్ ఆరోగ్యం", subheading: "టెలిమెట్రీ స్ట్రీమ్‌లు మరియు AI నమూనా స్థితి." },
    chat: { title: "MIDAS AI సహాయకుడు", placeholder: "గని ప్రమాదాలు లేదా నిల్వల గురించి అడగండి...", disclaimer: "సమాధానాలు నిజ-సమయ డేటాపై ఆధారపడి ఉంటాయి.", suggested: "సూచించబడిన ప్రశ్నలు" },
  },

  ta: {
    nav: {
      landing: "முகப்பு",
      dashboard: "செயல்பாடுகள் டாஷ்போர்டு",
      reserveMap: "கனிம இருப்பு மதிப்பீடு",
      productionTrends: "உற்பத்தி போக்குகள்",
      riskRootCause: "ஆபத்து & மூலக் காரணங்கள்",
      actions: "பரிந்துரைக்கப்பட்ட செயல்கள்",
      equipment: "உபகரணங்கள் & உதிரிபாகங்கள் கடை",
      digitalTwin: "டிஜிட்டல் இரட்டை வரைபடம்",
      dataHealth: "தரவு & கணினி நிலை",
      chatbot: "AI உதவியாளர்",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "சுரங்க முடிவு ஆதரவு அமைப்பு",
      org: "மாயில் லிமிடெட் (MOIL)",
      liveFeed: "நேரலை தரவு",
      cachedFeed: "ஆஃப்லைன் கேச்",
      lastSync: "கடைசி ஒத்திசைவு",
      syncNow: "இப்போது ஒத்திசை",
      risk: "ஆபத்து நிலை",
      probability: "பற்றாக்குறை ஆபத்து",
      target: "மாதாந்திர இலக்கு",
      actual: "உண்மையான உற்பத்தி",
      grade: "தாது தரம்",
      thickness: "தடிமன்",
      tonnage: "மதிப்பிடப்பட்ட டன்",
      confidence: "நம்பகத்தன்மை",
      zone: "புவியியல் மண்டலம்",
      actions: "செயல் திட்டங்கள்",
      status: "நிலை",
      loading: "தரவு ஏற்றப்படுகிறது...",
      error: "சர்வர் இணைப்பு தோல்வி",
      search: "சுரங்க பெயர் அல்லது ஐடியைத் தேடுங்கள்...",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      languages: "மொழிகள்",
      searchLanguage: "37 மொழிகளைத் தேடுங்கள்...",
      popular: "பிரபலமான மொழிகள்",
      allLanguages: "அனைத்து 37 இந்திய மற்றும் பிராந்திய மொழிகள்",
    },
    overview: { heading: "செயல்பாடுகள் கண்ணோட்டம்", subheading: "10 சுரங்கங்களின் நேரலை உற்பத்தி, ஆபத்து மற்றும் இருப்பு நிலை.", totalReserves: "மொத்த இருப்பு", activeProduction: "தற்போதைய உற்பத்தி", minesAtRisk: "ஆபத்தில் உள்ள சுரங்கங்கள்", modelReliability: "AI துல்லியம்", operationalAlerts: "எச்சரிக்கைகள்", allMinesTable: "சுரங்க உற்பத்தி & ஆபத்து நிலை" },
    reserve: { heading: "புவியியல் இருப்பு மதிப்பீடு", subheading: "100x100மீ பரப்பில் மாங்கனீசு தாது தரம் மற்றும் டன் அளவு மதிப்பீடு.", pointInspector: "புள்ளி தரம் மதிப்பீட்டாளர்", inspectBlock: "பிளாக்கை சோதிக்கவும்", filterZone: "மண்டல வடிகட்டி", allZones: "அனைத்து மண்டலங்கள் (>=32% Mn)", greenZone: "உயர் தரம் (>=38% Mn)", yellowZone: "நடுத்தர தரம் (32-38% Mn)", redZone: "குறைந்த தரம் (<32% Mn)" },
    trends: { heading: "உற்பத்தி வரலாறு & முன்னறிவிப்பு", subheading: "24 மாத உற்பத்தி வரலாறு மற்றும் ஆபத்து பகுப்பாய்வு.", selectMine: "சுரங்கத்தைத் தேர்ந்தெடுக்கவும்" },
    risk: { heading: "ஆபத்து கண்டறிதல் & மூல காரணங்கள்", subheading: "சுரங்கம் ஏன் இலக்கை அடையவில்லை என்பதை அறியவும்." },
    actions: { heading: "பரிந்துரைக்கப்பட்ட செயல் திட்டம்", subheading: "உற்பத்தி தாக்கத்தின் அடிப்படையில் முன்னுரிமை நடவடிக்கைகள்." },
    equipment: { heading: "உபகரணங்கள் & உதிரிபாகங்கள் கடை", subheading: "AI பழுது முன்கணிப்பு மற்றும் உடனடி ஆர்டர்.", emergencyRequisition: "அவசர கார்ட்", checkout: "கொள்முதல் ஆணை சமர்ப்பிக்கவும்" },
    digitalTwin: { heading: "டிஜிட்டல் இரட்டை வரைபடம்", subheading: "தாது இருப்பு, வாகனங்கள் மற்றும் ஆபத்து மண்டலங்களின் வரைபடம்.", layers: "வரைபட அடுக்குகள்", layerReserves: "இருப்பு மண்டலங்கள்", layerFleet: "வாகன நிலை", layerRisk: "ஆபத்து வரைபடம்", layerDrone: "ட்ரோன் ஆய்வு" },
    dataHealth: { heading: "தரவு & கணினி நிலை", subheading: "டெலிமெட்ரி மற்றும் AI மாதிரி இயக்க நிலை." },
    chat: { title: "MIDAS AI உதவியாளர்", placeholder: "சுரங்க அபாயங்கள் அல்லது இருப்புக்கள் பற்றி கேளுங்கள்...", disclaimer: "பதில்கள் நேரலை தரவு அடிப்படையிலானவை.", suggested: "பரிந்துரைக்கப்பட்ட கேள்விகள்" },
  },

  gu: {
    nav: {
      landing: "મુખ્ય પૃષ્ઠ",
      dashboard: "ઓપરેશન્સ ડૅશબોર્ડ",
      reserveMap: "ભંડાર અંદાજ",
      productionTrends: "ઉત્પાદન વલણો",
      riskRootCause: "જોખમ અને મૂળ કારણો",
      actions: "ભલામણ કરેલ પગલાં",
      equipment: "ઉપકરણો અને સ્પેરપાર્ટ્સ સ્ટોર",
      digitalTwin: "ડિજિટલ ટ્વિન નકશો",
      dataHealth: "ડેટા અને સિસ્ટમ સ્થિતિ",
      chatbot: "AI સહાયક",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "ખાણ નિર્ણય સહાયક તંત્ર",
      org: "મોયલ લિમિટેડ (MOIL)",
      liveFeed: "લાઇવ ડેટા ફીડ",
      cachedFeed: "ઑફલાઇન કૅશ",
      lastSync: "છેલ્લું સિંક",
      syncNow: "હમણાં સિંક કરો",
      risk: "જોખમ સ્તર",
      probability: "ઘટાડાનું જોખમ",
      target: "માસિક લક્ષ્યાંક",
      actual: "વાસ્તવિક ઉત્પાદન",
      grade: "ધાતુ ગ્રેડ",
      thickness: "સ્તરની જાડાઈ",
      tonnage: "અંદાજિત ટન",
      confidence: "વિશ્વસનીયતા",
      zone: "ભૂસ્તરીય ઝોન",
      actions: "કાર્ય યોજના",
      status: "સ્થિતિ",
      loading: "ડેટા લોડ થઈ રહ્યો છે...",
      error: "સર્વર કનેક્શન નિષ્ફળ",
      search: "ખાણનું નામ શોધો...",
      selectLanguage: "ભાષા પસંદ કરો",
      languages: "ભાષાઓ",
      searchLanguage: "37 ભાષાઓ શોધો...",
      popular: "લોકપ્રિય ભાષાઓ",
      allLanguages: "તમામ 37 ભારતીય અને પ્રાદેશિક ભાષાઓ",
    },
    overview: { heading: "ઓપરેશન્સ વિહંગાવલોકન", subheading: "10 ખાણોમાં રીઅલ-ટાઇમ ઉત્પાદન, જોખમ અને અનામત સ્થિતિ.", totalReserves: "કુલ ભંડાર", activeProduction: "હાલનું ઉત્પાદન", minesAtRisk: "જોખમમાં રહેલી ખાણો", modelReliability: "AI ચોકસાઈ", operationalAlerts: "ચેતવણીઓ", allMinesTable: "ખાણ ઉત્પાદન સ્થિતિ" },
    reserve: { heading: "ભૂસ્તરશાસ્ત્રીય ભંડાર અંદાજ", subheading: "100x100m બ્લોકમાં મેંગેનીઝ અયસ્ક ગ્રેડ અને ટનેજ અંદાજ.", pointInspector: "ગ્રેડ કેલ્ક્યુલેટર", inspectBlock: "બ્લોક તપાસો", filterZone: "ઝોન ફિલ્ટર", allZones: "બધા ઝોન (>=32% Mn)", greenZone: "ઉચ્ચ ગ્રેડ (>=38% Mn)", yellowZone: "મધ્યમ ગ્રેડ (32-38% Mn)", redZone: "નીચો ગ્રેડ (<32% Mn)" },
    trends: { heading: "ઉત્પાદન ઇતિહાસ અને આગાહી", subheading: "24 મહિનાનો ઉત્પાદન ઇતિહાસ અને વિશ્લેષણ.", selectMine: "ખાણ પસંદ કરો" },
    risk: { heading: "જોખમ નિદાન અને મૂળ કારણો", subheading: "ખાણ લક્ષ્યાંકથી કેમ પાછળ પડી તે સમજો." },
    actions: { heading: "ભલામણ કરેલ કાર્ય યોજના", subheading: "ઉત્પાદન સુધારવા માટે પ્રાથમિકતાના પગલાં." },
    equipment: { heading: "સાધનસામગ્રી સ્ટોર", subheading: "AI બ્રેકડાઉન આગાહી અને વન-ક્લિક ડિસ્પેચ.", emergencyRequisition: "ઇમરજન્સી કાર્ટ", checkout: "ઓર્ડર સબમિટ કરો" },
    digitalTwin: { heading: "ડિજિટલ ટ્વિન નકશો", subheading: "અયસ્ક ભંડાર, વાહનો અને જોખમ ક્ષેત્રોનો નકશો.", layers: "નકશા લેયર્સ", layerReserves: "ભંડાર ઝોન", layerFleet: "વાહનોની સ્થિતિ", layerRisk: "જોખમ હીટમેપ", layerDrone: "ડ્રોન સર્વે" },
    dataHealth: { heading: "ડેટા અને સિસ્ટમ સ્થિતિ", subheading: "ટેલિમેટ્રી અને AI મોડેલની કાર્યકારી સ્થિતિ." },
    chat: { title: "MIDAS AI સહાયક", placeholder: "ખાણ જોખમ અથવા ભંડાર વિશે પૂછો...", disclaimer: "જવાબો લાઇવ ટેલિમેટ્રી આધારિત છે.", suggested: "સૂચવેલા પ્રશ્નો" },
  },

  ur: {
    nav: {
      landing: "مرکزی صفحہ",
      dashboard: "آپریشنز ڈیش بورڈ",
      reserveMap: "ذخائر کا تخمینہ",
      productionTrends: "پیداواری رجحانات",
      riskRootCause: "خطرات اور بنیادی وجوہات",
      actions: "تجویز کردہ اقدامات",
      equipment: "آلات اور اسپیئر پارٹس اسٹور",
      digitalTwin: "ڈیجیٹل ٹوئن نقشہ",
      dataHealth: "ڈیٹا اور سسٹم کی حالت",
      chatbot: "AI معاون",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "کان کنی فیصلہ سازی نظام",
      org: "موئل لمیٹڈ (MOIL)",
      liveFeed: "براہ راست ڈیٹا فیڈ",
      cachedFeed: "آف لائن کیش",
      lastSync: "آخری مطابقت پذیری",
      syncNow: "ابھی ہم آہنگ کریں",
      risk: "خطرے کی سطح",
      probability: "کمی کا خطرہ",
      target: "ماہانہ ہدف",
      actual: "اصل پیداوار",
      grade: "معدنی گریڈ",
      thickness: "تہہ کی موٹائی",
      tonnage: "تخمینہ شدہ ٹن",
      confidence: "اعتماد کا وقفہ",
      zone: "ارضیاتی زون",
      actions: "اقدامات",
      status: "حالت",
      loading: "ڈیٹا لوڈ ہو رہا ہے...",
      error: "سرور سے رابطہ ناکام رہا",
      search: "کان کا نام تلاش کریں...",
      selectLanguage: "زبان منتخب کریں",
      languages: "زبانیں",
      searchLanguage: "37 زبانیں تلاش کریں...",
      popular: "مقبول زبانیں",
      allLanguages: "تمام 37 ہندوستانی اور علاقائی زبانیں",
    },
    overview: { heading: "آپریشنز کا جائزہ", subheading: "تمام 10 کانوں میں پیداوار، خطرات اور ذخائر کی براہ راست معلومات۔", totalReserves: "کل ذخائر", activeProduction: "موجودہ پیداوار", minesAtRisk: "خطرے میں کانیں", modelReliability: "AI درستگی", operationalAlerts: "انتباہات", allMinesTable: "پیداواری جدول" },
    reserve: { heading: "ارضیاتی ذخائر کا تخمینہ", subheading: "100x100 میٹر بلاکس میں مینگنیج ایسک گریڈ اور ٹن کا تخمینہ۔", pointInspector: "پوائنٹ گریڈ کیلکولیٹر", inspectBlock: "بلاک معائنہ", filterZone: "زون فلٹر", allZones: "تمام زونز (>=32% Mn)", greenZone: "اعلیٰ گریڈ (>=38% Mn)", yellowZone: "درمیانہ گریڈ (32-38% Mn)", redZone: "کم گریڈ (<32% Mn)" },
    trends: { heading: "پیداواری تاریخ اور پیش گوئی", subheading: "24 ماہ کی پیداواری تاریخ اور تجزیہ۔", selectMine: "کان منتخب کریں" },
    risk: { heading: "خطرے کی تشخیص اور بنیادی وجوہات", subheading: "سمجھیں کہ کان پیداواری ہدف سے کیوں پیچھے رہ سکتی ہے۔" },
    actions: { heading: "تجویز کردہ ایکشن پلان", subheading: "پیداوار پر اثر کے لحاظ سے ترجیحی اقدامات۔" },
    equipment: { heading: "سامان اور اسپیئرز اسٹور", subheading: "AI خرابی کی پیش گوئی اور فوری آرڈر۔", emergencyRequisition: "ہنگامی آرڈر", checkout: "خریداری کا آرڈر جمع کریں" },
    digitalTwin: { heading: "ڈیجیٹل ٹوئن نقشہ", subheading: "ذخائر، گاڑیوں اور خطرے کے علاقوں کا نقشہ۔", layers: "نقشہ کی تہیں", layerReserves: "ذخائر کے زون", layerFleet: "گاڑیوں کی پوزیشن", layerRisk: "رسک ہیٹ میپ", layerDrone: "ڈرون سروے" },
    dataHealth: { heading: "ڈیٹا اور سسٹم کی حالت", subheading: "ٹیلی میٹری اور AI ماڈل کی آپریشنل حالت۔" },
    chat: { title: "MIDAS AI معاون", placeholder: "کان کے خطرات یا ذخائر کے بارے میں پوچھیں...", disclaimer: "جوابات لائیو ڈیٹا پر مبنی ہیں۔", suggested: "تجویز کردہ سوالات" },
  },

  kn: {
    nav: {
      landing: "ಮುಖಪುಟ",
      dashboard: "ಕಾರ್ಯಾಚರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      reserveMap: "ಖನಿಜ ಮೀಸಲು ಅಂದಾಜು",
      productionTrends: "ಉತ್ಪಾದನಾ ಪ್ರವೃತ್ತಿಗಳು",
      riskRootCause: "ಅಪಾಯ ಮತ್ತು ಮೂಲ ಕಾರಣಗಳು",
      actions: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು",
      equipment: "ಉಪಕರಣಗಳು ಮತ್ತು ಬಿಡಿಭಾಗಗಳ ಅಂಗಡಿ",
      digitalTwin: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ನಕ್ಷೆ",
      dataHealth: "ಡೇಟಾ ಮತ್ತು ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ",
      chatbot: "AI ಸಹಾಯಕ",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "ಗಣಿ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ",
      org: "ಮಾಯಿಲ್ ಲಿಮಿಟೆಡ್ (MOIL)",
      liveFeed: "ಲೈವ್ ಡೇಟಾ ಫೀಡ್",
      cachedFeed: "ಆಫ್‌ಲೈನ್ ಕ್ಯಾಶ್",
      lastSync: "ಕೊನೆಯ ಸಿಂಕ್",
      syncNow: "ಈಗಲೇ ಸಿಂಕ್ ಮಾಡಿ",
      risk: "ಅಪಾಯದ ಮಟ್ಟ",
      probability: "ಕೊರತೆಯ ಅಪಾಯ",
      target: "ಮಾಸಿಕ ಗುರಿ",
      actual: "ನೈಜ ಉತ್ಪಾದನೆ",
      grade: "ಅದಿರು ದರ್ಜೆ",
      thickness: "ಪದರದ ದಪ್ಪ",
      tonnage: "ಅಂದಾಜು ಟನ್",
      confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ",
      zone: "ಭೂವೈಜ್ಞಾನಿಕ ವಲಯ",
      actions: "ಕ್ರಮಗಳು",
      status: "ಸ್ಥಿತಿ",
      loading: "ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ಸರ್ವರ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ",
      search: "ಗಣಿಯ ಹೆಸರನ್ನು ಹುಡುಕಿ...",
      selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      languages: "ಭಾಷೆಗಳು",
      searchLanguage: "37 ಭಾಷೆಗಳನ್ನು ಹುಡುಕಿ...",
      popular: "ಜನಪ್ರಿಯ ಭಾಷೆಗಳು",
      allLanguages: "ಎಲ್ಲಾ 37 ಭಾರತೀಯ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳು",
    },
    overview: { heading: "ಕಾರ್ಯಾಚರಣೆಗಳ ಅವಲೋಕನ", subheading: "10 ಗಣಿಗಳಲ್ಲಿ ನೈಜ-ಸಮಯದ ಉತ್ಪಾದನೆ ಮತ್ತು ಅಪಾಯದ ಸ್ಥಿತಿ.", totalReserves: "ಒಟ್ಟು ಮೀಸಲು", activeProduction: "ಪ್ರಸ್ತುತ ಉತ್ಪಾದನೆ", minesAtRisk: "ಅಪಾಯದಲ್ಲಿರುವ ಗಣಿಗಳು", modelReliability: "AI ನಿಖರತೆ", operationalAlerts: "ಎಚ್ಚರಿಕೆಗಳು", allMinesTable: "ಗಣಿ ಉತ್ಪಾದನಾ ಸ್ಥಿತಿ" },
    reserve: { heading: "ಭೂವೈಜ್ಞಾನಿಕ ಮೀಸಲು ಅಂದಾಜು", subheading: "100x100 ಮೀ ಬ್ಲಾಕ್‌ಗಳಲ್ಲಿ ಮ್ಯಾಂಗನೀಸ್ ಅದಿರು ದರ್ಜೆ ಮತ್ತು ಟನ್ ಅಂದಾಜು.", pointInspector: "ಪಾಯಿಂಟ್ ಗ್ರೇಡ್ ಅಂದಾಜಕ", inspectBlock: "ಬ್ಲಾಕ್ ಪರಿಶೀಲಿಸಿ", filterZone: "ವಲಯ ಫಿಲ್ಟರ್", allZones: "ಎಲ್ಲಾ ವಲಯಗಳು (>=32% Mn)", greenZone: "ಉತ್ತಮ ದರ್ಜೆ (>=38% Mn)", yellowZone: "ಮಧ್ಯಮ ದರ್ಜೆ (32-38% Mn)", redZone: "ಕಡಿಮೆ ದರ್ಜೆ (<32% Mn)" },
    trends: { heading: "ಉತ್ಪಾದನಾ ಇತಿಹಾಸ ಮತ್ತು ಮುನ್ಸೂಚನೆ", subheading: "24 ತಿಂಗಳ ಉತ್ಪಾದನಾ ಇತಿಹಾಸ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ.", selectMine: "ಗಣಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ" },
    risk: { heading: "ಅಪಾಯ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಮೂಲ ಕಾರಣಗಳು", subheading: "ಗಣಿ ಗುರಿಯನ್ನು ಏಕೆ ತಲುಪಲಿಲ್ಲ ಎಂಬುದನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ." },
    actions: { heading: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಕ್ರಿಯಾ ಯೋಜನೆ", subheading: "ಉತ್ಪಾದನಾ ಪ್ರಭಾವದ ಆಧಾರದ ಮೇಲೆ ಆದ್ಯತೆಯ ಕ್ರಮಗಳು." },
    equipment: { heading: "ಉಪಕರಣ ಮತ್ತು ಸ್ಪೇರ್ಸ್ ಸ್ಟೋರ್", subheading: "AI ಸ್ಥಗಿತ ಭವಿಷ್ಯ ಮತ್ತು ತ್ವರಿತ ರವಾನೆ.", emergencyRequisition: "ತುರ್ತು ಕಾರ್ಟ್", checkout: "ಆರ್ಡರ್ ಸಲ್ಲಿಸಿ" },
    digitalTwin: { heading: "ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ನಕ್ಷೆ", subheading: "ಅದಿರು ನಿಕ್ಷೇಪಗಳು, ವಾಹನಗಳು ಮತ್ತು ಅಪಾಯದ ವಲಯಗಳ ನಕ್ಷೆ.", layers: "ನಕ್ಷೆ ಪದರಗಳು", layerReserves: "ಮೀಸಲು ವಲಯಗಳು", layerFleet: "ವಾಹನ ಸ್ಥಾನ", layerRisk: "ಅಪಾಯ ಹೀಟ್‌ಮ್ಯಾಪ್", layerDrone: "ಡ್ರೋನ್ ಸಮೀಕ್ಷೆ" },
    dataHealth: { heading: "ಡೇಟಾ ಮತ್ತು ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ", subheading: "ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು AI ಮಾದರಿ ಕಾರ್ಯಾಚರಣೆಯ ಸ್ಥಿತಿ." },
    chat: { title: "MIDAS AI ಸಹಾಯಕ", placeholder: "ಗಣಿ ಅಪಾಯಗಳು ಅಥವಾ ಮೀಸಲು ಬಗ್ಗೆ ಕೇಳಿ...", disclaimer: "ಉತ್ತರಗಳು ಲೈವ್ ಡೇಟಾ ಆಧಾರಿತವಾಗಿವೆ.", suggested: "ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು" },
  },

  or: {
    nav: {
      landing: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
      dashboard: "ଅପରେସନ ଡ୍ୟାସବୋର୍ଡ",
      reserveMap: "ଭଣ୍ଡାର ଆକଳନ",
      productionTrends: "ଉତ୍ପାଦନ ଧାରା",
      riskRootCause: "ବିପଦ ଓ ମୂଳ କାରଣ",
      actions: "ପରାମର୍ଶିତ ପଦକ୍ଷେପ",
      equipment: "ଯନ୍ତ୍ରାଂଶ ଓ ଉପକରଣ ଷ୍ଟୋର",
      digitalTwin: "ଡିଜିଟାଲ ଟ୍ୱିନ୍ ମାନଚିତ୍ର",
      dataHealth: "ଡାଟା ଓ ସିଷ୍ଟମ ସ୍ଥିତି",
      chatbot: "AI ସହାୟକ",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "ଖଣି ନିର୍ଣ୍ଣୟ ସହାୟତା ପ୍ରଣାଳୀ",
      org: "ମଏଲ୍ ଲିମିଟେଡ୍ (MOIL)",
      liveFeed: "ଲାଇଭ୍ ଡାଟା ଫିଡ୍",
      cachedFeed: "ଅଫଲାଇନ୍ କ୍ୟାସ୍",
      lastSync: "ଶେଷ ସିଙ୍କ୍",
      syncNow: "ବର୍ତ୍ତମାନ ସିଙ୍କ୍ କରନ୍ତୁ",
      risk: "ବିପଦ ସ୍ତର",
      probability: "ଅଭାବ ବିପଦ",
      target: "ମାସିକ ଲକ୍ଷ୍ୟ",
      actual: "ପ୍ରକୃତ ଉତ୍ତୋଳନ",
      grade: "ଖଣିଜ ଗ୍ରେଡ୍",
      thickness: "ମୋଟେଇ",
      tonnage: "ଆକଳିତ ଟନ୍",
      confidence: "ବିଶ୍ୱସନୀୟତା",
      zone: "ଭୂତାତ୍ତ୍ୱିକ ଜୋନ୍",
      actions: "ପଦକ୍ଷେପ",
      status: "ସ୍ଥିତି",
      loading: "ଡାଟା ଲୋଡ୍ ହେଉଛି...",
      error: "ସର୍ଭର ସଂଯୋଗ ବିଫଳ",
      search: "ଖଣିର ନାମ ଖୋଜନ୍ତୁ...",
      selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
      languages: "ଭାଷା",
      searchLanguage: "୩୭ଟି ଭାଷା ଖୋଜନ୍ତୁ...",
      popular: "ଲୋକପ୍ରିୟ ଭାଷା",
      allLanguages: "ସମସ୍ତ ୩୭ଟି ଭାରତୀୟ ଓ ଆଞ୍ଚଳିକ ଭାଷା",
    },
    overview: { heading: "ଅପରେସନ୍ ସମୀକ୍ଷା", subheading: "୧୦ଟି ଖଣିରେ ରିଅଲ-ଟାଇମ୍ ଉତ୍ପାଦନ, ବିପଦ ଏବଂ ଭଣ୍ଡାର ସ୍ଥିତି।", totalReserves: "ମୋଟ ଭଣ୍ଡାର", activeProduction: "ବର୍ତ୍ତମାନର ଉତ୍ପାଦନ", minesAtRisk: "ବିପଦରେ ଥିବା ଖଣି", modelReliability: "AI ସଠିକତା", operationalAlerts: "ସତର୍କତା", allMinesTable: "ଖଣି ଉତ୍ପାଦନ ସ୍ଥିତି" },
    reserve: { heading: "ଭୂତାତ୍ତ୍ୱିକ ଭଣ୍ଡାର ଆକଳନ", subheading: "୧୦୦x୧୦୦ ମିଟର ବ୍ଲକରେ ମାଙ୍ଗାନିଜ୍ ଖଣିଜ ଗ୍ରେଡ୍ ଏବଂ ଟନ୍ ଆକଳନ।", pointInspector: "ପଏଣ୍ଟ ଗ୍ରେଡ୍ ଆକଳକ", inspectBlock: "ବ୍ଲକ୍ ଯାଞ୍ଚ", filterZone: "ଜୋନ୍ ଫିଲ୍ଟର୍", allZones: "ସମସ୍ତ ଜୋନ୍ (>=୩୨% Mn)", greenZone: "ଉଚ୍ଚ ଗ୍ରେଡ୍ (>=୩୮% Mn)", yellowZone: "ମଧ୍ୟମ ଗ୍ରେଡ୍ (୩୨-୩୮% Mn)", redZone: "ନିମ୍ନ ଗ୍ରେଡ୍ (<୩୨% Mn)" },
    trends: { heading: "ଉତ୍ପାଦନ ଇତିହାସ ଏବଂ ପୂର୍ବାନୁମାନ", subheading: "୨୪ ମାସର ଉତ୍ପାଦନ ଇତିହାସ ଏବଂ ବିଶ୍ଳେଷଣ।", selectMine: "ଖଣି ଚୟନ କରନ୍ତୁ" },
    risk: { heading: "ବିପଦ ନିର୍ଣ୍ଣୟ ଏବଂ ମୂଳ କାରଣ", subheading: "ଖଣି ଲକ୍ଷ୍ୟ ପୂରଣ ନହେବାର କାରଣ ବୁଝନ୍ତୁ।" },
    actions: { heading: "ପରାମର୍ଶିତ କାର୍ଯ୍ୟ ଯୋଜନା", subheading: "ଉତ୍ପାଦନ ବୃଦ୍ଧି ପାଇଁ ପ୍ରାଥମିକତା ପଦକ୍ଷେପ।" },
    equipment: { heading: "ଉପକରଣ ଏବଂ ସ୍ପେୟାର୍ସ ଷ୍ଟୋର୍", subheading: "AI ଖରାପ ହେବା ପୂର୍ବାନୁମାନ ଏବଂ ତୁରନ୍ତ ଅର୍ଡର।", emergencyRequisition: "ଜରୁରୀ କାର୍ଟ", checkout: "ଅର୍ଡର ଦାଖଲ କରନ୍ତୁ" },
    digitalTwin: { heading: "ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍ ମାନଚିତ୍ର", subheading: "ଖଣିଜ ଭଣ୍ଡାର, ଗାଡ଼ି ଏବଂ ବିପଦ ଅଞ୍ଚଳର ମାନଚିତ୍ର।", layers: "ମାନଚିତ୍ର ଲେୟାର୍", layerReserves: "ଭଣ୍ଡାର ଜୋନ୍", layerFleet: "ଗାଡ଼ି ସ୍ଥିତି", layerRisk: "ବିପଦ ହିଟମ୍ୟାପ୍", layerDrone: "ଡ୍ରୋନ୍ ସର୍ଭେ" },
    dataHealth: { heading: "ଡାଟା ଓ ସିଷ୍ଟମ ସ୍ଥିତି", subheading: "ଟେଲିମେଟ୍ରି ଏବଂ AI ମଡେଲ୍ ସ୍ଥିତି।" },
    chat: { title: "MIDAS AI ସହାୟକ", placeholder: "ଖଣି ବିପଦ ବା ଭଣ୍ଡାର ବିଷୟରେ ପଚାରନ୍ତୁ...", disclaimer: "ଉତ୍ତରଗୁଡ଼ିକ ଲାଇଭ୍ ଡାଟା ଉପରେ ଆଧାରିତ।", suggested: "ପ୍ରସ୍ତାବିତ ପ୍ରଶ୍ନ" },
  },

  ml: {
    nav: {
      landing: "ഹോം പേജ്",
      dashboard: "ഓപ്പറേഷൻസ് ഡാഷ്‌ബോർഡ്",
      reserveMap: "ഖനിജ ശേഖര കണക്കെടുപ്പ്",
      productionTrends: "ഉൽപ്പാദന പ്രവണതകൾ",
      riskRootCause: "അപകടസാധ്യത & കാരണങ്ങൾ",
      actions: "ശുപാർശ ചെയ്ത നടപടികൾ",
      equipment: "ഉപകരണങ്ങളും സ്പെയറുകളും സ്റ്റോർ",
      digitalTwin: "ഡിജിറ്റൽ ട്വിൻ മാപ്പ്",
      dataHealth: "ഡാറ്റ & സിസ്റ്റം ആരോഗ്യം",
      chatbot: "AI അസിസ്റ്റന്റ്",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "ഖനന തീരുമാന പിന്തുണാ സംവിധാനം",
      org: "മോയിൽ ലിമിറ്റഡ് (MOIL)",
      liveFeed: "തത്സമയ ഡാറ്റ ഫീഡ്",
      cachedFeed: "ഓഫ്‌ലൈൻ കാഷെ",
      lastSync: "അവസാന സിങ്ക്",
      syncNow: "ഇപ്പോൾ സിങ്ക് ചെയ്യുക",
      risk: "അപകട നില",
      probability: "കുറവ് വരാനുള്ള സാധ്യത",
      target: "പ്രതിമാസ ലക്ഷ്യം",
      actual: "യഥാർത്ഥ ഉൽപ്പാദനം",
      grade: "അയിര് ഗ്രേഡ്",
      thickness: "കനം",
      tonnage: "കണക്കാക്കിയ ടൺ",
      confidence: "വിശ്വാസ്യത",
      zone: "ഭൂഗർഭ മേഖല",
      actions: "നടപടികൾ",
      status: "സ്ഥിതി",
      loading: "ഡാറ്റ ലോഡ് ചെയ്യുന്നു...",
      error: "സെർവർ കണക്ഷൻ പരാജയപ്പെട്ടു",
      search: "ഖനിയുടെ പേര് തിരയുക...",
      selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക",
      languages: "ഭാഷകൾ",
      searchLanguage: "37 ഭാഷകൾ തിരയുക...",
      popular: "ജനപ്രിയ ഭാഷകൾ",
      allLanguages: "എല്ലാ 37 ഇന്ത്യൻ & പ്രാദേശിക ഭാഷകളും",
    },
    overview: { heading: "പ്രവർത്തന അവലോകനം", subheading: "10 ഖനികളിലെ തത്സമയ ഉൽപ്പാദനവും അപകടസാധ്യതയും.", totalReserves: "മൊത്തം ശേഖരം", activeProduction: "നിലവിലെ ഉൽപ്പാദനം", minesAtRisk: "അപകടസാധ്യതയുള്ള ഖനികൾ", modelReliability: "AI കൃത്യത", operationalAlerts: "മുന്നറിയിപ്പുകൾ", allMinesTable: "ഖനി ഉൽപ്പാദന പട്ടിക" },
    reserve: { heading: "ഭൂഗർഭ ശേഖര കണക്കെടുപ്പ്", subheading: "100x100 മീറ്റർ ബ്ലോക്കുകളിൽ മാംഗനീസ് അയിര് ഗ്രേഡും ടണ്ണും കണക്കാക്കൽ.", pointInspector: "പോയിന്റ് ഗ്രേഡ് കാൽക്കുലേറ്റർ", inspectBlock: "ബ്ലോക്ക് പരിശോധിക്കുക", filterZone: "സോൺ ഫിൽട്ടർ", allZones: "എല്ലാ സോണുകളും (>=32% Mn)", greenZone: "ഉയർന്ന ഗ്രേഡ് (>=38% Mn)", yellowZone: "ഇടത്തരം ഗ്രേഡ് (32-38% Mn)", redZone: "കുറഞ്ഞ ഗ്രേഡ് (<32% Mn)" },
    trends: { heading: "ഉൽപ്പാദന ചരിത്രവും പ്രവചനവും", subheading: "24 മാസത്തെ ഉൽപ്പാദന ചരിത്രവും വിശകലനവും.", selectMine: "ഖനി തിരഞ്ഞെടുക്കുക" },
    risk: { heading: "അപകടസാധ്യത നിർണയം & കാരണങ്ങൾ", subheading: "ഖനി ലക്ഷ്യത്തിലെത്താത്തതിന്റെ കാരണം മനസ്സിലാക്കുക." },
    actions: { heading: "ശുപാർശ ചെയ്യുന്ന പ്രവർത്തന പദ്ധതി", subheading: "ഉൽപ്പാദന സ്വാധീനത്തെ അടിസ്ഥാനമാക്കിയുള്ള മുൻഗണനാ നടപടികൾ." },
    equipment: { heading: "ഉപകരണ സ്റ്റോർ", subheading: "AI തകരാർ പ്രവചനവും തൽക്ഷണ ഓർഡറും.", emergencyRequisition: "അടിയന്തിര കാർട്ട്", checkout: "ഓർഡർ സമർപ്പിക്കുക" },
    digitalTwin: { heading: "ഡിജിറ്റൽ ട്വിൻ മാപ്പ്", subheading: "അയിര് ശേഖരം, വാഹനങ്ങൾ, അപകട മേഖലകൾ എന്നിവയുടെ മാപ്പ്.", layers: "മാപ്പ് ലെയറുകൾ", layerReserves: "ശേഖര സോണുകൾ", layerFleet: "വാഹന സ്ഥാനം", layerRisk: "റിസ്ക് ഹീറ്റ്മാപ്പ്", layerDrone: "ഡ്രോൺ സർവേ" },
    dataHealth: { heading: "ഡാറ്റ & സിസ്റ്റം ആരോഗ്യം", subheading: "ടെലിമെട്രിയും AI മോഡൽ പ്രവർത്തന നിലയും." },
    chat: { title: "MIDAS AI അസിസ്റ്റന്റ്", placeholder: "ഖനി അപകടങ്ങൾ അല്ലെങ്കിൽ ശേഖരത്തെക്കുറിച്ച് ചോദിക്കുക...", disclaimer: "ഉത്തരങ്ങൾ തത്സമയ ഡാറ്റയെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്.", suggested: "നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ" },
  },

  pa: {
    nav: {
      landing: "ਮੁੱਖ ਪੰਨਾ",
      dashboard: "ਓਪਰੇਸ਼ਨਜ਼ ਡੈਸ਼ਬੋਰਡ",
      reserveMap: "ਭੰਡਾਰ ਅਨੁਮਾਨ",
      productionTrends: "ਉਤਪਾਦਨ ਰੁਝਾਨ",
      riskRootCause: "ਖ਼ਤਰਾ ਅਤੇ ਮੂਲ ਕਾਰਨ",
      actions: "ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤੀਆਂ ਕਾਰਵਾਈਆਂ",
      equipment: "ਸਾਜ਼ੋ-ਸਾਮਾਨ ਅਤੇ ਸਪੇਅਰਜ਼ ਸਟੋਰ",
      digitalTwin: "ਡਿਜੀਟਲ ਟਵਿਨ ਨਕਸ਼ਾ",
      dataHealth: "ਡਾਟਾ ਅਤੇ ਸਿਸਟਮ ਸਿਹਤ",
      chatbot: "AI ਸਹਾਇਕ",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "ਖਾਣ ਫੈਸਲਾ ਸਹਾਇਤਾ ਪ੍ਰਣਾਲੀ",
      org: "ਮੋਇਲ ਲਿਮਿਟੇਡ (MOIL)",
      liveFeed: "ਲਾਈਵ ਡਾਟਾ ਫੀਡ",
      cachedFeed: "ਔਫਲਾਈਨ ਕੈਸ਼",
      lastSync: "ਆਖਰੀ ਸਿੰਕ",
      syncNow: "ਹੁਣੇ ਸਿੰਕ ਕਰੋ",
      risk: "ਖ਼ਤਰੇ ਦਾ ਪੱਧਰ",
      probability: "ਕਮੀ ਦਾ ਖ਼ਤਰਾ",
      target: "ਮਹੀਨਾਵਾਰ ਟੀਚਾ",
      actual: "ਅਸਲ ਉਤਪਾਦਨ",
      grade: "ਕੱਚੀ ਧਾਤ ਗ੍ਰੇਡ",
      thickness: "ਤਹਿ ਦੀ ਮੋਟਾਈ",
      tonnage: "ਅਨੁਮਾਨਿਤ ਟਨ",
      confidence: "ਭਰੋਸੇਯੋਗਤਾ",
      zone: "ਭੂ-ਵਿਗਿਆਨਕ ਜ਼ੋਨ",
      actions: "ਕਾਰਵਾਈਆਂ",
      status: "ਸਥਿਤੀ",
      loading: "ਡਾਟਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
      error: "ਸਰਵਰ ਕਨੈਕਸ਼ਨ ਅਸਫਲ",
      search: "ਖਾਣ ਦਾ ਨਾਮ ਖੋਜੋ...",
      selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
      languages: "ਭਾਸ਼ਾਵਾਂ",
      searchLanguage: "37 ਭਾਸ਼ਾਵਾਂ ਖੋਜੋ...",
      popular: "ਪ੍ਰਸਿੱਧ ਭਾਸ਼ਾਵਾਂ",
      allLanguages: "ਸਾਰੀਆਂ 37 ਭਾਰਤੀ ਅਤੇ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ",
    },
    overview: { heading: "ਓਪਰੇਸ਼ਨ ਸੰਖੇਪ", subheading: "10 ਖਾਣਾਂ ਵਿੱਚ ਰੀਅਲ-ਟਾਈਮ ਉਤਪਾਦਨ ਅਤੇ ਖ਼ਤਰੇ ਦੀ ਸਥਿਤੀ।", totalReserves: "ਕੁੱਲ ਭੰਡਾਰ", activeProduction: "ਮੌਜੂਦਾ ਉਤਪਾਦਨ", minesAtRisk: "ਖ਼ਤਰੇ ਵਿੱਚ ਖਾਣਾਂ", modelReliability: "AI ਸ਼ੁੱਧਤਾ", operationalAlerts: "ਚੇਤਾਵਨੀਆਂ", allMinesTable: "ਖਾਣ ਉਤਪਾਦਨ ਸਥਿਤੀ" },
    reserve: { heading: "ਭੂ-ਵਿਗਿਆਨਕ ਭੰਡਾਰ ਅਨੁਮਾਨ", subheading: "100x100 ਮੀਟਰ ਬਲਾਕਾਂ ਵਿੱਚ ਮੈਂਗਨੀਜ਼ ਅਯਸਕ ਗ੍ਰੇਡ ਅਤੇ ਟਨੇਜ ਅਨੁਮਾਨ।", pointInspector: "ਪੁਆਇੰਟ ਗ੍ਰੇਡ ਕੈਲਕੁਲੇਟਰ", inspectBlock: "ਬਲਾਕ ਜਾਂਚੋ", filterZone: "ਜ਼ੋਨ ਫਿਲਟਰ", allZones: "ਸਾਰੇ ਜ਼ੋਨ (>=32% Mn)", greenZone: "ਉੱਚ ਗ੍ਰੇਡ (>=38% Mn)", yellowZone: "ਦਰਮਿਆਨਾ ਗ੍ਰੇਡ (32-38% Mn)", redZone: "ਘੱਟ ਗ੍ਰੇਡ (<32% Mn)" },
    trends: { heading: "ਉਤਪਾਦਨ ਇਤਿਹਾਸ ਅਤੇ ਭਵਿੱਖਬਾਣੀ", subheading: "24 ਮਹੀਨਿਆਂ ਦਾ ਉਤਪਾਦਨ ਇਤਿਹਾਸ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ।", selectMine: "ਖਾਣ ਚੁਣੋ" },
    risk: { heading: "ਖ਼ਤਰਾ ਨਿਦਾਨ ਅਤੇ ਮੂਲ ਕਾਰਨ", subheading: "ਸਮਝੋ ਕਿ ਖਾਣ ਟੀਚੇ ਤੋਂ ਕਿਉਂ ਪਿੱਛੇ ਰਹਿ ਗਈ।" },
    actions: { heading: "ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤੀ ਕਾਰਜ ਯੋਜਨਾ", subheading: "ਉਤਪਾਦਨ ਵਧਾਉਣ ਲਈ ਤਰਜੀਹੀ ਕਦਮ।" },
    equipment: { heading: "ਸਾਜ਼ੋ-ਸਾਮਾਨ ਸਟੋਰ", subheading: "AI ਬ੍ਰੇਕਡਾਊਨ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਤੁਰੰਤ ਆਰਡਰ।", emergencyRequisition: "ਐਮਰਜੈਂਸੀ ਕਾਰਟ", checkout: "ਆਰਡਰ ਦਰਜ ਕਰੋ" },
    digitalTwin: { heading: "ਡਿਜੀਟਲ ਟਵਿਨ ਨਕਸ਼ਾ", subheading: "ਧਾਤ ਦੇ ਭੰਡਾਰ, ਵਾਹਨ ਅਤੇ ਖ਼ਤਰੇ ਵਾਲੇ ਖੇਤਰਾਂ ਦਾ ਨਕਸ਼ਾ।", layers: "ਨਕਸ਼ੇ ਦੀਆਂ ਪਰਤਾਂ", layerReserves: "ਭੰਡਾਰ ਜ਼ੋਨ", layerFleet: "ਵਾਹਨ ਸਥਿਤੀ", layerRisk: "ਖ਼ਤਰਾ ਹੀਟਮੈਪ", layerDrone: "ਡਰੋਨ ਸਰਵੇਖਣ" },
    dataHealth: { heading: "ਡਾਟਾ ਅਤੇ ਸਿਸਟਮ ਸਿਹਤ", subheading: "ਟੈਲੀਮੈਟਰੀ ਅਤੇ AI ਮਾਡਲ ਕਾਰਜਸ਼ੀਲ ਸਥਿਤੀ।" },
    chat: { title: "MIDAS AI ਸਹਾਇਕ", placeholder: "ਖਾਣ ਦੇ ਖ਼ਤਰਿਆਂ ਜਾਂ ਭੰਡਾਰਾਂ ਬਾਰੇ ਪੁੱਛੋ...", disclaimer: "ਜਵਾਬ ਲਾਈਵ ਡਾਟਾ 'ਤੇ ਆਧਾਰਿਤ ਹਨ।", suggested: "ਸੁਝਾਏ ਗਏ ਸਵਾਲ" },
  },

  bho: {
    nav: {
      landing: "मुख्य पन्ना",
      dashboard: "ऑपरेशन्स डैशबोर्ड",
      reserveMap: "भंडार अनुमान",
      productionTrends: "उत्पादन रुझान",
      riskRootCause: "जोखिम आ मूल कारण",
      actions: "सलाह दिहल कार्रवाई",
      equipment: "उपकरण आ स्पेयर पार्ट्स स्टोर",
      digitalTwin: "डिजिटल ट्विन नक्शा",
      dataHealth: "डेटा आ सिस्टम स्वास्थ्य",
      chatbot: "AI सहायक",
    },
    common: {
      systemName: "MIDAS",
      subtitle: "खान निर्णय सहायता प्रणाली",
      org: "मॉयल लिमिटेड (MOIL)",
      liveFeed: "लाइव डेटा फीड",
      cachedFeed: "ऑफलाइन कैश",
      lastSync: "अंतिम सिंक",
      syncNow: "अबहिए सिंक करीं",
      risk: "जोखिम स्तर",
      probability: "कमी के जोखिम",
      target: "महीना के लक्ष्य",
      actual: "असली निकासी",
      grade: "अयस्क ग्रेड",
      thickness: "मोटाई",
      tonnage: "अनुमानित टन",
      confidence: "भरोसा",
      zone: "भूगर्भीय क्षेत्र",
      actions: "कार्रवाई कदम",
      status: "स्थिति",
      loading: "डेटा लोड हो रहल बा...",
      error: "सर्वर से संपर्क ना हो पावल",
      search: "खान के नाम खोजीं...",
      selectLanguage: "भाषा चुनीं",
      languages: "भाषा",
      searchLanguage: "37 भाषा खोजीं...",
      popular: "प्रमुख भाषा",
      allLanguages: "सभ 37 गो भारतीय आ क्षेत्रीय भाषा",
    },
    overview: { heading: "ऑपरेशन्स सारांश", subheading: "10 गो खान में लाइव उत्पादन आ जोखिम के स्थिति।", totalReserves: "कुल भंडार", activeProduction: "वर्तमान उत्पादन", minesAtRisk: "जोखिम में खान", modelReliability: "AI सटीकता", operationalAlerts: "अलर्ट", allMinesTable: "खान उत्पादन स्थिति" },
    reserve: { heading: "भूवैज्ञानिक भंडार अनुमान", subheading: "100x100 मी ब्लॉक में मैंगनीज अयस्क ग्रेड आ टनभार के अनुमान।", pointInspector: "पॉइंट ग्रेड अनुमानक", inspectBlock: "ब्लॉक जांचीं", filterZone: "ज़ोन फिल्टर", allZones: "सब ज़ोन (>=32% Mn)", greenZone: "उच्च ग्रेड (>=38% Mn)", yellowZone: "मध्यम ग्रेड (32-38% Mn)", redZone: "कम ग्रेड (<32% Mn)" },
    trends: { heading: "उत्पादन इतिहास आ भविष्यवाणी", subheading: "24 महीना के उत्पादन इतिहास आ विश्लेषण।", selectMine: "खान चुनीं" },
    risk: { heading: "जोखिम निदान आ मूल कारण", subheading: "समझीं कि खान लक्ष्य से काहे पाछे छूट रहल बा।" },
    actions: { heading: "सलाह दिहल कार्य योजना", subheading: "उत्पादन बढ़ावे खातिर जरूरी कदम।" },
    equipment: { heading: "उपकरण स्टोर", subheading: "AI खराबी भविष्यवाणी आ तुरंत ऑर्डर।", emergencyRequisition: "इमरजेंसी कार्ट", checkout: "ऑर्डर जमा करीं" },
    digitalTwin: { heading: "डिजिटल ट्विन नक्शा", subheading: "अयस्क भंडार, गाड़ी आ जोखिम क्षेत्र के नक्शा।", layers: "नक्शा लेयर्स", layerReserves: "भंडार ज़ोन", layerFleet: "गाड़ी स्थिति", layerRisk: "जोखिम हीटमैप", layerDrone: "ड्रोन सर्वे" },
    dataHealth: { heading: "डेटा आ सिस्टम स्वास्थ्य", subheading: "टेलीमेट्री आ AI मॉडल के स्थिति।" },
    chat: { title: "MIDAS AI सहायक", placeholder: "खान जोखिम भा भंडार के बारे में पूछीं...", disclaimer: "उत्तर लाइव डेटा पर आधारित बा।", suggested: "सलाह दिहल सवाल" },
  },
};

// Helper: Get translation for any language code with automatic English fallback
export function getTranslationsFor(langCode: string): TranslationSchema {
  return ALL_TRANSLATIONS[langCode] || ALL_TRANSLATIONS['en'];
}
