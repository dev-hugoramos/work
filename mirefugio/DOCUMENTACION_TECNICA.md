# 🔧 Documentación Técnica - Mi Refugio

## 📋 Índice
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Componentes Principales](#componentes-principales)
3. [Algoritmos de IA](#algoritmos-de-ia)
4. [API y Servicios](#api-y-servicios)
5. [Estructura de Datos](#estructura-de-datos)
6. [Optimizaciones](#optimizaciones)
7. [Testing](#testing)
8. [Deployment](#deployment)

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interfaz      │    │   Lógica de     │    │   Almacenamiento│
│   de Usuario    │◄──►│   Negocio       │◄──►│   Local         │
│   (Vue.js)      │    │   (JavaScript)  │    │   (LocalStorage)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   Análisis de   │              │
         └──────────────►│   Emociones     │◄─────────────┘
                        │   (IA Híbrida)  │
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   API Externa   │
                        │  (Hugging Face) │
                        └─────────────────┘
```

### Principios de Diseño
- **Single Page Application (SPA)**: Una sola página con navegación dinámica
- **Component-Based Architecture**: Componentes Vue.js reutilizables
- **Reactive Data Flow**: Estado reactivo con Vue.js
- **Progressive Enhancement**: Funciona sin JavaScript básico
- **Mobile-First Design**: Optimizado para dispositivos móviles

## 🧩 Componentes Principales

### 1. Aplicación Principal (Vue.js App)
```javascript
const { createApp } = Vue;

createApp({
    data() {
        return {
            // Estado de la aplicación
            name: '',
            feeling: '',
            submitted: false,
            loading: false,
            result: null,
            userHistory: [],
            aiInsights: null
        }
    },
    computed: {
        // Propiedades computadas reactivas
        emotionLabel() { /* ... */ },
        empathyMessage() { /* ... */ },
        needsHelp() { /* ... */ }
    },
    methods: {
        // Métodos de la aplicación
        analyzeEmotion() { /* ... */ },
        generateEmpathyResponse() { /* ... */ },
        generateInsights() { /* ... */ }
    }
}).mount('#app');
```

### 2. Sistema de Análisis Emocional
```javascript
detectEmotionFromKeywords(text) {
    // Algoritmo de análisis local
    const keywords = {
        'sadness': ['triste', 'deprimido', 'solo', ...],
        'joy': ['feliz', 'alegre', 'contento', ...],
        // ... más emociones
    };
    
    // Análisis con pesos y contexto
    let scores = {};
    for (let emotion in keywords) {
        keywords[emotion].forEach(keyword => {
            const count = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
            scores[emotion] += count;
        });
    }
    
    // Detección de patrones complejos
    const complexPatterns = {
        'anxiety': /(?:muy|mucho|demasiado)\s+(?:ansioso|nervioso|preocupado)/,
        'excitement': /(?:muy|mucho)\s+(?:emocionado|excitado)/,
        'hopeful': /(?:tengo|siento)\s+(?:esperanza|fe)/
    };
    
    return { emotion, score, confidence };
}
```

### 3. Sistema de Respuestas Empáticas
```javascript
generateEmpathyResponse(emotion, text) {
    // Detección de contexto específico
    const isLoss = text.includes("murió") || text.includes("falleció");
    const isAnxiety = text.includes("ansiedad") || text.includes("preocupado");
    const isLonely = text.includes("solo") || text.includes("sola");
    
    // Respuestas contextuales
    if (isLoss) return `${name}, lamento profundamente tu pérdida...`;
    if (isAnxiety) return `${name}, puedo sentir tu ansiedad...`;
    
    // Respuestas basadas en historial
    if (this.userHistory.length > 0) {
        const lastEmotion = this.userHistory[this.userHistory.length - 1]?.emotion;
        if (lastEmotion === emotion) {
            return `${name}, veo que has estado experimentando...`;
        }
    }
    
    // Respuesta estándar
    return phrases[Math.floor(Math.random() * phrases.length)].replace('{name}', name);
}
```

## 🤖 Algoritmos de IA

### 1. Análisis Híbrido de Emociones
```javascript
async analyzeEmotion() {
    // Paso 1: Análisis local
    const keywordResult = this.detectEmotionFromKeywords(this.feeling);
    
    // Paso 2: Validación con API si es necesario
    if (keywordResult.confidence < 0.7) {
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/finiteautomata/beto-emotion-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputs: this.feeling })
            });
            
            const data = await response.json();
            const aiResult = { emotion: data[0][0].label.toLowerCase(), score: data[0][0].score };
            
            // Combinar resultados inteligentemente
            finalResult = aiResult.score > keywordResult.score ? aiResult : keywordResult;
        } catch (error) {
            finalResult = keywordResult;
        }
    }
    
    return finalResult;
}
```

### 2. Sistema de Aprendizaje
```javascript
generateInsights() {
    const recentEntries = this.userHistory.slice(-7);
    const emotionCounts = {};
    let totalScore = 0;
    
    // Análisis de tendencias
    recentEntries.forEach(entry => {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
        totalScore += entry.score;
    });
    
    const avgScore = totalScore / recentEntries.length;
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
        emotionCounts[a] > emotionCounts[b] ? a : b
    );
    
    return {
        trend: avgScore > 0.6 ? 'positivo' : avgScore < 0.4 ? 'negativo' : 'neutral',
        dominantEmotion: dominantEmotion,
        pattern: this.detectEmotionalPattern(),
        recommendation: this.getPersonalizedRecommendation(dominantEmotion, avgScore)
    };
}
```

### 3. Detección de Patrones Emocionales
```javascript
detectEmotionalPattern() {
    const recent = this.userHistory.slice(-5).map(e => e.emotion);
    const positiveEmotions = ['joy', 'love', 'gratitude', 'excitement', 'hopeful'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'anxiety'];
    
    const positiveCount = recent.filter(e => positiveEmotions.includes(e)).length;
    const negativeCount = recent.filter(e => negativeEmotions.includes(e)).length;
    
    if (positiveCount > negativeCount + 1) return 'mejorando';
    if (negativeCount > positiveCount + 1) return 'empeorando';
    return 'estable';
}
```

## 🌐 API y Servicios

### 1. API de Hugging Face
```javascript
// Configuración de la API
const API_URL = "https://api-inference.huggingface.co/models/finiteautomata/beto-emotion-analysis";

// Llamada a la API
const response = await fetch(API_URL, {
    method: "POST",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_TOKEN" // Opcional
    },
    body: JSON.stringify({ inputs: text })
});

