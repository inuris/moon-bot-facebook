const RATE = {
  'USD': 24000,
  'EUR': 30000
}
const CATEGORIES = {
  GLASSES: {
    ID: "GLASSES",
    SHIP: 0,
    EXTRA: 5,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Kính mát",
    NOTE: "Phụ thu $5/cái",
    KEYWORD: ["sunglasses", "eyewear accessories"],
    NOTKEYWORD: []
  },
  BELT: {
    ID: "BELT",
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Dây nịt",
    NOTE: "Phí ship $11/kg",
    KEYWORD: ["belt"],
    NOTKEYWORD: []
  },
  WATCH: {
    ID: "WATCH",
    SHIP: 0,
    EXTRA: 15,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Đồng hồ",
    NOTE: "Phụ thu $15/cái",
    KEYWORD: ["watches"],
    NOTKEYWORD: []
  },
  JEWELRY: {
    ID: "JEWELRY",
    SHIP: 0,
    EXTRA: 5,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Trang sức",
    NOTE: "Phụ thu $5/cái",
    KEYWORD: ["> jewelry"],
    NOTKEYWORD: ["> shoes", "cleaning", "care"]
  },
  BIKE: {
    ID: "BIKE",
    SHIP: 12,
    EXTRA: 40,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Xe đạp",
    NOTE: "Phí ship $12/kg + Phụ thu $40/chiếc",
    KEYWORD: ["bike", "walker", "rollator","cycling"],
    NOTKEYWORD: ["accessories"]
  },
  KITCHENAPPLIANCE: {
    ID: "KITCHENAPPLIANCE",
    SHIP: 12,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Dụng cụ nhà bếp",
    NOTE: "Phí ship $12/kg",
    KEYWORD: ["coffee machine", "blender", "brewer", "appliance"],
    NOTKEYWORD: ["> paper & plastic"]
  },
  DVD: {
    ID: "DVD",
    SHIP: 10,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0,
    HVANCHOR: 500,
    NAME: "Đĩa nhạc, game",
    NOTE: "Phí ship $10/kg",
    KEYWORD: ["video games", " > games","blu-ray >", "dvd >"],
    NOTKEYWORD: ["accessories", "controllers", " > consoles", "cards"]
  },
  CHEMICAL_VITAMIN: {
    ID: "CHEMICAL_VITAMIN",
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0,
    HVANCHOR: 500,
    NAME: "Thuốc - Vitamin - Hóa chất",
    NOTE: "Phí ship $11/kg",
    KEYWORD: [
      "beauty & grooming",
      "oil",
      "vitamin",
      "supplement",
      "personal care",
      "liquid",
      "health supplies",
      "cleaning & care"
    ],
    NOTKEYWORD: ["> professional dental supplies", "> toothbrushes","diffusers", "candles"]
  },
  PHONE_TABLET_LAPTOP: {
    ID: "PHONE_TABLET_LAPTOP",
    SHIP: 12,
    EXTRA: 40,
    PRICEEXTRA: 70,
    PRICEANCHOR: 25,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Điện thoại - Laptop",
    NOTE: "Phí ship $12/kg + Phụ thu $40/cái",
    KEYWORD: [
      "amazon devices",
      "> unlocked cell phones",
      "laptops >",
      "> carrier cell phones"
    ],
    NOTKEYWORD: ["computer components","laptop accessories","tablet accessories","computer accessories"]
  },
  CONSOLE: {
    ID: "CONSOLE",
    SHIP: 13,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 0,
    NAME: "Máy chơi game",
    NOTE: "Phí ship $13/kg",
    KEYWORD: [" > consoles"],
    NOTKEYWORD: []
  },
  CAMERA: {
    ID: "CAMERA",
    SHIP: 0,
    EXTRA: 35,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Camera",
    NOTE: "Phụ thu $35/chiếc",
    KEYWORD: ["camera & photo > video >", "camera & photo > dslr cameras"],
    NOTKEYWORD: ["accessories"]
  },
  GOLF: {
    ID: "GOLF",
    SHIP: 12,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Golf",
    NOTE: "Phí ship $12/kg",
    KEYWORD: ["golf club", " > racquets"],
    NOTKEYWORD: []
  },
  DIGITAL: {
    ID: "DIGITAL",
    SHIP: 13,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.05,
    HVANCHOR: 500,
    NAME: "Điện tử",
    NOTE: "Phí ship $13/kg",
    KEYWORD: [
      "electronics",
      "machines",
      "television",
      "computer",
      "laptop",
      "monitor",
      "device",
      "headphones"
    ],
    NOTKEYWORD: [
      "kids",
      "learning",
      "education",
      "audio & video accessories",
      "screen protectors",
      "cases",
      "bags",
      "camera & photo accessories",
      "accessory kits",
      "cables",
      "holder",
      "stands",
      "cradles",
      "mounts",
      "repair kits",
      "sticks",
      "tripods",
      "styluses"
    ]
  },
  AUTOMOTIVE: {
    ID: "AUTOMOTIVE",
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.05,
    HVANCHOR: 500,
    NAME: "Phụ kiện xe hơi",
    NOTE: "Phí ship $11/kg",
    KEYWORD: ["> wheels & tires >",
             "> engine & chassis parts"],
    NOTKEYWORD: []
  },
  MILK: {
    ID: "MILK",
    SHIP: 7.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Sữa",
    NOTE: "Phí ship $7.5/kg",
    KEYWORD: ["bottled beverages, water & drink mixes"],
    NOTKEYWORD: []
  },
  CLOTHES: {
    ID: "CLOTHES",
    SHIP: 8.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Quần áo, giày dép",
    NOTE: "Phí ship $8.5/kg",
    KEYWORD: ["clothing, shoes & jewelry >"],
    NOTKEYWORD: []
  },
  GENERAL: {
    ID: "GENERAL",
    SHIP: 8.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "thông thường",
    NOTE: "Phí ship $8.5/kg",
    KEYWORD: [],
    NOTKEYWORD: []
  },
  UNKNOWN: {
    ID: "UNKNOWN",
    SHIP: 0,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HVEXTRA: 0.1,
    HVANCHOR: 500,
    NAME: "Chưa xác định",
    NOTE: "Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về",
    KEYWORD: [],
    NOTKEYWORD: []
  }
};
const IGNORE_WEBSITES=[
  "zara.com/es",
  "ebay.com",
  "victoriassecret.com",
  "urbanoutfitters.com",
  "ruelala.com"
]
const WEBSITES = {
  AMAZON3RD:{
    TAX: 0.083,
    MATCH: "amazon.com/gp/offer-listing",
    SILENCE: false,
    //COOKIE:"session-id=145-0181747-4095778; session-token=Y1mJ+P3eHpParb4TsuuNijPOisCg68nT0KcIo0qjgYiyErNXSpH1b/WILk1MsAepA9B1gzNC+2sHWf0OyK9NC/EYCk503FS7cqRM2pjv63Cy3p2HkMnAV4rMOnez+22Iev1N9Wi2lJsY5uyNxq/2LBaRq4/uKUGctUoe2ofX3eHVjPPodol2L+twTquBidvaCahHsJMmvY/ZEJGgRMuG6xdYFYzvUR229XMtQua4+BLSLBGnZPbCH7HKbMX3lyp9; ubid-main=130-5429414-6939308",
    PRICEBLOCK: [
      ".olpOfferPrice"
    ],
    SHIPPINGBLOCK: [
      ".olpShippingInfo"
    ]
  },  
  AMAZON: {
    TAX: 0.083,
    MATCH: "amazon.com",
    NAME: "Amazon",
    SILENCE: false,
    //COOKIE:"session-id=145-0181747-4095778; session-token=Y1mJ+P3eHpParb4TsuuNijPOisCg68nT0KcIo0qjgYiyErNXSpH1b/WILk1MsAepA9B1gzNC+2sHWf0OyK9NC/EYCk503FS7cqRM2pjv63Cy3p2HkMnAV4rMOnez+22Iev1N9Wi2lJsY5uyNxq/2LBaRq4/uKUGctUoe2ofX3eHVjPPodol2L+twTquBidvaCahHsJMmvY/ZEJGgRMuG6xdYFYzvUR229XMtQua4+BLSLBGnZPbCH7HKbMX3lyp9; ubid-main=130-5429414-6939308",
    DETAILBLOCK: [
      "#productDetails_detailBullets_sections1 tr",
      "#detailBulletsWrapper_feature_div li",
      "#detailBullets_feature_div span.a-list-item",
      "#prodDetails tr",
      "#detail-bullets .content li",
      "#technical-details-table tr",
      "#tech-specs-desktop tr"
    ],
    CATEGORYCONDITION: ["sellers rank"],
    WEIGHTCONDITION: ["weight" , "dimensions"],    
    PRICEBLOCK: [
      "#priceblock_dealprice",
      "#priceblock_ourprice",
      "#priceblock_saleprice",
      "#priceblock_pospromoprice",
      ".guild_priceblock_ourprice",
      ".offer-price",
      "#alohaPricingWidget .a-color-price"
    ],
    REDIRECT:[
      "#availability a"
    ],
    SHIPPINGBLOCK: [
      "#ourprice_shippingmessage"
    ]
  },
  AEROPOSTALE: {
    TAX: 0,
    MATCH: "aeropostale.com",
    NAME: "AeroPostale",
    SILENCE: false,
    PRICEBLOCK: [
      ".product-price .price-sale",
      ".product-price .price-msrp"
    ]
  },  
  BHPHOTOVIDEO: {
    TAX: 0,
    MATCH: "bhphotovideo.com",    
    NAME: "BHPhotoVideo",
    SILENCE: false,
    PRICEBLOCK: [
      ".ypYouPay",
      ".itc-you-pay .itc-you-pay-price"
    ]
  },
  CARTERS: {
    TAX: 0.083,
    MATCH: "carters.com",
    NAME: "Carters",
    SILENCE: false,
    PRICEBLOCK:[
      '.product-price-container .price-sales-usd'
    ]
  },
  CROCS:{
    TAX: 0.083,
    MATCH: "crocs.com",
    NAME: "Crocs",
    SILENCE: false,
    JSONBLOCK:{
      KEYWORD: "masterData",
      REGEX: /\{[.\s\S]+\}/gm,
      PATH: [
        "$..masterData.colors[?(@.isSale==true)].price",
        "$..masterData.colors[?(@.isSale==false)].price",
            ]
    } 
  },
  DOLLSKILL:{
    TAX: 0,
    MATCH: "dollskill.com",
    NAME: "DollSkill",
    SILENCE: false,
    PRICEBLOCK:[
      '.price-usd .special-price',
      '.price-usd .price'
    ]
  },
  FOREVER21: {
    TAX: 0,
    MATCH: "forever21.com",
    NAME: "Forever21",
    SILENCE: false,
    JSONBLOCK:{
      INDEX: 1,
      SELECTOR:'script[type="application/ld+json"]',
      PATH: ["$.Offers.price"]
    } 
  },
      // Subdomain của GAP
      ATHLETA: {
        TAX: 0.083,
        MATCH: "athleta.gap.com",
        NAME: "Athleta",
        SILENCE: false,
        JSONBLOCK:{
          INDEX: 0,
          PATH: ["$[0].offers[0].price"]
        }
      },
      BANANAREPUBLIC: {
        TAX: 0,
        MATCH: "bananarepublic.gap.com",
        NAME: "BananaRepublic",
        SILENCE: false,
        JSONBLOCK:{
          INDEX: 0,
          PATH: ["$[0].offers[0].price"]
        }
      },
      HILLCITY: {
        TAX: 0.083,
        MATCH: "hillcity.gap.com",
        NAME: "HillCity",
        SILENCE: false,
        JSONBLOCK:{
          INDEX: 0,
          PATH: ["$[0].offers[0].price"]
        }
      },
      OLDNAVY: {
        TAX: 0.083,
        MATCH: "oldnavy.gap.com",
        NAME: "OldNavy",
        SILENCE: false,
        JSONBLOCK:{
          INDEX: 0,
          PATH: ["$.offers[0].price"]
        }
      },
  GAP: {
    TAX: 0.083,
    MATCH: "gap.com",
    NAME: "GAP",
    SILENCE: false,
    JSONBLOCK:{
      INDEX: 0,
      PATH: ["$[0].offers[0].price"]
    }
  },
  JOMASHOP: {
    SILENT: true,
    TAX: 0,
    MATCH: "jomashop.com",
    NAME: "JomaShop",
    SILENCE: false,
    COOKIE:"bounceClientVisit355v=N4IgNgDiBcIBYBcEQM4FIDMBBNAmAYnvgO6kB0AVgPYC2AhinFRGQMa1EICWKKVCAWmJ0ErOAIQAGABwBWACy4A7AEYVktZMllENMCAA0IAE4wQpYpVoMmLdjRABfIA; _vuid=d11ab39c-b372-43e3-ad8d-3617c5cb6d4e; D_HID=62B7A346-4058-3C77-8CB7-ED51A5943914; D_IID=A74F366D-F291-329B-8AE3-695F6EBA958A; D_SID=115.77.169.59:WASVmq9DjNjsYYd7Yje++3y4C70jD9sz5J1mpazEagA; D_UID=CDF9689C-0487-3CF1-80E9-F81FCB40B168; D_ZID=F7698C1E-15E4-32FF-807F-C52EA2BA8BF2; D_ZUID=862AEB79-2FF9-382C-B620-D920270D33BD; gateCpc=[%22first_cpc%22]; gateNonDirect=[%22first_cpc%22]; tracker_device=8e55fcc1-53aa-4815-8985-04a6011b9886;",
    JSONBLOCK:{
      SELECTOR: '#xitem-primary-json',
      INDEX: 0,
      PATH: ["$.price"]
    },
    CATEGORYBLOCK:[".breadcrumbs"]
  },
  NINEWEST: {
    TAX: 0.083,
    MATCH: "ninewest.com",
    SILENCE: false
  },
  OSHKOSH: {
    TAX: 0.083,
    MATCH: "oshkosh.com",
    NAME: "OshKosh",
    SILENCE: false,
    PRICEBLOCK:[
      '.product-price-container .price-sales-usd'
    ]
  },
  RILEYROSE: {
    TAX: 0.083,
    MATCH: "rileyrose.com",
    NAME: "RileyRose",
    SILENCE: false,
    JSONBLOCK:{
      INDEX: 29,
      PATH: ["$.Offers.price"]
    } 
  },  
  SKIPHOP: {
    TAX: 0.083,
    MATCH: "skiphop.com",
    NAME: "SkipHop",
    SILENCE: false,
    PRICEBLOCK:[
      '.product-price-container .price-sales-usd'
    ]
  },
  THEBODYSHOP: {
    TAX: 0,
    MATCH: "thebodyshop.com",
    SILENCE: false,
    PRICEBLOCK:[
      '.current-price',
      '.price-wrapper'
    ]
  },
  WALGREENS: {
    TAX: 0.083,
    MATCH: "walgreens.com",
    NAME: "Walgreens",
    SILENCE: false,
    PRICEBLOCK: [
      "#sales-price-info",
      "#regular-price-info"
    ]
  },
  WALMART: {
    TAX: 0,
    MATCH: "walmart.com",
    NAME: "Walmart",
    SILENCE: false,
    PRICEBLOCK: [
      ".prod-PriceHero .price-group"
    ]
  },
  ZARAUS:{
    TAX: 0,
    MATCH: "zara.com/us",
    NAME: 'Zara',
    SILENCE: false,   
    JSONBLOCK:{
      INDEX: 16,
      PATH: ["$[0].offers.price"]
    }
  },
  ZEROUV: {
    TAX: 0.083,
    MATCH: "shopzerouv.com",
    NAME: "ZeroUV",
    SILENCE: false,
    PRICEBLOCK:[
      ".current_price"
    ],
    CATEGORYBLOCK:[".product_links"]
  },
};

module.exports.RATE = RATE;
module.exports.CATEGORIES = CATEGORIES;
module.exports.IGNORE_WEBSITES = IGNORE_WEBSITES;
module.exports.WEBSITES = WEBSITES;