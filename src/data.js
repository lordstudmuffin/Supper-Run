// ---------- Game data. Everything that names a food carries tags so the allergy filter can see it. ----------
const ING = {};
const MEATS = ['poultry', 'beef', 'pork', 'lamb', 'fish', 'shellfish'];
function ing(id, n, e, k, c, o = {}) {
  const t = (o.t || []).slice();
  if (['poultry', 'beef', 'pork', 'lamb'].includes(k)) t.push('meat');
  if (k === 'fish' || k === 'shellfish') t.push('seafood');
  ING[id] = { id, n, e, k, c, al: o.al || [], t, s: o.s || '', lv: o.lv || 0, st: !!o.st, a: o.a || [] };
}
// proteins
ing('chicken', 'Chicken thighs', '🍗', 'poultry', 5, { s: 'poultry', a: ['chicken', 'chicken breast', 'chicken breasts', 'chicken thigh'] });
ing('gturkey', 'Ground turkey', '🦃', 'poultry', 5, { s: 'poultry', a: ['turkey'] });
ing('gbeef', 'Ground beef', '🥩', 'beef', 6, { s: 'ground', a: ['beef', 'hamburger', 'mince'] });
ing('porkchop', 'Pork chops', '🍖', 'pork', 6, { s: 'whole', a: ['pork', 'pork chop'] });
ing('bacon', 'Bacon', '🥓', 'pork', 6, { s: 'cured' });
ing('sausage', 'Italian sausage', '🌭', 'pork', 5, { s: 'ground', a: ['sausage', 'sausages'] });
ing('eggs', 'Eggs', '🥚', 'egg', 3.5, { al: ['egg'], s: 'egg', a: ['egg'] });
ing('tuna', 'Canned tuna', '🐟', 'fish', 2, { al: ['fish'], s: 'rte', a: ['tuna'] });
ing('tilapia', 'White fish fillets', '🐟', 'fish', 6, { al: ['fish'], s: 'fish', a: ['tilapia', 'cod', 'white fish', 'fish'] });
ing('tofu', 'Firm tofu', '🧊', 'legume', 2.5, { al: ['soy'] });
ing('chickpeas', 'Canned chickpeas', '🫘', 'legume', 1.25, { a: ['chickpeas', 'garbanzo beans'] });
ing('blackbeans', 'Black beans', '🫘', 'legume', 1.25, { a: ['beans', 'canned beans'] });
ing('lentils', 'Lentils', '🥣', 'legume', 2);
ing('salmon', 'Salmon fillet', '🍣', 'fish', 9, { al: ['fish'], s: 'fish', lv: 3, a: ['salmon'] });
ing('shrimp', 'Shrimp', '🍤', 'shellfish', 8, { al: ['shellfish'], s: 'shellfish', lv: 4, a: ['prawns'] });
ing('steak', 'A steak to share', '🥩', 'beef', 10, { s: 'whole', lv: 6, a: ['steak'] });
ing('chorizo', 'Fresh chorizo', '🌶️', 'pork', 5, { s: 'ground', t: ['spicy', 'sausage'], lv: 5, a: ['chorizo'] });
ing('halloumi', 'Halloumi', '🧀', 'dairy', 6, { al: ['milk'], t: ['cheese'], lv: 4 });
// vegetables
ing('onion', 'Onion', '🧅', 'veg', 1, { a: ['onions', 'yellow onion', 'red onion'] });
ing('garlic', 'Garlic', '🧄', 'veg', 0.75);
ing('pepper', 'Bell pepper', '🫑', 'veg', 1.5, { a: ['bell peppers', 'peppers'] });
ing('mushroom', 'Mushrooms', '🍄', 'veg', 3, { a: ['mushroom'] });
ing('spinach', 'Spinach', '🥬', 'veg', 3);
ing('cabbage', 'Cabbage', '🥬', 'veg', 2.5);
ing('carrot', 'Carrots', '🥕', 'veg', 1.5, { a: ['carrot'] });
ing('potato', 'Potatoes', '🥔', 'veg', 3, { a: ['potato'] });
ing('sweetpotato', 'Sweet potato', '🍠', 'veg', 1.5, { a: ['sweet potatoes', 'yam'] });
ing('zucchini', 'Zucchini', '🥒', 'veg', 1.5, { t: ['squash'] });
ing('tomato', 'Tomatoes', '🍅', 'veg', 2.5, { a: ['tomato', 'cherry tomatoes'] });
ing('cantomato', 'Canned tomatoes', '🥫', 'veg', 1.5, { t: ['tomato'], a: ['crushed tomatoes', 'diced tomatoes', 'tomato sauce'] });
ing('corn', 'Corn', '🌽', 'veg', 1.5, { a: ['frozen corn', 'canned corn'] });
ing('peas', 'Frozen peas', '🫛', 'veg', 1.5, { a: ['peas'] });
ing('broccoli', 'Broccoli', '🥦', 'veg', 2.5);
ing('cucumber', 'Cucumber', '🥒', 'veg', 1);
ing('scallion', 'Green onions', '🌱', 'veg', 1, { t: ['onion'], a: ['scallions', 'green onion', 'spring onions'] });
ing('jalapeno', 'Jalapeño', '🌶️', 'veg', 0.5, { t: ['spicy', 'chili', 'jalapeno', 'pepper'], a: ['jalapenos', 'jalapeno'] });
ing('avocado', 'Avocado', '🥑', 'veg', 1.5, { a: ['avocados'] });
ing('eggplant', 'Eggplant', '🍆', 'veg', 2);
ing('cauliflower', 'Cauliflower', '🥦', 'veg', 3);
ing('kale', 'Kale', '🥬', 'veg', 2.5);
ing('squash', 'Butternut squash', '🎃', 'veg', 3.5, { lv: 2 });
ing('beet', 'Beets', '🟣', 'veg', 3, { lv: 2, a: ['beet', 'beetroot'] });
// fruit
ing('lemon', 'Lemon', '🍋', 'fruit', 0.75, { t: ['citrus'], a: ['lemons', 'lemon juice'] });
ing('lime', 'Lime', '🍈', 'fruit', 0.5, { t: ['citrus'], a: ['limes', 'lime juice'] });
ing('apple', 'Apple', '🍎', 'fruit', 1, { a: ['apples'] });
ing('banana', 'Banana', '🍌', 'fruit', 0.5, { a: ['bananas'] });
ing('orange', 'Orange', '🍊', 'fruit', 1, { t: ['citrus'], a: ['oranges'] });
ing('berries', 'Frozen berries', '🫐', 'fruit', 4, { t: ['berry', 'strawberry', 'blueberry'], a: ['berries', 'blueberries', 'strawberries'] });
ing('pineapple', 'Canned pineapple', '🍍', 'fruit', 1.75, { a: ['pineapple'] });
ing('mango', 'Mango', '🥭', 'fruit', 1.5, { lv: 3 });
ing('pomegranate', 'Pomegranate', '🔴', 'fruit', 3, { lv: 7 });
// grains and starches
ing('rice', 'Rice', '🍚', 'grain', 2);
ing('pasta', 'Pasta', '🍝', 'grain', 1.5, { al: ['wheat'], t: ['gluten', 'noodle'], a: ['spaghetti', 'penne', 'macaroni', 'noodles'] });
ing('tortilla', 'Flour tortillas', '🫓', 'grain', 3, { al: ['wheat'], t: ['gluten'], a: ['tortillas', 'tortilla'] });
ing('bread', 'Bread', '🍞', 'grain', 3, { al: ['wheat'], t: ['gluten'], a: ['toast', 'sandwich bread'] });
ing('ramen', 'Instant ramen', '🍜', 'grain', 1, { al: ['wheat', 'soy'], t: ['gluten', 'noodle'], a: ['ramen', 'instant noodles'] });
ing('oats', 'Oats', '🌾', 'grain', 3, { t: ['oat'], a: ['oatmeal'] });
ing('cornmeal', 'Cornmeal', '🌽', 'grain', 2.5, { t: ['corn', 'polenta'], a: ['polenta'] });
ing('couscous', 'Couscous', '🍚', 'grain', 2.5, { al: ['wheat'], t: ['gluten'] });
ing('ricenoodle', 'Rice noodles', '🍜', 'grain', 2.5, { t: ['noodle', 'rice'] });
ing('pastry', 'Puff pastry', '🥐', 'grain', 5, { al: ['wheat', 'milk'], t: ['gluten'], lv: 5 });
ing('gnocchi', 'Gnocchi', '🥟', 'grain', 3.5, { al: ['wheat', 'egg'], t: ['gluten', 'potato'], lv: 2 });
// dairy
ing('butter', 'Butter', '🧈', 'dairy', 4, { al: ['milk'] });
ing('cheddar', 'Cheddar', '🧀', 'dairy', 3.5, { al: ['milk'], t: ['cheese'], a: ['cheese', 'shredded cheese'] });
ing('parmesan', 'Parmesan', '🧀', 'dairy', 4, { al: ['milk'], t: ['cheese'] });
ing('creamcheese', 'Cream cheese', '🥯', 'dairy', 2.5, { al: ['milk'], t: ['cheese'] });
ing('yogurt', 'Plain yogurt', '🥛', 'dairy', 1.25, { al: ['milk'], a: ['yogurt', 'greek yogurt'] });
ing('cream', 'Heavy cream', '🥛', 'dairy', 3.5, { al: ['milk'], a: ['cream'] });
ing('feta', 'Feta', '🧀', 'dairy', 4, { al: ['milk'], t: ['cheese'] });
ing('mozzarella', 'Mozzarella', '🧀', 'dairy', 3.5, { al: ['milk'], t: ['cheese'] });
// flavor
ing('soy', 'Soy sauce', '🍶', 'condiment', 2.5, { al: ['soy', 'wheat'], t: ['gluten'] });
ing('pb', 'Peanut butter', '🥜', 'condiment', 3, { al: ['peanut'], t: ['nut'] });
ing('honey', 'Honey', '🍯', 'condiment', 4, { t: ['honey'] });
ing('maple', 'Maple syrup', '🍁', 'condiment', 5, { t: ['syrup'] });
ing('mustard', 'Dijon mustard', '🟡', 'condiment', 2.5, { t: ['mustard'] });
ing('hotsauce', 'Hot sauce', '🔥', 'condiment', 2, { t: ['spicy', 'chili'] });
ing('salsa', 'Salsa', '💃', 'condiment', 3, { t: ['tomato', 'onion', 'spicy', 'chili', 'cilantro'] });
ing('pickles', 'Pickles', '🥒', 'condiment', 3, { t: ['cucumber', 'pickle'], a: ['pickle'] });
ing('olives', 'Olives', '🫒', 'condiment', 3, { a: ['olive'] });
ing('balsamic', 'Balsamic vinegar', '🍷', 'condiment', 4, { t: ['vinegar'] });
ing('curry', 'Curry powder', '🟠', 'spice', 3, { t: ['curry'] });
ing('paprika', 'Smoked paprika', '🔴', 'spice', 3, { t: ['paprika'] });
ing('cinnamon', 'Cinnamon', '🟤', 'spice', 2);
ing('cumin', 'Cumin', '🟤', 'spice', 2.5);
ing('ginger', 'Fresh ginger', '🫚', 'spice', 1);
ing('cilantro', 'Cilantro', '🌿', 'herb', 1, { t: ['coriander'] });
ing('basil', 'Basil', '🌿', 'herb', 3);
ing('mint', 'Mint', '🌿', 'herb', 2.5);
ing('choc', 'Chocolate chips', '🍫', 'sweet', 3, { al: ['milk', 'soy'], t: ['chocolate'], a: ['chocolate'] });
ing('walnut', 'Walnuts', '🌰', 'nut', 5, { al: ['treenut'], t: ['nut'] });
ing('almond', 'Almonds', '🌰', 'nut', 5, { al: ['treenut'], t: ['nut'] });
ing('peanut', 'Peanuts', '🥜', 'nut', 3, { al: ['peanut'], t: ['nut'] });
ing('sesame', 'Sesame seeds', '⚪', 'nut', 3, { al: ['sesame'], t: ['seed'] });
ing('sesameoil', 'Toasted sesame oil', '🫗', 'condiment', 4, { al: ['sesame'] });
ing('panko', 'Panko breadcrumbs', '🍘', 'grain', 2.5, { al: ['wheat'], t: ['gluten', 'bread'], a: ['breadcrumbs'] });
ing('chips', 'Potato chips', '🥔', 'snack', 3, { t: ['potato'] });
ing('tchips', 'Tortilla chips', '🔺', 'snack', 3, { t: ['corn'] });
ing('popcorn', 'Popcorn kernels', '🍿', 'snack', 3, { t: ['corn'] });
ing('coffee', 'Instant coffee', '☕', 'snack', 4, { t: ['caffeine'], lv: 2 });
ing('miso', 'Miso paste', '🥣', 'condiment', 5, { al: ['soy'], lv: 3 });
ing('gochujang', 'Gochujang', '🌶️', 'condiment', 5, { al: ['soy', 'wheat'], t: ['spicy', 'chili', 'gluten'], lv: 4 });
ing('coconut', 'Coconut milk', '🥥', 'condiment', 2.5, { t: ['coconut'], lv: 2 });
ing('tahini', 'Tahini', '🫙', 'condiment', 6, { al: ['sesame'], lv: 5 });
ing('harissa', 'Harissa', '🌶️', 'condiment', 5, { t: ['spicy', 'chili'], lv: 6 });
ing('capers', 'Capers', '🟢', 'condiment', 3, { lv: 3 });
ing('sundried', 'Sun-dried tomatoes', '🍅', 'condiment', 4, { t: ['tomato'], lv: 4 });
ing('pesto', 'Pesto', '🌿', 'condiment', 4, { al: ['treenut', 'milk'], t: ['nut', 'basil', 'cheese'], lv: 3 });
ing('fishsauce', 'Fish sauce', '🐠', 'fish', 3.5, { al: ['fish'], lv: 6 });
ing('kimchi', 'Kimchi', '🥬', 'condiment', 5, { al: ['fish', 'shellfish'], t: ['spicy', 'cabbage', 'chili'], lv: 5 });
ing('nori', 'Nori sheets', '🟩', 'condiment', 3, { t: ['seaweed'], lv: 7 });
// ---- second helping: a much wider shelf ----
ing('wings', 'Chicken wings', '🍗', 'poultry', 6, { s: 'poultry' });
ing('rotisserie', 'Rotisserie chicken', '🍗', 'poultry', 7, { s: 'left', a: ['cooked chicken', 'leftover chicken'] });
ing('gpork', 'Ground pork', '🥩', 'pork', 5, { s: 'ground' });
ing('glamb', 'Ground lamb', '🥩', 'lamb', 8, { s: 'ground', a: ['lamb'] });
ing('stewbeef', 'Beef stew meat', '🥩', 'beef', 8, { s: 'whole', a: ['stew meat'] });
ing('ham', 'Sliced ham', '🍖', 'pork', 4, { s: 'rte2', a: ['ham', 'deli ham'] });
ing('hotdog', 'Hot dogs', '🌭', 'pork', 4, { s: 'left', t: ['beef', 'sausage'], a: ['hot dog', 'hotdogs'] });
ing('pepperoni', 'Pepperoni', '🍕', 'pork', 4, { s: 'rte2', t: ['beef', 'spicy'] });
ing('delturkey', 'Deli turkey', '🥪', 'poultry', 4.5, { s: 'rte2', a: ['lunch meat', 'sliced turkey'] });
ing('fishsticks', 'Frozen fish sticks', '🐟', 'fish', 5, { al: ['fish', 'wheat'], s: 'fish', t: ['gluten'], a: ['fish sticks'] });
ing('sardines', 'Canned sardines', '🐟', 'fish', 2.5, { al: ['fish'], s: 'rte' });
ing('cansalmon', 'Canned salmon', '🐟', 'fish', 4, { al: ['fish'], s: 'rte' });
ing('scallops', 'Scallops', '🐚', 'shellfish', 10, { al: ['shellfish'], s: 'shellfish', lv: 8 });
ing('tempeh', 'Tempeh', '🟫', 'legume', 3.5, { al: ['soy'] });
ing('edamame', 'Edamame', '🫛', 'legume', 3, { al: ['soy'] });
ing('kidney', 'Kidney beans', '🫘', 'legume', 1.25);
ing('whitebeans', 'White beans', '🫘', 'legume', 1.25, { a: ['cannellini beans', 'navy beans'] });
ing('pinto', 'Pinto beans', '🫘', 'legume', 1.25);
ing('refried', 'Refried beans', '🫘', 'legume', 1.5);
ing('hummus', 'Hummus', '🥙', 'condiment', 3.5, { al: ['sesame'], t: ['chickpea'] });
ing('celery', 'Celery', '🥬', 'veg', 2);
ing('lettuce', 'Lettuce', '🥬', 'veg', 2, { a: ['romaine', 'salad', 'salad mix'] });
ing('asparagus', 'Asparagus', '🌿', 'veg', 4);
ing('greenbeans', 'Green beans', '🫛', 'veg', 2);
ing('sprouts', 'Brussels sprouts', '🥬', 'veg', 3.5, { a: ['brussel sprouts'] });
ing('bokchoy', 'Bok choy', '🥬', 'veg', 2.5);
ing('leek', 'Leeks', '🌱', 'veg', 3, { t: ['onion'] });
ing('radish', 'Radishes', '🔴', 'veg', 2);
ing('shallot', 'Shallots', '🧅', 'veg', 1.5, { t: ['onion'] });
ing('mixedveg', 'Frozen mixed vegetables', '🥕', 'veg', 2, { t: ['corn', 'pea', 'carrot'], a: ['mixed vegetables', 'frozen vegetables', 'frozen veggies'] });
ing('fries', 'Frozen fries', '🍟', 'veg', 3.5, { t: ['potato'], a: ['french fries', 'fries', 'tater tots'] });
ing('hashbrowns', 'Hash browns', '🥔', 'veg', 3, { t: ['potato'] });
ing('artichoke', 'Artichoke hearts', '🌿', 'veg', 3.5, { a: ['artichokes'] });
ing('redpeppers', 'Roasted red peppers', '🫑', 'veg', 3.5, { t: ['bell'] });
ing('pumpkin', 'Canned pumpkin', '🎃', 'veg', 2.5, { t: ['squash'], a: ['pumpkin', 'pumpkin puree'] });
ing('arugula', 'Arugula', '🥬', 'veg', 3);
ing('snappeas', 'Snap peas', '🫛', 'veg', 3, { a: ['snow peas'] });
ing('okra', 'Okra', '🌿', 'veg', 3);
ing('greenchiles', 'Canned green chiles', '🌶️', 'veg', 1.5, { t: ['spicy', 'chili', 'pepper'] });
ing('grapes', 'Grapes', '🍇', 'fruit', 3.5);
ing('pear', 'Pear', '🍐', 'fruit', 1, { a: ['pears'] });
ing('peaches', 'Canned peaches', '🍑', 'fruit', 2, { a: ['peach', 'peaches'] });
ing('raisins', 'Raisins', '🍇', 'fruit', 2.5, { t: ['grape'] });
ing('cranberries', 'Dried cranberries', '🔴', 'fruit', 3, { t: ['berry'] });
ing('watermelon', 'Watermelon', '🍉', 'fruit', 4, { t: ['melon'] });
ing('applesauce', 'Applesauce', '🍎', 'fruit', 2.5, { t: ['apple'] });
ing('oj', 'Orange juice', '🧃', 'fruit', 3.5, { t: ['citrus', 'orange'] });
ing('dates', 'Dates', '🟤', 'fruit', 4, { lv: 6 });
ing('quinoa', 'Quinoa', '🍚', 'grain', 4);
ing('corntortilla', 'Corn tortillas', '🫓', 'grain', 2.5, { t: ['corn'] });
ing('pita', 'Pita bread', '🫓', 'grain', 3, { al: ['wheat'], t: ['gluten', 'bread'] });
ing('naan', 'Naan', '🫓', 'grain', 3.5, { al: ['wheat', 'milk'], t: ['gluten', 'bread'] });
ing('bagel', 'Bagels', '🥯', 'grain', 3.5, { al: ['wheat'], t: ['gluten', 'bread'] });
ing('muffin', 'English muffins', '🧇', 'grain', 3, { al: ['wheat', 'milk'], t: ['gluten', 'bread'] });
ing('buns', 'Burger buns', '🍔', 'grain', 3, { al: ['wheat'], t: ['gluten', 'bread'], a: ['hamburger buns', 'hot dog buns', 'buns'] });
ing('crackers', 'Crackers', '🍘', 'grain', 3, { al: ['wheat'], t: ['gluten'] });
ing('pancakemix', 'Pancake mix', '🥞', 'grain', 3, { al: ['wheat', 'milk', 'egg'], t: ['gluten'] });
ing('cereal', 'Breakfast cereal', '🥣', 'grain', 4, { al: ['wheat'], t: ['gluten'], a: ['cereal'] });
ing('macbox', 'Boxed mac and cheese', '🧀', 'grain', 1.5, { al: ['wheat', 'milk'], t: ['gluten', 'cheese', 'pasta'], a: ['mac and cheese', 'mac n cheese', 'kraft dinner'] });
ing('pizzadough', 'Pizza dough', '🍕', 'grain', 3, { al: ['wheat'], t: ['gluten'] });
ing('eggnoodles', 'Egg noodles', '🍜', 'grain', 2.5, { al: ['wheat', 'egg'], t: ['gluten', 'noodle'] });
ing('waffles', 'Frozen waffles', '🧇', 'grain', 3, { al: ['wheat', 'milk', 'egg', 'soy'], t: ['gluten'], a: ['waffles'] });
ing('biscuits', 'Canned biscuit dough', '🥐', 'grain', 2.5, { al: ['wheat', 'milk'], t: ['gluten'], a: ['biscuits', 'crescent rolls'] });
ing('milk', 'Milk', '🥛', 'dairy', 3.5, { al: ['milk'] });
ing('sourcream', 'Sour cream', '🥛', 'dairy', 2.5, { al: ['milk'] });
ing('cottage', 'Cottage cheese', '🥛', 'dairy', 3.5, { al: ['milk'], t: ['cheese'] });
ing('ricotta', 'Ricotta', '🧀', 'dairy', 4, { al: ['milk'], t: ['cheese'] });
ing('american', 'Sliced cheese', '🧀', 'dairy', 3.5, { al: ['milk'], t: ['cheese'], a: ['american cheese', 'cheese slices', 'string cheese'] });
ing('goat', 'Goat cheese', '🧀', 'dairy', 5, { al: ['milk'], t: ['cheese'], lv: 3 });
ing('blue', 'Blue cheese', '🧀', 'dairy', 5, { al: ['milk'], t: ['cheese'], lv: 7 });
ing('icecream', 'Vanilla ice cream', '🍨', 'sweet', 4.5, { al: ['milk', 'egg'], a: ['ice cream'] });
ing('ketchup', 'Ketchup', '🍅', 'condiment', 3, { t: ['tomato'] });
ing('mayo', 'Mayonnaise', '🥚', 'condiment', 4, { al: ['egg'], a: ['mayo'] });
ing('bbq', 'BBQ sauce', '🍖', 'condiment', 3, { a: ['barbecue sauce'] });
ing('ranch', 'Ranch dressing', '🥗', 'condiment', 3.5, { al: ['milk', 'egg'], a: ['ranch'] });
ing('sriracha', 'Sriracha', '🌶️', 'condiment', 4, { t: ['spicy', 'chili', 'garlic'] });
ing('teriyaki', 'Teriyaki sauce', '🍶', 'condiment', 3.5, { al: ['soy', 'wheat'], t: ['gluten'] });
ing('marinara', 'Marinara sauce', '🍝', 'condiment', 3, { t: ['tomato', 'garlic', 'onion'], a: ['pasta sauce', 'spaghetti sauce', 'tomato sauce jar'] });
ing('alfredo', 'Alfredo sauce', '🍝', 'condiment', 3.5, { al: ['milk'], t: ['cheese'] });
ing('worcester', 'Worcestershire sauce', '🍶', 'condiment', 3.5, { al: ['fish'] });
ing('jam', 'Jam', '🍓', 'condiment', 3.5, { t: ['jelly', 'berry', 'fruit'], a: ['jelly', 'preserves'] });
ing('hazelspread', 'Chocolate hazelnut spread', '🍫', 'sweet', 4.5, { al: ['treenut', 'milk', 'soy'], t: ['nut', 'chocolate'], a: ['nutella'] });
ing('tomatopaste', 'Tomato paste', '🥫', 'condiment', 1.25, { t: ['tomato'] });
ing('chxbroth', 'Chicken broth', '🍲', 'condiment', 2.5, { t: ['meat', 'chicken', 'broth'], a: ['chicken stock', 'broth', 'stock', 'bouillon'] });
ing('vegbroth', 'Vegetable broth', '🍲', 'condiment', 2.5, { t: ['broth'], a: ['vegetable stock'] });
ing('enchilada', 'Enchilada sauce', '🥫', 'condiment', 2.5, { t: ['spicy', 'chili', 'tomato'] });
ing('italdressing', 'Italian dressing', '🥗', 'condiment', 3, { a: ['salad dressing', 'vinaigrette'] });
ing('relish', 'Pickled jalapeños', '🌶️', 'condiment', 2.5, { t: ['spicy', 'chili', 'jalapeno', 'pickle'] });
ing('chilicrisp', 'Chili crisp', '🌶️', 'condiment', 6, { al: ['soy', 'peanut'], t: ['spicy', 'chili', 'garlic', 'nut'], lv: 5 });
ing('currypaste', 'Curry paste', '🟥', 'condiment', 4, { al: ['shellfish'], t: ['spicy', 'chili', 'curry'], lv: 4 });
ing('garlicpowder', 'Garlic powder', '🧄', 'spice', 2.5, { t: ['garlic'] });
ing('onionpowder', 'Onion powder', '🧅', 'spice', 2.5, { t: ['onion'] });
ing('chilipowder', 'Chili powder', '🌶️', 'spice', 2.5, { t: ['spicy', 'chili'] });
ing('pepperflakes', 'Red pepper flakes', '🌶️', 'spice', 2.5, { t: ['spicy', 'chili'] });
ing('oregano', 'Oregano', '🌿', 'spice', 2.5);
ing('italseason', 'Italian seasoning', '🌿', 'spice', 2.5, { t: ['oregano', 'basil'] });
ing('taco', 'Taco seasoning', '🌮', 'spice', 1.25, { t: ['spicy', 'chili', 'cumin', 'onion', 'garlic'] });
ing('bagelseason', 'Everything bagel seasoning', '🥯', 'spice', 3.5, { al: ['sesame'], t: ['garlic', 'onion', 'seed'] });
ing('nutmeg', 'Nutmeg', '🟤', 'spice', 3);
ing('turmeric', 'Turmeric', '🟡', 'spice', 3);
ing('thyme', 'Thyme', '🌿', 'herb', 2.5);
ing('rosemary', 'Rosemary', '🌿', 'herb', 2.5);
ing('parsley', 'Parsley', '🌿', 'herb', 1.5);
ing('dill', 'Dill', '🌿', 'herb', 2.5);
ing('cocoa', 'Cocoa powder', '🍫', 'sweet', 3.5, { t: ['chocolate'] });
ing('marshmallow', 'Marshmallows', '☁️', 'sweet', 2.5, { t: ['gelatin'] });
ing('graham', 'Graham crackers', '🍪', 'sweet', 3.5, { al: ['wheat'], t: ['gluten'] });
ing('cookies', 'Chocolate sandwich cookies', '🍪', 'sweet', 4, { al: ['wheat', 'soy'], t: ['gluten', 'chocolate'], a: ['oreos', 'cookies'] });
ing('pretzels', 'Pretzels', '🥨', 'snack', 3, { al: ['wheat'], t: ['gluten'] });
ing('granola', 'Granola', '🥣', 'snack', 4, { al: ['treenut'], t: ['oat', 'nut'] });
ing('cashew', 'Cashews', '🌰', 'nut', 6, { al: ['treenut'], t: ['nut'] });
ing('pecan', 'Pecans', '🌰', 'nut', 6, { al: ['treenut'], t: ['nut'] });
ing('pistachio', 'Pistachios', '🌰', 'nut', 6, { al: ['treenut'], t: ['nut'], lv: 6 });
ing('sunflower', 'Sunflower seeds', '🌻', 'nut', 3, { t: ['seed'] });
ing('almondbutter', 'Almond butter', '🌰', 'condiment', 7, { al: ['treenut'], t: ['nut'] });
ing('coconutflakes', 'Shredded coconut', '🥥', 'sweet', 3, { t: ['coconut'] });
ing('cola', 'Cola', '🥤', 'snack', 2, { t: ['soda', 'caffeine'], a: ['soda', 'coke', 'pepsi'] });
// pantry staples: can be in the pantry, never dealt as a must-use card
ing('salt', 'Salt', '🧂', 'staple', 0, { st: 1 });
ing('blackpepper', 'Black pepper', '🧂', 'staple', 0, { st: 1, a: ['pepper'] });
ing('oliveoil', 'Olive oil', '🫒', 'staple', 0, { st: 1, a: ['oil', 'vegetable oil', 'cooking oil', 'canola oil'] });
ing('flour', 'Flour', '🌾', 'staple', 0, { st: 1, al: ['wheat'], t: ['gluten'] });
ing('sugar', 'Sugar', '🍬', 'staple', 0, { st: 1, a: ['brown sugar'] });
ing('vinegar', 'Vinegar', '🧴', 'staple', 0, { st: 1, a: ['white vinegar', 'apple cider vinegar'] });
ing('water', 'Water', '💧', 'staple', 0, { st: 1 });
ing('cornstarch', 'Cornstarch', '🌽', 'staple', 0, { st: 1, t: ['corn'] });
ing('bakingpowder', 'Baking powder', '🧁', 'staple', 0, { st: 1, a: ['baking soda'] });
ing('vanilla', 'Vanilla extract', '🍦', 'staple', 0, { st: 1, a: ['vanilla'] });

