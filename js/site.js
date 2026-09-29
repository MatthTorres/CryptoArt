// ==========================================================
// MarketPulse — JS compartido: Home (index.html), Sobre nosotros (about.html)
// y Políticas de uso (legal.html). Tema oscuro/claro, idioma ES/EN/PT y
// datos del mercado para el home. La versión vive en js/version.js.
// ==========================================================

// Idiomas soportados. `locale` es el BCP-47 para números y fechas: el_pt-BR es
// el que espera un lector brasileño (R$ 1.234,56 y 28/09/2026).
const LANGS = [
  { code: 'es', btn: 'ES', locale: 'es-ES', name: 'Español' },
  { code: 'en', btn: 'EN', locale: 'en-US', name: 'English' },
  { code: 'pt', btn: 'PT', locale: 'pt-BR', name: 'Português' },
];
// Antes el código era binario (`lang === 'en' ? EN : ES`). Con tres idiomas eso
// devuelve inglés para cualquier idioma que no sea español, así que PT
// acabaría hablando inglés. Estos helpers son la única fuente de verdad.
function loc(tag) {
  const hit = LANGS.find(l => l.code === tag);
  return hit ? hit.locale : 'es-ES';
}
// Nombre localizado de un activo con campos name / nameEn / namePt.
function pickName(item) {
  if (state.lang === 'en' && item.nameEn) return item.nameEn;
  if (state.lang === 'pt' && item.namePt) return item.namePt;
  return item.name;
}

