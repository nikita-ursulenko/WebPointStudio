// Groq API service for translations
//
// IMPORTANT:
// - Do NOT hardcode API keys in the repository.
// - Provide `VITE_GROQ_API_KEY` via environment variables (e.g. .env.local)
// - Optionally set `VITE_GROQ_MODEL` to override the default model.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';

interface TranslationRequest {
  text: string;
  targetLanguage: 'ro' | 'en';
  context?: string; // Контекст для лучшего перевода (например, "portfolio project title")
}

export const translateText = async ({
  text,
  targetLanguage,
  context = 'website content',
}: TranslationRequest): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error('Missing VITE_GROQ_API_KEY env var');
  }

  const languageNames = {
    ro: 'Romanian',
    en: 'English',
  };

  const prompt = `Translate the following Russian text to ${languageNames[targetLanguage]}.

Context: ${context}

Rules:
1. Translate ONLY the text provided below
2. Do NOT translate this instruction or any other text
3. Keep the translation professional and natural
4. Return ONLY the translated text, nothing else

Text to translate:
${text}

Your translation:`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Your task is to translate the provided Russian text to the target language. Return ONLY the translated text, without any explanations, comments, or additional text. Do not translate instructions or system messages.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error('Empty translation response');
    }

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const translatePortfolioProject = async (project: {
  title: string;
  category: string;
  problem: string;
  solution: string;
  result: string;
}) => {
  try {
    // Название проекта не переводится, остальные поля переводим
    const [categoryRo, problemRo, solutionRo, resultRo, categoryEn, problemEn, solutionEn, resultEn] = await Promise.all([
      translateText({ text: project.category, targetLanguage: 'ro', context: 'portfolio project category' }),
      translateText({ text: project.problem, targetLanguage: 'ro', context: 'portfolio project problem description' }),
      translateText({ text: project.solution, targetLanguage: 'ro', context: 'portfolio project solution description' }),
      translateText({ text: project.result, targetLanguage: 'ro', context: 'portfolio project result description' }),
      translateText({ text: project.category, targetLanguage: 'en', context: 'portfolio project category' }),
      translateText({ text: project.problem, targetLanguage: 'en', context: 'portfolio project problem description' }),
      translateText({ text: project.solution, targetLanguage: 'en', context: 'portfolio project solution description' }),
      translateText({ text: project.result, targetLanguage: 'en', context: 'portfolio project result description' }),
    ]);

    return {
      ro: {
        title: project.title, // Название остается на русском
        category: categoryRo,
        problem: problemRo,
        solution: solutionRo,
        result: resultRo,
      },
      en: {
        title: project.title, // Название остается на русском
        category: categoryEn,
        problem: problemEn,
        solution: solutionEn,
        result: resultEn,
      },
    };
  } catch (error) {
    console.error('Portfolio translation error:', error);
    throw error;
  }
};

export const translateBlogArticle = async (article: {
  title: string;
  excerpt: string;
  content: string;
  category: string;
}) => {
  try {
    // Переводим все поля статьи
    // Для контента используем увеличенный max_tokens
    const translateContent = async (text: string, targetLanguage: 'ro' | 'en') => {
      const languageNames = {
        ro: 'Romanian',
        en: 'English',
      };

      const prompt = `Translate the following Russian text to ${languageNames[targetLanguage]}.

Context: blog article content

Rules:
1. Translate ONLY the text provided below
2. Do NOT translate this instruction or any other text
3. Keep the translation professional and natural
4. Return ONLY the translated text, nothing else

Text to translate:
${text}

Your translation:`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a professional translator. Your task is to translate the provided Russian text to the target language. Return ONLY the translated text, without any explanations, comments, or additional text. Do not translate instructions or system messages.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000, // Увеличенный лимит для длинного контента
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const translation = data.choices?.[0]?.message?.content?.trim();

      if (!translation) {
        throw new Error('Empty translation response');
      }

      return translation;
    };

    const [titleRo, excerptRo, contentRo, categoryRo, titleEn, excerptEn, contentEn, categoryEn] = await Promise.all([
      translateText({ text: article.title, targetLanguage: 'ro', context: 'blog article title' }),
      translateText({ text: article.excerpt, targetLanguage: 'ro', context: 'blog article excerpt' }),
      translateContent(article.content, 'ro'),
      translateText({ text: article.category, targetLanguage: 'ro', context: 'blog article category' }),
      translateText({ text: article.title, targetLanguage: 'en', context: 'blog article title' }),
      translateText({ text: article.excerpt, targetLanguage: 'en', context: 'blog article excerpt' }),
      translateContent(article.content, 'en'),
      translateText({ text: article.category, targetLanguage: 'en', context: 'blog article category' }),
    ]);

    return {
      ro: {
        title: titleRo,
        excerpt: excerptRo,
        content: contentRo,
        category: categoryRo,
      },
      en: {
        title: titleEn,
        excerpt: excerptEn,
        content: contentEn,
        category: categoryEn,
      },
    };
  } catch (error) {
    console.error('Blog translation error:', error);
    throw error;
  }
};
