export default function capitalizeWord(word: string) {
    if (!word || !word.length) return ''
    return word.charAt(0).toUpperCase() + word.slice(1)
}
