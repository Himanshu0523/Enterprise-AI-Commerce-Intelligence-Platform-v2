const fs = require('fs');
const path = require('path');

const rootDir = 'd:\\web_devlopment\\Full stack project\\E-commerce\\apps\\storefront\\src';

const itemsToCheck = {
  pages: [
    { name: 'forgot-password', path: 'app/(auth)/forget-password' },
    { name: 'reset-password', path: 'app/(auth)/reset-password' },
    { name: 'categories/[slug]', path: 'app/(shop)/categories/[slug]' },
    { name: 'category/[id]', path: 'app/category/[id]' },
    { name: 'brands/[slug]', path: 'app/(shop)/brands/[slug]' },
    { name: 'collections/[slug]', path: 'app/(shop)/collections/[slug]' },
    { name: 'sale', path: 'app/(shop)/sale' },
    { name: 'new-arrivals', path: 'app/(shop)/new-arrivals' },
    { name: 'compare', path: 'app/(shop)/compare' },
    { name: 'search', path: 'app/(shop)/search' },
    { name: 'about', path: 'app/(content)/about' },
    { name: 'contact', path: 'app/(content)/contact' },
    { name: 'faq', path: 'app/(content)/faq' },
    { name: 'privacy', path: 'app/(content)/privacy' },
    { name: 'shipping-returns', path: 'app/(content)/shipping-returns' },
    { name: 'size-guide', path: 'app/(content)/size-guide' },
    { name: 'terms', path: 'app/(content)/terms' },
    { name: 'orders/[id]', path: 'app/(shop)/account/orders/[id]' },
    { name: 'addresses/add', path: 'app/(shop)/account/addresses/add' },
    { name: 'payment-methods', path: 'app/(shop)/account/payment-methods' },
    { name: 'settings', path: 'app/(shop)/account/settings' },
    { name: 'reviews', path: 'app/(shop)/account/reviews' },
    { name: 'checkout/shipping', path: 'app/(shop)/checkout/shipping' },
    { name: 'checkout/payment', path: 'app/(shop)/checkout/payment' },
    { name: 'checkout/confirmation', path: 'app/(shop)/checkout/confirmation' }
  ],
  components: [
    { name: 'MegaMenu', file: 'components/layout/Header/MegaMenu' },
    { name: 'Breadcrumbs', file: 'components/common/Breadcrumbs' },
    { name: 'PriceRangeSlider', file: 'components/product/ProductFilters/PriceRangeSlider' },
    { name: 'FilterDrawer', file: 'components/product/ProductFilters/FilterDrawer' },
    { name: 'ProductSkeleton', file: 'components/ui/ProductSkeleton' },
    { name: 'WishlistToggle', file: 'components/product/WishlistToggle' },
    { name: 'StockBadge', file: 'components/product/ProductDetail/StockBadge' },
    { name: 'DeliveryEstimate', file: 'components/product/ProductDetail/DeliveryEstimate' },
    { name: 'CheckoutStepper', file: 'components/checkout/CheckoutStepper' },
    { name: 'AddressForm', file: 'components/account/AddressForm' },
    { name: 'OrderCard', file: 'components/account/OrderCard' },
    { name: 'Toast', file: 'components/shared/Toast' },
    { name: 'ImageWithFallback', file: 'components/shared/ImageWithFallback' },
    { name: 'SocialShare', file: 'components/shared/SocialShare' },
    { name: 'HeroBanner', file: 'components/shared/HeroBanner' },
    { name: 'CompareButton', file: 'components/product/CompareButton' }
  ],
  contexts: [
    { name: 'CartContext', file: 'lib/contexts/CartContext' },
    { name: 'FilterContext', file: 'lib/contexts/FilterContext' },
    { name: 'ToastContext', file: 'lib/contexts/ToastContext' },
    { name: 'ThemeContext', file: 'lib/contexts/ThemeContext' }
  ],
  hooks: [
    { name: 'useFilters', file: 'lib/hooks/useFilters' },
    { name: 'useRecentlyViewed', file: 'lib/hooks/useRecentlyViewed' },
    { name: 'useCompare', file: 'lib/hooks/useCompare' },
    { name: 'useMediaQuery', file: 'lib/hooks/useMediaQuery' },
    { name: 'usePagination', file: 'lib/hooks/usePagination' }
  ]
};