const data = await response.json();
```

### 2. Gestión de Errores de API
```javascript
try {
    const response = await fetch(API_URL, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
} catch (error) {
    console.log('API no disponible, usando análisis local');
    return fallbackResult;
}
```

### 3. Sistema de Fallback
- **Análisis local**: Siempre disponible como respaldo
- **Cache de resultados**: Evita llamadas repetitivas
- **Timeout handling**: Manejo de timeouts de red
- **Graceful degradation**: Degradación elegante de funcionalidades

## 💾 Estructura de Datos

### 1. Modelo de Usuario
```javascript
const userModel = {
    name: String,
    currentMood: {
        emotion: String,
        score: Number,
        confidence: Number,
        timestamp: String
    },
    history: [historyEntry]
};
```

### 2. Entrada de Historial
```javascript
const historyEntry = {
    timestamp: String,        // ISO 8601 format
    emotion: String,          // Emoción detectada
    score: Number,            // Puntuación (0-1)
    confidence: Number,       // Confianza del análisis (0-1)
    text: String,            // Texto original del usuario
    name: String,            // Nombre del usuario
    context: Object          // Contexto adicional (opcional)
};
```

### 3. Resultado de Análisis
```javascript
const analysisResult = {
    emotion: String,          // Emoción principal
    score: Number,            // Intensidad (0-1)
    confidence: Number,       // Confianza (0-1)
    secondaryEmotions: Array, // Emociones secundarias
    context: Object,          // Contexto detectado
    insights: Object          // Insights generados
};
```

### 4. Insights Inteligentes
```javascript
const insights = {
    trend: String,            // 'positivo', 'negativo', 'neutral'
    dominantEmotion: String,  // Emoción dominante
    pattern: String,          // 'mejorando', 'empeorando', 'estable'
    recommendation: String,   // Recomendación personalizada
    suggestions: Array,       // Sugerencias específicas
    riskLevel: String         // Nivel de riesgo
};
```

## ⚡ Optimizaciones

### 1. Rendimiento
```javascript
// Lazy loading de componentes
const LazyComponent = defineAsyncComponent(() => import('./Component.vue'));

// Debouncing en búsquedas
const debouncedSearch = debounce(searchFunction, 300);

// Memoización de cálculos costosos
const expensiveCalculation = computed(() => {
    return heavyComputation(this.data);
});
```

### 2. Gestión de Memoria
```javascript
// Limpieza de historial
if (this.userHistory.length > 50) {
    this.userHistory = this.userHistory.slice(-50);
}

// Limpieza de event listeners
beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
}
```

### 3. Optimización de Red
```javascript
// Cache de resultados de API
const apiCache = new Map();