const ALLERGENS = [['milk', 'Milk / dairy'], ['egg', 'Eggs'], ['fish', 'Fish'], ['shellfish', 'Shellfish'], ['treenut', 'Tree nuts'], ['peanut', 'Peanuts'], ['wheat', 'Wheat / gluten'], ['soy', 'Soy'], ['sesame', 'Sesame']];
const DIETS = [['veg', 'Vegetarian'], ['vegan', 'Vegan'], ['pesc', 'Pescatarian'], ['noredmeat', 'No red meat'], ['nopork', 'No pork'], ['nobeef', 'No beef']];
// tap-to-pick lists for the avoid screen; each term goes through the same word matcher as typed ones
const DISLIKES = ['mushrooms', 'olives', 'cilantro', 'onions', 'garlic', 'tomatoes', 'bell peppers', 'spicy', 'eggplant', 'zucchini', 'squash', 'broccoli', 'cauliflower', 'brussels sprouts', 'kale', 'spinach', 'cabbage', 'beets', 'peas', 'celery', 'cucumber', 'avocado', 'asparagus', 'okra', 'sweet potato', 'pickles', 'mustard', 'mayo', 'ketchup', 'ranch', 'coconut', 'pineapple', 'banana', 'raisins', 'tofu', 'beans', 'lentils', 'chickpeas', 'seafood', 'tuna', 'salmon', 'sardines', 'bacon', 'sausage', 'ham', 'hot dogs', 'lamb', 'cheese', 'blue cheese', 'goat cheese', 'cottage cheese', 'yogurt', 'sour cream', 'honey', 'cinnamon', 'ginger', 'curry', 'mint', 'dill', 'coffee', 'chocolate', 'marshmallows', 'kimchi', 'soda'];
const OTHER_AL = ['mustard', 'celery', 'corn', 'coconut', 'garlic', 'onion', 'tomato', 'citrus', 'berry', 'banana', 'avocado', 'oats', 'gelatin', 'chocolate', 'caffeine', 'seeds'];
const GROUPS = [['Meat and fish', ['poultry', 'beef', 'pork', 'lamb', 'fish', 'shellfish']], ['Eggs and dairy', ['egg', 'dairy']], ['Beans and tofu', ['legume']], ['Vegetables', ['veg']], ['Fruit', ['fruit']], ['Grains and bread', ['grain']], ['Sauces and jars', ['condiment']], ['Spices and herbs', ['spice', 'herb']], ['Snacks and sweets', ['snack', 'sweet', 'nut']], ['Basics', ['staple']]];
// word lists used to classify things typed by hand (pantry items, hint ingredients)
const AL_WORDS = {
  milk: 'milk butter cheese cream yogurt whey ghee paneer custard dairy cheddar parmesan mozzarella feta',
  egg: 'egg mayo mayonnaise meringue',
  fish: 'fish salmon tuna cod tilapia anchovy sardine trout halibut',
  shellfish: 'shellfish shrimp prawn crab lobster scallop clam mussel oyster',
  treenut: 'almond walnut pecan cashew pistachio hazelnut macadamia',
  peanut: 'peanut',
  wheat: 'wheat flour bread pasta noodle tortilla cracker couscous panko spaghetti bun bagel',
  soy: 'soy tofu edamame miso tempeh',
  sesame: 'sesame tahini'
};
const KIND_WORDS = { poultry: 'chicken turkey duck', beef: 'beef steak hamburger', pork: 'pork bacon ham sausage chorizo', lamb: 'lamb', fish: AL_WORDS.fish, shellfish: AL_WORDS.shellfish, egg: 'egg' };