// Traverse files in src directory to get all source files
function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allSrcFiles = getFiles(rootDir);
console.log(`Found ${allSrcFiles.length} source files.`);

// Function to check if a component is imported/referenced in source files
function getReferencesCount(name, excludeFile = '') {
  let count = 0;
  const references = [];
  const regex = new RegExp(`\\b${name}\\b`, 'g');

  for (const file of allSrcFiles) {
    if (excludeFile && file.includes(excludeFile.replace(/\//g, path.sep))) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    if (regex.test(content)) {
      count++;
      references.push(path.relative(rootDir, file));
    }
  }
  return { count, references };
}

const results = {
  pages: [],
  components: [],
  contexts: [],
  hooks: []
};

// Check pages
for (const page of itemsToCheck.pages) {
  const fullPath = path.join(rootDir, page.path);
  const exists = fs.existsSync(fullPath);
  results.pages.push({
    name: page.name,
    path: page.path,
    exists,
    details: exists ? fs.readdirSync(fullPath) : null
  });
}

// Check components
for (const comp of itemsToCheck.components) {
  let fileFound = null;
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  for (const ext of extensions) {
    const checkPath = path.join(rootDir, comp.file + ext);
    if (fs.existsSync(checkPath)) {
      fileFound = checkPath;
      break;
    }
    // Also check index files in subfolders
    const checkIndexPath = path.join(rootDir, comp.file, 'index' + ext);
    if (fs.existsSync(checkIndexPath)) {
      fileFound = checkIndexPath;
      break;
    }
  }

  const exists = !!fileFound;
  let refInfo = { count: 0, references: [] };
  if (exists) {
    refInfo = getReferencesCount(comp.name, comp.file);
  }

  results.components.push({
    name: comp.name,
    file: comp.file,
    exists,
    actualPath: fileFound ? path.relative(rootDir, fileFound) : null,
    refCount: refInfo.count,
    references: refInfo.references
  });
}

// Check contexts
for (const ctx of itemsToCheck.contexts) {
  let fileFound = null;
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  for (const ext of extensions) {
    const checkPath = path.join(rootDir, ctx.file + ext);
    if (fs.existsSync(checkPath)) {
      fileFound = checkPath;
      break;
    }
  }

  const exists = !!fileFound;
  let refInfo = { count: 0, references: [] };
  if (exists) {
    refInfo = getReferencesCount(ctx.name, ctx.file);
  }

  results.contexts.push({
    name: ctx.name,
    file: ctx.file,
    exists,
    actualPath: fileFound ? path.relative(rootDir, fileFound) : null,
    refCount: refInfo.count,
    references: refInfo.references
  });
}

// Check hooks
for (const hook of itemsToCheck.hooks) {
  let fileFound = null;
  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  for (const ext of extensions) {
    const checkPath = path.join(rootDir, hook.file + ext);
    if (fs.existsSync(checkPath)) {
      fileFound = checkPath;
      break;
    }
  }

  const exists = !!fileFound;
  let refInfo = { count: 0, references: [] };
  if (exists) {
    refInfo = getReferencesCount(hook.name, hook.file);
  }

  results.hooks.push({
    name: hook.name,
    file: hook.file,
    exists,
    actualPath: fileFound ? path.relative(rootDir, fileFound) : null,
    refCount: refInfo.count,
    references: refInfo.references
  });
}

fs.writeFileSync('check_usage_results.json', JSON.stringify(results, null, 2), 'utf8');
console.log('Results written to check_usage_results.json');