const I18N = {
  es: {
    homeTitle: 'MarketPulse — Inicio',
    aboutTitle: 'MarketPulse — Sobre nosotros',
    homeTagline: 'Cripto · Metales · Forex — Fundamental + Técnico',
    langEsName: 'Español',
    langEnName: 'Inglés',
    langPtName: 'Portugués',
    navHome: 'Inicio',
    navAnalysis: 'Cripto',
    navMetals: 'Metales',
    navForex: 'Divisas',
    navAbout: 'Sobre nosotros',
    footerPrefix: 'MarketPulse · Datos de mercado en tiempo real · Actualizado:',
    footerLegal: 'Políticas de uso y responsabilidad',
    footerVersion: 'Versión',
    footerRights: 'Todos los derechos reservados.',
    footerBrandLine: 'MarketPulse · Análisis multi-activo: cripto, metales y divisas',
    errorTitle: 'MarketPulse — Página no encontrada',
    errorHeading: 'Página no encontrada',
    errorText: 'La ruta solicitada no existe o ha cambiado. Vuelve al inicio para seguir con el análisis diario de cripto, metales y divisas.',
    errorCta: 'Ir al inicio →',
    legalTitle: 'MarketPulse — Políticas de uso y Liberación de responsabilidad',
    homeLoading: 'Cargando datos del mercado…',
    homeOk: 'Datos actualizados correctamente.',
    homeError: '⚠️ No se pudieron cargar los datos del mercado (posible límite de la API). Pulsa Reintentar en unos segundos.',
    retry: 'Reintentar',
    homeHeroCrypto: 'El pulso del mercado cripto hoy',
    homeHeroMetals: 'El pulso del mercado de metales hoy',
    homeHeroForex: 'El pulso del mercado de divisas hoy',
    heroPause: 'Pausar la rotación automática',
    heroPlay: 'Reanudar la rotación automática',
    marketFearGreed: 'Índice Miedo/Codicia',
    marketCap: 'Cap. mercado total',
    marketDominance: 'Dominancia BTC',
    coinsTitle: 'Elige una cripto para analizar',
    metalsTitle: 'Elige un metal o energía para analizar',
    metalsDesc: 'Cobertura spot con visión fundamental, lectura técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    metalGold: 'Metal refugio por excelencia.',
    metalPlatinum: 'Usado en catalizadores y joyería.',
    metalPalladium: 'El metal más raro de los preciosos.',
    metalOil: 'La materia prima energética más operada.',
    metalCopper: 'El metal industrial de la electrificación.',
    metalCarbon: 'La transición energética, medida en el mercado.',
    forexTitle: 'Elige un activo Forex para analizar',
    forexDesc: 'Cotizaciones del mercado de divisas con visión fundamental, lectura técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    forexCardEUR: 'La divisa más operada del mundo.',
    forexCardGBP: 'Alta liquidez, sensible a tasas.',
    forexCardJPY: 'Refugio clásico en Asia.',
    forexCardCOP: 'Tasa local USD/COP.',
    forexCardMXN: 'Tasa local USD/MXN.',
    coinsDesc: 'Cada análisis incluye visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    btnAnalysis: 'Ver análisis completo →',
    weekPrefix: 'En 7 días:',
    summarySentiment: 'El sentimiento del mercado hoy es de {fng} ({fngVal}/100).',
    summaryLeaders: 'Líderes del día: {list}.',
    summaryLaggards: 'Más castigados hoy: {list}.',
    segCrypto: 'cripto',
    segMetals: 'metales y energía',
    segForex: 'divisas',
    segToneUp: 'En promedio, {n} activos de {seg} operan al alza en las últimas 24 horas.',
    segToneFlat: 'Los {n} activos de {seg} se mueven laterales, sin una tendencia clara en las últimas 24 horas.',
    segToneDown: 'En promedio, los {n} activos de {seg} operan a la baja en las últimas 24 horas.',
    statBest: 'Mejor del día',
    statWorst: 'Peor del día',
    statAvg: 'Promedio 24h',
    segLoading: 'Actualizando los datos de este mercado…',
    segUnavailable: 'Ahora mismo no hay datos disponibles para este mercado.',
    trendUpStrong: 'Fuerte impulso alcista en las últimas 24 horas.',
    trendUp: 'Tendencia alcista moderada en el día.',
    trendFlat: 'Consolidación / movimiento lateral durante el día.',
    trendDown: 'Caída moderada en las últimas 24 horas.',
    trendDownStrong: 'Fuerte caída durante el día — posible sobreventa.',
    aboutHeroTitle: 'Sobre MarketPulse',
    aboutHeroText: 'MarketPulse es una plataforma de análisis multi-activo que combina datos de mercado en tiempo real con indicadores estadísticos para ofrecerte, cada día, una lectura clara de qué puede pasar con las principales criptomonedas, metales y divisas.',
    aboutMissionTitle: 'Nuestra misión',
    aboutMissionText: 'Democratizar el análisis financiero: traducir indicadores complejos de cripto, metales y Forex en probabilidades y rangos fáciles de entender, para que cualquier persona pueda tomar decisiones informadas y gestionar su riesgo.',
    aboutHowTitle: 'Qué incluye cada análisis',
    aboutHow1: 'Análisis fundamental: variaciones 24h/7d/30d, sentimiento de mercado, volumen y capitalización (según el activo).',
    aboutHow2: 'Lectura técnica: tendencia, momentum y volatilidad calculados sobre el historial reciente de cada activo.',
    aboutHow3: 'Probabilidad de subida y de bajada para cada análisis y una probabilidad combinada ponderada.',
    aboutHow4: 'Rango estimado de fluctuación del día: escenarios alcista/bajista y precio esperado al cierre.',
    aboutHow5: 'Recomendación profesional combinada (compra / mantenimiento / venta) con gráficos diario y en tiempo real.',
    aboutVerticalsTitle: 'Tres mercados, una metodología',
    aboutVerticalCrypto: 'Cripto: Bitcoin, Ethereum, Solana, XRP y Dogecoin, con precio, capitalización, volumen y sentimiento del mercado.',
    aboutVerticalMetals: 'Metales, energía y carbono: Oro, Platino, Paladio, Petróleo WTI, Cobre y Carbono, con precio y variación del día.',
    aboutVerticalForex: 'Divisas: EUR/USD, GBP/USD, USD/JPY, USD/COP y USD/MXN, con cotización en vivo y variación del día.',
    aboutSourcesTitle: 'Transparencia y privacidad',
    aboutSourcesText: 'Trabajamos con proveedores de datos de mercado reconocidos y renovamos la información de forma continua. Medimos el uso del sitio con Umami Cloud: analítica sin cookies, con la IP anonimizada y sin datos que permitan identificarte. Los detalles están en las políticas de uso.',
    aboutRiskTitle: 'Aviso de riesgo',
    aboutRiskText: 'MarketPulse no presta asesoría financiera. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Cripto, metales y divisas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder y usa siempre stop-loss.',
    aboutRiskLink: 'Consulta las políticas de uso y liberación de responsabilidad.',
    legalHeroTitle: 'Políticas de uso y Liberación de responsabilidad',
    legalHeroText: 'Condiciones para usar MarketPulse: qué ofrece la plataforma, qué no ofrece y cuáles son tus responsabilidades como usuario.',
    legalUpdated: 'Última actualización:',
    legalVersion: 'Versión del programa:',
    legalSummaryTitle: 'Resumen rápido',
    legalSummaryText: 'MarketPulse es una herramienta informativa y educativa. No es asesoría financiera, no gestiona tu dinero y no garantiza resultados. Los datos provienen de terceros y pueden fallar. Cada decisión de inversión es tuya y bajo tu responsabilidad.',
    legalUseTitle: '1. Uso permitido',
    legalUseText: 'MarketPulse es una herramienta informativa de análisis multi-activo (criptomonedas, metales, energía y divisas). Puedes consultar libremente los análisis, probabilidades, rangos estimados y gráficos para fines educativos y de investigación personal.',
    legalMisuseTitle: '2. Uso no permitido',
    legalMisuse1: 'No usar la plataforma para prestar asesoría financiera a terceros como si fuera una recomendación profesional certificada.',
    legalMisuse2: 'No redistribuir automáticamente los datos con scraping masivo que degrade el servicio o afecte a los proveedores de datos.',
    legalMisuse3: 'No intentar alterar, descompilar ni suplantar la identidad visual de MarketPulse.',
    legalRiskTitle: '3. Liberación de responsabilidad',
    legalRiskText: 'MarketPulse no presta asesoría financiera, no gestiona fondos y no garantiza resultados. Los análisis, probabilidades y rangos se generan automáticamente a partir de modelos estadísticos y datos públicos de terceros, y pueden contener errores, retrasos o interrupciones. Toda decisión de inversión la tomas bajo tu propio riesgo.',
    legalVolTitle: '4. Riesgo de los activos',
    legalVolText: 'Las criptomonedas, los metales, la energía y las divisas son activos volátiles y conllevan riesgo de pérdida parcial o total del capital, incluyendo apalancamiento, brechas de precio y eventos geopolíticos. Nunca inviertas más de lo que puedes permitirte perder y usa siempre gestión de riesgo (stop-loss, diversificación).',
    legalDataTitle: '5. Datos y disponibilidad',
    legalDataText: 'La información de mercado proviene de proveedores externos, por lo que puede haber retrasos, interrupciones o diferencias frente a otras fuentes, ajenas a MarketPulse. Los cálculos se ejecutan en tu navegador. Usamos Umami Cloud (umami.is) como encargado del tratamiento para medir el uso del sitio de forma anónima: registra páginas vistas, URL de referencia, tipo de navegador, sistema operativo, tipo de dispositivo y país de origen. No utiliza cookies ni publicidad, anonimiza la IP y no almacena datos que permitan identificarte, por lo que no se requiere banner de consentimiento. Sus servidores están en la UE y EE. UU. y los datos se conservan 6 meses. Puedes solicitar su eliminación en cualquier momento.',
    legalIpTitle: '6. Propiedad intelectual',
    legalIpText: 'El nombre MarketPulse, su logo, sus textos y el código de análisis pertenecen a sus autores. Puedes compartir enlaces a la plataforma citando la fuente, pero no copiar ni clonar el sitio completo con fines comerciales sin autorización.',
    legalContactTitle: '7. Contacto y cambios',
    legalContactText: 'Estas políticas pueden actualizarse con cada versión del programa (consulta el número de versión en el pie de página). El uso continuado de la plataforma implica la aceptación de la versión vigente.',
  },
  pt: {
    homeTitle: 'MarketPulse — Início',
    aboutTitle: 'MarketPulse — Sobre nós',
    homeTagline: 'Cripto · Metais · Forex — Fundamental + Técnico',
    langEsName: 'Espanhol',
    langEnName: 'Inglês',
    langPtName: 'Português',
    navHome: 'Início',
    navAnalysis: 'Cripto',
    navMetals: 'Metais',
    navForex: 'Câmbio',
    navAbout: 'Sobre nós',
    footerPrefix: 'MarketPulse · Dados de mercado em tempo real · Atualizado:',
    footerLegal: 'Políticas de uso e responsabilidade',
    footerVersion: 'Versão',
    footerRights: 'Todos os direitos reservados.',
    footerBrandLine: 'MarketPulse · Análise multiactive: cripto, metais e câmbio',
    errorTitle: 'MarketPulse — Página não encontrada',
    errorHeading: 'Página não encontrada',
    errorText: 'O endereço acessado não existe ou mudou. Volte ao início para seguir a análise diária de cripto, metais e câmbio.',
    errorCta: 'Ir para o início →',
    legalTitle: 'MarketPulse — Políticas de uso e Isenção de Responsabilidade',
    homeLoading: 'Carregando dados do mercado…',
    homeOk: 'Dados atualizados com sucesso.',
    homeError: '⚠️ Não foi possível carregar os dados do mercado (limite da API possível). Clique em Tentar novamente em alguns segundos.',
    retry: 'Tentar novamente',
    homeHeroCrypto: 'O pulso do mercado cripto hoje',
    homeHeroMetals: 'O pulso do mercado de metais hoje',
    homeHeroForex: 'O pulso do mercado de câmbio hoje',
    heroPause: 'Pausar a rotação automática',
    heroPlay: 'Retomar a rotação automática',
    marketFearGreed: 'Índice de Medo/Ganância',
    marketCap: 'Cap. de mercado total',
    marketDominance: 'Dominância do BTC',
    coinsTitle: 'Escolha uma cripto para analisar',
    metalsTitle: 'Escolha um metal ou energia para analisar',
    metalsDesc: 'Cobertura à vista com visão fundamental, leitura técnica, probabilidades de alta/baixa, faixa estimada do dia e recomendação profissional.',
    metalGold: 'O metal refúgio por excelência.',
    metalPlatinum: 'Usado em catalisadores e joalheria.',
    metalPalladium: 'O metal mais raro entre os preciosos.',
    metalOil: 'A matéria-prima energética mais negociada.',
    metalCopper: 'O metal industrial da eletrificação.',
    metalCarbon: 'A transição energética, medida pelo mercado.',
    forexTitle: 'Escolha um ativo Forex para analisar',
    forexDesc: 'Cotações do mercado de câmbio com visão fundamental, leitura técnica, probabilidades de alta/baixa, faixa estimada do dia e recomendação profissional.',
    forexCardEUR: 'A moeda mais negociada do mundo.',
    forexCardGBP: 'Alta liquidez, sensível aos juros.',
    forexCardJPY: 'Refúgio clássico na Ásia.',
    forexCardCOP: 'Câmbio local USD/COP.',
    forexCardMXN: 'Câmbio local USD/MXN.',
    coinsDesc: 'Cada análise inclui visão fundamental, visão técnica, probabilidades de alta/baixa, faixa estimada do dia e recomendação profissional.',
    btnAnalysis: 'Ver análise completa →',
    weekPrefix: 'Em 7 dias:',
    summarySentiment: 'O sentimento do mercado hoje é {fng} ({fngVal}/100).',
    summaryLeaders: 'Líderes do dia: {list}.',
    summaryLaggards: 'Mais pressionados hoje: {list}.',
    segCrypto: 'cripto',
    segMetals: 'metais e energia',
    segForex: 'câmbio',
    segToneUp: 'Em média, {n} ativos de {seg} operam em alta nas últimas 24 horas.',
    segToneFlat: 'Os {n} ativos de {seg} estão de lado, sem tendência clara nas últimas 24 horas.',
    segToneDown: 'Em média, os {n} ativos de {seg} operam em baixa nas últimas 24 horas.',
    statBest: 'Melhor do dia',
    statWorst: 'Pior do dia',
    statAvg: 'Média 24h',
    segLoading: 'Atualizando os dados deste mercado…',
    segUnavailable: 'Neste momento não há dados disponíveis para este mercado.',
    trendUpStrong: 'Forte impulso comprador nas últimas 24 horas.',
    trendUp: 'Tendência de alta moderada no dia.',
    trendFlat: 'Consolidação / movimento lateral durante o dia.',
    trendDown: 'Queda moderada nas últimas 24 horas.',
    trendDownStrong: 'Forte queda durante o dia — possível sobrevenda.',
    aboutHeroTitle: 'Sobre o MarketPulse',
    aboutHeroText: 'O MarketPulse é uma plataforma de análise multiactive que combina dados de mercado em tempo real com indicadores estatísticos para oferecer, todos os dias, uma leitura clara do que pode acontecer com as principais criptomoedas, metais e moedas.',
    aboutMissionTitle: 'A nossa missão',
    aboutMissionText: 'Democratizar a análise financeira: traduzir indicadores complexos de cripto, metais e Forex em probabilidades e faixas fáceis de entender, para que qualquer pessoa possa tomar decisões informadas e gerir o seu risco.',
    aboutHowTitle: 'O que cada análise inclui',
    aboutHow1: 'Análise fundamental: variações de 24h/7d/30d, sentimento de mercado, volume e capitalização (conforme o ativo).',
    aboutHow2: 'Leitura técnica: tendência, momentum e volatilidade calculados sobre o histórico recente de cada ativo.',
    aboutHow3: 'Probabilidade de alta e de baixa para cada análise e uma probabilidade combinada ponderada.',
    aboutHow4: 'Faixa estimada de oscilação do dia: cenários de alta/baixa e preço esperado no fechamento.',
    aboutHow5: 'Recomendação profissional combinada (compra / manutenção / venda) com gráficos diários e em tempo real.',
    aboutVerticalsTitle: 'Três mercados, uma metodologia',
    aboutVerticalCrypto: 'Cripto: Bitcoin, Ethereum, Solana, XRP e Dogecoin, com preço, capitalização, volume e sentimento de mercado.',
    aboutVerticalMetals: 'Metais, energia e carbono: Ouro, Platina, Paládio, Petróleo WTI, Cobre e Carbono, com preço e variação do dia.',
    aboutVerticalForex: 'Câmbio: EUR/USD, GBP/USD, USD/JPY, USD/COP e USD/MXN, com cotação ao vivo e variação do dia.',
    aboutSourcesTitle: 'Transparência e privacidade',
    aboutSourcesText: 'Trabalhamos com fornecedores de dados de mercado reconhecidos e renovamos as informações continuamente. Medimos o uso do site com o Umami Cloud: análise sem cookies, com o IP anonimizado e sem dados que permitam identificar-te. Os detalhes estão nas políticas de uso.',
    aboutRiskTitle: 'Aviso de risco',
    aboutRiskText: 'O MarketPulse não presta consultoria financeira. As estimativas são geradas automaticamente a partir de modelos estatísticos e dados públicos, e não garantem resultados. Cripto, metais e câmbio são ativos voláteis: nunca invista mais do que pode perder e use sempre stop-loss.',
    aboutRiskLink: 'Consulte as políticas de uso e isenção de responsabilidade.',
    legalHeroTitle: 'Políticas de uso e Isenção de Responsabilidade',
    legalHeroText: 'Condições de uso do MarketPulse: o que a plataforma oferece, o que não oferece e quais são as suas responsabilidades como utilizador.',
    legalUpdated: 'Última atualização:',
    legalVersion: 'Versão do programa:',
    legalSummaryTitle: 'Resumo rápido',
    legalSummaryText: 'O MarketPulse é uma ferramenta informativa e educativa. Não é consultoria financeira, não gere o seu dinheiro e não garante resultados. Os dados vêm de terceiros e podem falhar. Cada decisão de investimento é sua e sob a sua responsabilidade.',
    legalUseTitle: '1. Uso permitido',
    legalUseText: 'O MarketPulse é uma ferramenta informativa de análise multiactive (criptomoedas, metais, energia e câmbio). Pode consultar livremente as análises, probabilidades, faixas estimadas e gráficos para fins educativos e de investigação pessoal.',
    legalMisuseTitle: '2. Uso não permitido',
    legalMisuse1: 'Não usar a plataforma para prestar consultoria financeira a terceiros como se fosse uma recomendação profissional certificada.',
    legalMisuse2: 'Não redistribuir automaticamente os dados com scraping massivo que degrada o serviço ou afeta os fornecedores de dados.',
    legalMisuse3: 'Não tentar alterar, descompilar ou imitar a identidade visual do MarketPulse.',
    legalRiskTitle: '3. Isenção de responsabilidade',
    legalRiskText: 'O MarketPulse não presta consultoria financeira, não gere fundos e não garante resultados. As análises, probabilidades e faixas são geradas automaticamente a partir de modelos estatísticos e dados públicos de terceiros, e podem conter erros, atrasos ou interrupções. Toda a decisão de investimento é tomada por si sob o seu próprio risco.',
    legalVolTitle: '4. Risco dos ativos',
    legalVolText: 'As criptomoedas, os metais, a energia e as moedas são ativos voláteis e implicam risco de perda parcial ou total do capital, incluindo alavancagem, saltos de preço e eventos geopolíticos. Nunca invista mais do que pode perder e use sempre gestão de risco (stop-loss, diversificação).',
    legalDataTitle: '5. Dados e disponibilidade',
    legalDataText: 'A informação de mercado vem de fornecedores externos, pelo que pode haver atrasos, interrupções ou diferenças face a outras fontes, alheias ao MarketPulse. Os cálculos são executados no seu navegador. Usamos o Umami Cloud (umami.is) como encarregado do tratamento para medir o uso do site de forma anónima: regista páginas vistas, URL de referência, tipo de navegador, sistema operativo, tipo de dispositivo e país de origem. Não utiliza cookies nem publicidade, anonimiza o IP e não armazena dados que permitam identificar-te, pelo que não é necessário um banner de consentimento. Os seus servidores estão na UE e nos EUA e os dados são conservados durante 6 meses. Podes solicitar a sua eliminação a qualquer momento.',
    legalIpTitle: '6. Propriedade intelectual',
    legalIpText: 'O nome MarketPulse, o seu logótipo, os seus textos e o código de análise pertencem aos seus autores. Pode partilhar links para a plataforma citando a fonte, mas não copiar nem clonar o site completo para fins comerciais sem autorização.',
    legalContactTitle: '7. Contacto e alterações',
    legalContactText: 'Estas políticas podem ser atualizadas a cada versão do programa (consulte o número da versão no rodapé). A utilização continuada da plataforma implica a aceitação da versão vigente.',
  },
  en: {
    homeTitle: 'MarketPulse — Home',
    aboutTitle: 'MarketPulse — About us',
    homeTagline: 'Crypto · Metals · Forex — Fundamental + Technical',
    langEsName: 'Spanish',
    langEnName: 'English',
    langPtName: 'Portuguese',
    navHome: 'Home',
    navAnalysis: 'Crypto',
    navMetals: 'Metals',
    navForex: 'Forex',
    navAbout: 'About us',
    footerPrefix: 'MarketPulse · Real-time market data · Updated:',
    footerLegal: 'Terms of use & disclaimer',
    footerVersion: 'Version',
    footerRights: 'All rights reserved.',
    footerBrandLine: 'MarketPulse · Multi-asset analysis: crypto, metals and forex',
    errorTitle: 'MarketPulse — Page not found',
    errorHeading: 'Page not found',
    errorText: 'The page you requested does not exist or has moved. Go back home to keep reading the daily analysis of crypto, metals and forex.',
    errorCta: 'Go to home →',
    legalTitle: 'MarketPulse — Terms of Use & Disclaimer',
    homeLoading: 'Loading market data…',
    homeOk: 'Data updated successfully.',
    homeError: '⚠️ Could not load market data (possible API rate limit). Press Retry in a few seconds.',
    retry: 'Retry',
    homeHeroCrypto: 'The pulse of the crypto market today',
    homeHeroMetals: 'The pulse of the metals market today',
    homeHeroForex: 'The pulse of the forex market today',
    heroPause: 'Pause automatic rotation',
    heroPlay: 'Resume automatic rotation',
    marketFearGreed: 'Fear/Greed Index',
    marketCap: 'Total market cap',
    marketDominance: 'BTC dominance',
    coinsTitle: 'Choose a crypto to analyze',
    metalsTitle: 'Choose a metal or energy to analyze',
    metalsDesc: 'Spot coverage with fundamental view, technical read, up/down probabilities, daily estimated range and professional recommendation.',
    metalGold: 'The ultimate safe-haven metal.',
    metalPlatinum: 'Used in catalysts and jewelry.',
    metalPalladium: 'The rarest precious metal.',
    metalOil: 'The most traded energy commodity.',
    metalCopper: 'The industrial metal behind electrification.',
    metalCarbon: 'The energy transition, measured by the market.',
    forexTitle: 'Choose a Forex asset to analyze',
    forexDesc: 'Currency market quotes with fundamental view, technical read, up/down probabilities, daily estimated range and professional recommendation.',
    forexCardEUR: 'The most traded pair in the world.',
    forexCardGBP: 'High liquidity, rate-sensitive.',
    forexCardJPY: 'Classic Asian safe haven.',
    forexCardCOP: 'Local USD/COP rate.',
    forexCardMXN: 'Local USD/MXN rate.',
    coinsDesc: "Each analysis includes a fundamental view, a technical view, up/down probabilities, the day's estimated range and a professional recommendation.",
    btnAnalysis: 'View full analysis →',
    weekPrefix: 'Over 7 days:',
    summarySentiment: "Today's market sentiment is {fng} ({fngVal}/100).",
    summaryLeaders: "Today's leaders: {list}.",
    summaryLaggards: "Today's laggards: {list}.",
    segCrypto: 'crypto',
    segMetals: 'metals and energy',
    segForex: 'forex',
    segToneUp: 'On average, {n} {seg} assets are up over the last 24 hours.',
    segToneFlat: 'The {n} tracked {seg} assets are trading sideways, with no clear trend over the last 24 hours.',
    segToneDown: 'On average, the {n} {seg} assets are down over the last 24 hours.',
    statBest: 'Best today',
    statWorst: 'Worst today',
    statAvg: '24h average',
    segLoading: 'Updating the data for this market…',
    segUnavailable: 'There is no data available for this market right now.',
    trendUpStrong: 'Strong bullish momentum in the last 24 hours.',
    trendUp: 'Moderate uptrend on the day.',
    trendFlat: 'Consolidation / sideways action during the day.',
    trendDown: 'Moderate decline over the last 24 hours.',
    trendDownStrong: 'Sharp drop on the day — possibly oversold.',
    aboutHeroTitle: 'About MarketPulse',
    aboutHeroText: 'MarketPulse is a multi-asset analysis platform that combines real-time market data with statistical indicators to give you, every day, a clear read on what may happen with leading cryptocurrencies, metals and currencies.',
    aboutMissionTitle: 'Our mission',
    aboutMissionText: 'Democratize financial analysis: turn complex crypto, metals and Forex indicators into probabilities and ranges that are easy to understand, so anyone can make informed decisions and manage their risk.',
    aboutHowTitle: 'What each analysis includes',
    aboutHow1: 'Fundamental analysis: 24h/7d/30d changes, market sentiment, volume and market cap (depending on the asset).',
    aboutHow2: 'Technical read: trend, momentum and volatility computed over each asset’s recent history.',
    aboutHow3: 'Up and down probabilities for each analysis plus a weighted combined probability.',
    aboutHow4: 'Estimated daily fluctuation range: bullish/bearish scenarios and expected closing price.',
    aboutHow5: 'Combined professional recommendation (buy / hold / sell) with daily and real-time charts.',
    aboutVerticalsTitle: 'Three markets, one methodology',
    aboutVerticalCrypto: 'Crypto: Bitcoin, Ethereum, Solana, XRP and Dogecoin, with price, market cap, volume and market sentiment.',
    aboutVerticalMetals: 'Metals, energy & carbon: Gold, Platinum, Palladium, WTI Oil, Copper and Carbon, with price and daily change.',
    aboutVerticalForex: 'Forex: EUR/USD, GBP/USD, USD/JPY, USD/COP and USD/MXN, with live quotes and daily change.',
    aboutSourcesTitle: 'Transparency and privacy',
    aboutSourcesText: 'We work with recognised market-data providers and refresh the information continuously. We measure site usage with Umami Cloud: cookie-free analytics, with the IP anonymized and no data that could identify you. Details are in the usage policies.',
    aboutRiskTitle: 'Risk disclaimer',
    aboutRiskText: 'MarketPulse does not provide financial advice. Estimates are generated automatically from statistical models and public data and do not guarantee results. Crypto, metals and forex are volatile assets: never invest more than you can afford to lose and always use a stop-loss.',
    aboutRiskLink: 'Read the terms of use and liability disclaimer.',
    legalHeroTitle: 'Terms of Use & Disclaimer',
    legalHeroText: 'Terms for using MarketPulse: what the platform offers, what it does not offer, and your responsibilities as a user.',
    legalUpdated: 'Last updated:',
    legalVersion: 'App version:',
    legalSummaryTitle: 'Quick summary',
    legalSummaryText: 'MarketPulse is an informational and educational tool. It is not financial advice, it does not manage your money and it does not guarantee results. Data comes from third parties and may fail. Every investment decision is yours and your responsibility.',
    legalUseTitle: '1. Permitted use',
    legalUseText: 'MarketPulse is an informational multi-asset analysis tool (cryptocurrencies, metals, energy and forex). You may freely consult analyses, probabilities, estimated ranges and charts for educational and personal research purposes.',
    legalMisuseTitle: '2. Prohibited use',
    legalMisuse1: 'Do not use the platform to provide financial advice to third parties as if it were certified professional advice.',
    legalMisuse2: 'Do not redistribute data automatically with massive scraping that degrades the service or affects the data providers.',
    legalMisuse3: 'Do not attempt to alter, decompile or impersonate the MarketPulse brand.',
    legalRiskTitle: '3. Disclaimer',
    legalRiskText: 'MarketPulse does not provide financial advice, manage funds or guarantee results. Analyses, probabilities and ranges are generated automatically from statistical models and third-party public data, and may contain errors, delays or outages. Every investment decision is at your own risk.',
    legalVolTitle: '4. Asset risk',
    legalVolText: 'Cryptocurrencies, metals, energy and forex are volatile assets with risk of partial or total loss of capital, including leverage, price gaps and geopolitical events. Never invest more than you can afford to lose and always use risk management (stop-loss, diversification).',
    legalDataTitle: '5. Data & availability',
    legalDataText: 'Market data comes from external providers, so delays, outages or differences with other sources may occur and are outside MarketPulse’s control. Calculations run in your browser. We use Umami Cloud (umami.is) as data processor to measure site usage anonymously: it records page views, referrer URL, browser type, operating system, device type and country of origin. It uses no cookies or advertising, anonymizes the IP address and stores no data that could identify you, so no consent banner is required. Its servers are located in the EU and the US, and data is retained for 6 months. You can request its deletion at any time.',
    legalIpTitle: '6. Intellectual property',
    legalIpText: 'The MarketPulse name, logo, texts and analysis code belong to their authors. You may share links to the platform citing the source, but may not copy or clone the full site for commercial purposes without permission.',
    legalContactTitle: '7. Contact & changes',
    legalContactText: 'These policies may be updated with each program version (see the version number in the footer). Continued use of the platform implies acceptance of the current version.',
  },
};

