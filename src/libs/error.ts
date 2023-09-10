interface ErrorMetadata {
    [key: string]: unknown
}

export default class AppError extends Error {
    metadata?: ErrorMetadata
    type?: string
    error?: Error

    constructor({
        message, type, metadata, error, name
    }: { message?: string, type?: string, metadata?: ErrorMetadata, error?: Error, name?: string }) {
        if (error) {
            super(error.message)
            this.error = error
        } else {
            super(message)
            this.name = name || 'App Error'
            this.type = type
            this.metadata = metadata
        }
    }

    addMetadata(metadata: ErrorMetadata) {
        this.metadata = this.metadata ? { ...this.metadata, ...metadata } : metadata
    }
}
