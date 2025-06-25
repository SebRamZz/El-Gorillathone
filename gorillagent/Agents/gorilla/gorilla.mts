import 'dotenv/config';

import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { loadAgentPrompt } from "./generate_prompt.mts";
import { geminiVeoVideoTool } from "./tools/geminiVideo.mts";

const gorillaPrompt = loadAgentPrompt('gorilla');

const agentModel = new ChatOpenAI({
  temperature: 0.5,
  model: "dolphin3.0-llama3.1-8b", // ou le nom de votre modèle
  configuration: {
    baseURL: "http://host.docker.internal:1234/v1",
    apiKey: "not-needed", // LMStudio ne nécessite pas de clé API réelle
  }
});

//const agentModel = new ChatOpenAI({ temperature: 0.5, model: "gpt-4o-mini" });

const agentCheckpointer = new MemorySaver();
export const gorillAgent = createReactAgent({
  prompt: gorillaPrompt,
  llm: agentModel,
  tools: [geminiVeoVideoTool],
  checkpointSaver: agentCheckpointer,
});