// Check if the page number is valid, otherwise change it to be 1
export function validPageQueryParam(page: string): number {
  const pageNumber = Number(page)

  if (!page || Number.isNaN(pageNumber) || pageNumber < 1) {
    return 1
  }
  return pageNumber
}
