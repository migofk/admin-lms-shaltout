
exports.fixingOptions = (json,label,value)=>{
    var array=[];
    for (let index = 0; index < json.length; index++) {
      array[index] ={"label":json[index][label],"value":json[index][value]} ;
      
    }
    return array;
}

exports.getSelectedValueInArray = (selectArray)=>{
    var array=[];
    for (let index = 0; index < selectArray.length; index++) {
      array[index] ={"label":selectArray[index].value} ;
      
    }
    return array;
}