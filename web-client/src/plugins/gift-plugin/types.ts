export interface GiftList {
  id: number
  name: string
  description?: string
  eventDate?: string // ISO date string
}

export type CreateGiftListDto = Omit<GiftList, 'id'>
export type UpdateGiftListDto = Partial<CreateGiftListDto>
