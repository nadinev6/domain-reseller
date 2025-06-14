import { DomainResult } from '../types';

// TLD data with pricing
const tldData = [
  { tld: 'com', price: 12.99 },
  { tld: 'net', price: 11.99 },
  { tld: 'org', price: 9.99 },
  { tld: 'io', price: 39.99 },
  { tld: 'dev', price: 14.99 },
  { tld: 'app', price: 15.99 },
  { tld: 'tech', price: 49.99 },
  { tld: 'co', price: 24.99 },
  { tld: 'me', price: 18.99 },
];

// Generate a deterministic but "random" result based on domain name
const isDomainAvailable = (domain: string): boolean => {
  // Simple hash function for deterministic results
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Make approximately 60% of domains available
  return hash % 100 > 40;
};

// Search domains with provided term and generate results
export const searchDomains = (searchTerm: string): DomainResult[] => {
  // Clean up search term
  const cleanTerm = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!cleanTerm) return [];
  
  // Generate results for different TLDs
  const results: DomainResult[] = [];
  
  // Add primary searched domain with .com if not specified
  let primarySearch = cleanTerm;
  let hasTld = false;
  
  // Check if user included a TLD in search
  for (const { tld } of tldData) {
    if (cleanTerm.endsWith(`.${tld}`)) {
      primarySearch = cleanTerm.substring(0, cleanTerm.length - tld.length - 1);
      hasTld = true;
      break;
    }
  }
  
  // Add primary domain with user's TLD or .com
  if (hasTld) {
    const tld = cleanTerm.split('.').pop() || 'com';
    const domainName = `${primarySearch}.${tld}`;
    const isAvailable = isDomainAvailable(domainName);
    const tldInfo = tldData.find(t => t.tld === tld) || { tld, price: 12.99 };
    
    results.push({
      id: `domain-${results.length + 1}`,
      name: domainName,
      available: isAvailable,
      price: tldInfo.price,
      tld: tldInfo.tld
    });
  }
  
  // Add results for other popular TLDs
  for (const { tld, price } of tldData) {
    // Skip if already added
    if (hasTld && cleanTerm.endsWith(`.${tld}`)) continue;
    
    const domainName = `${primarySearch}.${tld}`;
    const isAvailable = isDomainAvailable(domainName);
    
    results.push({
      id: `domain-${results.length + 1}`,
      name: domainName,
      available: isAvailable,
      price,
      tld
    });
  }
  
  // Add a few alternative suggestions with suffixes
  const suffixes = ['online', 'digital', 'site', 'web'];
  for (let i = 0; i < 2; i++) {
    const suffix = suffixes[Math.floor(Math.abs(cleanTerm.charCodeAt(0) * (i + 1)) % suffixes.length)];
    const tldIndex = Math.floor(Math.abs(cleanTerm.charCodeAt(0) * (i + 2)) % tldData.length);
    const { tld, price } = tldData[tldIndex];
    
    const domainName = `${primarySearch}${suffix}.${tld}`;
    const isAvailable = true; // Make suggestions always available
    
    results.push({
      id: `domain-${results.length + 1}`,
      name: domainName,
      available: isAvailable,
      price,
      tld
    });
  }
  
  return results;
};