class GqlQueryBuilder {
    private generateInput(inputName?: string) {
        return inputName ? ` ($input: ${inputName})` : ''
    }

    generateMutation({
        mutationName,
        inputName,
        fields,
    }: { mutationName: string, inputName?: string, fields?: string }): string {
        const input = this.generateInput(inputName)
        return `
            mutation ${mutationName}${input} {
                ${mutationName}${input ? '(input: $input)' : ''} ${fields ? `{ ${fields} }` : ''}
            }
        `
    }

    generateQuery({
        queryName,
        fields,
        inputName
    }: { queryName: string, fields?: string, inputName?: string }): string {
        const input = this.generateInput(inputName)
        return `
            query ${queryName}${input} {
                ${queryName}${input ? '(input: $input)' : ''} ${fields ? `{ ${fields} }` : ''}
            }
        `
    }
}

const  gqlBuilder = new GqlQueryBuilder()
export default gqlBuilder