// USDA FSIS safe minimum internal temperatures
const SAFETY = {
  poultry: ['Chicken, turkey, other poultry (whole, pieces or ground)', '165°F (74°C)'],
  ground: ['Ground beef, pork, lamb, and fresh sausage', '160°F (71°C)'],
  whole: ['Steaks, chops and roasts (beef, pork, lamb)', '145°F (63°C), then rest 3 minutes'],
  fish: ['Fish with fins', '145°F (63°C), or until opaque and it flakes with a fork'],
  shellfish: ['Shrimp, scallops, crab, lobster', 'Until the flesh is pearly white and opaque'],
  egg: ['Eggs', 'Until yolk and white are firm. Egg dishes: 160°F (71°C)'],
  left: ['Leftovers and casseroles', '165°F (74°C)']
};
const SAFE_NOTE = {
  cured: 'Bacon is too thin for a thermometer. Cook it until crisp, and wash anything the raw strips touched.',
  rte: 'Canned fish is already cooked. Once it is open, keep it cold and use it within a few days.',
  rte2: 'Deli and cured meats are ready to eat. Keep them cold, and heat them until steaming if anyone is pregnant or has a weak immune system.',
  left: 'Already-cooked meat and hot dogs: reheat until steaming hot all the way through, 165°F (74°C).'
};
const BASICS = [
  'Wash hands with soap for 20 seconds before cooking and after touching raw meat, eggs or fish.',
  'Keep raw meat, eggs and fish on their own board and plate, away from food that is ready to eat.',
  'Do not rinse raw chicken. It only splashes germs around the sink.',
  'Put the thermometer in the thickest part, not touching bone or the pan.',
  'Clams, mussels and oysters are done when the shells open. Throw away any that stay shut.',
  'Get leftovers into the fridge within 2 hours (1 hour if the room is above 90°F). Fridge at 40°F or colder.'
];

