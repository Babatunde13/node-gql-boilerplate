import { strict as assert } from 'node:assert'
import capitalizeWord from '../../src/libs/capitalize_word'

describe('capitalizeWord', () => {
    it('should return empty string if nothing is passed', () => {
        assert.equal(capitalizeWord(), '')
        assert.equal(capitalizeWord(''), '')
    })
    
    it('should capitalize word', () => {
        assert.equal(capitalizeWord('hello'), 'Hello')
    })
})
