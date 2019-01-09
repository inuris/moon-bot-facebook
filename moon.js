const select = require("soupselect-update").select;
const RATE_USD_VND = 24066;
const CATEGORIES = {
  GLASSES: {
    SHIP: 0,
    EXTRA: 5,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Kính mát",
    NOTE: "Phụ thu $5/cái",
    KEYWORD: ["sunglasses", "eyewear accessories"],
    NOTKEYWORD: []
  },
  BELT: {
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Dây nịt",
    NOTE: "Phí ship $11/kg",
    KEYWORD: ["belt"],
    NOTKEYWORD: []
  },
  WATCH: {
    SHIP: 0,
    EXTRA: 15,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Đồng hồ",
    NOTE: "Phụ thu $15/cái",
    KEYWORD: ["watches"],
    NOTKEYWORD: []
  },
  JEWELRY: {
    SHIP: 0,
    EXTRA: 5,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Trang sức",
    NOTE: "Phụ thu $5/cái",
    KEYWORD: ["> jewelry"],
    NOTKEYWORD: ["> shoes", "cleaning", "care"]
  },
  BIKE: {
    SHIP: 12,
    EXTRA: 40,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Xe đạp",
    NOTE: "Phí ship $12/kg + Phụ thu $40/chiếc",
    KEYWORD: ["bike", "walker", "rollator","cycling"],
    NOTKEYWORD: ["accessories"]
  },
  KITCHENAPPLIANCE: {
    SHIP: 12,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Dụng cụ nhà bếp",
    NOTE: "Phí ship $12/kg",
    KEYWORD: ["coffee machine", "blender", "brewer", "appliance"],
    NOTKEYWORD: ["> paper & plastic"]
  },
  DVD: {
    SHIP: 10,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0,
    HQANCHOR: 500,
    NAME: "Đĩa nhạc, game",
    NOTE: "Phí ship $10/kg",
    KEYWORD: ["video games", " > games","blu-ray >", "dvd >"],
    NOTKEYWORD: ["accessories", "controllers", " > consoles", "cards"]
  },
  CHEMICAL_VITAMIN: {
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0,
    HQANCHOR: 500,
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
    SHIP: 12,
    EXTRA: 40,
    PRICEEXTRA: 70,
    PRICEANCHOR: 25,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    SHIP: 13,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 0,
    NAME: "Máy chơi game",
    NOTE: "Phí ship $13/kg",
    KEYWORD: [" > consoles"],
    NOTKEYWORD: []
  },
  CAMERA: {
    SHIP: 0,
    EXTRA: 35,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Camera",
    NOTE: "Phụ thu $35/chiếc",
    KEYWORD: ["camera & photo > video >", "camera & photo > dslr cameras"],
    NOTKEYWORD: ["accessories"]
  },
  GOLF: {
    SHIP: 12,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Golf",
    NOTE: "Phí ship $12/kg",
    KEYWORD: ["golf club", " > racquets"],
    NOTKEYWORD: []
  },
  DIGITAL: {
    SHIP: 13,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.05,
    HQANCHOR: 500,
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
    SHIP: 11,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.05,
    HQANCHOR: 500,
    NAME: "Phụ kiện xe hơi",
    NOTE: "Phí ship $11/kg",
    KEYWORD: ["> wheels & tires >",
             "> engine & chassis parts"],
    NOTKEYWORD: []
  },
  MILK: {
    SHIP: 7.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Sữa",
    NOTE: "Phí ship $7.5/kg",
    KEYWORD: ["bottled beverages, water & drink mixes"],
    NOTKEYWORD: []
  },
  CLOTHES: {
    SHIP: 8.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Quần áo, giày dép",
    NOTE: "Phí ship $8.5/kg",
    KEYWORD: ["clothing, shoes & jewelry >"],
    NOTKEYWORD: []
  },
  GENERAL: {
    SHIP: 8.5,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "thông thường",
    NOTE: "Phí ship $8.5/kg",
    KEYWORD: [],
    NOTKEYWORD: []
  },
  UNKNOWN: {
    SHIP: 0,
    EXTRA: 0,
    PRICEEXTRA: 0,
    PRICEANCHOR: 0,
    HQEXTRA: 0.1,
    HQANCHOR: 500,
    NAME: "Chưa xác định",
    NOTE: "Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về",
    KEYWORD: [],
    NOTKEYWORD: []
  }
};
const WEBSITES = {
  ALDO: {
    TAX: 0.083,
    URL: "www.aldoshoes.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  AMAZON: {
    TAX: 0.083,
    URL: "www.amazon.com",
    DETAILBLOCK: [
      "#productDetails_detailBullets_sections1 tr",
      "#detailBullets_feature_div span.a-list-item",
      "#detailBulletsWrapper_feature_div li",
      "#prodDetails tr",
      "#detail-bullets .content li",
      "#technical-details-table tr",
      "#tech-specs-desktop tr"
    ],
    PRICEBLOCK: [
      "#priceblock_dealprice",
      "#priceblock_ourprice",
      "#priceblock_saleprice",
      ".guild_priceblock_ourprice",
      ".offer-price",
      "#alohaPricingWidget .a-color-price"
    ],
    SHIPPINGBLOCK: [
      "#ourprice_shippingmessage"
    ]
  },
  BATHBODYWORKS: {
    TAX: 0.083,
    URL: "www.bathandbodyworks.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  BHCOSMETICS: {
    TAX: 0,
    URL: "www.bhcosmetics.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  CARTERS: {
    TAX: 0.083,
    URL: "www.carters.com",
    DETAILBLOCK: "",
    PRICEBLOCK:
      'document.getElementsByClassName("product-price-container desktopvisible")[0].getElementsByClassName("price-sales-usd")[0]',
    SHIPPINGBLOCK:
      ''
  },
  CLINIQUE: {
    TAX: 0.083,
    URL: "www.clinique.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  FOREVER21: {
    TAX: 0.083,
    URL: "www.forever21.com",
    DETAILBLOCK: "",
    PRICEBLOCK: 'document.getElementById("ItemPrice")',
    SHIPPINGBLOCK: ''
  },
  FRAGRANCENET: {
    TAX: 0,
    URL: "www.fragrancenet.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  GAP: {
    TAX: 0.083,
    URL: "www.gap.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  HM: {
    TAX: 0.083,
    URL: "www.hm.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  JOMASHOP: {
    TAX: 0,
    URL: "www.jomashop.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  LOFT: {
    TAX: 0.083,
    URL: "www.loft.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  NINEWEST: {
    TAX: 0.083,
    URL: "www.ninewest.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  OLDNAVY: {
    TAX: 0.083,
    URL: "www.oldnavy.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  OSHKOSH: {
    TAX: 0.083,
    URL: "www.oshkosh.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  RALPHLAUREN: {
    TAX: 0.083,
    URL: "www.ralphlauren.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  RUELALA: {
    TAX: 0,
    URL: "www.reulala.com",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  THEBODYSHOP: {
    TAX: 0.083,
    URL: "www.thebodyshop.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  TOYSRUS: {
    TAX: 0.083,
    URL: "www.toysrus.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  BABIESRUS: {
    TAX: 0.083,
    URL: "babiesrus.toysrus.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  VICTORIASSECRET: {
    TAX: 0.083,
    URL: "www.victoriassecret.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  WALGREENS: {
    TAX: 0.083,
    URL: "www.walgreens.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  VITACOST: {
    TAX: 0,
    URL: "www.vitacost.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  ZULILY: {
    TAX: 0,
    URL: "www.zulily.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  }
};
module.exports = {
  RATE_USD_VND,
  CATEGORIES,
  checkKeyword,
  calculateMoonPrice,
  printMoonPrice,
  toVND
};
// Chuyển đổi dạng Number ra Currency: 1200000 => 1,200,000
Number.prototype.formatMoney = function(c, d, t) {
  var n = this,
    c = isNaN((c = Math.abs(c))) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "")
  );
};
// Đổi USD sang VND, làm tròn 5000
Number.prototype.toVND = function(rate){
  var priceNew = Math.ceil((this * rate) / 5000) * 5000; //Làm tròn lên 5000  
  return priceNew.formatMoney(0, '.', ',')+" VND"; // Thêm VND vào
};

