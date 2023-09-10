export default function isError(e: { error: Error } | unknown): e is { error: Error } {
    if (!e) {
        return true
    }

    return (e as { error: Error }).error instanceof Error
}
