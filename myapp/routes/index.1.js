var express = require('express');
var router = express.Router();
var sql = require("./../tool/sql");
var md5 = require("md5");

/* GET home page. */
router.get('/', function(req, res, next) {

	// if(! req.cookies.islogin || req.cookies.islogin == 0){
	// 	res.redirect("/login"); //跳转到登录页

	// 	return ; //代码将不再继续执行
	// }
  res.render('index', { 
		activeIndex: 1
	});
});

router.get("/login", function (req, res, next){
	res.render("login");
});

router.post("/loginAction", (req, res, next) =>{

	let {name, password } = req.body;
		 
	password = md5(password);
	    sql.find("sh1811", "admin", {name, password}).then(data => {
			if(data.length===0){
				
				res.redirect("/login");
			}else{
			
				res.redirect("/");
			}
		})
	 

})

router.get("/loginout", (req, res, next) => {

	// res.cookie("islogin",null);
	    res.clearCookie("islogin");
   
	res.redirect("/login")

})

module.exports = router;
