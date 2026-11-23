import { RAG } from '@convex-dev/rag';
import { cohere } from '@ai-sdk/cohere';
import { components } from '../../_generated/api';

export const rag = new RAG(components.rag, {
  textEmbeddingModel: cohere.embedding('embed-v4.0'),
  embeddingDimension: 1536
});
