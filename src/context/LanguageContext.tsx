import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'ta' | 'es' | 'pt' | 'ru' | 'ar' | 'zh';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇧🇷' },
  { code: 'ru', label: 'Russian', nativeLabel: 'Русский', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText: string) => string;
}

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'Multi-Jurisdictional AI Governance & Data-Fusion Engine',
    'nav.tab.fusion': 'AI Data Fusion',
    'nav.tab.policy': 'Demand Hotspots & Policy',
    'nav.tab.ingestion': 'Citizen Ingestion Hub',
    'nav.tab.datasets': 'Official Datasets',
    'nav.tab.gis': 'GIS Heatmap',
    'nav.tab.package': 'Pitch Deck & Submission Kit',
    'nav.telemetry': 'JSON Telemetry',
    'datasets.header.title': 'Official Sovereign Repositories',
    'datasets.header.subtitle': 'Verified baseline statistical metrics & capital project registries.',
    'datasets.btn.enterRealData': 'Enter Real Data',
    'datasets.btn.verifyApi': 'Verify with Live API',
    'datasets.tab.all': 'All Verified Datasets',
    'datasets.tab.demographics': '1. Demographic Census',
    'datasets.tab.infrastructure': '2. Infrastructure Indices',
    'datasets.tab.investment': '3. Public Investment Plans',
    'datasets.tab.publicFeeds': '4. Global Public Feeds (WHO / FAO)',
    'fusion.title': 'Cross-Reference & Telemetry Fusion Engine',
    'fusion.subtitle': 'Fuses real-time regional citizen voice/text submissions with official baseline demographic datasets, infrastructure indices, and public investment plans.',
    'ingestion.title': 'Citizen Telemetry Ingestion Gateway',
    'policy.title': 'BRICS Demand Hotspots & High-Priority Project Recommendations',
  },
  ta: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'பல்வேறு நாடுகளுக்கான AI ஆளுமை & தரவு இணைவு தளம்',
    'nav.tab.fusion': 'AI தரவு இணைவு',
    'nav.tab.policy': 'தேவை மையங்கள் & கொள்கைகள்',
    'nav.tab.ingestion': 'குடிமக்கள் கருத்து நுழைவு',
    'nav.tab.datasets': 'அரசு தரவுத் தொகுப்புகள்',
    'nav.tab.gis': 'GIS வரைபடம்',
    'nav.tab.package': 'திட்ட விளக்க தொகுப்பு',
    'nav.telemetry': 'JSON தொலை அளவியல்',
    'datasets.header.title': 'அரசு அதிகாரப்பூர்வ தரவுக் களஞ்சியங்கள்',
    'datasets.header.subtitle': 'சரிபார்க்கப்பட்ட புள்ளிவிவரங்கள் மற்றும் மூலதனத் திட்ட பதிவேடுகள்.',
    'datasets.btn.enterRealData': 'சுயமாக தரவை உள்ளிடுக',
    'datasets.btn.verifyApi': 'API மூலம் சரிபார்க்கவும்',
    'datasets.tab.all': 'அனைத்து தரவுகளும்',
    'datasets.tab.demographics': '1. மக்கள்தொகை கணக்கெடுப்பு',
    'datasets.tab.infrastructure': '2. உள்கட்டமைப்பு குறியீடுகள்',
    'datasets.tab.investment': '3. பொது முதலீட்டுத் திட்டங்கள்',
    'datasets.tab.publicFeeds': '4. உலகளாவிய பொதுத் தரவுகள் (WHO / FAO)',
    'fusion.title': 'குடிமக்கள் & அரசு தரவு இணைவு இயந்திரம்',
    'fusion.subtitle': 'குடிமக்களின் குரல்வழி/உரை பதிவுகளை அரசு புள்ளிவிவரங்கள் மற்றும் திட்டங்களுடன் இணைத்து துல்லியமாக ஆய்வு செய்கிறது.',
    'ingestion.title': 'குடிமக்கள் கருத்துப் பதிவு மையம்',
    'policy.title': 'முன்னுரிமை திட்டங்கள் மற்றும் தேவை மையங்கள்',
  },
  es: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'Motor de Gobernanza e Integración de Datos con IA Multijurisdiccional',
    'nav.tab.fusion': 'Fusión de Datos IA',
    'nav.tab.policy': 'Puntos Críticos y Políticas',
    'nav.tab.ingestion': 'Centro de Recepción Ciudadana',
    'nav.tab.datasets': 'Conjuntos de Datos Oficiales',
    'nav.tab.gis': 'Mapa GIS de Calor',
    'nav.tab.package': 'Kit de Presentación y Propuesta',
    'nav.telemetry': 'Telemetría JSON',
    'datasets.header.title': 'Repositorios Oficiales de Datos',
    'datasets.header.subtitle': 'Métricas estadísticas de referencia verificadas y registros de proyectos de capital.',
    'datasets.btn.enterRealData': 'Ingresar Datos Reales',
    'datasets.btn.verifyApi': 'Verificar con API en Vivo',
    'datasets.tab.all': 'Todos los Datos Verificados',
    'datasets.tab.demographics': '1. Censo Demográfico',
    'datasets.tab.infrastructure': '2. Índices de Infraestructura',
    'datasets.tab.investment': '3. Planes de Inversión Pública',
    'datasets.tab.publicFeeds': '4. Fuentes Públicas Globales (OMS / FAO)',
    'fusion.title': 'Motor de Fusión y Telemetría de Gobernanza IA',
    'fusion.subtitle': 'Fusiona solicitudes ciudadanas de voz/texto en tiempo real con datos demográficos, infraestructura y planes de inversión.',
    'ingestion.title': 'Portal de Recepción de Solicitudes Ciudadanas',
    'policy.title': 'Recomendaciones de Proyectos Prioritarios y Puntos Críticos',
  },
  pt: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'Motor de Governança de IA e Fusão de Dados Multijurisdicional',
    'nav.tab.fusion': 'Fusão de Dados com IA',
    'nav.tab.policy': 'Pontos Críticos e Políticas',
    'nav.tab.ingestion': 'Portal do Cidadão',
    'nav.tab.datasets': 'Dados Governamentais Oficiais',
    'nav.tab.gis': 'Mapa de Calor GIS',
    'nav.tab.package': 'Kit de Submissão e Pitch',
    'nav.telemetry': 'Telemetria JSON',
    'datasets.header.title': 'Repositórios Oficiais Verificados',
    'datasets.header.subtitle': 'Métricas estatísticas de linha de base e registros de projetos de capital.',
    'datasets.btn.enterRealData': 'Inserir Dados Reais',
    'datasets.btn.verifyApi': 'Verificar com API',
    'datasets.tab.all': 'Todos os Dados Verificados',
    'datasets.tab.demographics': '1. Censo Demográfico',
    'datasets.tab.infrastructure': '2. Índices de Infraestrutura',
    'datasets.tab.investment': '3. Planos de Investimento Público',
    'datasets.tab.publicFeeds': '4. Feeds Públicos Globais (OMS / FAO)',
    'fusion.title': 'Motor de Fusão e Telemetria de Dados',
    'fusion.subtitle': 'Cruza relatos de cidadãos em tempo real com dados censitários e orçamentos de infraestrutura.',
    'ingestion.title': 'Central de Ingestão de Demandas Cidadãs',
    'policy.title': 'Recomendações Prioritárias para Gestores Públicos',
  },
  ru: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'Многоюрисдикционный ИИ-движок управления и слияния данных',
    'nav.tab.fusion': 'ИИ Слияние данных',
    'nav.tab.policy': 'Горячие точки и Политика',
    'nav.tab.ingestion': 'Портал обращений граждан',
    'nav.tab.datasets': 'Официальные госданные',
    'nav.tab.gis': 'ГИС-теплокарта',
    'nav.tab.package': 'Питч-дек и Пакет заявки',
    'nav.telemetry': 'JSON Телеметрия',
    'datasets.header.title': 'Официальные государственные реестры',
    'datasets.header.subtitle': 'Проверенные базовые статистические показатели и реестры проектов.',
    'datasets.btn.enterRealData': 'Ввести реальные данные',
    'datasets.btn.verifyApi': 'Проверить через API',
    'datasets.tab.all': 'Все проверенные данные',
    'datasets.tab.demographics': '1. Демографическая перепись',
    'datasets.tab.infrastructure': '2. Индексы инфраструктуры',
    'datasets.tab.investment': '3. Планы госинвестиций',
    'datasets.tab.publicFeeds': '4. Глобальные данные (ВОЗ / ФАО)',
    'fusion.title': 'Движок слияния данных и аналитики ИИ',
    'fusion.subtitle': 'Объединяет обращения граждан в реальном времени с официальными демографическими данными и бюджетами.',
    'ingestion.title': 'Шлюз приема обращений граждан',
    'policy.title': 'Рекомендации приоритетных проектов для БРИКС',
  },
  ar: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': 'محرك حوكمة الذكاء الاصطناعي ودمج البيانات متعدد الاختصاصات',
    'nav.tab.fusion': 'دمج البيانات بالذكاء الاصطناعي',
    'nav.tab.policy': 'النقاط الساخنة والسياسات',
    'nav.tab.ingestion': 'بوابة استقبال طلبات المواطنين',
    'nav.tab.datasets': 'مجموعات البيانات الرسمية',
    'nav.tab.gis': 'الخريطة الحرارية GIS',
    'nav.tab.package': 'ملف التقديم والعرض التقديمي',
    'nav.telemetry': 'قياس عن بعد JSON',
    'datasets.header.title': 'المستودعات الحكومية الرسمية المعتمدة',
    'datasets.header.subtitle': 'المؤشرات الإحصائية الأساسية وسجلات مشاريع الاستثمار العام.',
    'datasets.btn.enterRealData': 'إدخال بيانات حقيقية',
    'datasets.btn.verifyApi': 'التحقق عبر واجهة API',
    'datasets.tab.all': 'جميع مجموعات البيانات',
    'datasets.tab.demographics': '١. التعداد السكاني والديموغرافي',
    'datasets.tab.infrastructure': '٢. مؤشرات البنية التحتية',
    'datasets.tab.investment': '٣. خطط الاستثمار العام',
    'datasets.tab.publicFeeds': '٤. مصادر البيانات العالمية (منظمة الصحة / الفاو)',
    'fusion.title': 'محرك دمج البيانات والتحليل الذكي',
    'fusion.subtitle': 'دمج بلاغات المواطنين في الوقت الفعلي مع البيانات الديموغرافية ومؤشرات البنية التحتية.',
    'ingestion.title': 'مركز استقبال بلاغات المواطنين',
    'policy.title': 'توصيات المشاريع ذات الأولوية لصناع القرار',
  },
  zh: {
    'nav.brand': 'CivicPulse',
    'nav.tagline': '跨管辖区人工智能治理与数据融合引擎',
    'nav.tab.fusion': 'AI 数据融合',
    'nav.tab.policy': '需求热点与政策',
    'nav.tab.ingestion': '公众诉求接入中心',
    'nav.tab.datasets': '官方基准数据集',
    'nav.tab.gis': 'GIS 热力图',
    'nav.tab.package': '演示文稿与申报材料',
    'nav.telemetry': 'JSON 遥测数据',
    'datasets.header.title': '官方权威数据仓库',
    'datasets.header.subtitle': '经验证的基础统计指标与公共资本项目库。',
    'datasets.btn.enterRealData': '录入真实数据',
    'datasets.btn.verifyApi': '在线 API 验证',
    'datasets.tab.all': '所有已验证数据集',
    'datasets.tab.demographics': '1. 人口普查数据',
    'datasets.tab.infrastructure': '2. 基础设施指数',
    'datasets.tab.investment': '3. 公共投资计划',
    'datasets.tab.publicFeeds': '4. 全球公共数据源 (WHO / FAO)',
    'fusion.title': '跨领域数据融合与决策分析引擎',
    'fusion.subtitle': '将实时公众语音与文本诉求与国家人口基准、基础设施指数及财政投资规划深度融合。',
    'ingestion.title': '公众多渠道诉求接入门户',
    'policy.title': '金砖国家重点民生项目决策建议',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, defaultText) => defaultText,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageCode>('en');

  const t = (key: string, defaultText: string) => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    return defaultText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
