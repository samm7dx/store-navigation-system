export const categories = [
  { name: 'Dairy', zone: 'Dairy Zone', rackType: 'Refrigerated Rack' },
  { name: 'Frozen Foods', zone: 'Frozen Foods Zone', rackType: 'Freezer' },
  { name: 'Grains & Pulses', zone: 'Grains & Pulses Zone', rackType: 'Open Rack' },
  { name: 'Snacks', zone: 'Snacks Zone', rackType: 'Display Rack' },
  { name: 'Beverages', zone: 'Beverages Zone', rackType: 'Shelf Rack' },
  { name: 'Personal Care', zone: 'Personal Care Zone', rackType: 'Personal Care Rack' },
  { name: 'Household', zone: 'Household Zone', rackType: 'Utility Rack' },
  { name: 'Bakery', zone: 'Bakery Zone', rackType: 'Bakery Shelf' }
];

export const getCategoryData = (categoryName) => {
  return categories.find(c => c.name === categoryName) || { zone: 'Uncategorized Zone', rackType: 'Standard Shelf' };
};
