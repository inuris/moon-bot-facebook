const htmlparser     = require("htmlparser2");
const request        = require("request-promise");

// Data JSON
const DATA           = require('./data.js');
const RATE           = DATA.RATE;
const CATEGORIES     = DATA.CATEGORIES;
const IGNORE_WEBSITES= DATA.IGNORE_WEBSITES;
const WEBSITES       = DATA.WEBSITES;

// Formatter dùng để format string VND, number...
const Formatter = require('./formatter.js').Formatter;

// Parser dùng để lấy element từ HTML DOM
const Parser = require('./htmlparser.js').Parser;

const Product = require('./product.js');
const Category= Product.Category;
const Weight  = Product.Weight;
const Price   = Product.Price;



class Website{
  constructor(url){    
    var found=false;
    var isUrl=false;
    var isIgnored=false;
    var reg=/((?:(?:http|https):\/\/)?(?:\w*\.\w+\.\w+)(?:\.\w+)?)+([\w-;,.\/?%&=]*)?/i;
    var tempWeb = null;
    var tempUrl = "";
    var tempDomain="";
    // Kiểm tra trong text có URL ko
    var tempMatch = url.match(reg); 
    if (tempMatch!==null){
      isUrl=true;
      tempUrl = tempMatch[0]; // Lấy ra url trong đoạn text
      if (Formatter.checkKeyword(tempMatch[0],IGNORE_WEBSITES) === false){
        for (let i in WEBSITES){             
          if(tempMatch[0].indexOf(WEBSITES[i].MATCH)>=0){
            tempUrl = tempMatch[0]; // full url
            tempDomain = tempMatch[1]; // chỉ có domain
            if (tempDomain.indexOf('http')!==0)
              tempDomain="https://"+tempDomain;
            tempWeb = WEBSITES[i];
            break;
          }          
        }
      }
      else{
        isIgnored=true;
      }
    }
    if (tempWeb!==null){
      found = true;            
    }
    this.domain     =  tempDomain;  // chỉ có domain
    this.url        =  tempUrl;     // full url
    this.isUrl      =  isUrl;       // true false : có phải Url ko
    this.isIgnored  =  isIgnored;   // true false : có trong list IGNORE ko
    this.att        =  tempWeb;     // các thuộc tính lấy từ WEBSITES
    this.htmlraw    =  "";
    this.found      =  found;       // true false: có tìm thấy đúng website trong list hay ko
  }
  setDom(htmlraw){
    this.htmlraw=htmlraw;
  }
  static async getItem(website, recentitem){                     
    var requestOptions = {
        method: "GET",
        url: website.url,
        gzip: true,
        jar: true,
        headers:{'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'}
    };
    // Nếu website cần Cookie thì set
    if (website.att.COOKIE !== undefined){
        requestOptions.headers.cookie = request.cookie(website.att.COOKIE)
    }
    try {
      const body = await request(requestOptions);
      // Đưa html raw vào website
      website.setDom(body);
      var item = new Item(website, recentitem);
      return item;
    }
    catch (err) {
      return err;
    }
  }
  
