import { faker } from '@faker-js/faker';

const products = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: faker.commerce.product(),
  description: faker.commerce.productDescription(),
  price: 100 + i,
  thumbnail: faker.image.urlPicsumPhotos(),
  //  thumbnail: `https://example.com/product${i + 1}.jpg`,
  code: `P${i + 1}`,
  category: faker.commerce.department(),
  stock: faker.number.int({ min: 1, max: 100 }),
  status: faker.datatype.boolean(),
}));

export const getMockingProducts = (req, res) => {
  res.status(200).render("mockingProducts", { products });
};