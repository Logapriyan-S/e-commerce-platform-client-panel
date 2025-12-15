export interface Order {
  id: number;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

const mockOrders: Order[] = [
  {
    id: 1001,
    date: '2025-07-27',
    total: 4898,
    status: 'Delivered',
    items: [
      { name: 'Wireless Headphones', quantity: 1, price: 2999 },
      { name: 'Bluetooth Speaker', quantity: 1, price: 1899 },
    ],
  },
  {
    id: 1002,
    date: '2025-07-26',
    total: 19999,
    status: 'Shipped',
    items: [
      { name: 'Smartphone', quantity: 1, price: 19999 },
    ],
  },
];

export default mockOrders;
