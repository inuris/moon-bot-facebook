module.exports = {
  getMoonPrice //getMoonPrice(url, htmlraw)
};
const moon = require("./moon.js");
const select = require("soupselect-update").select;
const htmlparser = require("htmlparser2");
const logger = require('./logger.js').logger;
// Danh sách các loại detail block của Amazon

// Lấy Giá web sau sale, return Float;
function getAmazonPrice(dom) {
  var priceString = "";
  var shippingString = "";
  var itemPrice = {
    price:0,
    priceString:""
  };
  // Duyệt các block chứa giá
  for (var i = 0; i < PRICEBLOCK.length; i++) {
    var itemPriceBlock = select(dom, PRICEBLOCK[i]);   
    //console.log(htmlparser.DomUtils.getText(itemPriceBlock));
    if (itemPriceBlock.length > 0) {        
      priceString = htmlparser.DomUtils.getText(itemPriceBlock[0])
        .replace(/\s+/gm," ")
        .trim()        
        .replace(/\$\s*|,/gm, "")
        .replace(" ", ".") // $33 99 => 33.99
      break;
    }
  }  
  
  // Duyệt các block chứa ship
  for (var i = 0; i < SHIPPINGBLOCK.length; i++) {
    var itemShippingBlock = select(dom, SHIPPINGBLOCK[i]); 
    if (itemShippingBlock.length > 0) {        
      var getShippingString = htmlparser.DomUtils.getText(itemShippingBlock[0]);
      if (getShippingString!==null)
      {
        var reg=/\d+.?\d*/gm;
        var shippingMatch = getShippingString.match(reg)
        if (shippingMatch!=null){
          shippingString=shippingMatch[0];      
          break;
        }
      }
    }
  }
  if (priceString !== "") {
    itemPrice.price = parseFloat(priceString) + (shippingString!==""?parseFloat(shippingString):0);
    itemPrice.priceString=priceString;
  }
  //console.log(itemPrice);
  return itemPrice;
}

// Lấy thông tin chung Detail (cân nặng + category) từ DOM theo Block, return {weight, category);
function getAmazonDetailString(dom, block) {
  var detailString = {
    weightArray: [],
    categoryString: ""
  };
  var detailTable = select(dom, block); // Element chứa info cân nặng
  
  for (var e of detailTable) {
    if (e.type === "tag") {
      var row = e.children; 
      // try{console.log(row.length);
      //    console.log(htmlparser.DomUtils.getText(row))}
      // catch(e){};
      // row là 1 dòng gồm có 5 element: <td>Weight</td><td>$0.00</td>
      try {
        var rowText=htmlparser.DomUtils.getText(row).trim().toLowerCase();
        if (
            rowText.indexOf("weight") >= 0 ||
            rowText.indexOf("dimensions") >= 0
          ) {
            detailString.weightArray.push(rowText.replace(/\s+/gm," ").trim());
            // Có dạng: 1.1 pounds
          }
          // Tìm từ "Sellers Rank" để add Category
          else if (rowText.indexOf("sellers rank") >= 0) {            
            detailString.categoryString += rowText;
          }
             
        // if (row[1].type === "tag" && row[3].type === "tag") {          
        //   // Tìm từ "Weight/Demensions" (1 số sp có weight nằm ở dimension)
        //   if (
        //     row[1].children[0].data.indexOf("Weight") >= 0 ||
        //     row[1].children[0].data.indexOf("Dimensions") >= 0
        //   ) {
        //     detailString.weight.push(
        //       row[3].children[0].data.trim().toLowerCase()
        //     );
        //     // Có dạng: 1.1 pounds
        //   }
        //   // Tìm từ "Sellers Rank" để add Category
        //   else if (row[1].children[0].data.indexOf("Sellers Rank") >= 0) {            
        //     detailString.category += htmlparser.DomUtils.getText(
        //       row[3].children
        //     )
        //       .trim()
        //       .toLowerCase();
        //   }
        // }
      } catch (err) {}
    }
  }
  detailString.categoryString = detailString.categoryString.toLowerCase()
                                .replace(/\s+/gm," ")
                                .trim()
                                .replace(/\s{2,}|\..+ {.+}|see top 100| in|(amazon )*best sellers rank:|#\d*,?\d*/gm, "");
  return detailString;
}

// Xử lý cân nặng từ array cân nặng, return Float;
function handleAmazonWeight(weightArray) {
  var itemWeight = {
    current: "",
    kg: 0,
    unit: ""
  };
  //console.log(weightArray);
  var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/;
  if (weightArray.length === 0) {
    return 0;
  } else {
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
          itemWeight.kg < weightKg ||
          weightArray[i].indexOf("shipping weight") >= 0
        ) {
          itemWeight.current = weight.toString();
          itemWeight.kg = weightKg;
          itemWeight.unit = weightUnit;
        }
      }
    }
    //console.log(itemWeight + itemWeightUnit);
    // Đổi sang Kg

    return itemWeight;
  }
}