  static getAvailableWebsite(){
    var listweb = "";
    for (let web in WEBSITES){             
      if(WEBSITES[web].NAME !== undefined){
        listweb += WEBSITES[web].NAME + ", "
      }
    }
    listweb = listweb.substr(0, listweb.length-2);
    return listweb;
  }
  
}
class Item{
  constructor(website, recentitem){
    var handler = new htmlparser.DomHandler((error, dom) => {
      if (error) {
        console.log(error);
      } else {
        var myParser = new Parser(dom);

        var price=new Price();
        // Tìm giá trên HTML (có priceBlock)
        if (website.att.PRICEBLOCK!==undefined){
          var priceString = myParser.getText(website.att.PRICEBLOCK);
          //console.log(priceString);
          price.setPrice(priceString);          
        }
        // Tìm giá trên JSON (ko có priceBlock, chỉ có JSONBlock)
        else if (website.att.JSONBLOCK!==undefined){
          var priceString = myParser.getJSON(website.att.JSONBLOCK); 
          price.setPrice(priceString);
        }

        var shipping=new Price();
        if (website.att.SHIPPINGBLOCK!==undefined){
          var shippingString = myParser.getText(website.att.SHIPPINGBLOCK);
          var regShipping=/\d+.?\d*/gm;
          shipping.setPrice(shippingString, regShipping);
        }
        
        var redirect="";
        if (website.att.REDIRECT!==undefined){
          var newurl = myParser.getLink(website.att.REDIRECT);
          if (newurl!=="")
            redirect = website.domain + newurl;            
        }

        var weight = new Weight();
        var category=new Category();
        var recenturl;
        // recentitem chỉ có khi vào trang redirect rồi
        if (recentitem!==undefined){ 
          // Nếu đã có thông tin ở trang trước thì ko cần lấy thông tin ở trang redirect
          if (recentitem.weight.kg!==0)
            weight = recentitem.weight;
          if (recentitem.category.string!==0)
            category = recentitem.category;
          if (recentitem.weburl !=="")
            website.url = recentitem.weburl;
        }
        // Nếu cần lấy Category & Weight từ chung 1 data table thì define DETAILBLOCK
        else if (website.att.DETAILBLOCK!==undefined){
          // detailArray gồm nhiều row trong table chứa Detail
          var detailArray = myParser.getTextArray(website.att.DETAILBLOCK);
          weight.setWeight(detailArray,website.att.WEIGHTCONDITION);          
          category.setCategory(detailArray, website.att.CATEGORYCONDITION); 
        }
        else{ // các trang thông thường sẽ có category nằm riêng, weight nằm riêng
          if (website.att.CATEGORYBLOCK!==undefined){
            var categoryString = myParser.getTextArray(website.att.CATEGORYBLOCK);
            category.setCategory(categoryString); 
          }
          if (website.att.WEIGHTBLOCK!==undefined){
            var weightString = myParser.getTextArray(website.att.WEIGHTBLOCK);
            weight.setWeight(weightString); 
          }
        }
        
        this.weburl = website.url;
        this.webatt = website.att; // Thuế tại Mỹ của từng web
        
        //console.log(price);
        this.price=price; // Giá item
        this.shipping=shipping; // Giá ship của web
        this.priceshipping= Price.getPriceShipping(price, shipping); // Tổng giá item và ship

        //console.log(redirect);
        this.redirect=redirect;
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
    var itemTax = itemPrice * this.webatt.TAX; // Thuế tại Mỹ
    var itemPriceAfterTax = itemPrice + itemTax; // Giá Sau Thuế
    //console.log("tax: " + itemTax + " (" + this.webatt.TAX * 100 + "%)");
  
    var itemMoon = itemPriceAfterTax * (itemPriceAfterTax < 300 ? 0.07 : 0.05); // Công mua tính theo Giá Sau Thuế
    //console.log("moon: " + itemMoon);
  
    var itemWeight = this.weight.kg;
    var itemShip = itemWeight * this.category.att.SHIP; // Giá ship theo cân nặng
    //console.log("ship: $" + this.category.att.SHIP + "/kg x " + itemWeight + "kg");
  
    var itemPriceExtra = this.category.att.EXTRA +
      (itemPrice >= this.category.att.PRICEANCHOR
        ? this.category.att.PRICEEXTRA
        : 0); /// Phụ thu theo cái
    //console.log("extra: " + category.att.EXTRA);
  
    var itemHVEXTRA =
      itemPrice *
      (itemPrice >= this.category.att.HVANCHOR
        ? this.category.att.HVEXTRA
        : 0); // Phụ thu giá trị cao (HVANCHOR)
    //console.log("high price extra: " + itemHVEXTRA);
  
    var itemTotal =
      itemPrice > 0
        ? itemPriceAfterTax + itemMoon + itemShip + itemPriceExtra + itemHVEXTRA
        : 0;
    //console.log("total: " + itemTotal);
    return itemTotal;
  }
  // Xuất log gồm log.type (error/success) và log.content dạng string
  toLog(){
    let logContent =`
URL : ${this.weburl}
PRICE : ${this.price.string} ~ ${this.totalString}
SHIPPING : ${this.shipping.value} ~ ${this.shipping.string}
WEIGHT : ${this.weight.string} ~ ${this.weight.kg}kg
CATEGORY : ${this.category.att.ID}
CATEGORYSTRING : ${this.category.string}`;
    let logType='success';
    if (this.webatt.DETAILBLOCK!== undefined){
      if (this.weight.kg===0 || this.category.att.ID ==="UNKNOWN")
      logType='error';
    }
    if (this.price.value===0)
      logType='error';
    let log = {
      content: logContent,
      type: logType
    }
    console.log(logContent);
    return log;
  }
  // Xuất ra string báo giá và chú thích
  toText(){
    var response;
    // Nếu ko xác định dc giá
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
  
  // Xuất ra json theo format response của FB
  // Dùng để auto reply
  // badgeImageUrl là hình cover của response
  toFBResponse(badgeImageUrl){  
    var response;
    // Nếu ko xác định dc giá
    if (this.totalString ==""){
      response= {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": "Ko xác định được giá sản phẩm",
              "image_url": badgeImageUrl,
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
      itemTitle='Giá tham khảo: ' + this.totalString;
      // Nếu ko có cân nặng và thuộc danh mục có ship,hoặc ko có danh mục (unknown) thì thông báo "cân sau"
      if ((this.weight.kg===0 && this.category.att.SHIP!==0) || this.category.att.ID==='UNKNOWN'){
        itemSubtitle = 'Phí ship tính theo cân nặng, sẽ được thông báo sau khi hàng về';
      }
      else{
        itemSubtitle = 'Đã bao gồm ' + this.category.att.NOTE + ' mặt hàng ' + this.category.att.NAME;     
      };
      response =  {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [{
              "title": itemTitle,
              "subtitle": itemSubtitle,
              "image_url": badgeImageUrl,
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
  // Xuất ra json theo format response của FB
  // Dùng để gửi admin duyệty
  // gửi thông tin báo giá kèm theo button cho phép trả lời nhanh
  toFBAdmin(senderid,sendername){  
    var response;
    let responseContent =`${sendername} gửi link ${this.weburl}
- Giá web: ${this.price.string}`;
    if (this.shipping.value>0) {
    responseContent += `
- Ship: ${this.shipping.value}`;
    }
    if ((this.weight.kg===0 && this.category.att.SHIP!==0) || this.category.att.ID==='UNKNOWN'){
      responseContent += "\n- Chưa có cân nặng";
    }
    else
      responseContent += `
- Cân: ${this.weight.kg}kg
- Mặt hàng ${this.category.att.NAME}`;
    let payloadContent_1=`send|${senderid}|Dạ giá sp này là ${this.totalString}`;
    let payloadContent_2=`send|${senderid}|Cái này là ${this.totalString}`;
    response =  {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type":"button",
          "text":responseContent,
          "buttons":[
            {
              "type":"postback",
              "payload": payloadContent_1,
              "title": "Dạ, " + this.totalString
            },
            {
              "type":"postback",
              "payload": payloadContent_2,
              "title": "Cái này " + this.totalString
            }
          ]
        }
      }
    }  
    return response;
  }
  // chuyển giá (float)price sang VND theo RATE, thêm đơn vị VND
  toVND(price){    
    var rate = this.webatt.RATE || RATE['USD'];
    var priceNew = Math.ceil((price * rate) / 5000) * 5000; //Làm tròn lên 5000 
    return Formatter.formatMoney(priceNew, 0, ',', '.')+"đ"; // Thêm VND vào
  }
}
module.exports.Website=Website;