export interface Plugin {
  name: string
  register(): void
}
