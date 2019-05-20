class Formatter{  
  // Chuyển đổi dạng Number ra Currency: 1200000 => 1,200,000
  static formatMoney(number, c, d, t) {
    var n = number,
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

  // Check a string contain one of any string in Array
  static checkKeyword(keyword, include, exclude){
    if (include==undefined){
      return true;    
    }
    for (let i=0;i<include.length;i++) {
      if (keyword.includes(include[i])) {
        if (exclude !== undefined){
          for (let e=0;e<exclude.length;e++) {
            if (keyword.includes(exclude[e])) {
              return false;
            }
          }
        }
        return true;
      }
    }
    return false;
  }

  // Đổi USD sang VND, làm tròn 5000
  static toVND(price, rate){
    var priceNew = Math.ceil((price * rate) / 5000) * 5000; //Làm tròn lên 5000  
    return this.formatMoney(priceNew, 0, '.', ',')+" VND"; // Thêm VND vào
  };

}

module.exports.Formatter   = Formatter;