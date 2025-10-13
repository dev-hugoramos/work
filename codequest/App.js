import React, { useState, useEffect } from 'react';
import { Play, Code, BookOpen, Trophy, ChevronRight, RotateCcw } from 'lucide-react';

const CodeQuestGame = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const levels = [
    {
      id: 0,
      title: "Capítulo 1: El Despertar",
      story: "Despiertas en una estación espacial abandonada. Tu IA compañera, ADA, te saluda: 'Para reactivar los sistemas, necesito que me ayudes con algo básico. Crea una variable llamada energia y asígnale el valor 100.'",
      concept: "Variables",
      task: "Declara una variable 'energia' con valor 100",
      starterCode: "// Declara tu variable aquí\n",
      hint: "Usa: let energia = 100;",
      validation: (code) => {
        return code.includes('energia') && code.includes('100') && (code.includes('let') || code.includes('const') || code.includes('var'));
      },
      explanation: "Las variables son contenedores que guardan datos. Usamos 'let' o 'const' para declararlas."
    },
    {
      id: 1,
      title: "Capítulo 2: Operaciones Críticas",
      story: "¡Bien hecho! Los sistemas empiezan a responder. ADA dice: 'La energía se está agotando. Tenemos 100 unidades pero el escudo consume 30. Calcula cuánta energía nos queda y guárdala en energiaRestante.'",
      concept: "Operadores Aritméticos",
      task: "Calcula: let energiaRestante = 100 - 30",
      starterCode: "let energia = 100;\nlet consumo = 30;\n// Calcula energiaRestante\n",
      hint: "let energiaRestante = energia - consumo;",
      validation: (code) => {
        return code.includes('energiaRestante') && (code.includes('100 - 30') || code.includes('energia - consumo'));
      },
      explanation: "Los operadores aritméticos (+, -, *, /, %) nos permiten realizar cálculos matemáticos."
    },
    {
      id: 2,
      title: "Capítulo 3: Decisiones Difíciles",
      story: "Una puerta bloqueada aparece. ADA explica: 'Solo se abre si la energía es mayor a 50. Escribe un condicional que verifique si podemos abrirla.'",
      concept: "Condicionales (if)",
      task: "Usa if para verificar si energia > 50",
      starterCode: "let energia = 70;\n// Escribe tu condicional aquí\nif (",
      hint: "if (energia > 50) { /* código */ }",
      validation: (code) => {
        return code.includes('if') && code.includes('>') && code.includes('50');
      },
      explanation: "Los condicionales (if/else) permiten tomar decisiones basadas en condiciones."
    },
    {
      id: 3,
      title: "Capítulo 4: El Laberinto",
      story: "Entras a un pasillo con 5 puertas. ADA sugiere: 'Necesitamos revisar cada puerta. Usa un bucle for para contar del 1 al 5.'",
      concept: "Bucles (for)",
      task: "Crea un for que cuente de 1 a 5",
      starterCode: "// Crea tu bucle for aquí\nfor (",
      hint: "for (let i = 1; i <= 5; i++) { }",
      validation: (code) => {
        return code.includes('for') && code.includes('let') && code.includes('<=') && code.includes('i++');
      },
      explanation: "Los bucles for repiten código un número específico de veces."
    },
    {
      id: 4,
      title: "Capítulo 5: El Código Maestro",
      story: "Encuentras un panel de control. ADA dice: 'Necesitamos una función que verifique códigos de acceso. Crea una función llamada verificarCodigo que reciba un parámetro.'",
      concept: "Funciones",
      task: "Crea: function verificarCodigo(codigo) { }",
      starterCode: "// Define tu función aquí\n",
      hint: "function verificarCodigo(codigo) { return codigo === 1234; }",
      validation: (code) => {
        return code.includes('function') && code.includes('verificarCodigo') && code.includes('codigo');
      },
      explanation: "Las funciones son bloques de código reutilizables que realizan tareas específicas."
    },
    {
      id: 5,
      title: "Capítulo 6: Inventario",
      story: "Recoges objetos útiles. ADA: 'Organicemos lo que tienes. Crea un array llamado inventario con 3 items: linterna, llave, mapa.'",
      concept: "Arrays",
      task: "Crea un array con 3 elementos",
      starterCode: "// Crea tu array aquí\nlet inventario = ",
      hint: "let inventario = ['linterna', 'llave', 'mapa'];",
      validation: (code) => {
        return code.includes('inventario') && code.includes('[') && code.includes(']') && code.includes('linterna');
      },
      explanation: "Los arrays son listas ordenadas que pueden contener múltiples valores."
    },
    {
      id: 6,
      title: "Capítulo 7: Datos del Jugador",
      story: "ADA quiere registrar tu información. 'Crea un objeto llamado jugador con propiedades: nombre, nivel, y puntos.'",
      concept: "Objetos",
      task: "Crea un objeto con 3 propiedades",
      starterCode: "// Crea tu objeto aquí\nlet jugador = {\n  \n};",
      hint: "let jugador = { nombre: 'Ada', nivel: 1, puntos: 100 };",
      validation: (code) => {
        return code.includes('jugador') && code.includes('{') && code.includes('nombre') && code.includes(':');
      },
      explanation: "Los objetos almacenan datos relacionados usando pares clave-valor."
    },
    {
      id: 7,
      title: "Capítulo 8: Búsqueda Infinita",
      story: "Hay señales de vida en diferentes sectores. 'Usa un bucle while para buscar mientras haya señales (señal > 0).'",
      concept: "Bucles (while)",
      task: "Crea un while que verifique señal > 0",
      starterCode: "let señal = 5;\n// Crea tu bucle while\nwhile (",
      hint: "while (señal > 0) { señal--; }",
      validation: (code) => {
        return code.includes('while') && code.includes('señal') && code.includes('>');
      },
      explanation: "Los bucles while repiten código mientras una condición sea verdadera."
    },
    {
      id: 8,
      title: "Capítulo 9: Exploración Total",
      story: "Tienes una lista de salas por explorar. 'Usa un forEach para recorrer el array de salas.'",
      concept: "Métodos de Array",
      task: "Usa forEach en un array",
      starterCode: "let salas = ['Puente', 'Motor', 'Hangar'];\n// Usa forEach aquí\nsalas.",
      hint: "salas.forEach(sala => console.log(sala));",
      validation: (code) => {
        return code.includes('forEach') && code.includes('=>');
      },
      explanation: "forEach es un método que ejecuta una función para cada elemento de un array."
    },
    {
      id: 9,
      title: "Final: El Escape",
      story: "¡Llegaste al final! Para escapar necesitas escribir una función completa que verifique si todos los sistemas están listos. Combina todo lo aprendido.",
      concept: "Desafío Final",
      task: "Crea una función que use condicionales y retorne true/false",
      starterCode: "function sistemasListos(energia, oxigeno) {\n  // Tu código aquí\n  \n}",
      hint: "function sistemasListos(energia, oxigeno) { return energia > 50 && oxigeno > 70; }",
      validation: (code) => {
        return code.includes('function') && code.includes('sistemasListos') && code.includes('return') && code.includes('&&');
      },
      explanation: "¡Has dominado los fundamentos! Ahora puedes combinar variables, condicionales, bucles y funciones."
    }
  ];

  const runCode = () => {
    const level = levels[currentLevel];
    
    if (level.validation(userCode)) {
      setFeedback('¡Correcto! 🎉 ' + level.explanation);
      setScore(score + 100);
      setCompletedLevels([...completedLevels, currentLevel]);
      
      setTimeout(() => {
        if (currentLevel < levels.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setUserCode(levels[currentLevel + 1].starterCode);
          setFeedback('');
          setShowHint(false);
        } else {
          setFeedback('🏆 ¡FELICIDADES! Has completado CodeQuest. Puntuación final: ' + (score + 100));
        }
      }, 2000);
    } else {
      setFeedback('❌ No es correcto. Revisa tu código e intenta de nuevo.');
    }
  };

  useEffect(() => {
    if (gameStarted && levels[currentLevel]) {
      setUserCode(levels[currentLevel].starterCode);
    }
  }, [currentLevel, gameStarted]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/30">
          <div className="text-center">
            <Code className="w-20 h-20 mx-auto mb-6 text-purple-400" />
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CodeQuest
            </h1>
            <p className="text-xl text-purple-200 mb-8">La Aventura del Programador</p>
            <div className="bg-slate-700/50 rounded-lg p-6 mb-8 text-left">
              <p className="text-gray-300 mb-4">
                🚀 Estás a punto de embarcarte en una aventura espacial donde aprenderás programación desde cero.
              </p>
              <p className="text-gray-300 mb-4">
                📚 Cubrirás: Variables, Operadores, Condicionales, Bucles, Funciones, Arrays, Objetos y más.
              </p>
              <p className="text-gray-300">
                💡 Cada nivel presenta un desafío narrativo que resolverás con código real.
              </p>
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 mx-auto shadow-lg"
            >
              <Play className="w-6 h-6" />
              Comenzar Aventura
            </button>
          </div>
        </div>
      </div>
    );
  }

  const level = levels[currentLevel];
  const progress = ((currentLevel + 1) / levels.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 mb-4 shadow-xl border border-purple-500/30">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <Code className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">CodeQuest</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{score} pts</span>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-purple-300 text-sm mt-2">Nivel {currentLevel + 1} de {levels.length}</p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Story Panel */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-purple-500/30">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">{level.title}</h2>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <p className="text-gray-300 leading-relaxed">{level.story}</p>
            </div>
            <div className="bg-purple-900/30 border border-purple-500/50 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-300 font-semibold mb-2">📖 Concepto: {level.concept}</p>
              <p className="text-white">🎯 Tarea: {level.task}</p>
            </div>
            {showHint && (
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4">
                <p className="text-sm text-yellow-300 font-semibold mb-1">💡 Pista:</p>
                <code className="text-yellow-200 text-sm">{level.hint}</code>
              </div>
            )}
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="text-purple-400 hover:text-purple-300 text-sm underline"
              >
                Mostrar pista
              </button>
            )}
          </div>

          {/* Code Editor Panel */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-purple-400" />
                Editor de Código
              </h2>
              <button
                onClick={() => setUserCode(level.starterCode)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Reiniciar código"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 bg-slate-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Escribe tu código aquí..."
              spellCheck="false"
            />
            <button
              onClick={runCode}
              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-5 h-5" />
              Ejecutar Código
            </button>
            {feedback && (
              <div className={`mt-4 p-4 rounded-lg ${
                feedback.includes('Correcto') || feedback.includes('FELICIDADES')
                  ? 'bg-green-900/30 border border-green-500/50'
                  : 'bg-red-900/30 border border-red-500/50'
              }`}>
                <p className={`${
                  feedback.includes('Correcto') || feedback.includes('FELICIDADES')
                    ? 'text-green-300'
                    : 'text-red-300'
                }`}>
                  {feedback}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-slate-800/50 backdrop-blur-lg rounded-xl p-4 shadow-xl border border-purple-500/30">
          <p className="text-purple-300 text-sm mb-2">Niveles completados:</p>
          <div className="flex gap-2 flex-wrap">
            {levels.map((lvl, idx) => (
              <div
                key={idx}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold ${
                  completedLevels.includes(idx)
                    ? 'bg-green-500 text-white'
                    : idx === currentLevel
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-gray-400'
                }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeQuestGame;
