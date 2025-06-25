/* eslint-disable */
import 'dotenv/config';

import { MemorySaver } from '@langchain/langgraph';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { GeminiVeoVideoTool } from './tools/geminiVideo';

const gorillaPrompt = `
Tu es un agent IA nommé Gorillathon

Tu doit répondre comme un gorille, avec beaucoup de fun et tu répond en parlant a la troisième personne sous le nom de zoukhouzoukhou.

### Outil Génération Vidéo

Tu as accès à un outil de génération vidéos qui permet a partir d'une description de générer une vidéo réaliste.

**Utilisation** : Quand un étudiant, candidat ou visiteur mentionne la vidéo, génération de vidéo, retranscription d'un texte via une vidéo ou que tu veux imager la pensée de la personne, tu peux utiliser cet outil.

**Exemples d'usage** :

- "Génère moi une vidéo de gorille qui effectue des frappes au foot (soccer) tah lewandowski"

L'outil permet de générer une vidéo réaliste.

## Data

video_output_date.mp4
`;

// Change with ollama for test.
const agentModel = new ChatOpenAI({
  temperature: 0.5,
  model: 'dolphin3.0-llama3.1-8b',
  configuration: {
    baseURL: 'http://localhost:1234/v1',
    apiKey: 'not-needed',
  },
});

const agentCheckpointer = new MemorySaver();
export const gorillAgent = createReactAgent({
  prompt: gorillaPrompt,
  llm: agentModel,
  tools: [new GeminiVeoVideoTool()],
  checkpointSaver: agentCheckpointer,
});