// ---------- Estado de preferencias (compartido con la app de análisis) ----------
const state = {
  theme: localStorage.getItem('btc-theme') || 'dark',
  // Se valida contra LANGS: un valor antiguo o manipulado en localStorage
  // (p. ej. 'pt-BR' de una versión previa) caería en un idioma sin diccionario.
  lang: (() => {
    const saved = localStorage.getItem('btc-lang');
    return LANGS.some(l => l.code === saved) ? saved : 'es';
  })(),
  statusKey: 'homeLoading',
};

const cached = {};

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.es[key] || key;
}

function locale() { return loc(state.lang); }

function fmtUSD(n) {
  return new Intl.NumberFormat(locale(), { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n, digits = 1) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`;
}
function fmtBig(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return fmtUSD(n);
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}
function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('btc-theme', theme);
  applyTheme();
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  // Desplegable: solo se ve el código del idioma activo. El botón muestra
  // `langCurrent` y las opciones se marcan con aria-current (no una clase
  // .active, que ya no existe en el CSS del desplegable).
  const current = document.getElementById('langCurrent');
  if (current) {
    const active = LANGS.find(l => l.code === state.lang);
    if (active) current.textContent = active.btn;
  }
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.setAttribute('aria-current', opt.dataset.lang === state.lang ? 'true' : 'false');
  });
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(state.statusKey);
  // Navegación activa según la página
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    const active = (page === 'home' && href.startsWith('index.html')) ||
                   (page === 'about' && href.startsWith('about.html'));
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  renderHome();
  heroUpdateLabels();
  if (typeof stampVersionFooter === 'function') stampVersionFooter();
}
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('btc-lang', lang);
  applyLang();
}

// ---------- Traducciones del sentimiento Fear & Greed ----------
// El API de alternative.me devuelve las etiquetas en inglés; cada idioma tiene
// su propio mapa en vez de un ternario, porque PT no puede caer en el inglés.
const FNG_MAP = {
  es: { 'Extreme Fear': 'Miedo extremo', 'Fear': 'Miedo', 'Neutral': 'Neutral', 'Greed': 'Codicia', 'Extreme Greed': 'Codicia extrema' },
  pt: { 'Extreme Fear': 'Medo extremo', 'Fear': 'Medo', 'Neutral': 'Neutro', 'Greed': 'Ganância', 'Extreme Greed': 'Ganância extrema' },
  en: {},
};
function translateFng(label) {
  const map = FNG_MAP[state.lang] || FNG_MAP.es;
  return map[label] || label;
}

function trendKey(change24h) {
  if (change24h >= 2.5) return 'trendUpStrong';
  if (change24h >= 0.5) return 'trendUp';
  if (change24h > -0.5) return 'trendFlat';
  if (change24h > -2.5) return 'trendDown';
  return 'trendDownStrong';
}

// ---------- Home: tarjetas + resumen del mercado ----------
function renderHomeSkeletons(grid, n = 5) {
  if (!grid) return;
  // Solo pinta esqueletos si aún no hay tarjetas reales.
  if (grid.querySelector('.coin-card')) return;
  grid.innerHTML = '';
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'coin-card card skeleton-card';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<div class="sk sk-line sk-title"></div>'
      + '<div class="sk sk-line sk-price"></div>'
      + '<div class="sk sk-line sk-chg"></div>'
      + '<div class="sk sk-line sk-cta"></div>';
    grid.appendChild(d);
  }
}

function renderHome() {
  const grid = document.getElementById('coinCards');
  // Sin caché todavía (primera visita): pinta esqueletos al instante para que
  // la retícula y la navegación respondan antes de que llegue la red.
  if (!grid) return;
  if (!cached.markets) { renderHomeSkeletons(grid); return; }

  grid.innerHTML = '';
  cached.markets.forEach(m => {
    const c24 = m.price_change_percentage_24h ?? 0;
    const c7 = m.price_change_percentage_7d ?? 0;
    const a = document.createElement('a');
    a.className = 'coin-card card';
    a.href = `analysis.html?coin=${m.id}`;
    a.innerHTML = `
      <div class="coin-card-head">
        <img src="${m.image}" alt="${m.symbol}" width="40" height="40" loading="lazy" decoding="async">
        <div>
          <h3>${m.name}</h3>
          <span class="coin-sym">${m.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div class="coin-card-price">${fmtUSD(m.current_price)}</div>
      <div class="coin-chg">
        <span class="${c24 >= 0 ? 'up' : 'down'}">24h ${fmtPct(c24)}</span>
        <span class="${c7 >= 0 ? 'up' : 'down'}">${t('weekPrefix')} ${fmtPct(c7)}</span>
      </div>
      <p class="coin-trend">${t(trendKey(c24))}</p>
      <span class="coin-cta">${t('btnAnalysis')}</span>`;
    grid.appendChild(a);
  });

  // El resumen y las estadísticas siguen al titular rotatorio (cripto/metales/divisas)
  renderSegmentInfo(activeSegmentIndex());
}

// ---------- Home: información por segmento (sigue al titular rotatorio) ----------
// El titular rota entre cripto, metales y divisas; el resumen y las estadísticas
// cambian con él para que la información corresponda al mercado anunciado.
const SEGMENTS = [
  { key: 'crypto', labelKey: 'segCrypto' },
  { key: 'metals', labelKey: 'segMetals' },
  { key: 'forex', labelKey: 'segForex' },
];
const SEGMENT_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.cors.lol/?url=',
];
const SEGMENT_HOSTS = ['https://query1.finance.yahoo.com', 'https://query2.finance.yahoo.com'];
// Misma cascada que las páginas de análisis (2 hosts × 2 proxies): prueba cada
// combinación con 1 intento y avanza en cuanto una falla, sin pausas.
const SEGMENT_QUOTES = {
  metals: [
    { yahoo: 'GC=F', es: 'Oro', en: 'Gold', pt: 'Ouro' },
    { yahoo: 'PL=F', es: 'Platino', en: 'Platinum', pt: 'Platina' },
    { yahoo: 'PA=F', es: 'Paladio', en: 'Palladium', pt: 'Paládio' },
    { yahoo: 'CL=F', es: 'Petróleo', en: 'Oil', pt: 'Petróleo' },
    { yahoo: 'HG=F', es: 'Cobre', en: 'Copper', pt: 'Cobre' },
    { yahoo: 'KRBN', es: 'Carbono', en: 'Carbon', pt: 'Carbono' },
  ],
  forex: [
    { yahoo: 'EURUSD=X', es: 'EUR/USD', en: 'EUR/USD', pt: 'EUR/USD' },
    { yahoo: 'GBPUSD=X', es: 'GBP/USD', en: 'GBP/USD', pt: 'GBP/USD' },
    { yahoo: 'JPY=X', es: 'USD/JPY', en: 'USD/JPY', pt: 'USD/JPY' },
    { yahoo: 'COP=X', es: 'USD/COP', en: 'USD/COP', pt: 'USD/COP' },
    { yahoo: 'MXN=X', es: 'USD/MXN', en: 'USD/MXN', pt: 'USD/MXN' },
  ],
};

function activeSegmentIndex() {
  const i = typeof heroActiveIndex === 'function' ? heroActiveIndex() : 0;
  return i >= 0 && i < SEGMENTS.length ? i : 0;
}
function activeSegmentKey() {
  return (SEGMENTS[activeSegmentIndex()] || SEGMENTS[0]).key;
}

// Cotizaciones del segmento (metales o divisas) con la misma cascada de proxies
// que las páginas de análisis. Se pide solo el último tramo diario para el cambio de 24 h.
// Se guardan en localStorage: en la siguiente visita del home ya no se pide nada.
const SEGMENT_TTL = 15 * 60 * 1000;
function segmentStoreKey(key) { return 'mp_seg_' + key; }
function readSegmentStore(key) {
  try {
    const raw = localStorage.getItem(segmentStoreKey(key));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < SEGMENT_TTL ? data : null;
  } catch { return null; }
}
function writeSegmentStore(key, data) {
  try { localStorage.setItem(segmentStoreKey(key), JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota */ }
}

async function fetchSegmentChart(yahooSymbol) {
  const path = `/v8/finance/chart/${yahooSymbol}?interval=1d&range=5d`;
  let lastErr = null;
  for (const host of SEGMENT_HOSTS) {
    for (const proxy of SEGMENT_PROXIES) {
      try {
        // Tope 8 s: sin AbortController, un proxy colgado dejaba el titular
        // rotatorio sin datos de metales/divisas hasta el timeout del navegador.
        const data = await fetchRetry(proxy + encodeURIComponent(host + path), 1, 8000);
        if (data && data.chart && data.chart.result && data.chart.result[0]) return data;
        lastErr = new Error('yahoo empty');
      } catch (e) { lastErr = e; }
    }
  }
  throw lastErr || new Error('segment Yahoo failed');
}

async function loadSegmentQuotes(key) {
  if (cached.segments && cached.segments[key]) return cached.segments[key];
  const stored = readSegmentStore(key);
  if (stored) {
    if (!cached.segments) cached.segments = {};
    cached.segments[key] = stored;
    return stored;
  }
  const list = SEGMENT_QUOTES[key] || [];
  // El segmento de metales pasó de 5 a 8 símbolos. Lanzarlos todos en paralelo
  // es lo que dispara el rate-limit del proxy gratuito, así que se piden en
  // tandas de 4: la latencia apenas sube y se sigue sin perder cotizaciones
  // (Promise.allSettled degrada a «sin datos» solo si un símbolo falla).
  const CONCURRENCY = 4;
  const settled = [];
  for (let i = 0; i < list.length; i += CONCURRENCY) {
    const batch = list.slice(i, i + CONCURRENCY);
    settled.push(...await Promise.allSettled(batch.map(q =>
      fetchSegmentChart(q.yahoo)
        .then(d => {
          const closes = (d.chart.result[0].indicators.quote[0].close || []).filter(v => v != null);
          if (closes.length < 2) throw new Error('sin datos');
          const last = closes[closes.length - 1];
          const prev = closes[closes.length - 2];
          return { es: q.es, en: q.en, chg24: ((last - prev) / prev) * 100 };
        })
    )));
  }
  const quotes = settled.filter(r => r.status === 'fulfilled').map(r => r.value)
    .sort((a, b) => b.chg24 - a.chg24);
  if (quotes.length < 2) throw new Error('sin cotizaciones');
  const seg = { quotes, avg: quotes.reduce((s, q) => s + q.chg24, 0) / quotes.length };
  if (!cached.segments) cached.segments = {};
  cached.segments[key] = seg;
  writeSegmentStore(key, seg);
  return seg;
}

// Nombre del ticker en el idioma activo, con español como respaldo si el
// idioma no trae la etiqueta (p. ej.Cotizaciones que son solo un par).
function quoteLabel(q) { return q[state.lang] || q.es; }

function addStatRow(container, name, value, cls = 'neutral') {
  const row = document.createElement('div');
  row.className = 'metric-row';
  row.innerHTML = `<span class="metric-name">${name}</span><span class="metric-value ${cls}">${value}</span>`;
  container.appendChild(row);
}

// Resumen + estadísticas del segmento que muestra el titular en pantalla.
function renderSegmentInfo(index) {
  const el = document.getElementById('marketSummary');
  const stats = document.getElementById('marketStats');
  if (!el || !stats) return;
  const seg = SEGMENTS[index] || SEGMENTS[0];

  // --- Cripto: sentimiento, capitalización total y dominancia ---
  if (seg.key === 'crypto') {
    if (!cached.markets || !cached.markets.length) { el.textContent = '—'; stats.innerHTML = ''; return; }
    const sorted = [...cached.markets].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0));
    const leaders = sorted.slice(0, 2).map(m => `${m.symbol.toUpperCase()} ${fmtPct(m.price_change_percentage_24h ?? 0)}`).join(', ');
    const laggards = sorted.slice(-2).reverse().map(m => `${m.symbol.toUpperCase()} ${fmtPct(m.price_change_percentage_24h ?? 0)}`).join(', ');
    const avg = cached.markets.reduce((s, m) => s + (m.price_change_percentage_24h ?? 0), 0) / cached.markets.length;
    const tone = avg > 0.5 ? 'segToneUp' : avg < -0.5 ? 'segToneDown' : 'segToneFlat';
    const parts = [];
    if (cached.fng) parts.push(t('summarySentiment').replace('{fng}', translateFng(cached.fng.value_classification)).replace('{fngVal}', cached.fng.value));
    parts.push(t(tone).replace('{n}', cached.markets.length).replace('{seg}', t(seg.labelKey)));
    parts.push(t('summaryLeaders').replace('{list}', leaders));
    parts.push(t('summaryLaggards').replace('{list}', laggards));
    el.textContent = parts.join(' ');
    stats.innerHTML = '';
    if (cached.fng) addStatRow(stats, t('marketFearGreed'), `${cached.fng.value} · ${translateFng(cached.fng.value_classification)}`, Number(cached.fng.value) >= 50 ? 'up' : 'down');
    if (cached.global) {
      addStatRow(stats, t('marketCap'), fmtBig(cached.global.total_market_cap.usd));
      addStatRow(stats, t('marketDominance'), `${cached.global.market_cap_percentage.btc.toFixed(1)}%`);
    }
    return;
  }

  // --- Metales y divisas: mejor, peor y promedio del segmento ---
  const data = cached.segments && cached.segments[seg.key];
  if (!data) {
    el.textContent = t('segLoading');
    stats.innerHTML = '';
    loadSegmentQuotes(seg.key)
      .then(() => { if (activeSegmentIndex() === index) renderSegmentInfo(index); })
      .catch(() => { if (activeSegmentIndex() === index) el.textContent = t('segUnavailable'); });
    return;
  }
  const best = data.quotes[0];
  const worst = data.quotes[data.quotes.length - 1];
  const tone = data.avg > 0.15 ? 'segToneUp' : data.avg < -0.15 ? 'segToneDown' : 'segToneFlat';
  const leaders = data.quotes.slice(0, 2).map(q => `${quoteLabel(q)} ${fmtPct(q.chg24)}`).join(', ');
  const laggards = data.quotes.slice(-2).reverse().map(q => `${quoteLabel(q)} ${fmtPct(q.chg24)}`).join(', ');
  el.textContent = [
    t(tone).replace('{n}', data.quotes.length).replace('{seg}', t(seg.labelKey)),
    t('summaryLeaders').replace('{list}', leaders),
    t('summaryLaggards').replace('{list}', laggards),
  ].join(' ');
  stats.innerHTML = '';
  addStatRow(stats, t('statBest'), `${quoteLabel(best)} ${fmtPct(best.chg24)}`, best.chg24 >= 0 ? 'up' : 'down');
  addStatRow(stats, t('statWorst'), `${quoteLabel(worst)} ${fmtPct(worst.chg24)}`, worst.chg24 >= 0 ? 'up' : 'down');
  // El color del promedio sigue al signo real: un -0.04% no puede verse en verde.
  addStatRow(stats, t('statAvg'), fmtPct(data.avg), data.avg > 0.05 ? 'up' : data.avg < -0.05 ? 'down' : 'neutral');
}

// ---------- Fetch con reintento (cubre el rate-limit429 de CoinGecko) ----------
// Timeout corto: la primera visita no puede quedarse colgada esperando a una
// API lenta. Si un proveedor tarda >8 s, se aborta y se usa caché/fallback.
function fetchWithTimeout(url, ms = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}
async function fetchRetry(url, tries = 3, ms = 8000) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetchWithTimeout(url, ms);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
}

function showRetry(container, onClick) {
  if (!container) return;
  container.querySelectorAll('.retry-btn').forEach(b => b.remove());
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'retry-btn';
  btn.textContent = t('retry');
  btn.addEventListener('click', () => { btn.remove(); onClick(); });
  container.appendChild(btn);
}

function setStatusText(key) {
  state.statusKey = key;
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(key);
}

function loadHomeWithRetry() {
  document.querySelector('#statusRow .loader')?.classList.remove('done');
  document.querySelector('#statusRow')?.querySelectorAll('.retry-btn').forEach(b => b.remove());
  setStatusText('homeLoading');
  loadHomeData().catch(handleHomeError);
}

function handleHomeError(err) {
  console.error(err);
  document.querySelector('#statusRow .loader')?.classList.add('done');
  setStatusText('homeError');
  showRetry(document.getElementById('statusRow'), loadHomeWithRetry);
}

const HOME_STORE_KEY = 'mp_home_v1';
const HOME_TTL = 15 * 60 * 1000; // 15 min: el home reutiliza datos entre visitas
const HOME_BACKUP_TTL = 24 * 60 * 60 * 1000; // 24 h: última red ante fallo total
function readHomeStore(maxAge) {
  try {
    const raw = localStorage.getItem(HOME_STORE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < maxAge ? data : null;
  } catch { return null; }
}
function writeHomeStore(data) {
  try { localStorage.setItem(HOME_STORE_KEY, JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota */ }
}

async function loadHomeData() {
  // 1) Pintado instantáneo: si hay caché (15 min o respaldo 24 h), se muestra
  // AHORA y la red solo refresca en segundo plano. Así abrir la web y navegar
  // entre páginas es inmediato, incluso con la API lenta o caída.
  const quick = readHomeStore(HOME_TTL) || readHomeStore(HOME_BACKUP_TTL);
  if (quick) {
    applyHomePayload(quick);
    // Refresco silencioso en segundo plano (no bloquea la navegación).
    refreshHomeInBackground();
    // Precarga diferida de metales/divisas sin competir con el pintado inicial.
    scheduleSegmentPrefetch();
    return;
  }
  // 2) Sin caché (primera visita): red con timeout + respuesta parcial.
  const ids = 'bitcoin,ethereum,solana,ripple,dogecoin';
  const [markets, fngRes, globalRes] = await Promise.all([
    fetchMarketsPart(ids),
    fetchRetry('https://api.alternative.me/fng/?limit=1').catch(() => null),
    fetchRetry('https://api.coingecko.com/api/v3/global').catch(() => null),
  ]);
  if (!markets.length) throw new Error('markets vacío');
  const payload = { markets, fng: fngRes && fngRes.data ? fngRes.data[0] : null, global: globalRes && globalRes.data ? globalRes.data : null };
  writeHomeStore(payload);
  applyHomePayload(payload);
  scheduleSegmentPrefetch();
}

// Mercado para las tarjetas de la portada, con respuesta parcial: CoinGecko es
// gratis y sin clave, asi que con varios visitantes a la vez puede devolver
// 429 para algun id. Antes un solo id en fallo hacia fallar la llamada entera
// y la portada se quedaba vacia aunque los otros cuatro vinieran bien.
async function fetchMarketsPart(ids) {
  const wanted = ids.split(',');
  const found = new Map();
  for (const id of wanted) {
    try {
      const r = await fetchRetry(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd` +
        `&ids=${id}&price_change_percentage=24h,7d&sparkline=false`);
      if (Array.isArray(r) && r.length) found.set(id, r[0]);
    } catch { /* ese id se queda fuera; el resto de la portada se muestra igual */ }
  }
  return wanted.map((id) => found.get(id)).filter(Boolean);
}

