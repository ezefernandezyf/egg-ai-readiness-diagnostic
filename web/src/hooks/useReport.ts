// ── TanStack Query hooks for Report ──────────────────────────────
import { useQuery, useMutation } from '@tanstack/react-query';
import { submitQuiz, getReport } from '@/api/diagnostic';
import type { SubmitPayload, SubmitResponse, ReportResponse } from '@/api/diagnostic';

// ── Fetch report by ID ──────────────────────────────────────────
export function useReport(id: string | undefined) {
  return useQuery<ReportResponse>({
    queryKey: ['report', id],
    queryFn: () => getReport(id!),
    enabled: !!id,
    retry: 2,
    staleTime: 30_000,
  });
}

// ── Submit quiz mutation ────────────────────────────────────────
export function useSubmitQuiz() {
  return useMutation<SubmitResponse, Error, SubmitPayload>({
    mutationFn: (payload: SubmitPayload) => submitQuiz(payload),
  });
}
