function initGame(){
	var allSmallF = document.getElementsByClassName('smallFrame');
	//先将原有的分数，里面的东西清空，在随机值
	var score = document.getElementById("scoreCount");
	score.innerHTML = "0";
	for(var i=0;i<allSmallF.length;i++)
		allSmallF[i].innerHTML = "";
	for(var j = 0; j<2 ;j++){
		for(var i=0;i<allSmallF.length;i++)
			if(allSmallF[i].innerHTML == ""){
				var willProduce = Math.floor(Math.random()*10+1);//1-10的随机数字
				if(willProduce >= 9)
					allSmallF[i].innerHTML = 2 ;
			}
	}
}
initGame();