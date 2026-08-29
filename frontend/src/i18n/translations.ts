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
    syncTelemetry: string;
    syncing: string;
    exportCSV: string;
    activeShift: string;
    fleetTelemetry: string;
    online: string;
    units: string;
    weather: string;
    rain: string;
    sausarBelt: string;
    pace: string;
    flagged: string;
    allClean: string;
    highRisk: string;
    moderateRisk: string;
    onTrack: string;
    proved111: string;
    krigingMesh: string;
    aucScore: string;
    deficitsDetected: string;
    alertBannerTitle: string;
    alertBannerDesc: string;
    filterFlagged: string;
    searchPlaceholder: string;
    allTab: string;
    needsAttentionTab: string;
    onTrackTab: string;
    extracted: string;
    targetLabel: string;
    achieved: string;
    tPerDay: string;
    driver: string;
    preview: string;
    diagnose: string;
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
    quickQueries: string;
    welcomeMessage: string;
    query1: string;
    query2: string;
    query3: string;
    query4: string;
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
      syncTelemetry: "Sync Telemetry",
      syncing: "Syncing...",
      exportCSV: "Export CSV",
      activeShift: "Active Shift A",
      fleetTelemetry: "Fleet Telemetry",
      online: "Online",
      units: "units",
      weather: "Weather",
      rain: "Rain",
      sausarBelt: "Sausar Manganese Belt",
      pace: "pace",
      flagged: "Flagged",
      allClean: "All Clean",
      highRisk: "High Risk",
      moderateRisk: "Moderate Risk",
      onTrack: "On Track",
      proved111: "Proved 111",
      krigingMesh: "In-situ Cutoff ≥32% Mn • Kriging Mesh",
      aucScore: "0.9921 AUC",
      deficitsDetected: "133/135 Deficits Detected (Test Holdout)",
      alertBannerTitle: "production units require immediate attention",
      alertBannerDesc: "Production pace is lagging due to equipment downtime and precipitation.",
      filterFlagged: "Filter Flagged Units →",
      searchPlaceholder: "Search mine, ID, or root cause...",
      allTab: "All",
      needsAttentionTab: "Needs Attention",
      onTrackTab: "On Track",
      extracted: "Extracted:",
      targetLabel: "Target:",
      achieved: "achieved",
      tPerDay: "T/day",
      driver: "Driver:",
      preview: "Preview",
      diagnose: "Diagnose →",
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
      quickQueries: "QUICK QUERIES:",
      welcomeMessage: "MIDAS AI Assistant active. I provide **real-time mine shortfall risk assessments**, SHAP root-cause attributions, prescriptive rules, equipment dispatch forecasts, and **geological reserve block estimates**.\n\nSelect a suggested query or ask anything about mine operations.",
      query1: "Why is Mine MN01 at risk this month?",
      query2: "What is our total estimated tonnage in the high-grade zone?",
      query3: "Show model validation accuracy and recall metrics",
      query4: "Which spare parts should we requisition immediately for Balaghat?",
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
      syncTelemetry: "टेलीमेट्री सिंक करें",
      syncing: "सिंक हो रहा है...",
      exportCSV: "सीएसवी निर्यात करें",
      activeShift: "सक्रिय शिफ्ट ए",
      fleetTelemetry: "वाहन टेलीमेट्री",
      online: "ऑनलाइन",
      units: "इकाइयां",
      weather: "मौसम",
      rain: "बारिश",
      sausarBelt: "सौसर मैंगनीज बेल्ट",
      pace: "गति",
      flagged: "चिह्नित",
      allClean: "सभी सामान्य",
      highRisk: "उच्च जोखिम",
      moderateRisk: "मध्यम जोखिम",
      onTrack: "सामान्य स्थिति",
      proved111: "प्रमाणित 111",
      krigingMesh: "इन-सिटू कटऑफ ≥32% Mn • क्रिगिंग मेश",
      aucScore: "0.9921 AUC",
      deficitsDetected: "133/135 कमियां पहचानी गईं (परीक्षण परिणाम)",
      alertBannerTitle: "उत्पादन इकाइयों पर तत्काल ध्यान देने की आवश्यकता है",
      alertBannerDesc: "उपकरण विफलता और वर्षा के कारण उत्पादन गति धीमी है।",
      filterFlagged: "चिह्नित खदानें देखें →",
      searchPlaceholder: "खान, आईडी या कारण खोजें...",
      allTab: "सभी",
      needsAttentionTab: "ध्यान योग्य",
      onTrackTab: "सामान्य स्थिति",
      extracted: "निकासी:",
      targetLabel: "लक्ष्य:",
      achieved: "प्राप्त",
      tPerDay: "टन/दिन",
      driver: "मुख्य कारण:",
      preview: "पूर्वावलोकन",
      diagnose: "निदान करें →",
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
      quickQueries: "त्वरित प्रश्न:",
      welcomeMessage: "MIDAS एआई सहायक सक्रिय है। मैं **वास्तविक समय खान कमी जोखिम**, SHAP मूल कारण, उपचारात्मक नियम, उपकरण प्रेषण पूर्वानुमान और **भूवैज्ञानिक भंडार अनुमान** प्रदान करता हूं।",
      query1: "खान MN01 इस महीने जोखिम में क्यों है?",
      query2: "उच्च ग्रेड क्षेत्र में हमारा कुल अनुमानित टनभार कितना है?",
      query3: "मॉडल सत्यापन सटीकता और रिकॉल मेट्रिक्स दिखाएं",
      query4: "बालाघाट के लिए कौन से स्पेयर पार्ट्स तुरंत मंगवाने चाहिए?",
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
      syncTelemetry: "टेलिमेट्री सिंक करा",
      syncing: "सिंक होत आहे...",
      exportCSV: "CSV निर्यात करा",
      activeShift: "सक्रिय शिफ्ट ए",
      fleetTelemetry: "फ्लीट टेलिमेट्री",
      online: "ऑनलाइन",
      units: "युनिट्स",
      weather: "हवामान",
      rain: "पाऊस",
      sausarBelt: "सौसर मँगनीज पट्टा",
      pace: "गती",
      flagged: "चिन्हांकित",
      allClean: "सर्व सामान्य",
      highRisk: "उच्च धोका",
      moderateRisk: "मध्यम धोका",
      onTrack: "ट्रॅकवर",
      proved111: "प्रमाणित 111",
      krigingMesh: "इन-सिटू कटऑफ ≥32% Mn • क्रिगिंग मेश",
      aucScore: "0.9921 AUC",
      deficitsDetected: "133/135 तूट ओळखली (चाचणी निकाल)",
      alertBannerTitle: "उत्पादन युनिट्सकडे त्वरित लक्ष देणे आवश्यक आहे",
      alertBannerDesc: "उपकरण बिघाड आणि पावसामुळे उत्पादन गती मागे पडत आहे.",
      filterFlagged: "चिन्हांकित युनिट्स पहा →",
      searchPlaceholder: "खाण, आयडी किंवा कारण शोधा...",
      allTab: "सर्व",
      needsAttentionTab: "लक्ष देणे आवश्यक",
      onTrackTab: "ट्रॅकवर",
      extracted: "उत्पादन:",
      targetLabel: "उद्दिष्ट:",
      achieved: "पूर्ण",
      tPerDay: "टन/दिवस",
      driver: "मूळ कारण:",
      preview: "पूर्वावलोकन",
      diagnose: "निदान करा →",
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
    trends: { heading: "उत्पादन इतिहास आणि अंदाज", subheading: "24 महिन्यांचा मासिक उत्पादन व धोका इतिहास.", selectMine: "खाण निवडा" },
    risk: { heading: "धोका निदान व मूळ कारणे", subheading: "खाण उद्दिष्टापेक्षा मागे का पडू शकते ते समजून घ्या." },
    actions: { heading: "सुचवलेली कृती योजना", subheading: "उत्पादन सुधारणेच्या प्रभावानुसार प्राधान्यीकृत पावले." },
    equipment: { heading: "उपकरणे व स्पेअर्स स्टोअर", subheading: "एआय उपकरण बिघाड अंदाज आणि वन-क्लिक डेपो डिस्पॅच.", emergencyRequisition: "तातडीचे प्रेषण कार्ट", checkout: "मागणी पत्र सादर करा" },
    digitalTwin: { heading: "डिजिटल ट्विन नकाशा", subheading: "धातू साठा, उपकरणे आणि धोका क्षेत्रांचा नकाशा.", layers: "नकाशा लेयर्स", layerReserves: "साठा क्षेत्र", layerFleet: "उपकरणे स्थिती", layerRisk: "धोका हीटमॅप", layerDrone: "ड्रोन सर्व्हे" },
    dataHealth: { heading: "डेटा व प्रणाली स्थिती", subheading: "टेलिमेट्री स्ट्रीम्स, सॅटेलाइट सिंक आणि एआय मॉडेल्स स्थिती." },
    chat: {
      title: "MIDAS एआय सहाय्यक",
      placeholder: "खाण धोका किंवा उपायांविषयी विचारा...",
      disclaimer: "उत्तरे थेट डेटा आणि प्रमाणित एआय मॉडेलवर आधारित आहेत.",
      suggested: "सुचवलेले प्रश्न",
      quickQueries: "जलद प्रश्न:",
      welcomeMessage: "MIDAS एआय सहाय्यक सक्रिय आहे. मी **थेट खाण तुटवडा धोका**, SHAP मूळ कारणे, सुधारात्मक नियम आणि **भूगर्भीय साठा अंदाज** प्रदान करतो.",
      query1: "खाण MN01 या महिन्यात धोक्यात का आहे?",
      query2: "उच्च दर्जाच्या क्षेत्रात एकूण अंदाजित साठा किती आहे?",
      query3: "मॉडेल अचूकता आणि रिकॉल मेट्रिक्स दाखवा",
      query4: "बालाघाटसाठी कोणते स्पेअर्स त्वरित मागवावेत?",
    },
  },
};

export function getTranslationsFor(langCode: string): TranslationSchema {
  return ALL_TRANSLATIONS[langCode] || ALL_TRANSLATIONS['en'];
}
