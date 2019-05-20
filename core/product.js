const CATEGORIES = require('./data.js').CATEGORIES;

// Formatter dùng để format string VND, number...
const Formatter = require('./formatter.js').Formatter;

class Category{
  constructor(){
    this.string = "";
    this.att = CATEGORIES["UNKNOWN"];
  }
  setCategory(detailArray, categoryCondition){
    var found=false;
    var catString="";
    var catType="GENERAL";     
    if (detailArray!== null){
      for (let i =0;i<detailArray.length;i++){
        if (Formatter.checkKeyword(detailArray[i], categoryCondition)){ 
          catString=detailArray[i].replace(/\s{2,}|\..+ {.+}|see top 100|(amazon )?best sellers rank:?|#\d*,?\d*/gi, "|");
          found=true;        
          // Query từng KEYWORD trong category
          for (let cat in CATEGORIES) {
            if (
              Formatter.checkKeyword(catString,
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
}
class Weight{
  constructor(){ 
    this.string="";
    this.kg=0;
    this.unit="";
  }
  setWeight(detailArray, weightCondition){
    var current= "",
        kg= 0,
        unit= "";
    //console.log(detailArray);
    var reg = /(\d*,*\d+\.*\d*)( ounce| pound| oz)/; 
    if (detailArray!== null)
    for (let i = 0; i < detailArray.length; i++) {
      if (Formatter.checkKeyword(detailArray[i], weightCondition)){
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
    // Nếu tìm dc cân nặng thì làm tròn
    if (kg>0){
      // Làm tròn lên 0.1
      kg = Math.ceil(kg * 10) / 10;
      // Nếu nhỏ hơn 0.2kg thì làm tròn 0.2
      if (kg < 0.2) {kg=0.2};
    }
    
    this.string=current;
    this.kg=kg;
    this.unit=unit;

  }
}
class Price{
  constructor(){
    this.string = "";
    this.value = 0;
  }
  setPrice(priceString, reg){    
    var tempString = priceString.replace(/\s+/gm," ")
                                .trim().toLowerCase();
    this.string = tempString;
    tempString = tempString.replace(/\$\s*|.*free shipping.*/gm, "")
                                .replace(" ", ".");
    if (reg !== undefined){
        var tempMatch = tempString.match(reg)
        if (tempMatch!=null){
          tempString=tempMatch[0];
        }   
    } 
    var value = parseFloat(tempString);
    if (isNaN(value)){
      value = 0;
    }
    this.value = value;
  }
  static getPriceShipping(price, ship){
    return price.value + ship.value;
  }
}

module.exports.Category   = Category;
module.exports.Weight     = Weight;
module.exports.Price      = Price;