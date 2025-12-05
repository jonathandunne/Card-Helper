import AsyncStorage from '@react-native-async-storage/async-storage';

export type Card = {
  id: string;
  name: string;
  brand: string;
  metadata?: any;
};

export type UserCardRow = {
  id: string;
  card_id?: string;
  card?: Card;
  created_at?: string;
};

// Static list of available cards
const STATIC_CARDS: Card[] = [
  // ======================
  // Your original student cards (extended categories)
  // ======================
  {
    id: 'discover-student-cash-back',
    name: 'Discover it® Student Cash Back',
    brand: 'Discover',
    metadata: {
      // Q4 2025: Amazon.com & Drugstores @ 5%; 1% everything else
      // https://www.discover.com/credit-cards/cash-back/it-card.html
      rewards: {
        groceries: 1,
        dining: 1,
        gas: 1,
        travel: 1,
        transit: 1,
        drugstores: 5,
        onlineShopping: 5, // Amazon.com
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'capital-one-savor-student',
    name: 'Capital One Savor Student Cash Rewards',
    brand: 'Capital One',
    metadata: {
      // 3% at grocery, dining, entertainment, streaming; 1% other
      // 
      rewards: {
        groceries: 3,
        dining: 3,
        gas: 1,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 3,
        streaming: 3,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  {
    id: 'boa-customized-student',
    name: 'Bank of America® Customized Cash Rewards for Students',
    brand: 'Bank of America',
    metadata: {
      // 3% in ONE chosen category (gas, online, dining, travel, drugstores, home improvement/furnishings)
      // 2% grocery & wholesale clubs; 1% other 
      // Here we show the max earn by category; app logic should enforce "one 3% choice".
      rewards: {
        groceries: 2,
        dining: 3,
        gas: 3,
        travel: 3,
        transit: 1,
        drugstores: 3,
        onlineShopping: 3,
        entertainment: 1,
        streaming: 3, // bundled under "online" with some merchants
        wholesale: 2,
        wireless: 3,
        departmentStores: 1,
        homeImprovement: 3,
        other: 1
      }
    }
  },
  {
    id: 'boa-travel-student',
    name: 'Bank of America® Travel Rewards for Students',
    brand: 'Bank of America',
    metadata: {
      // 1.5 points per $1 everywhere (≈1.5%) 
      rewards: {
        groceries: 1.5,
        dining: 1.5,
        gas: 1.5,
        travel: 1.5,
        transit: 1.5,
        drugstores: 1.5,
        onlineShopping: 1.5,
        entertainment: 1.5,
        streaming: 1.5,
        wholesale: 1.5,
        wireless: 1.5,
        departmentStores: 1.5,
        homeImprovement: 1.5,
        other: 1.5
      }
    }
  },

  // ======================
  // Discover (non-student)
  // ======================
  {
    id: 'discover-it-cash-back',
    name: 'Discover it® Cash Back',
    brand: 'Discover',
    metadata: {
      // Q4 2025 5%: Amazon.com & Drugstores; 1% everything else (same structure as student) 
      rewards: {
        groceries: 1,
        dining: 1,
        gas: 1,
        travel: 1,
        transit: 1,
        drugstores: 5,
        onlineShopping: 5,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'discover-it-chrome',
    name: 'Discover it® Chrome Gas & Dining',
    brand: 'Discover',
    metadata: {
      // 2% at gas stations and restaurants, 1% others
      rewards: {
        groceries: 1,
        dining: 2,
        gas: 2,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Chase Freedom / Sapphire / Amazon
  // ======================
  {
    id: 'chase-freedom-flex',
    name: 'Chase Freedom Flex℠',
    brand: 'Chase',
    metadata: {
      // Core: 5% Chase Travel; 3% dining & drugstores; 1% other
      // Q4 2025: 5% on Chase Travel, department stores, Old Navy, PayPal 
      rewards: {
        groceries: 1,
        dining: 3,
        gas: 1,
        travel: 5,
        transit: 1,
        drugstores: 3,
        onlineShopping: 1, // PayPal is too broad to model precisely
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 5,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'chase-freedom-unlimited',
    name: 'Chase Freedom Unlimited®',
    brand: 'Chase',
    metadata: {
      // 5% Chase Travel, 3% dining & drugstores, 1.5% other 
      rewards: {
        groceries: 1.5,
        dining: 3,
        gas: 1.5,
        travel: 5,
        transit: 1.5,
        drugstores: 3,
        onlineShopping: 1.5,
        entertainment: 1.5,
        streaming: 1.5,
        wholesale: 1.5,
        wireless: 1.5,
        departmentStores: 1.5,
        homeImprovement: 1.5,
        other: 1.5
      }
    }
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred®',
    brand: 'Chase',
    metadata: {
      // 5x travel via Chase Travel, 3x dining, 3x online grocery, 3x select streaming 
      rewards: {
        groceries: 3, // online grocery specifically
        dining: 3,
        gas: 1,
        travel: 5,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 3,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'chase-sapphire-reserve',
    name: 'Chase Sapphire Reserve®',
    brand: 'Chase',
    metadata: {
      // New structure: 10x hotels/ cars via Chase Travel, 5x flights, 3x other travel + dining, 1x other
      // (simplified to 4x travel, 3x dining) 
      rewards: {
        groceries: 1,
        dining: 3,
        gas: 1,
        travel: 4,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'amazon-prime-visa',
    name: 'Prime Visa (Amazon / Chase)',
    brand: 'Chase',
    metadata: {
      // 5% at Amazon, Whole Foods & Chase Travel; 2% gas, restaurants, transit; 1% other 
      rewards: {
        groceries: 5,          // Whole Foods / Amazon Fresh
        dining: 2,
        gas: 2,
        travel: 5,             // Chase Travel
        transit: 2,
        drugstores: 1,
        onlineShopping: 5,     // Amazon.com
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Capital One cashback & travel
  // ======================


  {
    id: 'capital-one-quicksilver',
    name: 'Capital One Quicksilver Cash Rewards',
    brand: 'Capital One',
    metadata: {
      // 1.5% everywhere, 5% hotels/rental cars via CapOne Travel 
      rewards: {
        groceries: 1.5,
        dining: 1.5,
        gas: 1.5,
        travel: 5,
        transit: 1.5,
        drugstores: 1.5,
        onlineShopping: 1.5,
        entertainment: 1.5,
        streaming: 1.5,
        wholesale: 1.5,
        wireless: 1.5,
        departmentStores: 1.5,
        homeImprovement: 1.5,
        other: 1.5
      }
    }
  },
  {
    id: 'capital-one-venture',
    name: 'Capital One Venture Rewards',
    brand: 'Capital One',
    metadata: {
      // 2x miles everywhere, 5x hotels/vacation rentals/rental cars via CapOne Travel 
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 2,
        travel: 5,
        transit: 2,
        drugstores: 2,
        onlineShopping: 2,
        entertainment: 2,
        streaming: 2,
        wholesale: 2,
        wireless: 2,
        departmentStores: 2,
        homeImprovement: 2,
        other: 2
      }
    }
  },
  {
    id: 'capital-one-venture-x',
    name: 'Capital One Venture X Rewards',
    brand: 'Capital One',
    metadata: {
      // 2x all purchases; 10x hotels/rental cars, 5x flights/vacation rentals via CapOne Travel 
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 2,
        travel: 10,
        transit: 2,
        drugstores: 2,
        onlineShopping: 2,
        entertainment: 2,
        streaming: 2,
        wholesale: 2,
        wireless: 2,
        departmentStores: 2,
        homeImprovement: 2,
        other: 2
      }
    }
  },

  // ======================
  // Citi cashback
  // ======================
  {
    id: 'citi-double-cash',
    name: 'Citi® Double Cash Card',
    brand: 'Citi',
    metadata: {
      // 2% on everything (1% when you buy, 1% when you pay) 
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 2,
        travel: 2,
        transit: 2,
        drugstores: 2,
        onlineShopping: 2,
        entertainment: 2,
        streaming: 2,
        wholesale: 2,
        wireless: 2,
        departmentStores: 2,
        homeImprovement: 2,
        other: 2
      }
    }
  },
  {
    id: 'citi-custom-cash',
    name: 'Citi Custom Cash℠ Card',
    brand: 'Citi',
    metadata: {
      // 5% on top eligible category (restaurants, gas, grocery, select travel, transit, streaming, drugstores, home improvement, live entertainment, etc.) up to cap, then 1% 
      // Here: base 1% + show 5% per eligible category; app should enforce only one active 5% category.
      rewards: {
        groceries: 5,
        dining: 5,
        gas: 5,
        travel: 5,
        transit: 5,
        drugstores: 5,
        onlineShopping: 1,
        entertainment: 5,
        streaming: 5,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 5,
        other: 1
      }
    }
  },

  // ======================
  // Wells Fargo
  // ======================
  {
    id: 'wells-fargo-active-cash',
    name: 'Wells Fargo Active Cash® Card',
    brand: 'Wells Fargo',
    metadata: {
      // 2% cash rewards on all purchases 
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 2,
        travel: 2,
        transit: 2,
        drugstores: 2,
        onlineShopping: 2,
        entertainment: 2,
        streaming: 2,
        wholesale: 2,
        wireless: 2,
        departmentStores: 2,
        homeImprovement: 2,
        other: 2
      }
    }
  },
  {
    id: 'wells-fargo-autograph',
    name: 'Wells Fargo Autograph® Card',
    brand: 'Wells Fargo',
    metadata: {
      // 3x restaurants, travel, gas, transit, streaming, phone plans; 1x other 
      rewards: {
        groceries: 1,
        dining: 3,
        gas: 3,
        travel: 3,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 3,
        wholesale: 1,
        wireless: 3,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Bank of America consumer
  // ======================
  {
    id: 'boa-customized',
    name: 'Bank of America® Customized Cash Rewards',
    brand: 'Bank of America',
    metadata: {
      // Same mechanics as student version 
      rewards: {
        groceries: 2,
        dining: 3,
        gas: 3,
        travel: 3,
        transit: 1,
        drugstores: 3,
        onlineShopping: 3,
        entertainment: 1,
        streaming: 3,
        wholesale: 2,
        wireless: 3,
        departmentStores: 1,
        homeImprovement: 3,
        other: 1
      }
    }
  },
  {
    id: 'boa-unlimited-cash',
    name: 'Bank of America® Unlimited Cash Rewards',
    brand: 'Bank of America',
    metadata: {
      // 1.5% cash back on all purchases
      rewards: {
        groceries: 1.5,
        dining: 1.5,
        gas: 1.5,
        travel: 1.5,
        transit: 1.5,
        drugstores: 1.5,
        onlineShopping: 1.5,
        entertainment: 1.5,
        streaming: 1.5,
        wholesale: 1.5,
        wireless: 1.5,
        departmentStores: 1.5,
        homeImprovement: 1.5,
        other: 1.5
      }
    }
  },

  // ======================
  // Amex cash back
  // ======================
  {
    id: 'amex-blue-cash-preferred',
    name: 'Blue Cash Preferred® Card from American Express',
    brand: 'American Express',
    metadata: {
      // 6% groceries, 6% select streaming, 3% gas, 3% transit, 1% other 
      rewards: {
        groceries: 6,
        dining: 1,
        gas: 3,
        travel: 1,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 6,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'amex-blue-cash-everyday',
    name: 'Blue Cash Everyday® Card from American Express',
    brand: 'American Express',
    metadata: {
      // 3% groceries, 3% U.S. gas, 3% U.S. online retail; 1% other 
      rewards: {
        groceries: 3,
        dining: 1,
        gas: 3,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 3,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Amex Membership Rewards (points @ ~1cpp)
  // ======================
  {
    id: 'amex-gold',
    name: 'American Express® Gold Card',
    brand: 'American Express',
    metadata: {
      // 4x restaurants, 4x U.S. supermarkets, 3x flights Amex Travel; 1x other 
      rewards: {
        groceries: 4,
        dining: 4,
        gas: 1,
        travel: 3, // flights via Amex Travel / airlines
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'amex-platinum',
    name: 'The Platinum Card® from American Express',
    brand: 'American Express',
    metadata: {
      // 5x flights & prepaid hotels via Amex Travel; 1x other 
      rewards: {
        groceries: 1,
        dining: 1,
        gas: 1,
        travel: 5,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Co-branded / store cards
  // ======================
  {
    id: 'costco-anywhere-visa',
    name: 'Costco Anywhere Visa® Card by Citi',
    brand: 'Citi',
    metadata: {
      // 5% gas at Costco, 4% other gas/EV (first $7k), 3% restaurants & eligible travel, 2% Costco, 1% other
      // 
      rewards: {
        groceries: 1,        // non-Costco groceries
        dining: 3,
        gas: 5,
        travel: 3,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 2,        // Costco
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'bilt-mastercard',
    name: 'Bilt World Elite Mastercard®',
    brand: 'Bilt',
    metadata: {
      // 3x dining, 2x travel, 1x rent & other 
      rewards: {
        groceries: 1,
        dining: 3,
        gas: 1,
        travel: 2,
        transit: 2,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'apple-card',
    name: 'Apple Card',
    brand: 'Goldman Sachs / Apple',
    metadata: {
      // 3% at Apple & select merchants, 2% via Apple Pay, 1% physical; modeled as 2% general 
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 2,
        travel: 2,
        transit: 2,
        drugstores: 2,
        onlineShopping: 2,
        entertainment: 2,
        streaming: 2,
        wholesale: 2,
        wireless: 2,
        departmentStores: 2,
        homeImprovement: 2,
        other: 2
      }
    }
  },
  {
    id: 'target-redcard-credit',
    name: 'Target RedCard™ Credit Card',
    brand: 'Target',
    metadata: {
      // 5% off Target & Target.com purchases; 1% elsewhere (modeled as 5% for Target categories)
      // 
      rewards: {
        groceries: 5,
        dining: 1,
        gas: 1,
        travel: 1,
        transit: 1,
        drugstores: 5,        // many pharmacies inside Target
        onlineShopping: 5,     // Target.com
        entertainment: 5,      // media / games bought at Target
        streaming: 1,
        wholesale: 1,
        wireless: 5,           // phone cards/devices at Target
        departmentStores: 5,
        homeImprovement: 5,
        other: 1
      }
    }
  },
    // ======================
  // U.S. Bank
  // ======================
  {
    id: 'usbank-cash-plus',
    name: 'U.S. Bank Cash+® Visa Signature® Card',
    brand: 'U.S. Bank',
    metadata: {
      // 5% on TWO chosen categories (cell phone, utilities, dept stores, TV/internet/streaming, fast food, ground transportation,
      // movie theaters, select clothing, sporting goods, furniture, electronics, etc.) + 2% grocery, gas, restaurants; 1% other.
      // We show max earn per bucket; your app should enforce category caps/choices.
      rewards: {
        groceries: 2,
        dining: 2,              // includes restaurants / fast food
        gas: 2,
        travel: 5,              // Travel Center reservations as a 5% category
        transit: 5,             // ground transportation option
        drugstores: 1,
        onlineShopping: 5,      // electronics / select clothing stores (approx.)
        entertainment: 5,       // movie theaters
        streaming: 5,           // TV, internet and streaming services
        wholesale: 1,
        wireless: 5,            // cell phone providers
        departmentStores: 5,    // department stores category
        homeImprovement: 5,     // furniture stores / home utilities proxy
        other: 1
      }
    }
  },
  {
    id: 'usbank-altitude-go',
    name: 'U.S. Bank Altitude® Go Visa Signature® Card',
    brand: 'U.S. Bank',
    metadata: {
      // 4x dining; 2x streaming, grocery, gas; 1x other.
      rewards: {
        groceries: 2,
        dining: 4,
        gas: 2,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 2,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'usbank-altitude-connect',
    name: 'U.S. Bank Altitude® Connect Visa Signature® Card',
    brand: 'U.S. Bank',
    metadata: {
      // 5x prepaid hotels & car rentals via Travel Center; 4x travel & gas/EV; 2x dining, streaming, groceries; 1x other.
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 4,
        travel: 5,
        transit: 4,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 2,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Citi - Strata family
  // ======================
  {
    id: 'citi-strata-premier',
    name: 'Citi Strata Premier® Card',
    brand: 'Citi',
    metadata: {
      // 10x hotels, car rentals, attractions via cititravel.com; 3x air travel/other hotels, 3x dining, supermarkets, gas/EV; 1x other.
      rewards: {
        groceries: 3,
        dining: 3,
        gas: 3,
        travel: 10,
        transit: 3,   // many transit bookings fall under travel/air/attractions
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'citi-strata',
    name: 'Citi Strata℠ Credit Card',
    brand: 'Citi',
    metadata: {
      // 3x on ONE self-select category (fitness clubs, select streaming, live entertainment, cosmetic/barber, etc.); 1x other.
      // We show max earn per eligible bucket; app should enforce 1 active 3x category.
      rewards: {
        groceries: 1,
        dining: 1,
        gas: 1,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 3,
        streaming: 3,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Amex Green + Delta co-branded
  // ======================
  {
    id: 'amex-green',
    name: 'American Express® Green Card',
    brand: 'American Express',
    metadata: {
      // 3x on travel, 3x on transit, 3x on dining; 1x other.
      rewards: {
        groceries: 1,
        dining: 3,
        gas: 1,
        travel: 3,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'delta-skymiles-gold',
    name: 'Delta SkyMiles® Gold American Express Card',
    brand: 'American Express',
    metadata: {
      // 2x miles on Delta purchases, restaurants, and U.S. supermarkets; 1x other.
      rewards: {
        groceries: 2,
        dining: 2,
        gas: 1,
        travel: 2,   // Delta purchases
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // United / Southwest co-branded
  // ======================
  {
    id: 'united-explorer',
    name: 'United℠ Explorer Card',
    brand: 'Chase',
    metadata: {
      // 2x miles on United purchases, dining, and hotel stays booked directly; 5x hotels via United Hotels portal; 1x other.
      rewards: {
        groceries: 1,
        dining: 2,
        gas: 1,
        travel: 5,   // hotel stays via United Hotels portal & United flights
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'southwest-priority',
    name: 'Southwest® Rapid Rewards® Priority Credit Card',
    brand: 'Chase',
    metadata: {
      // 4x Southwest purchases; 2x gas & dining; until 12/31/25 also 2x transit, internet/cable/phone & select streaming; 1x other.
      rewards: {
        groceries: 1,
        dining: 2,
        gas: 2,
        travel: 4,
        transit: 2,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 2,
        wholesale: 1,
        wireless: 2,   // internet/cable/phone
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Marriott & Hyatt hotel cards
  // ======================
  {
    id: 'marriott-bonvoy-boundless',
    name: 'Marriott Bonvoy Boundless® Credit Card',
    brand: 'Chase',
    metadata: {
      // Up to 17x at Marriott (10x base + 1x Silver + 6x from card); 3x on first $6k combined grocery/gas/dining; 2x other.
      rewards: {
        groceries: 3,
        dining: 3,
        gas: 3,
        travel: 6,   // Marriott stays via card earn only
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 2
      }
    }
  },
  {
    id: 'world-of-hyatt',
    name: 'World of Hyatt Credit Card',
    brand: 'Chase',
    metadata: {
      // Card earns 4x at Hyatt (plus 5x base from World of Hyatt program, but we only count card’s earn); 2x dining, airline tickets direct, local transit/commuting, fitness clubs; 1x other.
      rewards: {
        groceries: 1,
        dining: 2,
        gas: 1,
        travel: 4,   // Hyatt stays / airline tickets
        transit: 2,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },

  // ======================
  // Hilton cards
  // ======================
  {
    id: 'hilton-honors-amex',
    name: 'Hilton Honors American Express Card',
    brand: 'American Express',
    metadata: {
      // 7x Hilton; 5x U.S. restaurants, U.S. gas stations, U.S. supermarkets; 3x other.
      rewards: {
        groceries: 5,
        dining: 5,
        gas: 5,
        travel: 7,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 3
      }
    }
  },
  {
    id: 'hilton-honors-surpass',
    name: 'Hilton Honors American Express Surpass® Card',
    brand: 'American Express',
    metadata: {
      // 12x Hilton; 6x U.S. restaurants, supermarkets, gas; 4x U.S. online retail; 3x other.
      rewards: {
        groceries: 6,
        dining: 6,
        gas: 6,
        travel: 12,
        transit: 1,
        drugstores: 1,
        onlineShopping: 4,
        entertainment: 1,
        streaming: 1,
        wholesale: 1,
        wireless: 1,
        departmentStores: 1,
        homeImprovement: 1,
        other: 3
      }
    }
  },

  // ======================
  // Chase Ink business family
  // ======================
  {
    id: 'chase-ink-business-cash',
    name: 'Ink Business Cash® Credit Card',
    brand: 'Chase',
    metadata: {
      // 5% at office supply stores & on internet/cable/phone (first $25k); 2% gas & restaurants (first $25k); 1% other.
      rewards: {
        groceries: 1,
        dining: 2,
        gas: 2,
        travel: 1,
        transit: 1,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 5,       // TV/internet/streaming lumped here
        wholesale: 1,
        wireless: 5,        // internet/cable/phone services
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  },
  {
    id: 'chase-ink-business-unlimited',
    name: 'Ink Business Unlimited® Credit Card',
    brand: 'Chase',
    metadata: {
      // 1.5% cash back on all purchases (plus 5% on Lyft until 9/30/27, not modeled here).
      rewards: {
        groceries: 1.5,
        dining: 1.5,
        gas: 1.5,
        travel: 1.5,
        transit: 1.5,
        drugstores: 1.5,
        onlineShopping: 1.5,
        entertainment: 1.5,
        streaming: 1.5,
        wholesale: 1.5,
        wireless: 1.5,
        departmentStores: 1.5,
        homeImprovement: 1.5,
        other: 1.5
      }
    }
  },
  {
    id: 'chase-ink-business-preferred',
    name: 'Ink Business Preferred® Credit Card',
    brand: 'Chase',
    metadata: {
      // 3x points on travel, shipping, internet/cable/phone, and social media/search advertising (up to $150k/year); 1x other.
      rewards: {
        groceries: 1,
        dining: 1,
        gas: 1,
        travel: 3,
        transit: 3,
        drugstores: 1,
        onlineShopping: 1,
        entertainment: 1,
        streaming: 3,   // internet/cable/streaming
        wholesale: 1,
        wireless: 3,    // internet/cable/phone
        departmentStores: 1,
        homeImprovement: 1,
        other: 1
      }
    }
  }
];


const STORAGE_KEY = 'selected_cards';

export async function listCards(): Promise<{ data: Card[] | null; error: any }> {
  return { data: STATIC_CARDS, error: null };
}

export async function listUserCards(): Promise<{ data: UserCardRow[] | null; error: any }> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    const data: UserCardRow[] = cardIds.map(cardId => ({
      id: cardId,
      card_id: cardId,
      card: STATIC_CARDS.find(c => c.id === cardId),
      created_at: new Date().toISOString()
    }));

    return { data, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function addUserCard(cardId: string): Promise<{ data: any; error: any }> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    if (!cardIds.includes(cardId)) {
      cardIds.push(cardId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cardIds));
    }

    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}

export async function removeUserCard(userCardId: string): Promise<{ data: any; error: any }> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const cardIds: string[] = stored ? JSON.parse(stored) : [];

    const updated = cardIds.filter(id => id !== userCardId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return { data: null, error: null };
  } catch (e) {
    return { data: null, error: e };
  }
}
