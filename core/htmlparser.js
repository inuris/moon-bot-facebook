const select         = require("soupselect-update").select;
const htmlparser     = require("htmlparser2");
const request        = require("request-promise");
const jp             = require('jsonpath');

class Parser{
  constructor(dom){
    this.dom = dom;
  }
  // Lấy ra đoạn JSON từ thẻ <script type='application/ld+json'
  // Default sẽ lấy script đầu tiên, nếu cần lấy cái thứ n thì đổi index 
  // Lấy ra element theo JSONPath của web.JSONBLOCK
  getJSON(jsonblock){
    try{
      // Mặc định chỉ lấy JSON trong <script>, nếu cần lấy từ element khác thì phải thêm SELECTOR vào db
      var selector= jsonblock.SELECTOR || 'script';      
      var scriptBlock = select(this.dom, selector);
      if (scriptBlock === null) return "";
      var currentBlock;
      // Nếu web có <script> chứa JSON có index cố định thì set INDEX trong db để lấy đúng cái block[index] đó
      if (jsonblock.INDEX !==undefined && jsonblock.INDEX < scriptBlock.length){
        currentBlock = htmlparser.DomUtils.getText(scriptBlock[jsonblock.INDEX])
      }
      // Nếu web có <script> chứa JSON nằm bất kì thì phải dò bằng KEYWORD
      else if (jsonblock.KEYWORD !== undefined){
        for (let i=0;i<scriptBlock.length;i++){
          var tempBlock = htmlparser.DomUtils.getText(scriptBlock[i]);
          if (tempBlock.indexOf(jsonblock.KEYWORD)>=0){
            currentBlock = tempBlock;
            break;
          }
        }
      }
      else{
        // Mặc định lấy scriptBlock đầu tiên (thường dùng selector sẽ chỉ ra 1 block)
        currentBlock = htmlparser.DomUtils.getText(scriptBlock[0]);
      }
      // Nếu trong <script> ko phải JSON chuẩn thì phải dùng regex lấy phần JSON ra
      if (jsonblock.REGEX !== undefined){
        var matchhtml = currentBlock.match(jsonblock.REGEX);
        if (matchhtml.length>0)
          currentBlock = matchhtml[0];
      }
      //console.log(currentBlock);  
      var json = JSON.parse(currentBlock);
      // Có nhiều Path để lấy các trường hợp giá Sale/giá Thường có path khác nhau
      for (let i=0;i<jsonblock.PATH.length;i++){
        var query=jp.query(json,jsonblock.PATH[i]).toString();
        if (query!=="")
          return query;
      }
      //console.log(json);      
      return "";
    }
    catch(e){
      console.log(e);
      return "";
    }
  }

  // Lấy ra link href trong thẻ <a>
  getLink(blockElementArray, index = 0){
    try{
      
      for (let i = 0; i < blockElementArray.length; i++) {
        //console.log(blockElementArray[i]);         
        var link = select(this.dom, blockElementArray[i]);
        if (link.length>index && link[index].name==='a') {
          //console.log(link[index]);
          return link[index].attribs.href;
        }
      }  
      return "";
    }
    catch(e){
      console.log(e);
      return "";
    }
  }
  
  // Lấy ra plain text từ array các block selector, default chỉ return 1 string đầu tiên
  getText(blockElementArray, index = 0){
    try{    
      for (let i = 0; i < blockElementArray.length; i++) {          
          var text = select(this.dom, blockElementArray[i]);
          //console.log(htmlparser.DomUtils.getText(text));
          if (text.length>index) {        
            return htmlparser.DomUtils.getText(text[index]);
          }
      }
      return "";
    }
    catch(e){
      console.log(e);
      return "";
    }
    
  }

  // Lấy ra array text từ 1 bảng <td> hoặc <li>
  getTextArray(blockElementArray){
    try{
      var textArray=[];
      for (let i = 0; i < blockElementArray.length; i++) {
        // Nguyên table data
        //console.log(blockElementArray[i]);
        var textTable = select(this.dom, blockElementArray[i]);  
        
        for (let e of textTable){
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
    catch(e){
      console.log(e);
      return null;
    }
  }
}

module.exports.Parser = Parser;