const THEMES = [
  ['gothic', 'Gothic Feast', '🕯️', 'Dark, dramatic, a little haunted. Serve it like the castle has been expecting you.', 0],
  ['bento', 'Anime Bento', '🍱', 'Small tidy portions, neat compartments, and at least one thing cut into a cute shape.', 0],
  ['diner', 'Diner at 2am', '🌙', 'Greasy-spoon comfort for tired heroes. Someone has to say "what can I get ya, hon?"', 0],
  ['fancy', 'Fake Fancy Restaurant', '🎩', 'Tiny portions, huge plates, and a menu description that takes longer to read than the dish takes to eat.', 0],
  ['brinner', 'Breakfast for Dinner', '🌅', 'The morning menu, served after dark. Pajamas are formal wear tonight.', 0],
  ['street', 'Street Food Night', '🏮', 'Hand-held, bold, and eaten standing up. Bonus points for a paper wrapper.', 0],
  ['picnic', 'Living Room Picnic', '🧺', 'Blanket on the floor, everything portable. No table allowed.', 2],
  ['potluck', 'Cursed Potluck', '👻', 'The dish a mysterious neighbor would bring. Looks alarming, tastes great.', 3],
  ['tiny', 'Tiny Food', '🔍', 'Everything is bite-sized. If it needs a fork, it is too big.', 4],
  ['pirate', 'Pirate Galley', '🏴‍☠️', 'Hearty food for a long voyage, served with terrible accents.', 5],
  ['space', 'Space Station Rations', '🚀', 'Make dinner look like it came from the future. Geometry encouraged.', 6],
  ['grandma', "Grandma's Secret Recipe (Invented Tonight)", '👵', 'Cook it like it has been in the family for generations. Make up the backstory.', 7],
  ['mono', 'One-Color Meal', '🎨', 'Pick a single color. Everything on the plate has to match it.', 8],
  ['tavern', 'Medieval Tavern', '🍺', 'Rustic, shareable, served on a board. Speak only in ye olde English.', 9],
  ['finale', 'Cooking Show Finale', '📺', 'This is the last round of the season. Narrate everything to the camera.', 11]
].map(([id, n, e, d, lv]) => ({ id, n, e, d, lv }));

