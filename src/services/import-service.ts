/**
 * Smart Import — Frontend API Wrapper
 *
 * Supports:
 *  - Single file upload (PDF, docx, txt, single image)
 *  - Multi-image upload (up to 5 images for multi-page handwritten notes)
 *  - Pasted text import
 *  - Confirm and save to database
 *  - Health check
 */

import { apiClient } from './api-client';

const API_BASE = '/api/import';

export type ImageQuality = 'auto' | 'printed' | 'handwritten';
export type DetectedLang = 'eng' | 'hin' | 'guj' | 'auto';

export interface ImportCard {
  question:     string;
  answer:       string;
  subTopic?:    string;
  explanation?: string;
  type?:        string;
}

export interface ImportFields {
  theoryContent?:    string;
  thingsToRemember?: string;
  references?:       Array<{ title: string; url: string; type: string }>;
  emotionalAnchor?:  string;
}

export interface SmartImportResponse {
  method:       string;
  detectedLang: DetectedLang;
  confidence:   number;
  pageCount?:   number;
  fields:       ImportFields;
  cards:        ImportCard[];
}

export interface ConfirmPayload {
  nodeId: string;
  fields: ImportFields & { isImportant?: boolean };
  cards:  Array<{
    question:     string;
    answer:       string;
    questionType: string;
    subTopic?:    string;
    explanation?: string;
  }>;
}

/** Upload a single file (PDF, docx, txt, single image) */
export async function importSingleFile(
  nodeId:       string,
  file:         File,
  imageQuality: ImageQuality,
  nodeTitle?:   string,
  nodeType?:    string,
): Promise<SmartImportResponse> {
  const form = new FormData();
  form.append('nodeId',       nodeId);
  form.append('imageQuality', imageQuality);
  form.append('file',         file);
  if (nodeTitle) form.append('nodeTitle', nodeTitle);
  if (nodeType)  form.append('nodeType',  nodeType);

  const { data } = await apiClient.post<SmartImportResponse>(`${API_BASE}/smart`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 180000, // 180 seconds (3 minutes) timeout for image/document OCR and processing
  });
  return data;
}

/** Upload up to 5 image files (multi-page handwritten notes) */
export async function importMultipleImages(
  nodeId:       string,
  files:        File[],
  imageQuality: ImageQuality,
  nodeTitle?:   string,
  nodeType?:    string,
): Promise<SmartImportResponse> {
  const form = new FormData();
  form.append('nodeId',       nodeId);
  form.append('imageQuality', imageQuality);
  files.forEach(f => form.append('files', f));
  if (nodeTitle) form.append('nodeTitle', nodeTitle);
  if (nodeType)  form.append('nodeType',  nodeType);

  const { data } = await apiClient.post<SmartImportResponse>(`${API_BASE}/smart`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 300000, // 300 seconds (5 minutes) timeout for multi-page image sets
  });
  return data;
}

/** Import from pasted text (no file, JSON body) */
export async function importFromText(
  nodeId:      string,
  textContent: string,
  nodeTitle?:  string,
  nodeType?:   string,
): Promise<SmartImportResponse> {
  const { data } = await apiClient.post<SmartImportResponse>(`${API_BASE}/smart`, {
    nodeId,
    textContent,
    nodeTitle,
    nodeType,
  }, {
    timeout: 180000, // 180 seconds (3 minutes) timeout for text LLM analysis
  });
  return data;
}

/** Confirm and persist cards + node details to database */
export async function confirmImport(payload: ConfirmPayload) {
  const { data } = await apiClient.post(`${API_BASE}/confirm`, payload, {
    timeout: 30000, // 30 seconds timeout for DB saving and syncing
  });
  return data;
}

/** Check import pipeline health (NVIDIA key, temp dir, models) */
export async function checkImportHealth() {
  const { data } = await apiClient.get(`${API_BASE}/health`);
  return data;
}