async function cachedApiCall(input) {
    if (apiCache.has(input)) {
        return apiCache.get(input);
    }
    
    const result = await apiCall(input);
    apiCache.set(input, result);
    return result;
}
```

## 🧪 Testing

### 1. Tests Unitarios
```javascript
// Test de detección de emociones
describe('Emotion Detection', () => {
    test('should detect sadness correctly', () => {
        const text = "Estoy muy triste y solo";
        const result = detectEmotionFromKeywords(text);
        expect(result.emotion).toBe('sadness');
        expect(result.score).toBeGreaterThan(0.7);
    });
    
    test('should handle complex patterns', () => {
        const text = "Me siento muy ansioso y nervioso";
        const result = detectEmotionFromKeywords(text);
        expect(result.emotion).toBe('anxiety');
    });
});
```

### 2. Tests de Integración
```javascript
// Test del flujo completo
describe('Complete Flow', () => {
    test('should analyze emotion and generate response', async () => {
        const app = createApp();
        app.data().feeling = "Estoy muy feliz hoy";
        
        await app.methods.analyzeEmotion();
        
        expect(app.data().result).toBeDefined();
        expect(app.data().result.emotion).toBe('joy');
        expect(app.computed.empathyMessage()).toContain('feliz');
    });
});
```

### 3. Tests de Rendimiento
```javascript
// Test de rendimiento
describe('Performance Tests', () => {
    test('should analyze emotion within 1 second', async () => {
        const start = performance.now();
        await analyzeEmotion("Test text");
        const end = performance.now();
        
        expect(end - start).toBeLessThan(1000);
    });
});
```

## 🚀 Deployment

### 1. Configuración de Producción
```html
<!-- Optimizaciones de producción -->
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

<!-- Minificación -->
<script src="https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js"></script>
```

### 2. Variables de Entorno
```javascript
// Configuración de entorno
const config = {
    apiUrl: process.env.VUE_APP_API_URL || 'https://api-inference.huggingface.co',
    modelName: process.env.VUE_APP_MODEL_NAME || 'finiteautomata/beto-emotion-analysis',
    debug: process.env.NODE_ENV === 'development'
};
```

### 3. Optimizaciones de Build
```javascript
// Webpack optimizations
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
```

### 4. CDN y Caching
```html
<!-- Service Worker para cache -->
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
</script>

<!-- Cache headers -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

## 📊 Métricas y Monitoreo

### 1. Métricas de Rendimiento
```javascript
// Core Web Vitals
const metrics = {
    LCP: 'Largest Contentful Paint',
    FID: 'First Input Delay',
    CLS: 'Cumulative Layout Shift'
};

// Custom metrics
const customMetrics = {
    emotionAnalysisTime: 0,
    apiResponseTime: 0,
    userEngagementTime: 0
};
```

### 2. Analytics
```javascript
// Event tracking
function trackEvent(eventName, parameters) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
}

// Usage analytics
trackEvent('emotion_analyzed', {
    emotion: result.emotion,
    confidence: result.confidence,
    method: 'hybrid'
});
```

## 🔒 Seguridad

### 1. Validación de Entrada
```javascript
// Sanitización de entrada
function sanitizeInput(input) {
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
}
```

### 2. Protección XSS
```javascript
// Escape de HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
```

### 3. Validación de Datos
```javascript
// Validación de estructura de datos
function validateHistoryEntry(entry) {
    const schema = {
        timestamp: String,
        emotion: String,
        score: Number,
        text: String,
        name: String
    };
    
    return Object.keys(schema).every(key => 
        typeof entry[key] === schema[key].name.toLowerCase()
    );
}
```

---

**Documentación creada por Hugo Ramos Espino**  
*Desarrollador y Arquitecto de Software*

Para más información técnica o consultas, contacta a: [hugoramos.developer2024@gmail.com]