function applyHomePayload(payload) {
  cached.markets = payload.markets;
  cached.fng = payload.fng || cached.fng;
  cached.global = payload.global || cached.global;
  state.statusKey = 'homeOk';
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(state.statusKey);
  document.querySelector('#statusRow .loader')?.classList.add('done');
  const ut = document.getElementById('updateTime');
  if (ut) ut.textContent = new Date().toLocaleString(locale());
  renderHome();
}

// Refresco en segundo plano: no toca el estado visible salvo que tenga éxito.
async function refreshHomeInBackground() {
  try {
    const ids = 'bitcoin,ethereum,solana,ripple,dogecoin';
    const [markets, fngRes, globalRes] = await Promise.all([
      fetchMarketsPart(ids),
      fetchRetry('https://api.alternative.me/fng/?limit=1').catch(() => null),
      fetchRetry('https://api.coingecko.com/api/v3/global').catch(() => null),
    ]);
    if (!Array.isArray(markets) || !markets.length) return;
    const payload = { markets, fng: fngRes && fngRes.data ? fngRes.data[0] : null, global: globalRes && globalRes.data ? globalRes.data : null };
    writeHomeStore(payload);
    applyHomePayload(payload);
  } catch { /* se mantiene lo cacheado */ }
}

function scheduleSegmentPrefetch() {
  // Precarga en segundo plano los datos de metales y divisas para que el titular
  // rotatorio tenga información al instante. Se hacen uno detrás de otro (no 10
  // en paralelo) para no disparar el rate-limit del proxy gratuito, y de forma
  // diferida para no competir con el primer pintado.
  const run = async () => {
    for (const key of ['metals', 'forex']) {
      try {
        await loadSegmentQuotes(key);
        if (activeSegmentKey() === key) renderSegmentInfo(activeSegmentIndex());
      } catch { /* se reintenta al activar ese mercado */ }
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 1500);
}

// ---------- Home: titular rotatorio (cripto → metales → divisas) ----------
// El contador SOLO avanza cuando el usuario está quieto: cualquier interacción
// (mover el ratón, hacer scroll, clic, teclado o volver a la pestaña) marca actividad
// y el cambio se pospone, de modo que el titular no cambia mientras se lee la página.
const HERO_SLIDE_INTERVAL = 30000; // 30 s de inactividad antes de cambiar de titular
const heroSlider = { timer: null, paused: false, lastActivity: 0 };

function heroSlideEls() {
  return Array.from(document.querySelectorAll('#heroRotator .hero-slide'));
}
function heroDotEls() {
  return Array.from(document.querySelectorAll('#heroDots .hero-dot'));
}
function heroActiveIndex() {
  const i = heroSlideEls().findIndex(el => el.classList.contains('is-active'));
  return i < 0 ? 0 : i;
}

// Etiquetas accesibles de los puntos y del botón de pausa (según el idioma).
function heroUpdateLabels() {
  const keys = ['navAnalysis', 'navMetals', 'navForex'];
  heroDotEls().forEach((dot, i) => {
    if (!keys[i]) return;
    dot.setAttribute('aria-label', t(keys[i]));
    dot.setAttribute('title', t(keys[i]));
  });
  const pause = document.getElementById('heroPause');
  if (pause) {
    const label = t(heroSlider.paused ? 'heroPlay' : 'heroPause');
    pause.setAttribute('aria-label', label);
    pause.setAttribute('title', label);
    pause.setAttribute('aria-pressed', heroSlider.paused ? 'true' : 'false');
    pause.textContent = heroSlider.paused ? '▶' : '⏸';
  }
}

// Muestra el titular `index` deslizándolo fuera de pantalla y entrando el nuevo.
function heroShow(index, isSync) {
  const slides = heroSlideEls();
  if (!slides.length) return;
  const total = slides.length;
  const current = heroActiveIndex();
  const next = ((index % total) + total) % total;
  if (next === current && !isSync) return;

  // Sentido del deslizamiento (hacia delante o hacia atrás).
  const rotator = document.getElementById('heroRotator');
  const forward = next === current + 1 || (current === total - 1 && next === 0);
  if (rotator) rotator.dataset.dir = forward ? 'next' : 'prev';

  const leaving = slides[current];
  slides.forEach((el, i) => {
    el.classList.toggle('is-active', i === next);
    el.setAttribute('aria-hidden', i === next ? 'false' : 'true');
  });
  if (leaving && leaving !== slides[next]) {
    leaving.classList.add('is-leaving');
    window.setTimeout(() => leaving.classList.remove('is-leaving'), 650);
  }
  heroDotEls().forEach((dot, i) => {
    dot.classList.toggle('is-active', i === next);
    if (i === next) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  // La información (resumen y estadísticas) acompaña al titular: cambia con el.
  renderSegmentInfo(next);
}

function heroAdvance(step) {
  heroShow(heroActiveIndex() + step);
}
function heroStopAuto() {
  if (heroSlider.timer) {
    window.clearTimeout(heroSlider.timer);
    heroSlider.timer = null;
  }
}
// Arranca (o reinicia) el ciclo de rotación.
function heroStartAuto() {
  heroStopAuto();
  if (heroSlider.paused || heroSlideEls().length < 2) return;
  heroSlider.lastActivity = Date.now();
  heroSlider.timer = window.setTimeout(heroTick, HERO_SLIDE_INTERVAL);
}
// Un único temporizador comprueba el tiempo de inactividad en cada tic:
// si el usuario se movió, NO cambia el titular y se reprograma por el tiempo
// restante; si lleva el intervalo completo quieto, avanza y arranca el siguiente ciclo.
function heroTick() {
  const idle = Date.now() - heroSlider.lastActivity;
  if (idle < HERO_SLIDE_INTERVAL) {
    heroSlider.timer = window.setTimeout(heroTick, HERO_SLIDE_INTERVAL - idle);
    return;
  }
  heroAdvance(1);
  heroStartAuto();
}
// Actividad del usuario: solo marca la hora (barato, sin tocar el temporizador).
// Así el tic decide si ya pasó el intervalo de inactividad.
function heroNoteActivity() {
  if (heroSlider.paused) return;
  heroSlider.lastActivity = Date.now();
}
function heroToggleAuto() {
  heroSlider.paused = !heroSlider.paused;
  if (heroSlider.paused) heroStopAuto();
  else heroStartAuto();
  heroUpdateLabels();
}

function initHeroSlider() {
  const rotator = document.getElementById('heroRotator');
  if (!rotator) return;

  heroShow(0, true);
  heroUpdateLabels();

  // Puntos: ir directo a un titular.
  heroDotEls().forEach((dot, i) => {
    dot.addEventListener('click', () => {
      heroShow(i);
      heroStartAuto();
    });
  });

  // Botón de pausa/reanudar la rotación automática.
  document.getElementById('heroPause')?.addEventListener('click', heroToggleAuto);

  // Deslizar con el dedo (móvil):
  let startX = null;
  rotator.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    heroStopAuto();
  }, { passive: true });
  rotator.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) { heroStartAuto(); return; }
    heroAdvance(dx < 0 ? 1 : -1);
    heroStartAuto();
  }, { passive: true });

  // Pausa al pasar el ratón por encima; se reanuda al salir.
  rotator.addEventListener('mouseenter', heroStopAuto);
  rotator.addEventListener('mouseleave', heroStartAuto);

  // La cuenta atrás se reinicia con cualquier actividad: si el usuario está
  // leyendo o navegando, el titular no cambia hasta que lleve 30 s quieto.
  ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll'].forEach(evt => {
    window.addEventListener(evt, heroNoteActivity, { passive: true, capture: true });
  });
  // Al volver a la pestaña se concede el intervalo completo otra vez.
  const heroResume = () => { if (!document.hidden && !heroSlider.paused) heroStartAuto(); };
  document.addEventListener('visibilitychange', heroResume);
  window.addEventListener('focus', heroResume);

  // "Reducir movimiento": el titular sigue cambiando, pero sin deslizamiento.
  // El bloque @media prefers-reduced-motion de style.css ya lo resuelve con un
  // fundido de opacidad, así que aquí solo se mantiene la rotación activa.
  heroStartAuto();
}

