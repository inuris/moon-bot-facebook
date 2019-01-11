const select = require("soupselect-update").select;
const htmlparser = require("htmlparser2");
const logger = require('./logger.js').logger;
const RATE_USD_VND = 24000;
const CATEGORIES = {
  GLASSES: {
    NAME: "GLASSES",
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
    NAME: "BELT",
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
    NAME: "WATCH",
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
    NAME: "JEWELRY",
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
    NAME: "BIKE",
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
    NAME: "KITCHENAPPLIANCE",
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
    NAME: "DVD",
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
    NAME: "CHEMICAL_VITAMIN",
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
    NAME: "PHONE_TABLET_LAPTOP",
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
    NAME: "CONSOLE",
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
    NAME: "CAMERA",
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
    NAME: "GOLF",
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
    NAME: "DIGITAL",
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
    NAME: "AUTOMOTIVE",
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
    NAME: "MILK",
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
    NAME: "CLOTHES",
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
    NAME: "GENERAL",
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
    NAME: "UNKNOWN",
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
    MATCH: "aldoshoes",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  AMAZON: {
    TAX: 0.083,
    MATCH: "amazon",
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
    MATCH: "bathandbodyworks",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  BHCOSMETICS: {
    TAX: 0,
    MATCH: "bhcosmetics",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  CARTERS: {
    TAX: 0.083,
    MATCH: "carters",
    DETAILBLOCK: "",
    PRICEBLOCK:
      'document.getElementsByClassName("product-price-container desktopvisible")[0].getElementsByClassName("price-sales-usd")[0]',
    SHIPPINGBLOCK:
      ''
  },
  CLINIQUE: {
    TAX: 0.083,
    MATCH: "clinique",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  FOREVER21: {
    TAX: 0.083,
    MATCH: "forever21",
    DETAILBLOCK: "",
    PRICEBLOCK: ['#ItemPrice'],
    SHIPPINGBLOCK: ''
  },
  FRAGRANCENET: {
    TAX: 0,
    MATCH: "fragrancenet",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  GAP: {
    TAX: 0.083,
    MATCH: "www.gap.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  HM: {
    TAX: 0.083,
    MATCH: "www.hm.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  JOMASHOP: {
    TAX: 0,
    MATCH: "www.jomashop.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  LOFT: {
    TAX: 0.083,
    MATCH: "www.loft.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  NINEWEST: {
    TAX: 0.083,
    MATCH: "www.ninewest.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  OLDNAVY: {
    TAX: 0.083,
    MATCH: "www.oldnavy.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  OSHKOSH: {
    TAX: 0.083,
    MATCH: "www.oshkosh.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  RALPHLAUREN: {
    TAX: 0.083,
    MATCH: "www.ralphlauren.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  RUELALA: {
    TAX: 0,
    MATCH: "www.reulala.com",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  THEBODYSHOP: {
    TAX: 0.083,
    MATCH: "www.thebodyshop.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  TOYSRUS: {
    TAX: 0.083,
    MATCH: "www.toysrus.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  BABIESRUS: {
    TAX: 0.083,
    MATCH: "babiesrus.toysrus.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  VICTORIASSECRET: {
    TAX: 0.083,
    MATCH: "www.victoriassecret.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  WALGREENS: {
    TAX: 0.083,
    MATCH: "www.walgreens.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  VITACOST: {
    TAX: 0,
    MATCH: "www.vitacost.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  },
  ZULILY: {
    TAX: 0,
    MATCH: "www.zulily.com",
    DETAILBLOCK: "",
    PRICEBLOCK: "",
    SHIPPINGBLOCK: ""
  }
};
module.exports = {
  Website,
  Item
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
    for (var i = 0; i < blockElementArray.length; i++) {
        var text = select(this.dom, blockElementArray[i]);   
        //console.log(htmlparser.DomUtils.getText(text));
        if (text != null) {        
          return htmlparser.DomUtils.getText(text[index]);
        }
    }  
    return "";
  }
  getTextArray(blockElementArray){
    var textArray=[];
    for (var i = 0; i < blockElementArray.length; i++) {
      // Nguyên table data
      var textTable = select(this.dom, blockElementArray[i]);   
      for (var e of detailTable){
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
  constructor(detailArray){
    var found=false;
    for(var i =0;i<detailArray.length;i++){
      if (detailArray[i].indexOf("sellers rank")>=0){
        this.string=detailArray[i].replace(/\s{2,}|\..+ {.+}|see top 100| in|(amazon )*best sellers rank:|#\d*,?\d*/gm, "");;
        found=true;
        // Query từng KEYWORD trong category
        for (var cat in CATEGORIES) {
          if (
            checkKeyword(
              detailArray[i],
              CATEGORIES[cat].KEYWORD,
              CATEGORIES[cat].NOTKEYWORD
            ) === true
          ){
            this.category = CATEGORIES[cat];            
            break;
          }          
        }
        this.category= CATEGORIES["GENERAL"];
      }            
    }
    if (found===false){
      this.string="";
      this.category= CATEGORIES["UNKNOWN"];
    }    
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
  constructor(detailArray){
    var current= "",
      kg= 0,
      unit= "";
    //console.log(detailArray);
    var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/;    
    for (var i = 0; i < detailArray.length; i++) {
      if (detailArray[i].indexOf("weight") >= 0 || detailArray[i].indexOf("dimensions") >= 0){
        var weightReg = detailArray[i].match(reg); // ["2.6 pound", "2.6", " pound", index: 16, input: "shipping weight	2.6 pounds"
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
            detailArray[i].indexOf("shipping weight") >= 0
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
  constructor(priceString, reg){
    this.string = priceString;
    var tempString = priceString.replace(/\s+/gm," ")
                                .trim()        
                                .replace(/\$\s*|,/gm, "")
                                .replace(" ", ".");
    if (reg !== null){      
        var tempMatch = tempString.match(reg)
        if (tempMatch!=null){
          tempString=tempMatch[0];
        }   
    }
    this.value=parseFloat(tempString);
  }
  static getPriceShipping(price, ship){
    return price.value + ship.value;
  }
}
class Website{
  constructor(url){
    this.url=url;
    var reg=/^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/igm;
    var tempName="";
    var tempMatch = url.match(reg);
    if (tempMatch!==null){
      for (var web in WEBSITES){
        if(WEBSITES[web].MATCH.indexOf(tempMatch[1])>=0){
          tempName = web;
        }          
      }
    }
    if (tempName!==""){
      this.name=tempName;
      this.htmlraw="";

      this.priceBlock=WEBSITE[tempName].PRICEBLOCK;
      this.shippingBlock=WEBSITE[tempName].SHIPPINGBLOCK;
      this.detailBlock=WEBSITE[tempName].DETAILBLOCK;
    }        
  }
  setHtmlRaw(htmlraw){
    this.htmlraw=htmlraw;
  }
}
class Item{
  constructor(website){   
    if (website.name !==""){
      var handler = new htmlparser.DomHandler((error, dom) => {
        if (error) {
          console.log(error);
        } else {
          var myparser = new Parser(dom);
  
          var priceString = myparser.getText(website.priceBlock);        
          var price=new Price(priceString);
  
          var shippingString = myparser.getText(website.shippingBlock);
          var regShipping=/\d+.?\d*/gm;
          var shipping=new Price(shippingString, regShipping);
  
          this.price=price;
          this.shipping=shipping;
          this.priceshipping= Price.getPriceShipping(price, shipping);
  
          // detailArray gồm nhiều row trong table chứa Detail
          var detailArray = myparser.getTextArray(website.detailBlock);
          this.weight=new AmazonWeight(detailArray);
          this.category=new AmazonCategory(detailArray); 

          this.total=  calculatePrice();
          this.totalString=(this.total===0?"":this.toVND(item.total));;

          if (this.weight.value===0||item.category.NAME === "UNKNOWN"){
            logger.log('error','{\n"URL":"%s",\n"PRICE":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', url, this.priceshipping,this.weight.string,this.category.NAME,this.totalString,this.category.string);
          }
          else{
            logger.log('info','{\n"URL":"%s",\n"PRICE":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', url, this.priceshipping,this.weight.string,this.category.NAME,this.totalString,this.category.string);
          }
        }
      });
      var parser = new htmlparser.Parser(handler, { decodeEntities: true });
      parser.parseComplete(website.htmlraw);      
    }    
  }
  calculatePrice(){
    var itemPrice = this.priceshipping;
    var category= this.category;
    var itemTax = itemPrice * website.tax; // Thuế tại Mỹ
    var itemPriceAfterTax = itemPrice + itemTax; // Giá Sau Thuế
    //console.log("tax: " + itemTax + " (" + WEBSITES[website].TAX * 100 + "%)");
  
    var itemMoon = itemPriceAfterTax * (itemPriceAfterTax < 300 ? 0.07 : 0.05); // Công mua tính theo Giá Sau Thuế
    //console.log("moon: " + itemMoon);
  
    var itemWeight = Math.ceil(this.weight * 10) / 10;
    var itemShip = itemWeight * category.SHIP; // Giá ship theo cân nặng
    //console.log("ship: $" + CATEGORIES[category].SHIP + "/kg x " + itemWeight + "kg");
  
    var itemPriceExtra =
    category.EXTRA +
      (itemPrice >= category.PRICEANCHOR
        ? category.PRICEEXTRA
        : 0); /// Phụ thu theo cái
    //console.log("extra: " + CATEGORIES[category].EXTRA);
  
    var itemHQEXTRA =
      itemPrice *
      (itemPrice >= category.HQANCHOR
        ? category.HQEXTRA
        : 0); // Phụ thu giá trị cao (HQANCHOR)
    //console.log("high price extra: " + itemHQEXTRA);
  
    var itemTotal =
      itemPrice > 0
        ? itemPriceAfterTax + itemMoon + itemShip + itemPriceExtra + itemHQEXTRA
        : 0;
    //console.log("total: " + itemTotal);
    return itemTotal;
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
  toVND(price){
    var priceNew = Math.ceil((price * RATE_USD_VND) / 5000) * 5000; //Làm tròn lên 5000  
    return num.formatMoney(0, '.', ',')+" VND"; // Thêm VND vào
  }
}
