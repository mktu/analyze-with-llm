export type UrlRegistrationStatus = 'none' | 'inprogress' | 'done' | 'unknown'
export type UrlInfo = {
    url: string,
    status: UrlRegistrationStatus,
    id: string
}
export type GetUrlInfo = (UrlInfo & {
    result: 'found'
}) | { result: 'not found' }

export type HistoryInfo = {
    userId: string,
    message: string
}