// ---------- Selector de idioma desplegable ----------
// Boton que muestra el idioma activo y un menu con los tres. Se cierra al
// pulsar Escape, al hacer clic fuera y al elegir una opcion. Con teclado:
// Enter/Espacio abre, las flechas mueven el foco entre opciones.
function initLangDropdown() {
  const toggle = document.getElementById('langToggle');
  const menu = document.getElementById('langMenu');
  if (!toggle || !menu) return;
  const options = Array.from(menu.querySelectorAll('.lang-option'));

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  const isOpen = () => !menu.hidden;
  const close = (refocus) => {
    if (!isOpen()) return;
    setOpen(false);
    if (refocus) toggle.focus();
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!isOpen());
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      setLang(opt.dataset.lang);
      setOpen(false);
      toggle.focus();
    });
  });

  // Clic fuera: se comprueba que el destino no esté dentro del desplegable,
  // porque el clic en el propio boton ya esta tratado con stopPropagation.
  document.addEventListener('click', (e) => {
    if (isOpen() && !menu.contains(e.target) && e.target !== toggle) close(false);
  });

  // Escape cierra y devuelve el foco al boton; las flechas recorren el menu.
  menu.addEventListener('keydown', (e) => {
    const i = options.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? (i + 1) % options.length
        : (i - 1 + options.length) % options.length;
      options[next].focus();
    } else if (e.key === 'Home') {
      e.preventDefault(); options[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault(); options[options.length - 1].focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close(true);
  });
}

// ---------- Init ----------
// El sello de versión, copyright y fecha legal vive en js/version.js (fuente única).
function initSite() {
  applyTheme();

  document.getElementById('themeToggle')?.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  initLangDropdown();

  applyLang();
  stampVersionFooter();
  initHeroSlider();

  const grid = document.getElementById('coinCards');
  if (grid) {
    // La retícula se pinta al instante (esqueletos) para que los enlaces a
    // Cripto/Metales/Divisas respondan sin esperar a la red.
    renderHomeSkeletons(grid);
    loadHomeWithRetry();
  }
}

initSite();
