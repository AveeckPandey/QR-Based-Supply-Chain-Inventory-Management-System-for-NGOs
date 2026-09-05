// Presets for 8 Global Humanitarian Regions based on UN WFP & NGO Field Standards

export type RegionPreset = {
  id: string;
  name: string;
  subregionText: string;
  typicalMeals: string[];
  staples: {
    id: string;
    name: string;
    unit: string;
    fullReliefGramPerDay: number; // 2100 kcal standard
    singleMealGram: number;       // 700 kcal standard
    yieldKey: string;
  }[];
};

export const REGIONAL_RATION_PRESETS: RegionPreset[] = [
  {
    id: 'south_asia',
    name: 'South Asia',
    subregionText: 'India, Nepal, Bangladesh, Sri Lanka',
    typicalMeals: ['Dal Khichdi & Sabzi', 'Rice, Dal & Sambar', 'Roti & Veg Curry', 'Poha / Upma'],
    staples: [
      { id: 'rice', name: 'Raw Rice', unit: 'kg', fullReliefGramPerDay: 400, singleMealGram: 120, yieldKey: 'rice' },
      { id: 'dal', name: 'Lentils (Dal)', unit: 'kg', fullReliefGramPerDay: 80, singleMealGram: 40, yieldKey: 'dal' },
      { id: 'wheat', name: 'Wheat Flour (Atta)', unit: 'kg', fullReliefGramPerDay: 100, singleMealGram: 30, yieldKey: 'wheat' },
      { id: 'oil', name: 'Vegetable Oil', unit: 'L', fullReliefGramPerDay: 25, singleMealGram: 10, yieldKey: 'vegetables' },
    ],
  },
  {
    id: 'sub_saharan_africa',
    name: 'Sub-Saharan Africa',
    subregionText: 'Kenya, Uganda, Nigeria, Ghana, Ethiopia, Malawi',
    typicalMeals: ['Maize Porridge / Ugali', 'Jollof Rice & Beans', 'Plumpy\'Nut & CSB Porridge'],
    staples: [
      { id: 'maize', name: 'Maize Meal / Corn Flour', unit: 'kg', fullReliefGramPerDay: 420, singleMealGram: 130, yieldKey: 'maize' },
      { id: 'beans', name: 'Kidney / Black Beans', unit: 'kg', fullReliefGramPerDay: 90, singleMealGram: 45, yieldKey: 'dal' },
      { id: 'csb', name: 'Corn-Soy Blend (CSB)', unit: 'kg', fullReliefGramPerDay: 60, singleMealGram: 30, yieldKey: 'maize' },
      { id: 'plumpynut', name: 'Plumpy\'Nut (RUTF)', unit: 'sachet', fullReliefGramPerDay: 3, singleMealGram: 1, yieldKey: 'vegetables' },
    ],
  },
  {
    id: 'north_america',
    name: 'North America',
    subregionText: 'USA & Canada (Soup Kitchens & Pantry Drives)',
    typicalMeals: ['Stews, Chili & Casseroles', 'PB&J / Turkey Sandwiches', 'Pantry Kits'],
    staples: [
      { id: 'rice', name: 'Enriched Rice', unit: 'kg', fullReliefGramPerDay: 350, singleMealGram: 100, yieldKey: 'rice' },
      { id: 'canned_soup', name: 'Canned Beans / Stew', unit: 'can', fullReliefGramPerDay: 2, singleMealGram: 1, yieldKey: 'dal' },
      { id: 'pasta', name: 'Pasta / Macaroni', unit: 'kg', fullReliefGramPerDay: 200, singleMealGram: 80, yieldKey: 'rice' },
    ],
  },
  {
    id: 'europe',
    name: 'Europe & UK',
    subregionText: 'UK, France, Germany, Poland, Greece, Eastern Europe',
    typicalMeals: ['Hearty Soups & Crusty Bread', 'Pasta & Potato Meals', 'Hot Tea & Pastries'],
    staples: [
      { id: 'potatoes', name: 'Potatoes / Root Veg', unit: 'kg', fullReliefGramPerDay: 500, singleMealGram: 180, yieldKey: 'vegetables' },
      { id: 'pasta', name: 'Pasta', unit: 'kg', fullReliefGramPerDay: 250, singleMealGram: 90, yieldKey: 'rice' },
      { id: 'bread', name: 'Wheat Bread', unit: 'loaf', fullReliefGramPerDay: 1, singleMealGram: 0.3, yieldKey: 'wheat' },
    ],
  },
  {
    id: 'latin_america',
    name: 'Latin America & Caribbean',
    subregionText: 'Mexico, Guatemala, Colombia, Venezuela, Haiti, Peru',
    typicalMeals: ['Arroz con Frijoles (Rice & Beans)', 'Arepas / Tortillas', 'Sancocho Stew'],
    staples: [
      { id: 'rice', name: 'White Rice', unit: 'kg', fullReliefGramPerDay: 380, singleMealGram: 120, yieldKey: 'rice' },
      { id: 'black_beans', name: 'Black / Red Beans', unit: 'kg', fullReliefGramPerDay: 100, singleMealGram: 50, yieldKey: 'dal' },
      { id: 'corn_flour', name: 'Masa Harina (Cornmeal)', unit: 'kg', fullReliefGramPerDay: 150, singleMealGram: 50, yieldKey: 'maize' },
    ],
  },
  {
    id: 'middle_east',
    name: 'Middle East & North Africa',
    subregionText: 'Syria, Yemen, Lebanon, Jordan, Egypt, Palestine',
    typicalMeals: ['Kabsah / Majboos Rice', 'Ful Medames & Pita', 'Yellow Lentil Shorba', 'Dates'],
    staples: [
      { id: 'rice', name: 'Basmati / Long Rice', unit: 'kg', fullReliefGramPerDay: 400, singleMealGram: 120, yieldKey: 'rice' },
      { id: 'fava_beans', name: 'Ful Medames (Fava Beans)', unit: 'can', fullReliefGramPerDay: 2, singleMealGram: 1, yieldKey: 'dal' },
      { id: 'pita', name: 'Pita Flatbread', unit: 'pack', fullReliefGramPerDay: 1, singleMealGram: 0.5, yieldKey: 'wheat' },
      { id: 'dates', name: 'Pressed Dates', unit: 'kg', fullReliefGramPerDay: 100, singleMealGram: 40, yieldKey: 'vegetables' },
    ],
  },
  {
    id: 'southeast_asia',
    name: 'East & Southeast Asia',
    subregionText: 'Philippines, Vietnam, Indonesia, Thailand, Myanmar',
    typicalMeals: ['Lugaw / Congee Porridge', 'Rice & Fish Bowls', 'Instant Noodles & Sardines'],
    staples: [
      { id: 'rice', name: 'Jasmine / White Rice', unit: 'kg', fullReliefGramPerDay: 450, singleMealGram: 140, yieldKey: 'rice' },
      { id: 'sardines', name: 'Canned Sardines', unit: 'can', fullReliefGramPerDay: 2, singleMealGram: 1, yieldKey: 'chicken' },
      { id: 'noodles', name: 'Instant Noodles', unit: 'pack', fullReliefGramPerDay: 3, singleMealGram: 1, yieldKey: 'wheat' },
    ],
  },
  {
    id: 'global_conflict',
    name: 'Global Crisis & Conflict Zones',
    subregionText: 'World Central Kitchen / UN WFP Rapid Response',
    typicalMeals: ['Fresh Mobile Kitchen Stews', 'High Energy Biscuits (HEB)', 'MRE Rations'],
    staples: [
      { id: 'heb', name: 'High Energy Biscuits (HEB)', unit: 'pack', fullReliefGramPerDay: 4, singleMealGram: 2, yieldKey: 'wheat' },
      { id: 'mre', name: 'MRE Self-Heating Rations', unit: 'pack', fullReliefGramPerDay: 2, singleMealGram: 1, yieldKey: 'chicken' },
      { id: 'water', name: 'Bottled Drinking Water', unit: 'L', fullReliefGramPerDay: 3, singleMealGram: 1, yieldKey: 'vegetables' },
    ],
  },
];