const MODS = [
  ['onepan', 'One pan only', 'One pot or pan for everything. Fewer dishes later.', 0],
  ['t30', '30-minute timer', 'Start the clock when the first thing hits the counter. Hands off at zero.', 0, 30],
  ['vibes', 'No recipe, only vibes', 'No looking anything up. Trust your instincts and taste as you go.', 0],
  ['plated', 'Must be plated beautifully', 'It has to look like a photo before anyone takes a bite.', 0],
  ['swap', 'Swap roles halfway', 'At the halfway point the head chef and sous chef trade places.', 0],
  ['dj', 'Sous chef is the DJ', 'The sous chef picks every song. No vetoes.', 2],
  ['silent', 'Five silent minutes', 'For the first five minutes, no talking. Pointing and eyebrows only.', 3],
  ['narrate', 'Narrate it like a cooking show', 'The head chef explains every step to an imaginary audience.', 4],
  ['offhand', 'Wrong-hand garnish', 'Whoever plates has to garnish with their non-dominant hand.', 5],
  ['candle', 'Candlelight service', 'Lights down for dinner. Set the table like you mean it.', 6],
  ['five', 'Five tools only', 'Pick five utensils before you start. That is your whole kit.', 7],
  ['t20', '20-minute timer', 'Twenty minutes, start to plate. Good luck.', 8, 20]
].map(([id, n, d, lv, min]) => ({ id, n, d, lv, min: min || 0 }));

const BOSSES = [
  ['copycat', 'The Copycat', '🍽️', 'Recreate a restaurant dish you both love, from memory. Work at least two of the cards into it.', 3, 3],
  ['three', 'Three Courses', '🎖️', 'Cook a starter, a main and a dessert. Each card has to appear in a different course.', 3, 3],
  ['rematch', 'The Rematch', '⚔️', 'Pick a dish from your Hall of Legendary Failures and redeem it. The cards are your new secret weapons.', 4, 3],
  ['box', 'Mystery Box Finale', '📦', 'Five cards on the table. Use at least four of them in one meal.', 6, 5]
].map(([id, n, e, d, lv, cards]) => ({ id, n, e, d, lv, cards }));

const TITLES = [[1, 'Dish Pit Duo'], [2, 'Toast Apprentices'], [3, 'Microwave Mages'], [4, 'Line Cook Lovebirds'], [5, 'Sauce Wranglers'], [6, 'Pan Whisperers'], [7, 'Sous-Mates'], [8, 'Flame Tamers'], [9, 'Garnish Goblins'], [10, 'Knights of the Round Skillet'], [12, 'Michelin-Adjacent'], [15, 'Legendary Kitchen Gremlins'], [20, 'The Two-Headed Iron Chef']];

// Rescue hints. u lists every food a hint tells you to add, so the allergy filter can drop it.
const RESCUE = {
  salty: ['Too salty', [
    ['Bulk it out. Add more of something plain and unsalted that is already in the dish so the salt has more food to spread across.', []],
    ['Add a splash of water and simmer for a couple of minutes, then taste again.', []],
    ['Squeeze in some lemon. Sour distracts your tongue from salt.', ['lemon']],
    ['Stir in a spoonful of plain yogurt or a splash of cream to mellow it.', ['yogurt', 'cream']],
    ['A small pinch of sugar can take the edge off. Go slowly.', ['sugar']]]],
  bland: ['Bland', [
    ['Salt first. Add a pinch, stir, taste, repeat. Most bland food is just under-salted.', []],
    ['It probably needs something sour. Add a small splash of vinegar and taste.', ['vinegar']],
    ['Squeeze a lemon or lime over it right before serving.', ['lemon', 'lime']],
    ['Melt in a knob of butter at the end. Fat carries flavor.', ['butter']],
    ['A splash of soy sauce adds depth without tasting like soy sauce.', ['soy']],
    ['Give it some heat: a few shakes of hot sauce.', ['hotsauce']],
    ['Turn the heat up and let it brown. Color is flavor, so stop stirring for two minutes.', []]]],
  burnt: ['Something burned', [
    ['Stop stirring right now. Lift the good part into a clean pan and leave the stuck layer behind. Do not scrape.', []],
    ['Trim off the dark bits and call what is left "charred." Chefs charge extra for that word.', []],
    ['Open a window, wave a towel at the smoke alarm, and turn the heat down a notch for the rest of the cook.', []],
    ['Cover the smoky taste with something bright: a squeeze of lemon over the top.', ['lemon']]]],
  dry: ['Too dry', [
    ['Add a splash of water, put a lid on, and give it two minutes on low heat.', []],
    ['Drizzle olive oil over it just before serving.', ['oliveoil']],
    ['Make a quick pan sauce: splash water into the hot pan, scrape up the brown bits, swirl in butter, pour it over.', ['butter']],
    ['Serve it with a cool sauce on the side: plain yogurt with a squeeze of lemon and a pinch of salt.', ['yogurt', 'lemon']],
    ['Slice it thin. Thin slices feel juicier than thick ones.', []]]],
  wet: ['Too wet or soupy', [
    ['Lid off, heat up. Let it bubble until it thickens, stirring so the bottom does not catch.', []],
    ['Mash some of the soft pieces against the side of the pot and stir them back in to thicken it.', []],
    ['Scoop the solids out with a slotted spoon and boil the liquid down on its own, then reunite them.', []],
    ['Declare it a soup. Get bowls. Nobody has to know.', []]]],
  raw: ['Undercooked in the middle', [
    ['Cut the big pieces smaller, put it back on the heat with a lid on, and give it more time. For meat, eggs or fish, check the temperature chart before anyone eats.', []],
    ['Turn the heat down and cook longer. A scorched outside with a raw middle means the pan was too hot.', []],
    ['Finish it in the microwave in 30-second bursts, then back in the pan to crisp. Check the temperature chart for meat, eggs or fish.', []]]],
  spicy: ['Too spicy', [
    ['Serve smaller portions next to a big pile of something plain. Dilution is the real fix.', []],
    ['Stir in plain yogurt or a splash of cream. Dairy calms the burn.', ['yogurt', 'cream']],
    ['A little sugar balances heat. Add a pinch and taste.', ['sugar']],
    ['Add a drizzle of honey.', ['honey']],
    ['Squeeze lime over it. Sour pulls attention away from the heat.', ['lime']],
    ['Stir in a spoonful of peanut butter. It rounds off the heat and makes it saucy.', ['pb']],
    ['Add a splash of coconut milk to cool it down.', ['coconut']]]],
  broken: ['It fell apart', [
    ['It is now the "deconstructed" version. Pile it in a bowl, put something crunchy on top, and plate it with total confidence.', []],
    ['Press the pieces flat into a hot pan and let them crisp into one big golden patty.', []],
    ['Wrap it up. Anything that fell apart tastes intentional inside a tortilla.', ['tortilla']],
    ['Rename it. A new dramatic name fixes most structural problems.', []]]],
  sour: ['Too sour or too sweet', [
    ['Too sour: a pinch of sugar or a little more fat will round it off. Too sweet: a splash of vinegar and a pinch of salt.', ['sugar', 'vinegar']],
    ['Too sweet: salt is the fix. Add a pinch and taste again.', []],
    ['Too sour: add a little water or more of the plain base to dilute it.', []]]]
};