class Category{
  constructor(categoryString){
    this.categoryString=categoryString;
    if (categoryString === "") {
      this.category= "UNKNOWN";
    }    
    // Query từng KEYWORD trong category
    for (var cat in CATEGORIES) {
      if (
        checkKeyword(
          categoryString,
          CATEGORIES[cat].KEYWORD,
          CATEGORIES[cat].NOTKEYWORD
        ) === true
      )
      this.category= cat;
    }
    this.category= "GENERAL";  
  }  
  static checkKeyword(keyString, include, exclude){  
    for (var i = 0; i < include.length; i++) {
      if (keyString.indexOf(include[i]) >= 0) {
        for (var j = 0; j < exclude.length; j++) {
          if (keyString.indexOf(exclude[j]) >= 0) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
}
class Weight{
  constructor(weightArray){
    var current= "",
      kg= 0,
      unit= "";
    //console.log(weightArray);
    var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/;
    if (weightArray.length > 0) {
      for (var i = 0; i < weightArray.length; i++) {
        var weightReg = weightArray[i].match(reg); // ["2.6 pound", "2.6", " pound", index: 16, input: "shipping weight	2.6 pounds"
        //console.log(weightReg);
        if (weightReg !== null) {
          var weight = parseFloat(weightReg[1]);
          var weightKg = weight;
          
          var weightUnit = weightReg[2];
          if (weightUnit.indexOf("ounce") >= 0 || weightUnit.indexOf("oz") >= 0)
            weightKg = weight / 35.274;
          else if (weightUnit.indexOf("pound") >= 0) weightKg = weight / 2.2;
          // Tìm weight lớn nhất
          if (
            kg < weightKg ||
            weightArray[i].indexOf("shipping weight") >= 0
          ) {
            current = weight.toString();
            kg = weightKg;
            unit = weightUnit;
          }
        }
      }      
    }
    this.current=current;
    this.kg=kg;
    this.unit=weightUnit;
  }
}
class Price{
  constructor(priceString,shippingString){
    
    this.priceString=priceString.replace(/\s+/gm," ")
                                .trim()        
                                .replace(/\$\s*|,/gm, "")
                                .replace(" ", ".");
    this.shippingString                            

  }
}
class Item{
  constructor(dom){
    this.price=price;
    this.weight=new Weight(weightArray);
    this.category=new Category(categoryString);
  }
  static calculatePrice(website){
    var itemPrice = this.price;
    var category=this.category;
    var itemTax = itemPrice * WEBSITES[website].TAX; // Thuế tại Mỹ
    var itemPriceAfterTax = itemPrice + itemTax; // Giá Sau Thuế
    //console.log("tax: " + itemTax + " (" + WEBSITES[website].TAX * 100 + "%)");
  
    var itemMoon = itemPriceAfterTax * (itemPriceAfterTax < 300 ? 0.07 : 0.05); // Công mua tính theo Giá Sau Thuế
    //console.log("moon: " + itemMoon);
  
    var itemWeight = Math.ceil(this.weight * 10) / 10;
    var itemShip = itemWeight * CATEGORIES[category].SHIP; // Giá ship theo cân nặng
    //console.log("ship: $" + CATEGORIES[category].SHIP + "/kg x " + itemWeight + "kg");
  
    var itemPriceExtra =
      CATEGORIES[category].EXTRA +
      (itemPrice >= CATEGORIES[category].PRICEANCHOR
        ? CATEGORIES[category].PRICEEXTRA
        : 0); /// Phụ thu theo cái
    //console.log("extra: " + CATEGORIES[category].EXTRA);
  
    var itemHQEXTRA =
      itemPrice *
      (itemPrice >= CATEGORIES[category].HQANCHOR
        ? CATEGORIES[category].HQEXTRA
        : 0); // Phụ thu giá trị cao (HQANCHOR)
    //console.log("high price extra: " + itemHQEXTRA);
  
    var itemTotal =
      itemPrice > 0
        ? itemPriceAfterTax + itemMoon + itemShip + itemPriceExtra + itemHQEXTRA
        : 0;
    //console.log("total: " + itemTotal);
    return itemTotal;
  }  
  static toVND(price){
    var priceNew = Math.ceil((price * RATE_USD_VND) / 5000) * 5000; //Làm tròn lên 5000  
    return num.formatMoney(0, '.', ',')+" VND"; // Thêm VND vào
  }
}


// Đổi USD sang VND, làm tròn 5000
function toVND(price){
  var priceNew = Math.ceil((price * RATE_USD_VND) / 5000) * 5000; //Làm tròn lên 5000  
  return formatMoney(priceNew)+" VND"; // Thêm VND vào
}

// Chuyển đổi dạng Number ra Currency: 1200000 => 1,200,000
function formatMoney(num){
  return num.formatMoney(0, '.', ',');
}

// Kiểm tra keyword có tồn tại trong array include và không tồn tại trong exclude
// checkkeyword(string,array,array)
function checkKeyword(keyString, include, exclude){
  
  for (var i = 0; i < include.length; i++) {
    if (keyString.indexOf(include[i]) >= 0) {
      for (var j = 0; j < exclude.length; j++) {
        if (keyString.indexOf(exclude[j]) >= 0) {
          return false;
        }
      }
      return true;
    }
  }
  return false;
}

// Tính giá USD tổng dựa trên [tên website, giá web, cân nặng, danh mục], return int
function calculateMoonPrice(website, item){
  var itemPrice = item.price;
  var category=item.category;
  var itemTax = itemPrice * WEBSITES[website].TAX; // Thuế tại Mỹ
  var itemPriceAfterTax = itemPrice + itemTax; // Giá Sau Thuế
  //console.log("tax: " + itemTax + " (" + WEBSITES[website].TAX * 100 + "%)");

  var itemMoon = itemPriceAfterTax * (itemPriceAfterTax < 300 ? 0.07 : 0.05); // Công mua tính theo Giá Sau Thuế
  //console.log("moon: " + itemMoon);

  var itemWeight = Math.ceil(item.weight * 10) / 10;
  var itemShip = itemWeight * CATEGORIES[category].SHIP; // Giá ship theo cân nặng
  //console.log("ship: $" + CATEGORIES[category].SHIP + "/kg x " + itemWeight + "kg");

  var itemPriceExtra =
    CATEGORIES[category].EXTRA +
    (itemPrice >= CATEGORIES[category].PRICEANCHOR
      ? CATEGORIES[category].PRICEEXTRA
      : 0); /// Phụ thu theo cái
  //console.log("extra: " + CATEGORIES[category].EXTRA);

  var itemHQEXTRA =
    itemPrice *
    (itemPrice >= CATEGORIES[category].HQANCHOR
      ? CATEGORIES[category].HQEXTRA
      : 0); // Phụ thu giá trị cao (HQANCHOR)
  //console.log("high price extra: " + itemHQEXTRA);

  var itemTotal =
    itemPrice > 0
      ? itemPriceAfterTax + itemMoon + itemShip + itemPriceExtra + itemHQEXTRA
      : 0;
  //console.log("total: " + itemTotal);
  return itemTotal;
}
function printMoonPrice(item){
  // var itemText = '[Auto Reply] ';
  // if (item.totalString ==""){
  //   itemText += 'Ko xác định được giá sản phẩm. Vui lòng liên hệ để được báo giá chính xác.';
  // }
  // else{
  //   itemText += 'Giá của Moon: '+ item.totalString +'.\n';
  //   if ((item.weight===0 && CATEGORIES[item.category].SHIP!==0) || item.category==='UNKNOWN')
  //     // Nếu ko có cân nặng và thuộc danh mục có ship,hoặc ko có danh mục (unknown) thì thông báo "cân sau"
  //     itemText += 'Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về.';
  //   else
  //     itemText += 'Loại mặt hàng: ' + CATEGORIES[item.category].NAME +'.\n'+ CATEGORIES[item.category].NOTE +'.\n'
  //     +'(Giá tham khảo, vui lòng liên hệ để được báo giá chính xác)';
  // }

  var response;
  if (item.totalString ==""){
    response= {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Ko xác định được giá sản phẩm",
            "subtitle": "Vui lòng chat với Moon để được báo giá chính xác",
            "buttons": [
              {
                "type": "postback",
                "payload": "chat",
                "title": "Chat với Moon",
              }
            ],
          }]
        }
      }
    }
  }
  else{
    var itemTitle, itemSubtitle;
    itemTitle='[Auto] Giá dự kiến: ' + item.totalString;
    //itemTitle+='(Giá tham khảo, vui lòng liên hệ để được báo giá chính xác)';
    // Nếu ko có cân nặng và thuộc danh mục có ship,hoặc ko có danh mục (unknown) thì thông báo "cân sau"
    if ((item.weight===0 && CATEGORIES[item.category].SHIP!==0) || item.category==='UNKNOWN'){
      itemSubtitle = 'Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về';
    }
    else{
      itemSubtitle = 'Đã bao gồm ' + CATEGORIES[item.category].NOTE + ' mặt hàng ' + CATEGORIES[item.category].NAME;      
    };
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": itemTitle,
            "subtitle": itemSubtitle,
            "buttons": [
              {
                "type": "postback",
                "payload": "chat",
                "title": "Chat với Moon",
              }
            ],
          }]
        }
      }
    }
  }
  return response;
}


// Lấy variable có sẵn trên website
// function retrieveWebsiteVariables(variables) {
//   var ret = {};

//   var scriptContent = "";
//   for (var i = 0; i < variables.length; i++) {
//     var currVariable = variables[i];
//     scriptContent +=
//       "if (typeof " +
//       currVariable +
//       " !== 'undefined') document.body.setAttribute('tmp_" +
//       currVariable +
//       "', JSON.stringify(" +
//       currVariable +
//       "));\n";
//   }

//   var script = document.createElement("script");
//   script.id = "tmpScript";
//   script.appendChild(document.createTextNode(scriptContent));
//   (document.body || document.head || document.documentElement).appendChild(
//     script
//   );

//   for (var i = 0; i < variables.length; i++) {
//     var currVariable = variables[i];
//     ret[currVariable] = JSON.parse(
//       document.body.getAttribute("tmp_" + currVariable)
//     );
//     document.body.removeAttribute("tmp_" + currVariable);
//   }

//   document.getElementById("tmpScript").remove();

//   return ret;
// }
