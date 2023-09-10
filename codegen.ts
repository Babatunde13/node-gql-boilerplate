
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    schema: './src/graphql/schema',
    generates: {
        'generated/graphql.ts': {
            plugins: ['typescript', 'typescript-resolvers'],
            config: {
                useIndexSignature: true,
                contextType: 'src/types/base_req.types#AuthContext',
            }
        },
    }
}

export default config