const EPITAPHS = [
  'Here lies {d}. It had dreams.',
  'Here lies {d}. The smoke alarm sang at its funeral.',
  '{d}. Gone, but the smell remains.',
  'In loving memory of {d}. We ordered takeout.',
  'Here rests {d}. It was brave. It was not good.',
  '{d}. Loved by its creators. Feared by all others.',
  'Here lies {d}. {c} deserved better.',
  'Here lies {d}. It looked better in our heads.',
  '{d}. It flew too close to the burner.',
  'Rest now, {d}. You were seasoned with hope.'
];

// ---------- Dish blueprints ----------
// Every challenge is drawn from ONE of these, one card per slot, so the cards always make a real dish together.
// n = the dish idea shown under the cards. th = themes it suits ('*' = any savory theme).
// s = three slots; every item in a slot must work with every item in the other two slots.
const DISHES = [
  ['tacos', 'Tacos or a burrito bowl', ['street', 'diner', 'tiny', 'potluck', 'picnic'], [
    ['gbeef', 'chicken', 'gturkey', 'blackbeans', 'pinto', 'chorizo', 'tilapia', 'shrimp', 'gpork', 'rotisserie'],
    ['tortilla', 'corntortilla', 'rice'],
    ['salsa', 'lime', 'avocado', 'cilantro', 'jalapeno', 'cheddar', 'sourcream', 'corn', 'greenchiles', 'relish', 'cabbage', 'taco']]],
  ['nachos', 'Loaded nachos or quesadillas', ['street', 'diner', 'potluck'], [
    ['gbeef', 'chicken', 'blackbeans', 'refried', 'chorizo', 'pinto', 'rotisserie'],
    ['tchips', 'tortilla'],
    ['cheddar', 'salsa', 'jalapeno', 'sourcream', 'avocado', 'greenchiles', 'corn', 'relish', 'enchilada']]],
  ['stirfry', 'A stir-fry over rice or noodles', ['bento', 'street', 'space'], [
    ['chicken', 'tofu', 'gpork', 'shrimp', 'steak', 'eggs', 'tempeh'],
    ['rice', 'ramen', 'ricenoodle'],
    ['soy', 'ginger', 'scallion', 'broccoli', 'pepper', 'bokchoy', 'snappeas', 'sesameoil', 'teriyaki', 'sriracha', 'mushroom', 'gochujang', 'chilicrisp', 'edamame']]],
  ['ramen', 'A loaded bowl of ramen', ['bento', 'diner', 'street'], [
    ['eggs', 'chicken', 'gpork', 'tofu', 'shrimp', 'rotisserie'],
    ['ramen'],
    ['scallion', 'miso', 'corn', 'spinach', 'bokchoy', 'mushroom', 'kimchi', 'chilicrisp', 'nori', 'ginger', 'sriracha', 'sesame']]],
  ['friedrice', 'Fried rice', ['bento', 'diner', 'street', 'space'], [
    ['eggs', 'chicken', 'shrimp', 'ham', 'bacon', 'tofu', 'gpork'],
    ['rice'],
    ['peas', 'mixedveg', 'scallion', 'soy', 'carrot', 'corn', 'kimchi', 'pineapple', 'edamame']]],
  ['katsu', 'Crispy katsu with rice and slaw', ['bento'], [
    ['porkchop', 'chicken', 'tofu'],
    ['panko'],
    ['cabbage', 'cucumber', 'scallion', 'rice', 'curry']]],
  ['curry', 'A curry with rice or naan', ['fancy', 'grandma', 'potluck', 'finale', 'space'], [
    ['chicken', 'chickpeas', 'lentils', 'tofu', 'shrimp', 'cauliflower', 'potato'],
    ['rice', 'naan'],
    ['curry', 'coconut', 'currypaste', 'spinach', 'cantomato', 'ginger', 'yogurt', 'cilantro', 'peas']]],
  ['pasta', 'A pasta dish', ['fancy', 'grandma', 'diner', 'potluck', 'finale', 'gothic'], [
    ['sausage', 'chicken', 'gbeef', 'shrimp', 'bacon', 'whitebeans', 'mushroom', 'eggs'],
    ['pasta', 'gnocchi'],
    ['parmesan', 'spinach', 'cantomato', 'marinara', 'basil', 'lemon', 'cream', 'pesto', 'sundried', 'ricotta', 'broccoli', 'zucchini', 'pepperflakes', 'kale']]],
  ['mac', 'Mac and cheese or a cheesy bake', ['grandma', 'diner', 'potluck'], [
    ['macbox', 'pasta', 'potato'],
    ['cheddar', 'creamcheese', 'cream', 'milk', 'parmesan'],
    ['bacon', 'ham', 'broccoli', 'jalapeno', 'panko', 'peas', 'rotisserie', 'greenchiles', 'spinach']]],
  ['burger', 'Burgers or sliders', ['diner', 'picnic', 'street', 'tavern', 'tiny'], [
    ['gbeef', 'gturkey', 'blackbeans', 'chicken'],
    ['buns', 'bread'],
    ['cheddar', 'american', 'bacon', 'onion', 'pickles', 'bbq', 'avocado', 'mushroom', 'jalapeno', 'tomato']]],
  ['melt', 'A loaded grilled cheese or melt', ['diner', 'picnic'], [
    ['cheddar', 'american', 'mozzarella', 'ham', 'delturkey', 'tuna'],
    ['bread', 'bagel', 'muffin'],
    ['tomato', 'bacon', 'pickles', 'onion', 'spinach', 'avocado', 'jalapeno', 'mustard']]],
  ['pizza', 'Homemade pizza or flatbread', ['diner', 'picnic', 'street', 'tavern', 'finale', 'tiny'], [
    ['pizzadough', 'naan', 'pita', 'tortilla'],
    ['pepperoni', 'sausage', 'chicken', 'ham', 'mushroom', 'bacon', 'spinach'],
    ['mozzarella', 'marinara', 'pesto', 'pineapple', 'pepper', 'olives', 'onion', 'jalapeno', 'bbq', 'feta', 'basil', 'ricotta', 'arugula']]],
  ['bbq', 'A backyard BBQ plate', ['picnic', 'street', 'diner', 'pirate', 'potluck'], [
    ['chicken', 'wings', 'porkchop', 'sausage', 'hotdog'],
    ['corn', 'potato', 'cabbage', 'buns', 'sweetpotato', 'pinto'],
    ['bbq', 'honey', 'mustard', 'pickles', 'hotsauce', 'paprika']]],
  ['wraps', 'Wraps or stuffed pitas', ['street', 'picnic', 'space'], [
    ['chicken', 'chickpeas', 'glamb', 'rotisserie', 'halloumi', 'gturkey'],
    ['pita', 'tortilla', 'naan'],
    ['hummus', 'yogurt', 'cucumber', 'tomato', 'feta', 'lettuce', 'tahini', 'harissa', 'lemon', 'mint', 'olives', 'redpeppers']]],
  ['bowl', 'A grain bowl', ['fancy', 'picnic', 'space'], [
    ['chicken', 'salmon', 'chickpeas', 'tofu', 'eggs', 'halloumi', 'shrimp'],
    ['quinoa', 'rice', 'couscous'],
    ['avocado', 'cucumber', 'feta', 'spinach', 'kale', 'tomato', 'sweetpotato', 'lemon', 'edamame', 'corn', 'tahini', 'arugula']]],
  ['fishsear', 'Pan-seared fish with a side', ['fancy', 'finale'], [
    ['salmon', 'tilapia', 'scallops', 'shrimp'],
    ['rice', 'asparagus', 'potato', 'couscous', 'greenbeans', 'spinach'],
    ['lemon', 'butter', 'capers', 'dill', 'parsley', 'miso', 'pesto']]],
  ['fishfry', 'A fish fry', ['diner', 'pirate', 'tavern'], [
    ['tilapia', 'fishsticks', 'shrimp', 'cansalmon', 'tuna'],
    ['potato', 'fries', 'panko', 'cornmeal', 'cabbage'],
    ['lemon', 'pickles', 'mayo', 'dill', 'capers', 'hotsauce', 'paprika']]],
  ['steak', 'A steak or chop dinner', ['fancy', 'tavern', 'gothic', 'finale'], [
    ['steak', 'porkchop'],
    ['potato', 'asparagus', 'mushroom', 'sweetpotato', 'greenbeans', 'sprouts'],
    ['butter', 'rosemary', 'blue', 'balsamic', 'mustard', 'thyme', 'onion']]],
  ['roast', 'A sheet-pan roast dinner', ['gothic', 'fancy', 'grandma', 'tavern'], [
    ['chicken', 'porkchop', 'sausage', 'salmon', 'tofu', 'chickpeas'],
    ['potato', 'sweetpotato', 'sprouts', 'carrot', 'broccoli', 'cauliflower', 'squash', 'beet', 'asparagus', 'greenbeans'],
    ['rosemary', 'thyme', 'lemon', 'honey', 'mustard', 'balsamic', 'parmesan', 'paprika', 'maple']]],
  ['glazed', 'Something dark, glazed and dramatic', ['gothic'], [
    ['porkchop', 'chicken', 'salmon', 'steak', 'mushroom'],
    ['beet', 'squash', 'sweetpotato', 'potato', 'kale'],
    ['pomegranate', 'balsamic', 'honey', 'rosemary', 'maple', 'berries']]],
  ['stew', 'A hearty stew or chili', ['gothic', 'tavern', 'pirate', 'grandma', 'potluck'], [
    ['stewbeef', 'gbeef', 'chicken', 'sausage', 'kidney', 'lentils', 'glamb'],
    ['potato', 'carrot', 'cantomato', 'sweetpotato', 'squash'],
    ['paprika', 'cumin', 'chilipowder', 'thyme', 'rosemary', 'bread', 'cheddar', 'sourcream', 'kale']]],
  ['soup', 'A cozy soup', ['gothic', 'grandma', 'tavern', 'pirate'], [
    ['chicken', 'rotisserie', 'lentils', 'whitebeans', 'sausage'],
    ['chxbroth', 'vegbroth', 'cantomato', 'potato', 'squash'],
    ['carrot', 'celery', 'kale', 'spinach', 'thyme', 'eggnoodles', 'parmesan', 'bread']]],
  ['hash', 'A skillet hash', ['brinner', 'diner', 'tavern', 'pirate'], [
    ['potato', 'sweetpotato', 'hashbrowns'],
    ['sausage', 'bacon', 'chorizo', 'ham', 'rotisserie', 'blackbeans'],
    ['eggs', 'onion', 'pepper', 'cheddar', 'salsa', 'hotsauce', 'kale', 'spinach']]],
  ['scramble', 'A scramble, omelet or breakfast burrito', ['brinner', 'diner'], [
    ['eggs'],
    ['potato', 'hashbrowns', 'bread', 'tortilla', 'muffin'],
    ['bacon', 'sausage', 'ham', 'cheddar', 'spinach', 'pepper', 'mushroom', 'salsa', 'avocado', 'feta', 'hotsauce']]],
  ['bsandwich', 'Breakfast sandwiches', ['brinner', 'diner', 'picnic'], [
    ['eggs'],
    ['bagel', 'muffin', 'biscuits', 'bread'],
    ['bacon', 'sausage', 'ham', 'cheddar', 'american', 'avocado', 'spinach', 'tomato', 'hotsauce']]],
  ['pancakes', 'Pancakes, waffles or French toast', ['brinner', 'diner', 'tiny'], [
    ['pancakemix', 'waffles', 'bread', 'oats'],
    ['banana', 'berries', 'apple', 'peaches', 'pumpkin'],
    ['maple', 'honey', 'choc', 'cinnamon', 'pb', 'yogurt', 'walnut', 'pecan', 'bacon', 'hazelspread']]],
  // ---- second batch ----
  ['cajun', 'A Cajun rice skillet (jambalaya-style)', ['pirate', 'tavern', 'potluck', 'street'], [
    ['sausage', 'chicken', 'shrimp', 'chorizo'],
    ['rice'],
    ['pepper', 'celery', 'cantomato', 'paprika', 'hotsauce', 'onion']]],
  ['enchiladas', 'Enchiladas', ['grandma', 'potluck', 'diner'], [
    ['chicken', 'rotisserie', 'gbeef', 'blackbeans', 'pinto'],
    ['corntortilla', 'tortilla'],
    ['enchilada', 'cheddar', 'greenchiles', 'sourcream', 'corn', 'salsa']]],
  ['fajitas', 'Sizzling fajitas', ['street', 'diner', 'potluck'], [
    ['chicken', 'steak', 'shrimp', 'tofu', 'mushroom'],
    ['pepper', 'onion', 'zucchini'],
    ['tortilla', 'corntortilla', 'lime', 'sourcream', 'avocado', 'salsa']]],
  ['tortillasoup', 'Chicken tortilla soup', ['grandma', 'potluck', 'street'], [
    ['chicken', 'rotisserie', 'blackbeans'],
    ['chxbroth', 'cantomato', 'enchilada'],
    ['tchips', 'avocado', 'lime', 'cilantro', 'corn', 'sourcream', 'cheddar']]],
  ['huevos', 'Huevos rancheros', ['brinner', 'diner'], [
    ['eggs'],
    ['corntortilla', 'tortilla'],
    ['salsa', 'refried', 'blackbeans', 'avocado', 'cheddar', 'cilantro', 'greenchiles']]],
  ['shakshuka', 'Eggs baked in tomato sauce (shakshuka)', ['brinner', 'fancy', 'gothic'], [
    ['eggs'],
    ['cantomato', 'marinara'],
    ['feta', 'cumin', 'paprika', 'harissa', 'bread', 'pita', 'pepper', 'spinach']]],
  ['frittata', 'A frittata or quiche', ['brinner', 'fancy', 'grandma', 'picnic'], [
    ['eggs'],
    ['pastry', 'potato', 'hashbrowns', 'zucchini'],
    ['ham', 'bacon', 'spinach', 'feta', 'goat', 'cheddar', 'mushroom', 'broccoli', 'tomato']]],
  ['biscuitgravy', 'Biscuits and sausage gravy', ['brinner', 'diner', 'grandma'], [
    ['sausage', 'gpork', 'bacon'],
    ['biscuits'],
    ['milk', 'eggs', 'hotsauce', 'cheddar']]],
  ['chxwaffles', 'Chicken and waffles', ['diner', 'brinner'], [
    ['chicken', 'wings'],
    ['waffles', 'biscuits'],
    ['maple', 'honey', 'hotsauce', 'butter']]],
  ['chxsandwich', 'Crispy chicken sandwiches', ['diner', 'street', 'picnic'], [
    ['chicken'],
    ['buns', 'bread'],
    ['pickles', 'hotsauce', 'mayo', 'honey', 'cabbage', 'ranch', 'cheddar']]],
  ['sloppy', 'Sloppy joes', ['diner', 'potluck', 'picnic'], [
    ['gbeef', 'gturkey', 'lentils'],
    ['buns', 'bread'],
    ['ketchup', 'pepper', 'onion', 'worcester', 'mustard', 'cheddar', 'pickles']]],
  ['hotdogs', 'Loaded hot dogs', ['street', 'diner', 'picnic'], [
    ['hotdog', 'sausage', 'chorizo'],
    ['buns'],
    ['mustard', 'relish', 'onion', 'cheddar', 'pickles', 'ketchup', 'cabbage', 'bacon', 'jalapeno', 'kimchi']]],
  ['bakedpotato', 'Loaded baked potatoes', ['diner', 'picnic', 'potluck', 'tavern'], [
    ['potato', 'sweetpotato'],
    ['bacon', 'blackbeans', 'rotisserie', 'chorizo', 'ham'],
    ['cheddar', 'sourcream', 'scallion', 'butter', 'salsa']]],
  ['skewers', 'Skewers off the grill or broiler', ['street', 'picnic', 'tavern', 'pirate', 'tiny'], [
    ['chicken', 'shrimp', 'steak', 'sausage', 'tofu'],
    ['pepper', 'zucchini', 'onion', 'pineapple', 'mushroom', 'tomato'],
    ['lemon', 'teriyaki', 'bbq', 'harissa', 'rice', 'pita']]],
  ['meatballs', 'Meatballs (with pasta or in a sub)', ['grandma', 'potluck', 'tavern', 'diner', 'tiny'], [
    ['gbeef', 'gturkey', 'gpork', 'sausage'],
    ['pasta', 'buns', 'bread'],
    ['parmesan', 'mozzarella', 'marinara', 'basil', 'ricotta']]],
  ['bakedpasta', 'A baked pasta (lasagna-style or baked ziti)', ['grandma', 'potluck', 'gothic', 'tavern'], [
    ['gbeef', 'sausage', 'spinach', 'chicken', 'zucchini', 'eggplant'],
    ['pasta'],
    ['ricotta', 'mozzarella', 'marinara', 'parmesan', 'basil']]],
  ['cutlets', 'Crispy cutlets (schnitzel or parm)', ['tavern', 'grandma', 'diner', 'fancy'], [
    ['chicken', 'porkchop', 'eggplant'],
    ['panko', 'cornmeal'],
    ['marinara', 'mozzarella', 'lemon', 'parmesan', 'potato', 'cabbage', 'mustard']]],
  ['risotto', 'A creamy risotto', ['fancy', 'gothic', 'finale'], [
    ['mushroom', 'shrimp', 'chicken', 'squash', 'peas', 'asparagus', 'sausage'],
    ['rice'],
    ['parmesan', 'butter', 'lemon', 'thyme', 'spinach', 'cream']]],
  ['stroganoff', 'Stroganoff-style noodles', ['grandma', 'tavern', 'gothic'], [
    ['stewbeef', 'gbeef', 'mushroom', 'chicken'],
    ['eggnoodles', 'rice', 'pasta'],
    ['sourcream', 'cream', 'mustard', 'thyme', 'worcester', 'onion']]],
  ['stuffedpeppers', 'Stuffed peppers or zucchini boats', ['grandma', 'potluck', 'gothic'], [
    ['pepper', 'zucchini'],
    ['gbeef', 'gturkey', 'sausage', 'blackbeans'],
    ['rice', 'quinoa', 'cheddar', 'mozzarella', 'marinara', 'salsa', 'feta', 'cantomato']]],
  ['potpie', 'A pot pie', ['grandma', 'tavern', 'gothic', 'potluck'], [
    ['chicken', 'rotisserie', 'gturkey', 'mushroom'],
    ['pastry', 'biscuits'],
    ['peas', 'mixedveg', 'carrot', 'celery', 'thyme', 'cream', 'milk']]],
  ['shepherds', "Shepherd's or cottage pie", ['tavern', 'gothic', 'grandma', 'pirate'], [
    ['glamb', 'gbeef', 'gturkey', 'lentils'],
    ['potato', 'sweetpotato'],
    ['peas', 'carrot', 'mixedveg', 'worcester', 'thyme', 'cheddar', 'tomatopaste', 'rosemary']]],
  ['chowder', 'A creamy chowder', ['pirate', 'tavern', 'grandma', 'gothic'], [
    ['tilapia', 'shrimp', 'cansalmon', 'bacon', 'chicken'],
    ['potato', 'corn'],
    ['cream', 'milk', 'celery', 'thyme', 'dill', 'scallion']]],
  ['noodlesoup', 'A noodle soup (pho or ramen-shop style)', ['bento', 'street', 'gothic', 'grandma'], [
    ['chicken', 'steak', 'shrimp', 'tofu', 'rotisserie'],
    ['ricenoodle', 'eggnoodles', 'ramen'],
    ['chxbroth', 'vegbroth', 'ginger', 'lime', 'cilantro', 'scallion', 'bokchoy', 'sriracha', 'mint']]],
  ['teriyaki', 'A teriyaki plate', ['bento', 'street'], [
    ['chicken', 'salmon', 'tofu', 'porkchop'],
    ['rice'],
    ['teriyaki', 'broccoli', 'sesame', 'scallion', 'pineapple', 'edamame']]],
  ['sweetsour', 'Sweet and sour, takeout style', ['bento', 'diner', 'street'], [
    ['chicken', 'gpork', 'shrimp', 'tofu'],
    ['rice'],
    ['pineapple', 'pepper', 'onion', 'carrot']]],
  ['korean', 'A Korean-style rice bowl (bibimbap)', ['bento', 'street', 'space'], [
    ['gbeef', 'chicken', 'tofu', 'gpork', 'eggs'],
    ['rice'],
    ['gochujang', 'kimchi', 'spinach', 'carrot', 'cucumber', 'sesame', 'scallion', 'sesameoil']]],
  ['sushibowl', 'A sushi-style rice bowl (cooked or canned fish)', ['bento', 'fancy', 'space'], [
    ['salmon', 'tuna', 'shrimp', 'tofu', 'cansalmon'],
    ['rice'],
    ['cucumber', 'avocado', 'nori', 'edamame', 'sesame', 'sriracha', 'mango', 'scallion', 'mayo']]],
  ['onigiri', 'Rice balls (onigiri)', ['bento', 'picnic', 'tiny'], [
    ['tuna', 'cansalmon', 'eggs', 'chicken'],
    ['rice'],
    ['nori', 'sesame', 'mayo', 'scallion', 'soy']]],
  ['okonomiyaki', 'Savory cabbage pancakes (okonomiyaki)', ['bento', 'street', 'diner'], [
    ['cabbage'],
    ['bacon', 'shrimp', 'gpork'],
    ['mayo', 'scallion', 'nori', 'sriracha', 'kimchi']]],
  ['peanutnoodles', 'Peanut noodles', ['street', 'bento', 'space'], [
    ['chicken', 'shrimp', 'tofu', 'eggs'],
    ['ricenoodle', 'ramen', 'pasta'],
    ['pb', 'peanut', 'lime', 'scallion', 'cilantro', 'cucumber', 'carrot', 'sriracha', 'cabbage']]],
  ['lettucewraps', 'Lettuce wraps', ['bento', 'space', 'fancy', 'tiny'], [
    ['gpork', 'chicken', 'gturkey', 'tofu', 'shrimp'],
    ['lettuce'],
    ['soy', 'ginger', 'scallion', 'sriracha', 'peanut', 'carrot', 'sesameoil', 'lime', 'cucumber']]],
  ['banhmi', 'Bánh mì-style sandwiches', ['street', 'picnic', 'space'], [
    ['gpork', 'chicken', 'tofu', 'eggs'],
    ['bread', 'buns'],
    ['cucumber', 'cilantro', 'jalapeno', 'sriracha', 'mayo', 'carrot']]],
  ['falafel', 'Chickpea patties in pita (falafel-style)', ['street', 'picnic', 'space'], [
    ['chickpeas'],
    ['pita', 'couscous', 'lettuce'],
    ['tahini', 'hummus', 'yogurt', 'cucumber', 'tomato', 'parsley', 'mint', 'lemon', 'harissa', 'feta']]],
  // used for the Three Courses boss and the Tiny Food theme
  ['starter', 'Little bites to start', ['tiny'], [
    ['bread', 'crackers', 'pita', 'cucumber'],
    ['hummus', 'creamcheese', 'goat', 'feta', 'mozzarella', 'avocado'],
    ['tomato', 'basil', 'honey', 'balsamic', 'olives', 'redpeppers', 'sundried', 'lemon']]],
  ['dessert', 'A dessert', [], [
    ['banana', 'apple', 'berries', 'peaches', 'pear', 'pumpkin', 'mango'],
    ['oats', 'graham', 'pastry', 'biscuits', 'cookies'],
    ['cinnamon', 'choc', 'maple', 'honey', 'cream', 'creamcheese', 'walnut', 'pecan', 'coconutflakes', 'marshmallow', 'icecream']]]
].map(([id, n, th, s]) => ({ id, n, th, s }));
