export const createSlug = (str: string) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .normalize()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}
