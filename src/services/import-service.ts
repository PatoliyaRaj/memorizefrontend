import apiClient from './api-client';

export interface SmartImportPayload {
  method: string;
  detectedLang: string;
  confidence: number;
  fields: {
    theoryContent: string;
    thingsToRemember: string;
    references: Array<{ title: string; url: string; type: string }>;
    emotionalAnchor: string;
  };
  cards: Array<{
    question: string;
    answer: string;
    subTopic: string;
    explanation: string;
    type: string;
  }>;
}

export async function runSmartImport(formData: FormData): Promise<SmartImportPayload> {
  const { data } = await apiClient.post('/api/import/smart', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000, // Increase timeout to 60s for LLM processing
  });
  return data;
}

export async function confirmImport(payload: {
  nodeId: string;
  fields: SmartImportPayload['fields'];
  cards: Array<{ question: string; answer: string; questionType: string; subTopic?: string; explanation?: string }>;
}): Promise<{ nodeId: string; created: number; updated: number; softDeleted: number }> {
  const { data } = await apiClient.post('/api/import/confirm', payload);
  return data;
}
