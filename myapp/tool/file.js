var  xlsx = require("node-xlsx");


var  nodeExcel = require("excel-export");

const  file = {
     
  analysisdata (path){

        return new Promise((res, rej)=>{
           //解析execel
           
           const obj = xlsx.parse(path);  //解析数据
    
           res(obj);  //obj是buffer类型
    
        });
    },


  filterdata (data){  //过滤数据

            let arr= [];
        
             data.map((item, index)=>{
              
                if(index !==0){
        
                    arr.push({
                           'tel' :item[0].toString(),
                      'nickname' : item[1],
                      'password' : item[2],
                          "age"  : Number(item[3])
        
                    });
                }
            
        
             })

            return arr;
        
        },

    exportdata (data, res){
         var  config ={};
         config.name = "xl";
          
          
         let alldata =new Array();

		data.map((item, index) =>{
			let arr = [];
			arr.push(item.tel);
			arr.push(item.nickname);
            arr.push(item.password);
            arr.push(item.age);
			alldata.push(arr);
        })
        
        config.cols  = [
		
            {caption:"tel", type:"string"},
            {caption:"nickname", type:"string"},
            {caption:"password", type:"string"},
            {caption:"age", type:"string"}
    
         ];

        config.rows = alldata;


       var result = nodeExcel.execute(config);

           res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');


        
    //    console.log(result);

    }    

}

module.exports = file;