import { AISimulationSpec } from '../types/aiSimulation';

/**
 * OpenRouter Models Specified by User
 */
export const FREE_OPENROUTER_MODELS = [
  { id: 'google/gemma-4-31b-it:free', name: 'Gemma 4 31B IT (Free)', provider: 'Google' },
  { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma 4 26B A4B IT (Free)', provider: 'Google' },
  { id: 'google/lyria-3-pro-preview', name: 'Lyria 3 Pro Preview', provider: 'Google' },
  { id: 'google/lyria-3-clip-preview', name: 'Lyria 3 Clip Preview', provider: 'Google' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron 3 Ultra 550B (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron 3 Super 120B (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-nano-30b-a3b:free', name: 'Nemotron 3 Nano 30B (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'Nemotron 3 Nano Omni 30B Reasoning (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-nano-12b-v2-vl:free', name: 'Nemotron Nano 12B v2 VL (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-nano-9b-v2:free', name: 'Nemotron Nano 9B v2 (Free)', provider: 'NVIDIA' },
  { id: 'nvidia/nemotron-3.5-content-safety:free', name: 'Nemotron 3.5 Content Safety (Free)', provider: 'NVIDIA' },
  { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B (Free)', provider: 'OpenAI' },
  { id: 'inclusionai/ling-3.0-flash:free', name: 'Ling 3.0 Flash (Free)', provider: 'InclusionAI' },
  { id: 'cohere/north-mini-code:free', name: 'North Mini Code (Free)', provider: 'Cohere' },
  { id: 'poolside/laguna-s-2.1:free', name: 'Laguna S 2.1 (Free)', provider: 'Poolside' },
  { id: 'poolside/laguna-xs-2.1:free', name: 'Laguna XS 2.1 (Free)', provider: 'Poolside' }
];

export const CLASS_OPTIONS = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'General'
];

export const SUBJECT_OPTIONS = [
  'Science',
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'English',
  'General'
];

export const CLASS_AGE_MAPPING: Record<string, { ageGroup: string; levelDescription: string }> = {
  'Class 6': { ageGroup: '11-12 years old', levelDescription: 'Middle School (Concrete narrative hooks, intuitive visual scaffolding, foundational concepts)' },
  'Class 7': { ageGroup: '12-13 years old', levelDescription: 'Middle School (Logical reasoning, basic equations, interactive hands-on visual experiments)' },
  'Class 8': { ageGroup: '13-14 years old', levelDescription: 'Pre-High School (Quantitative analysis, structured formulas, step-by-step problem solving)' },
  'Class 9': { ageGroup: '14-15 years old', levelDescription: 'High School SSC-I (Formal mathematical derivations, rigorous science principles & lab calculations)' },
  'Class 10': { ageGroup: '15-16 years old', levelDescription: 'High School SSC-II (Advanced experiments, quantitative telemetry logging, precise physical laws)' },
  'Class 11': { ageGroup: '16-17 years old', levelDescription: 'Higher Secondary HSSC-I (College prep abstraction, advanced mathematical modeling & physics derivations)' },
  'Class 12': { ageGroup: '17-18 years old', levelDescription: 'Higher Secondary HSSC-II (University level rigor, detailed step-by-step mathematical proofs & analysis)' },
  'General': { ageGroup: 'All Ages', levelDescription: 'Accessible for general learners of all age groups' }
};

const SYSTEM_PROMPT = `You are VirtualLab AI, an elite education simulation architect and JSON synthesis engine for Cendronyx Labs. 
Your sole function is to convert ANY natural language educational prompt into an interactive visual simulation specification across ALL subjects (Physics, Chemistry, Biology, Mathematics, Computer Science, English, General).

UNIVERSAL AI INTERACTIVE CANVAS DIRECTIVE:
You have complete freedom to synthesize visual components for ANY concept asked by the user!
For EVERY prompt, you MUST populate "canvasPrimitives" with an array of 4 to 8 interactive visual components.
Each component in "canvasPrimitives" must include:
- "id": Unique snake_case ID (e.g. "part_1", "frontal_lobe", "chloroplast", "resistor_1", "verb_node", "event_horizon")
- "label": Clear component name (e.g. "Frontal Lobe", "Chloroplast Membrane", "Resistor R₁", "Subject Node")
- "description": 1-2 sentence detailed pedagogical explanation of this component's role & mechanism
- "color": Distinct vibrant hex color (#ec4899, #38bdf8, #f59e0b, #10b981, #8b5cf6, #ef4444)
- "highlightExpr": Condition matching variable sliders (e.g. "structureIndex == 0" or "index == 1") so it glows when selected!
- "connections": Optional array of component IDs this component connects or transfers signal/energy to!

CRITICAL INSTRUCTIONS:
1. Output STRICTLY AND ONLY a valid JSON object. 
2. DO NOT wrap the output in markdown code blocks (e.g., no \`\`\`json ... \`\`\`).
3. DO NOT include any conversational text, preambles, or explanations outside the JSON.
4. All LaTeX formulas inside the JSON MUST have their backslashes escaped (e.g., use "\\\\frac{a}{b}" instead of "\\frac{a}{b}").

JSON SCHEMA BLUEPRINT:
Generate the simulation using this exact schema structure:

{
  "id": "generate_a_unique_snake_case_id",
  "title": "Clear, Engaging Descriptive Title",
  "description": "Engaging 1-2 sentence description of the simulation's purpose.",
  "subject": "Physics" | "Chemistry" | "Biology" | "Mathematics" | "Computer Science" | "English" | "Science" | "General",
  "classLevel": "Class 6" | "Class 7" | "Class 8" | "Class 9" | "Class 10" | "Class 11" | "Class 12" | "General",
  "category": "String (e.g., Kinematics, Dynamics, Thermodynamics, Genetics, Anatomy, Organic Chemistry, Syntax, etc.)",
  "createdAt": 1720000000000,
  "theory": {
    "overview": "Comprehensive, academically accurate explanation of the core principles.",
    "keyConcepts": [
      "Crucial concept 1",
      "Crucial concept 2",
      "Crucial concept 3"
    ],
    "realWorldApplication": "Specific real-world engineering, biological, or practical application.",
    "formulaSummary": "Primary equations summarized in standard text or escaped LaTeX."
  },
  "variables": [
    {
      "key": "Unique variable key (e.g., 'structureIndex', 'm1', 'pH', 'temperature')",
      "label": "Human-readable label (e.g., 'Selected Structure Index', 'Mass (m₁)')",
      "min": 0,
      "max": 5,
      "step": 1,
      "default": 0,
      "unit": "String (e.g., 'index', 'kg', 'm/s', 'N', 'pH')"
    }
  ],
  "computedVars": [
    {
      "key": "Unique key (e.g., 'a1', 'enzymeActivity')",
      "label": "Human-readable label (e.g., 'Acceleration of m₁')",
      "expr": "Valid mathematical expression string using defined variables (e.g., '-F / m1')",
      "unit": "String (e.g., 'm/s²')"
    }
  ],
  "canvasPrimitives": [
    {
      "id": "part_1",
      "type": "anatomy_part",
      "label": "Structure / Component Name",
      "description": "1-2 sentence detailed pedagogical explanation of this component's role & mechanism",
      "color": "#ec4899",
      "highlightExpr": "structureIndex == 0",
      "connections": ["part_2"]
    }
  ],
  "chart": {
    "xAxisVar": "Variable key for the X-axis (usually 't')",
    "yAxisExpr": "Variable key or mathematical expression for the Y-axis",
    "xLabel": "Axis label with unit (e.g., 'Time (s)')",
    "yLabel": "Axis label with unit (e.g., 'Signal Voltage (mV)')"
  },
  "derivation": {
    "title": "Title of the mathematical derivation or step-by-step process",
    "steps": [
      {
        "stepNumber": 1,
        "label": "Brief step name",
        "formula": "Properly escaped LaTeX formula string (e.g., 'F = m \\\\cdot a')",
        "explanation": "Clear explanation of what is happening in this step."
      }
    ]
  },
  "quiz": [
    {
      "id": "q1",
      "question": "Clear, challenging multiple choice question?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctIndex": 1,
      "hint": "Helpful hint to guide the student without giving the answer away.",
      "explanation": "Detailed pedagogical explanation of why the correct answer is right."
    }
  ]
}`;

export async function generateSimulationWithOpenRouter(
  prompt: string,
  apiKey?: string,
  modelId: string = 'google/gemma-4-31b-it:free',
  targetClass: string = 'Class 9',
  targetSubject: string = 'Physics'
): Promise<{ spec: AISimulationSpec | null; error?: string }> {
  const effectiveKey = apiKey || localStorage.getItem('virtuallab_openrouter_api_key') || import.meta.env.VITE_OPENROUTER_API_KEY || '';

  if (!effectiveKey) {
    return {
      spec: null,
      error: 'NO_API_KEY'
    };
  }

  const ageInfo = CLASS_AGE_MAPPING[targetClass] || CLASS_AGE_MAPPING['General'];
  const formattedUserPrompt = `Target Class Level: ${targetClass} (Age Group: ${ageInfo.ageGroup} - ${ageInfo.levelDescription})
Subject Domain: ${targetSubject}
Concept Request: "${prompt}"

Target Appropriateness Directives:
1. Tailor the theory overview, mathematical complexity, and quiz difficulty specifically for ${targetClass} students (Age ${ageInfo.ageGroup}).
2. Ensure the simulation concepts strictly align with ${targetSubject} curriculum.
3. In your output JSON, set "classLevel": "${targetClass}" and "subject": "${targetSubject}".`;

  // Failover list starting with selected model followed by user models
  const candidateModels = [
    modelId,
    'google/gemma-4-31b-it:free',
    'google/gemma-4-26b-a4b-it:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
    'openai/gpt-oss-20b:free',
    'inclusionai/ling-3.0-flash:free',
    'cohere/north-mini-code:free',
    'poolside/laguna-s-2.1:free'
  ];

  const uniqueModels = Array.from(new Set(candidateModels));
  let lastErrorMsg = '';

  for (const currentModel of uniqueModels) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey.trim()}`,
          'HTTP-Referer': window.location.origin || 'http://localhost:5173',
          'X-Title': 'VirtualLab AI Simulation Studio'
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: formattedUserPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2500,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastErrorMsg = errText;
        console.warn(`OpenRouter model ${currentModel} error:`, errText);
        continue;
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content || '';

      const cleanedJson = rawContent
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed: AISimulationSpec = JSON.parse(cleanedJson);
      parsed.id = parsed.id || `ai_lab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      parsed.subject = (parsed.subject || targetSubject) as any;
      parsed.classLevel = (parsed.classLevel || targetClass) as any;
      parsed.createdAt = Date.now();

      return { spec: parsed };

    } catch (err: any) {
      lastErrorMsg = err?.message || String(err);
      console.warn(`Attempt with ${currentModel} failed:`, err);
    }
  }

  return {
    spec: null,
    error: `OpenRouter error: ${lastErrorMsg || 'Selected models currently unreachable'}.`
  };
}
