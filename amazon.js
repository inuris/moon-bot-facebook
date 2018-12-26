const moon = require("./moon.js");
const select = require("soupselect-update").select;
const htmlparser = require("htmlparser2");
// Danh sách các loại detail block của Amazon
const DETAILBLOCK = [
  "#productDetails_detailBullets_sections1 tr",
  "#detailBullets_feature_div span.a-list-item",
  "#detailBulletsWrapper_feature_div li",
  "#prodDetails tr",
  "#detail-bullets li",
  "#technical-details-table tr",
  "#tech-specs-desktop tr"
];

// Danh sách các block chứa giá của Amazon
const PRICEBLOCK = [
  "#priceblock_dealprice",
  "#priceblock_ourprice",
  "#priceblock_saleprice",
  ".guild_priceblock_ourprice:first",
  ".offer-price:first"
];
// Lấy Giá web sau sale, return Float;
function getAmazonPrice(dom) {
  var priceString = "";
  var itemPrice = 0;
  for (var i = 0; i < PRICEBLOCK.length; i++) {
    var itemPriceBlock = select(dom, PRICEBLOCK[i]);
    if (itemPriceBlock.length > 0) {
      priceString = itemPriceBlock[0].children[0].data
        .trim()
        .replace("$ ", "")
        .replace("$", "")
        .replace(",", "")
        .replace(" ", "."); // $33 99 => 33.99
      break;
    }
  }
  // Block đặc biệt chứa giá kèm text
  if (priceString === "") {
    var itemPriceWidget = select(
      dom,
      "#alohaPricingWidget .a-color-price:first"
    );
    if (itemPriceWidget.length > 0) {
      priceString = itemPriceWidget[0].children[0].data
        .trim()
        .replace("$ ", "")
        .replace("$", "")
        .replace(" ", ".");
    }
  }
  if (priceString !== "") {
    itemPrice = parseFloat(priceString);
  }
  return itemPrice;
}

// Lấy thông tin chung Detail (cân nặng + category) từ DOM theo Block, return {weight, category);
function getAmazonDetailString(dom, block) {
  var detailString = {
    weight: [],
    category: ""
  };
  var detailTable = select(dom, block); // Element chứa info cân nặng
  
  for (var e of detailTable) {
    if (e.type === "tag") {
      var row = e.children;
      // row là 1 dòng gồm có 5 element: <td>Weight</td><td>$0.00</td>
      try {
        if (row[1].type === "tag" && row[3].type === "tag") {
          
          // Tìm từ "Weight/Demensions" (1 số sp có weight nằm ở dimension)
          if (
            row[1].children[0].data.indexOf("Weight") >= 0 ||
            row[1].children[0].data.indexOf("Dimensions") >= 0
          ) {
            detailString.weight.push(
              row[3].children[0].data.trim().toLowerCase()
            );
            // Có dạng: 1.1 pounds
          }
          // Tìm từ "Sellers Rank" để add Category
          else if (row[1].children[0].data.indexOf("Sellers Rank") >= 0) {            
            detailString.category += htmlparser.DomUtils.getText(
              row[3].children
            )
              .trim()
              .toLowerCase();
          }
        }
      } catch (err) {}
    }
  }

  return detailString;
}

// Xử lý cân nặng từ array cân nặng, return Float;
function handleAmazonWeight(weightString) {
  var itemWeight = {
    current: 0,
    kg: 0,
    unit: ""
  };
  var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/i;
  if (weightString.length === 0) {
    return 0;
  } else {
    for (var i = 0; i < weightString.length; i++) {
      var weightReg = weightString[i].match(reg); // ["2.6 pound", "2.6", " pound", index: 16, input: "shipping weight	2.6 pounds"
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
          weightString[i].indexOf("shipping weight") >= 0
        ) {
          itemWeight.current = weight;
          itemWeight.kg = weightKg;
          itemWeight.unit = weightUnit;
          break;
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
  var categoryStr = categoryString
    .toLowerCase()
    .replace("see top 100", "")
    .replace(" in ", " ")
    .replace("amazon best sellers rank:", "")
    .replace("best sellers rank:", "");
  console.log(categoryStr);
  // Query từng KEYWORD trong category
  for (var category in moon.CATEGORIES) {
    if (
      moon.checkKeyword(
        categoryStr,
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
  var detailString;
  for (var i = 0; i < DETAILBLOCK.length; i++) {
    detailString = getAmazonDetailString(dom, DETAILBLOCK[i]);
    if (detailString.weight.length > 0) break;
  }
  var weight = handleAmazonWeight(detailString.weight);
  if (weight.kg == undefined){
    return {
      weight: 0,
      weightString: "none",
      category: handleAmazonCategory(detailString.category)
    };
  }
  return {
    weight: weight.kg,
    weightString: weight.current + weight.unit,
    category: handleAmazonCategory(detailString.category)
  };
}
module.exports = {
  getPrice: htmlraw => {
    console.clear();
    var item={
      price:0,
      weight:0,
      category:""
    };
    var handler = new htmlparser.DomHandler((error, dom) => {
      if (error) {
        console.log(error);
      } else {
        //console.log("1 USD = " + moon.RATE_USD_VND + " VNĐ");
        console.log("AMAZON");

        console.log("---PRICE---");
        item.price = getAmazonPrice(dom);
        console.log(item.price);

        var itemDetail = getAmazonDetail(dom);
        console.log("---WEIGHT---");
        item.weight = itemDetail.weight;
        console.log(itemDetail.weightString);

        console.log("---CATEGORY---");
        item.category = itemDetail.category;
        console.log(item.category);
      }
    });
    var parser = new htmlparser.Parser(handler, { decodeEntities: true });
    parser.parseComplete(htmlraw);
    return moon.printMoonPrice("AMAZON", item);
  }
};
