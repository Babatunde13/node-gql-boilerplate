import nock from 'nock'

const mockRequest = (url: string) => {
    const agent = nock(url)
    return agent
}

export default mockRequest
