"use strict"
const select = require("soupselect-update").select;
const htmlparser = require("htmlparser2");
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0.1,
    HQANCHOR: 500,
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
    HQEXTRA: 0,
    HQANCHOR: 500,
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
    ID: "PHONE_TABLET_LAPTOP",
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
    ID: "CONSOLE",
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
    ID: "CAMERA",
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
    ID: "GOLF",
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
    ID: "DIGITAL",
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
    ID: "AUTOMOTIVE",
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
    ID: "MILK",
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
    ID: "CLOTHES",
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
    ID: "GENERAL",
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
    ID: "UNKNOWN",
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
    MATCH: "aldoshoes"
  },
  AMAZON: {
    TAX: 0.083,
    MATCH: "amazon.com",
    DETAILBLOCK: [
      "#productDetails_detailBullets_sections1 tr",
      "#detailBulletsWrapper_feature_div li",
      "#detailBullets_feature_div span.a-list-item",
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
    MATCH: "bathandbodyworks"
  },
  BHCOSMETICS: {
    TAX: 0,
    MATCH: "bhcosmetics"
  },
  BHPHOTOVIDEO: {
    TAX: 0,
    MATCH: "bhphotovideo.com",
    PRICEBLOCK: [
      ".ypYouPay",
      ".itc-you-pay .itc-you-pay-price"
    ]
  },
  CARTERS: {
    TAX: 0.083,
    MATCH: "carters",
    PRICEBLOCK:
      '.product-price-container .price-sales-usd'
  },
  CLINIQUE: {
    TAX: 0.083,
    MATCH: "clinique"
  },
  FOREVER21: {
    TAX: 0.083,
    MATCH: "forever21",
    PRICEBLOCK: ['#ItemPrice']
  },
  FRAGRANCENET: {
    TAX: 0,
    MATCH: "fragrancenet.com"
  },
  GAP: {
    TAX: 0.083,
    MATCH: "gap.com"
  },
  HM: {
    TAX: 0.083,
    MATCH: "hm.com"
  },
  JOMASHOP: {
    TAX: 0,
    MATCH: "jomashop.com"
  },
  LOFT: {
    TAX: 0.083,
    MATCH: "loft.com"
  },
  NINEWEST: {
    TAX: 0.083,
    MATCH: "ninewest.com"
  },
  OLDNAVY: {
    TAX: 0.083,
    MATCH: "oldnavy.com"
  },
  OSHKOSH: {
    TAX: 0.083,
    MATCH: "oshkosh.com"
  },
  RALPHLAUREN: {
    TAX: 0.083,
    MATCH: "ralphlauren.com"
  },
  RUELALA: {
    TAX: 0,
    MATCH: "reulala.com"
  },
  THEBODYSHOP: {
    TAX: 0.083,
    MATCH: "thebodyshop.com"
  },
  VICTORIASSECRET: {
    TAX: 0.083,
    MATCH: "victoriassecret.com"
  },
  WALGREENS: {
    TAX: 0.083,
    MATCH: "walgreens.com"
  },
  WALMART: {
    TAX: 0,
    MATCH: "walmart.com",
    PRICEBLOCK: [
      ".prod-PriceHero .price-group"
    ]
  },
  VITACOST: {
    TAX: 0,
    MATCH: "vitacost.com"
  },
  ZULILY: {
    TAX: 0,
    MATCH: "zulily.com"
  }
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
class Parser{
  constructor(dom){
    this.dom=dom;
  }
  getText(blockElementArray, index = 0){
    if (blockElementArray!==undefined)      
      for (var i = 0; i < blockElementArray.length; i++) {          
          var text = select(this.dom, blockElementArray[i]);
          //console.log(htmlparser.DomUtils.getText(text));
          if (text.length>0) {        
            return htmlparser.DomUtils.getText(text[index]);
          }
      }  
    return "";
  }
  getTextArray(blockElementArray){
    var textArray=[];
    if (blockElementArray!==undefined)
    for (var i = 0; i < blockElementArray.length; i++) {
      // Nguyên table data
      //console.log(blockElementArray[i]);
      var textTable = select(this.dom, blockElementArray[i]);  
      
      for (var e of textTable){
        if (e.type === "tag") {
          //row là 1 dòng gồm có 5 element: <td>Weight</td><td>$0.00</td>
          var row = e.children;
          try{
            var rowText=htmlparser.DomUtils.getText(row).replace(/\s+/gm," ")
                                                        .trim()
                                                        .toLowerCase();            
            textArray.push(rowText);
          }
          catch (err) {}
        }
      }
      if (textArray.length>0)
        return textArray;
    }  
    return null;
  }
}
class AmazonCategory{
  constructor(){
    this.string = "";
    this.att = CATEGORIES["UNKNOWN"];
  }
  setCategory(detailArray){
    var found=false;
    var catString="";
    var catType="GENERAL"; 
    if (detailArray!== null){
      for(var i =0;i<detailArray.length;i++){
        if (detailArray[i].indexOf("sellers rank")>=0){ 
          catString=detailArray[i].replace(/\s{2,}|\..+ {.+}|see top 100| in |(amazon )?best sellers rank:?|#\d*,?\d*/gi, "|");
          found=true;        
          // Query từng KEYWORD trong category
          for (var cat in CATEGORIES) {
            if (
              this.checkKeyword(
                catString,
                CATEGORIES[cat].KEYWORD,
                CATEGORIES[cat].NOTKEYWORD
              ) === true
            ){
              catType = cat;            
              break;
            }          
          }
        }            
      }
    }
    if (found===false){
      catType= "UNKNOWN";
    }
    this.string= catString;
    this.att = CATEGORIES[catType];
  }  
  // Kiểm tra keyword có tồn tại trong array include và không tồn tại trong exclude
  // checkkeyword(string,array,array)
  checkKeyword(keyString, include, exclude){  
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
class AmazonWeight{
  constructor(){ 
    this.current="";
    this.kg=0;
    this.unit="";
  }
  setWeight(detailArray){
    var current= "",
        kg= 0,
        unit= "";
    //console.log(detailArray);
    var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/; 
    if (detailArray!== null)
    for (var i = 0; i < detailArray.length; i++) {
      if (detailArray[i].indexOf("weight") >= 0 || detailArray[i].indexOf("dimensions") >= 0){
        var weightReg = detailArray[i].match(reg); // ["2.6 pound", "2.6", " pound", index: 16, input: "shipping weight	2.6 pounds"
        //console.log(weightReg);
        if (weightReg !== null) {
          var weightString = weightReg[0];
          var weight = parseFloat(weightReg[1]);
          var weightKg = weight;
          
          var weightUnit = weightReg[2];
          if (weightUnit.indexOf("ounce") >= 0 || weightUnit.indexOf("oz") >= 0)
            weightKg = weight / 35.274;
          else if (weightUnit.indexOf("pound") >= 0) weightKg = weight / 2.2;
          // Tìm weight lớn nhất
          if (
            kg < weightKg ||
            detailArray[i].indexOf("shipping weight") >= 0
          ) {
            current = weightString;
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
  constructor(){
    this.string = "";
    this.value = 0;
  }
  setPrice(priceString, reg){
    this.string = priceString;
    var tempString = priceString.replace(/\s+/gm," ")
                                .trim()        
                                .replace(/\$\s*|,/gm, "")
                                .replace(" ", ".");
    if (reg !== undefined){      
        var tempMatch = tempString.match(reg)
        if (tempMatch!=null){
          tempString=tempMatch[0];
        }   
    }    
    this.value=(tempString!==""?parseFloat(tempString):0);
  }
  static getPriceShipping(price, ship){
    return price.value + ship.value;
  }
}
class Website{
  constructor(url){    
    this.found=false;
    var reg=/(?:(?:http|https):\/\/)?(\w*\.\w+\.\w+(?:\.\w+)?)+([\w- ;,./?%&=]*)?/i;
    var tempWeb = null;
    var tempUrl = "";
    var tempMatch = url.match(reg); 
    if (tempMatch!==null){
      for (var web in WEBSITES){             
        if(tempMatch[1].indexOf(WEBSITES[web].MATCH)>=0){
          tempUrl = tempMatch[0];          
          tempWeb = WEBSITES[web];
          break;
        }          
      }
    }
    if (tempWeb!==null){
      this.url=tempUrl;
      this.att=tempWeb;
      this.htmlraw="";
      this.found=true;
    }        
  }
  setHtmlRaw(htmlraw){
    this.htmlraw=htmlraw;
  }
}
class Item{
  constructor(website){     
    var handler = new htmlparser.DomHandler((error, dom) => {
      if (error) {
        console.log(error);
      } else {
        var myparser = new Parser(dom);

        var price=new Price();
        if (website.att.PRICEBLOCK!==undefined){
          var priceString = myparser.getText(website.att.PRICEBLOCK); 
          price.setPrice(priceString);
        }

        var shipping=new Price();
        if (website.att.SHIPPINGBLOCK!==undefined){
          var shippingString = myparser.getText(website.att.SHIPPINGBLOCK);
          var regShipping=/\d+.?\d*/gm;
          shipping.setPrice(shippingString, regShipping);
        }
        
        var weight = new AmazonWeight();
        var category=new AmazonCategory();  
        if (website.att.DETAILBLOCK!==undefined){
          // detailArray gồm nhiều row trong table chứa Detail
          var detailArray = myparser.getTextArray(website.att.DETAILBLOCK);
          weight.setWeight(detailArray);          
          category.setCategory(detailArray); 
        }
               
              
        this.webtax = website.att.TAX; // Thuế tại Mỹ của từng web
        this.webrate = website.att.RATE!==undefined?RATE[website.att.RATE]:RATE['USD']; // Quy đổi ngoại tệ
        this.price=price; // Giá item
        this.shipping=shipping; // Giá ship của web
        this.priceshipping= Price.getPriceShipping(price, shipping); // Tổng giá item và ship
        this.weight=weight;          
        this.category=category; 

        this.total =  this.calculatePrice();
        this.totalString=(this.total===0?"":this.toVND(this.total));;
      }
    });
    var parser = new htmlparser.Parser(handler, { decodeEntities: true });
    parser.parseComplete(website.htmlraw);  
  }
  calculatePrice(){
    var itemPrice = this.priceshipping;
    var category= this.category;
    var itemTax = itemPrice * this.webtax; // Thuế tại Mỹ
    var itemPriceAfterTax = itemPrice + itemTax; // Giá Sau Thuế
    //console.log("tax: " + itemTax + " (" + this.webtax * 100 + "%)");
  
    var itemMoon = itemPriceAfterTax * (itemPriceAfterTax < 300 ? 0.07 : 0.05); // Công mua tính theo Giá Sau Thuế
    //console.log("moon: " + itemMoon);
  
    var itemWeight = Math.ceil(this.weight.kg * 10) / 10;
    var itemShip = itemWeight * category.att.SHIP; // Giá ship theo cân nặng
    //console.log("ship: $" + category.att.SHIP + "/kg x " + itemWeight + "kg");
  
    var itemPriceExtra =
    category.att.EXTRA +
      (itemPrice >= category.att.PRICEANCHOR
        ? category.att.PRICEEXTRA
        : 0); /// Phụ thu theo cái
    //console.log("extra: " + category.att.EXTRA);
  
    var itemHQEXTRA =
      itemPrice *
      (itemPrice >= category.att.HQANCHOR
        ? category.att.HQEXTRA
        : 0); // Phụ thu giá trị cao (HQANCHOR)
    //console.log("high price extra: " + itemHQEXTRA);
  
    var itemTotal =
      itemPrice > 0
        ? itemPriceAfterTax + itemMoon + itemShip + itemPriceExtra + itemHQEXTRA
        : 0;
    //console.log("total: " + itemTotal);
    return itemTotal;
  }
  toText(){
    var response;
    if (this.totalString ==""){
      response= "Ko xác định được giá sản phẩm. Vui lòng chat với Moon để được báo giá chính xác."
    }
    else{
      var itemTitle, itemSubtitle;
      itemTitle='Giá dự kiến: ' + this.totalString+".";
      // Nếu ko có cân nặng và thuộc danh mục có ship,hoặc ko có danh mục (unknown) thì thông báo "cân sau"
      if ((this.weight.kg===0 && this.category.att.SHIP!==0) || this.category.att.ID==='UNKNOWN'){
        itemSubtitle = ' Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về.';
      }
      else{
        itemSubtitle = ' Đã bao gồm ' + this.category.att.NOTE + ' mặt hàng ' + this.category.att.NAME + '.';     
      };
      response = itemTitle+itemSubtitle;
    }
    return response;
  }
  toFBResponse(){
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
    if (this.totalString ==""){
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
      itemTitle='[Auto] Giá dự kiến: ' + this.totalString;
      // Nếu ko có cân nặng và thuộc danh mục có ship,hoặc ko có danh mục (unknown) thì thông báo "cân sau"
      if ((this.weight.kg===0 && this.category.att.SHIP!==0) || this.category.att.ID==='UNKNOWN'){
        itemSubtitle = 'Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về';
      }
      else{
        itemSubtitle = 'Đã bao gồm ' + this.category.att.NOTE + ' mặt hàng ' + this.category.att.NAME;     
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
  toVND(price){
    var priceNew = Math.ceil((price * this.webrate) / 5000) * 5000; //Làm tròn lên 5000  
    return priceNew.formatMoney(0, '.', ',')+" VND"; // Thêm VND vào
  }
}
module.exports.Website=Website;
module.exports.Item=Item;