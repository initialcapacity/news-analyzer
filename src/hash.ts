export const hash = async (value: string): Promise<string> => {
    const encoded = new TextEncoder().encode(value)
    const hashBuffer = await crypto.subtle.digest('MD5', encoded)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
