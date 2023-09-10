import { faker } from '@faker-js/faker'

export const generateFakeData = () => ({
    user: {
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        name: faker.person.fullName(),
        password: 'myRandom123$s',
        phone: (format?: string) => faker.phone.number(format),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
        avatar: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
    }
})
