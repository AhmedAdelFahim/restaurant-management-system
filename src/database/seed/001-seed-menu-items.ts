import { MenuItemSchema } from '../../menu-item/menu-item.model';

export async function seed(mongoose) {
  const MenuItemModel = mongoose.model('menuitems', MenuItemSchema);
  await MenuItemModel.deleteMany({});
  await MenuItemModel.insertMany([
    {
      itemName: 'Tea',
      itemPrice: 10,
    },
    {
      itemName: 'Milk',
      itemPrice: 20,
    },
    {
      itemName: 'Coffee',
      itemPrice: 30,
    },
    {
      itemName: 'Water',
      itemPrice: 5,
    },
    {
      itemName: 'Mongo',
      itemPrice: 35,
    },
    {
      itemName: 'Hot Chocolate',
      itemPrice: 50,
    },
  ]);
}
