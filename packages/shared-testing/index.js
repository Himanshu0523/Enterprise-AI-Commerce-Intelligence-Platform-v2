const mockUser = {
  id: 'usr_test_123',
  name: 'Test Customer',
  email: 'test@example.com',
  roles: ['customer'],
};

const mockProduct = {
  id: 'prod_test_456',
  name: 'Test Wireless Earbuds',
  price: 79.99,
  category: 'Electronics',
  stock: 25,
};

const mockOrder = {
  id: 'ord_test_789',
  userId: 'usr_test_123',
  totalAmount: 79.99,
  status: 'PENDING',
};

module.exports = { mockUser, mockProduct, mockOrder };
