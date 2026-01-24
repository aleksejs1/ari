import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api as axios } from '@/lib/axios'

import type { CreateGiftListDto, GiftList, UpdateGiftListDto } from '../types'

export const giftKeys = {
  all: ['gift-lists'] as const,
  lists: () => [...giftKeys.all, 'list'] as const,
  detail: (id: number) => [...giftKeys.lists(), id] as const,
}

import { getHydraMember, type HydraCollection } from '@/lib/hydra'

// --- API Functions ---

const getGiftLists = async (): Promise<GiftList[]> => {
  const { data } = await axios.get<HydraCollection<GiftList> | GiftList[]>('/gift_lists')
  return getHydraMember(data)
}

const createGiftList = async (dto: CreateGiftListDto): Promise<GiftList> => {
  const { data } = await axios.post<GiftList>('/gift_lists', dto)
  return data
}

const updateGiftList = async ({
  id,
  ...dto
}: UpdateGiftListDto & { id: number }): Promise<GiftList> => {
  const { data } = await axios.patch<GiftList>(`/gift_lists/${id}`, dto, {
    headers: {
      'Content-Type': 'application/merge-patch+json',
    },
  })
  return data
}

const deleteGiftList = async (id: number): Promise<void> => {
  await axios.delete(`/gift_lists/${id}`)
}

// --- Hooks ---

export function useGiftLists() {
  return useQuery({
    queryKey: giftKeys.lists(),
    queryFn: getGiftLists,
  })
}

export function useCreateGiftList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGiftList,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: giftKeys.lists() })
    },
  })
}

export function useUpdateGiftList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateGiftList,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: giftKeys.lists() })
    },
  })
}

export function useDeleteGiftList() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGiftList,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: giftKeys.lists() })
    },
  })
}