// Xử lý category từ string category, return String
function handleAmazonCategory(categoryString) {
  if (categoryString === "") {
    return "UNKNOWN";
  }
  
  // Query từng KEYWORD trong category
  for (var category in moon.CATEGORIES) {
    if (
      moon.checkKeyword(
        categoryString,
        moon.CATEGORIES[category].KEYWORD,
        moon.CATEGORIES[category].NOTKEYWORD
      ) === true
    )
      return category;
  }
  return "GENERAL";
}

// Lấy cân nặng và category sau khi xử lý
function getAmazonDetail(dom) {
  var detailString= {
    weightArray: [],
    categoryString: ""
  };
  for (var i = 0; i < DETAILBLOCK.length; i++) {
    var detailStringTemp = getAmazonDetailString(dom, DETAILBLOCK[i]);
    if (detailString.weightArray.length === 0 && detailStringTemp.weightArray.length > 0)
      detailString.weightArray = detailStringTemp.weightArray;
    if (detailString.categoryString === "" && detailStringTemp.categoryString != "")
      detailString.categoryString = detailStringTemp.categoryString;
    if (detailString.weightArray.length > 0 && detailString.categoryString!="") break;
  }
  var weight = handleAmazonWeight(detailString.weightArray);
  return {
    weight: weight.kg == undefined?0:weight.kg,
    weightString: weight.kg == undefined?"":weight.current + weight.unit,
    category: handleAmazonCategory(detailString.categoryString),
    categoryString: detailString.categoryString
  };
}
function getMoonPrice(url, htmlraw){
  var item={
    price:0,
    priceString:"",
    weight:0,
    weightString:"",
    category:"",
    categoryString:"",
    total:0,
    totalString:""
  };
  var handler = new htmlparser.DomHandler((error, dom) => {
    if (error) {
      console.log(error);
    } else {
      var itemPrice = getAmazonPrice(dom);
      item.price = itemPrice.price; 
      item.priceString = itemPrice.priceString; 
      var itemDetail = getAmazonDetail(dom);      
      item.weight = itemDetail.weight;
      item.weightString = itemDetail.weightString;
      item.category = itemDetail.category;
      item.categoryString = itemDetail.categoryString;
    }
  });
  var parser = new htmlparser.Parser(handler, { decodeEntities: true });
  parser.parseComplete(htmlraw);
  
  item.total = moon.calculateMoonPrice("AMAZON", item);
  item.totalString=(item.total===0?"":moon.toVND(item.total));
  
  if (item.weight===0||item.category === "UNKNOWN"){
    logger.log('error','{\n"URL":"%s",\n"PRICE":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', url, item.price,item.weightString,item.category,item.totalString,item.categoryString);
  }
  else{
    logger.log('info','{\n"URL":"%s",\n"PRICE":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', url, item.price,item.weightString,item.category,item.totalString,item.categoryString);
  }
  return moon.printMoonPrice(item);
}

