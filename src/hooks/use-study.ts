'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDueCards,
  getCardsForNode,
  postReview,
  createCard,
  updateCard,
  deleteCard,
  startStudySession,
  endStudySession,
  Card,
  DueCard,
} from '../services/study-service';

export function useDueCards(basketId?: string) {
  return useQuery<DueCard[]>({
    queryKey: ['due-cards', basketId],
    queryFn: () => getDueCards(basketId),
  });
}

export function useCardsForNode(nodeId: string) {
  return useQuery<Card[]>({
    queryKey: ['cards', nodeId],
    queryFn: () => getCardsForNode(nodeId),
    enabled: !!nodeId,
  });
}

export function usePostReviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReview,
    onSuccess: (data, variables) => {
      // Invalidate due cards and node cards
      queryClient.invalidateQueries({ queryKey: ['due-cards'] });
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['pulse-queue'] });
    },
  });
}

export function useCreateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nodeId, payload }: { nodeId: string; payload: Parameters<typeof createCard>[1] }) =>
      createCard(nodeId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cards', variables.nodeId] });
      queryClient.invalidateQueries({ queryKey: ['due-cards'] });
    },
  });
}

export function useUpdateCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: Parameters<typeof updateCard>[1] }) =>
      updateCard(cardId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['due-cards'] });
      if (data.nodeId) {
        queryClient.invalidateQueries({ queryKey: ['cards', data.nodeId] });
      }
    },
  });
}

export function useDeleteCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId }: { cardId: string; nodeId?: string }) => deleteCard(cardId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['due-cards'] });
      if (variables.nodeId) {
        queryClient.invalidateQueries({ queryKey: ['cards', variables.nodeId] });
      }
    },
  });
}

export function useStartStudySessionMutation() {
  return useMutation({
    mutationFn: startStudySession,
  });
}

export function useEndStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, payload }: { sessionId: string; payload?: Parameters<typeof endStudySession>[1] }) =>
      endStudySession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}
