var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
var xlsx = require("node-xlsx");
var file = require("./../tool/file");

/* GET users listing. */
// router.get('/', function(req, res, next) {

// 	let { pageCode, pageNumber } = req.query;
// 	pageCode = pageCode * 1 || 1; // 默认是第一页
// 	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
// 	sql.find('sh1811', 'users', {}).then(data => {
// 		const totalNumber = Math.ceil(data.length / pageNumber);
// 		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
				
// 		res.render('users', { 
// 			activeIndex: 2,
// 			totalNumber,
// 			pageNumber,
// 			pageCode,
// 			data    //  < == > data: data
// 		});
// 	}).catch(err => {
// 		console.log(err)
// 	})
// });

router.get('/', function(req, res, next) {
	let { pageCode, pageNumber } = req.query;
	pageCode = pageCode * 1 || 1; // 默认是第一页
	pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
	sql.find('sh1811', 'users', {}).then(data => {
		const totalNumber = Math.ceil(data.length / pageNumber);
		data = data.splice((pageCode -  1) * pageNumber, pageNumber)
		sql.distinct("sh1811", "users", "age").then(agearr => {

			res.render("users", {
				activeIndex :2,
				totalNumber ,
				pageCode,
				data,
				pageNumber,
				agearr

			});
          

		}).catch((err)=>{  console.log(err);})
	}).catch(err => {
		console.log(err)
	})
});



router.get('/add', function(req, res, next) {
  res.render('users_add', { 
		activeIndex: 2
	});
});
router.post('/addAction', function(req, res, next) {
	// { tel: tel}    { tel }
 // post 如何拿数据
 // const obj = req.body;
 let { tel, nickname, password, age } = req.body;
 sql.find('sh1811', 'users', { tel: tel }).then(data => {
	if (data.length == 0) {
		// 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
		password = md5(password);
		
		sql.insert('sh1811', 'users', { tel, nickname, password, age})
			.then(() => {
				res.redirect('/users');
			})
			.catch((err) => {
				res.redirect('/users/add');
			})
	} else {
		// 该用户已存在
		res.redirect('/users/add');
	}
 }).catch(err => {
	 console.log(err)
	 res.redirect('/users/add');
 })
 // console.log(obj);
 
});
// 删除
router.get('/remove', function(req, res, next) {
	const { tel } = req.query;
	      
  sql.remove('sh1811', 'users', { tel }).then(() => {
	  res.redirect('/users');
  }).catch((err) => {
	  res.redirect('/users');
  })
});
// 更新
router.post('/updateAction', function(req, res, next) {
  const { tel, nickname, age } = req.body;
  sql.update('sh1811', 'users', 'updateMany', { tel}, {$set: { nickname, age }})
  .then(() => {
	  res.redirect('/users');
  }).catch(err => {
	  res.redirect('/users');
  })
});

const usersxlsx = 'D:/1811三阶段/代码/第六天批量导入导出/stu.xlsx';
	
// function  analysisdata (){

// 	return new Promise((res, rej)=>{
// 	   //解析execel
	   
// 	   const obj = xlsx.parse(usrsxlsx);  //解析数据

// 	   res(obj);  //obj是buffer类型

// 	});
// }

// function filterdata(data){  //过滤数据

// 	let arr= [];

// 	 data.map((item, index)=>{
	  
// 		if(index !==0){

// 			arr.push({
// 			       'tel' : item[0],
// 			  'nickname' : item[1],
// 			  'password' : item[2]

// 			});
// 		}
	

// 	 })
	
 
// 	return arr;

// }

//批量导入数据
router.get('/importusers',function(req, res, next){
	
	file.analysisdata(usersxlsx).then((obj)=>{
		//   console.log(obj);
		  const data = obj[0].data
		 // res.send(obj[0].data)
		const result = file.filterdata(data);

		//res.send(result);

		sql.insert("sh1811", "users", result ).then(()=>{

			res.redirect("/users");
		}).catch((err)=>{ 
             console.log(err);
		})
	})
	
})

// 批量导出数据
// router.get('/exportusers', function(req, res, next) {

// 	sql.find("sh1811", "users", {}).then((data)=>{
		   
// 		file.exportdata(data,res);

// 	})

//   });

router.get("/exportusers", function(req, res, next){

	
   
	 sql.find("sh1811", "users", {}).then((data)=>{
	
		 file.exportdata(data, res);		

	 })



})

// router.get('/exportusers', (req, res, next) => {
// 	const _headers =  [
// 		{caption:'tel',type:'string'},
// 		{caption:'nickname',type:'string'},
// 		{caption:'password',type:'string'}];


// 	sql.find('sh1811', 'users', {}).then(data => {
// 		let alldata = new Array();
//     data.map((item, index) => {
//       let arr = [];
//       arr.push(item.tel);
//       arr.push(item.nickname);
//       arr.push(item.password);
//       alldata.push(arr);
// 		})
// 		const result = file.exportdata(_headers, alldata);
// 		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
// 		res.setHeader("Content-Disposition", "attachment; filename=" + "test.xlsx");
// 		res.end(result, 'binary');
// 	})
// })

router.get("/search", (req, res, next) => {

	   const { nickname } = req.query;
	   
	   sql.find("sh1811", "users", { nickname : eval("/" + nickname +"/") }).then(data => {

		  // res.send(data);
		  sql.distinct("sh1811", "users", "age").then(agearr => {

			res.render("users",{

				activeIndex: 2,
				totalNumber : 1 ,
				pageNumber : 1,
				pageCode :1 ,
				data ,
				agearr
			  })


		  })
		 
          

		// sql.distinct("sh1811", "users", "age").then(data => {
		// 	sql.render("users", { 
		// 		activeIndex :2,
		// 		totalNumber :1,
		// 		data,
		// 		pageNumber :data.length


		// 	})
		// }) 
	   })

})

router.get("/agesearch", (req, res, next) => {
	let  { age } = req.query;
	       age = age *1;
	sql.find("sh1811", "users", { age }).then((data) =>{
       
		sql.distinct("sh1811", "users", "age").then(agearr => {

			res.render("users", {

				activeIndex :2,
				totalNumber :1,
				pageCode :1,
				data,
				pageNumber: data.length,
				agearr

			})
          

		})




	}).catch((err) =>{

		console.log(err);
	})


})

router.get('/sort', function(req, res, next){

	
	let { type, num } = req.query;
	let sortData = {};
		sortData[""+type] =num * 1 ;
		sql.sort("sh1811", "users", sortData).then(data =>{

			sql.distinct("sh1811", "users", "age").then(agearr =>{

				res.render("users", {
					activeIndex :2,
					totalNumber :1,
					pageCode :1,
					data,
					pageNumber : data.length,
					agearr
				})

			})
		}).catch(err => {

			console.log(err);
		})
})

module.exports = router;
