import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { createWriteStream, createReadStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const geminiVeoVideoTool = tool(
  async ({ prompt, model, aspectRatio, personGeneration, numberOfVideos, durationSeconds, userToken }) => {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('❌ GOOGLE_API_KEY n’est pas définie dans les variables d’environnement.');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

    try {
      // Génération de la vidéo avec Gemini Veo
      let operation = await ai.models.generateVideos({
        model,
        prompt,
        config: {
          personGeneration,
          aspectRatio: aspectRatio ?? '16:9',
          numberOfVideos: numberOfVideos ?? 1,
          durationSeconds: durationSeconds ?? 8,
        },
      });

      while (!operation.done) {
        await new Promise((res) => setTimeout(res, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
      }

      const results = operation.response?.generatedVideos ?? [];
      if (results.length === 0) return '❌ Aucune vidéo générée.';

      const videoUrl = `${results[0].video?.uri}&key=${process.env.GOOGLE_API_KEY}`;

      // Assurer que le dossier /uploads existe
      const uploadsDir = path.resolve('uploads');
      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir);
      }

      const outputPath = path.resolve(uploadsDir, `generated_video_${Date.now()}.mp4`);

      console.log('🟢 Téléchargement de la vidéo depuis:', videoUrl);

      // Téléchargement de la vidéo
      const resp = await fetch(videoUrl);
      if (!resp.ok) throw new Error(`❌ Échec du téléchargement : ${resp.statusText}`);
      if (!resp.body) throw new Error('❌ Réponse vide lors du téléchargement.');

      const writer = createWriteStream(outputPath);
      await new Promise<void>((resolve, reject) => {
        resp.body!.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.log('📁 Vidéo enregistrée dans :', outputPath);

      // Envoi au backend
      const form = new FormData();
      form.append('file', createReadStream(outputPath));
      form.append('userId', userToken);

      const backendResponse = await fetch('http://hackaton-backend:3000/api/v1/videos/upload', {
        method: 'POST',
        body: form,
        headers: {
          Authorization: `Bearer ${userToken}`,
          ...form.getHeaders(),
        },
      });

      if (!backendResponse.ok) {
        throw new Error(`❌ Upload backend échoué : ${backendResponse.statusText}`);
      }

      return outputPath;
    } catch (err) {
      console.error('❌ Erreur lors de la génération vidéo :', err);
      return '❌ Erreur pendant la génération de la vidéo.';
    }
  },
  {
    name: 'gemini-veo-video-generator',
    description:
      "Génère une vidéo à partir d'un prompt texte avec le modèle Gemini Veo (2 ou 3) de Google.",
    schema: z.object({
      prompt: z
        .string()
        .describe("Prompt décrivant la scène ou le contenu de la vidéo (ex: 'Un coucher de soleil sur une plage tropicale')."),
      model: z
        .enum(['veo-2.0-generate-001', 'veo-3.0-generate-preview'])
        .optional()
        .default('veo-2.0-generate-001')
        .describe('Version du modèle Gemini Veo à utiliser.'),
      aspectRatio: z
        .enum(['16:9', '9:16'])
        .optional()
        .default('16:9')
        .describe('Format de la vidéo à générer.'),
      personGeneration: z
        .enum(['dont_allow'])
        .optional()
        .default('dont_allow')
        .describe("Autoriser ou non la génération de personnes (obligatoirement 'dont_allow' en UE)."),
      numberOfVideos: z
        .number()
        .int()
        .min(1)
        .max(1)
        .optional()
        .default(1)
        .describe('Nombre de vidéos à générer (max 1 pour le moment).'),
      durationSeconds: z
        .number()
        .min(5)
        .max(8)
        .optional()
        .default(8)
        .describe('Durée de la vidéo (5 à 8 secondes).'),
      userToken: z
        .string()
        .min(10, "Le token est trop court")
        .describe("Token d'authentification de l'utilisateur qui génère la vidéo."),
    }),
  }
);
