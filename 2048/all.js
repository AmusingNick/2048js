 //网络
lastView = new Array(16);
nowView = new Array(16);	
function setView(View){
	var allSmallF = document.getElementsByClassName('smallFrame');
	for(var i=0;i<allSmallF.length;i++)
		View[i] = allSmallF[i].innerHTML;
}
function isChangeView(lastView,nowView){
	for(var i=0;i<lastView.length;i++)
		if(lastView[i] != nowView[i])
			return true;
	return false;
}
function releaseView(){
	if(typeof lastView[0] != "undefined"){
		var allSmallF = document.getElementsByClassName('smallFrame');
		for(var i=0;i<allSmallF.length;i++)
			allSmallF[i].innerHTML = lastView[i];
		changeStyle();
	}
}//返回上一步

function findLineEmpty(line,allSmallF){
	var everyLine = line.split(",");
	for(var i=0;i<everyLine.length;i++)
		if(allSmallF[everyLine[i]].innerHTML == ""){
			return allSmallF[everyLine[i]];
		}
	return null;	//没有空的情况
}

function searchEmptyInsertIndex(line,lineEmpty,allSmallF){
	//line 0,4,8,12    //lineEmpty 5
	var intEmpty = parseInt(lineEmpty.getAttribute("name"));
	for(var i=0;i<line.length;i++){
		var intLine = parseInt(allSmallF[line[i]].getAttribute("name"));
		if(intLine == intEmpty)
			return i;
	}
}

function insertEmpty(line,lineEmpty,allSmallF){
	if(lineEmpty != null){
		//有空的情况下，找everySequence还没落下来的情况
		var IndexSearch = searchEmptyInsertIndex(line,lineEmpty,allSmallF);
		for(var i=IndexSearch+1;i<line.length;i++){
			if(allSmallF[line[i]].innerHTML!=""){
				lineEmpty.innerHTML = allSmallF[line[i]].innerHTML;
				allSmallF[line[i]].innerHTML = "";
				lineEmpty = allSmallF[line[i]];
			}
		}
	}
}

function changeAll(upSequence,upRange,Type){
	var allSmallF = document.getElementsByClassName('smallFrame');
	var score = document.getElementById("scoreCount");
	var allUpSequence = upSequence.split("~");
	for(var i=0;i<allUpSequence.length;i++){
		var everySequence = allUpSequence[i].split(",");
		var isChangeOfThisLine = false; 
		var lineEmpty;
		for(var j=0;j<everySequence.length;j++){
			//判断该列是否有一个融合,每一列只能有一个融合;
			var iTop = allSmallF[everySequence[j]].getAttribute(Type);  
			var target = allSmallF[everySequence[j]];
			//alert("target:"+target.getAttribute("name"));
			if(iTop.length != 0 && target.innerHTML!=""){
				//对不是顶上的target&&target不为空的值进行操作
				var allITop = iTop.split(",");
				for(var k=0;k<allITop.length;k++){
					//应该从该点的最近的一个点找
					var forIt = allSmallF[allITop[k]-1];
					//alert("forIt:"+allSmallF[allITop[k]-1].getAttribute("name"));
					if(forIt.innerHTML != "" ){
						if(target.innerHTML == forIt.innerHTML && !isChangeOfThisLine){
							var intForIt = parseInt(forIt.innerHTML);
							var intTarget = parseInt(target.innerHTML);
							var forItWrite = intForIt + intTarget;
							forIt.innerHTML = forItWrite.toString();
							target.innerHTML = "";
							isChangeOfThisLine = true;
							var intScore = parseInt(score.innerHTML);
							intScore += forItWrite;
							score.innerHTML = intScore;
							//加很好听的音效(先暂停之前的声音)
							document.getElementById("normalSound").pause();
							document.getElementById("combineSound").pause();
							document.getElementById("normalSound").play();  //播放声音
						}
						break;
					}
					if(forIt.innerHTML == "" 
						&&((allITop[k]==upRange[0])||(allITop[k]==upRange[1])
							||(allITop[k]==upRange[2])||(allITop[k]==upRange[3]))){
						forIt.innerHTML = target.innerHTML;
					 	target.innerHTML = "";
					 	//加普通音效
					}
					if(forIt.innerHTML == "" 
						&&((allITop[k]!=upRange[0])||(allITop[k]!=upRange[1])
							||(allITop[k]!=upRange[2])||(allITop[k]!=upRange[3]))){
						//检索下一个
					}
					lineEmpty = findLineEmpty(allUpSequence[i],allSmallF);
					//if()
						/*for的值   不为空  看是否和target是相同的值，
									  相同合并 (改分)
									  不相同放入其最上面的为空位置? 下面*/
						/*for的值  	为空  并且是顶上,直接将顶上赋值
						for的值  	为空  并且不是顶上，检索下一个
						*/
				}
			}
		}
		//不相同放入其最上面的为空位置
		insertEmpty(everySequence,lineEmpty,allSmallF);
	}
}
document.onkeydown = function keyDown(event){
	setView(lastView);
	var eType = event.keyCode;
	//上下
	var upSequence = "0,4,8,12~1,5,9,13~2,6,10,14~3,7,11,15";
	var upRange = new Array(4); upRange[0] = "1"; upRange[1] = "2";upRange[2] = "3";upRange[3] = "4"; 
	var downSequence = "12,8,4,0~13,9,5,1~14,10,6,2~15,11,7,3";
	var downRange = new Array(4); downRange[0] = "13"; downRange[1] = "14";downRange[2] = "15";downRange[3] = "16"; 
	//左右
	var leftSequence = "0,1,2,3~4,5,6,7~8,9,10,11~12,13,14,15";
	var leftRange = new Array(4); leftRange[0] = "1"; leftRange[1] = "5";leftRange[2] = "9";leftRange[3] = "13"; 
	var rightSequence = "3,2,1,0~7,6,5,4~11,10,9,8~15,14,13,12";
	var rightRange = new Array(4); rightRange[0] = "4"; rightRange[1] = "8";rightRange[2] = "12";rightRange[3] = "16"; 
	switch(eType){
		case 38://↑
			changeAll(upSequence,upRange,"top");
			break;
		case 40://↓
			changeAll(downSequence,downRange,"bottom");
			break;
		case 37://←
			changeAll(leftSequence,leftRange,"left");
			break;
		case 39://→
			changeAll(rightSequence,rightRange,"right");
			break;
	}
}

function isGameOver(){
	//游戏结束条件:1,都有数字，2.并且相互邻接的没有相同的
	var allSmallF = document.getElementsByClassName('smallFrame');
	for(var i=0;i<allSmallF.length;i++)
		if(allSmallF[i].innerHTML == "")
			return false;	//直接有一个非空，就没结束
	for(var i=0;i<allSmallF.length;i++){
		var iTop = allSmallF[i].getAttribute("top").split(",")[0];
		var iBottom = allSmallF[i].getAttribute("bottom").split(",")[0];
		var iLeft = allSmallF[i].getAttribute("left").split(",")[0];
		var iRight = allSmallF[i].getAttribute("right").split(",")[0];
		if(iTop != "" && allSmallF[iTop-1].innerHTML == allSmallF[i].innerHTML)
			return false;
		if(iBottom != "" && allSmallF[iBottom-1].innerHTML == allSmallF[i].innerHTML)
			return false;
		if(iLeft != "" && allSmallF[iLeft-1].innerHTML == allSmallF[i].innerHTML)
			return false;
		if(iRight != "" && allSmallF[iRight-1].innerHTML == allSmallF[i].innerHTML)
			return false;
	}
	return true;
}

function changeStyle(){
	var allSmallF = document.getElementsByClassName('smallFrame');
	for(var i=0;i<allSmallF.length;i++){
		if(allSmallF[i].innerHTML == 2 || allSmallF[i].innerHTML == 4 || allSmallF[i].innerHTML == "")
			allSmallF[i].style.color = "rgb(156, 143, 129)";
		if(allSmallF[i].innerHTML == 8)
			allSmallF[i].style.color = "rgb(22, 79, 140)"; 
		if(allSmallF[i].innerHTML == 16)
			allSmallF[i].style.color = "rgb(52, 169, 105)"; 
		if(allSmallF[i].innerHTML == 32)
			allSmallF[i].style.color = "rgb(36, 160, 29)"; 
		if(allSmallF[i].innerHTML == 64)
			allSmallF[i].style.color = "rgb(190, 193, 32)"; 
		if(allSmallF[i].innerHTML == 128)
			allSmallF[i].style.color = "rgb(220, 32, 213)"; 
		if(allSmallF[i].innerHTML == 256)
			allSmallF[i].style.color = "rgb(220, 32, 117)";
		if(allSmallF[i].innerHTML == 512)
			allSmallF[i].style.color = "rgb(255, 37, 0)";
		if(allSmallF[i].innerHTML == 1024)
			allSmallF[i].style.color = "rgb(28, 0, 136)";
		if(allSmallF[i].innerHTML == 2048)
			allSmallF[i].style.color = "rgb(52, 0, 253)";
	}	
}

document.onkeyup = function keyUp(event){
	setView(nowView);
	if(isChangeView(lastView,nowView)){
		if(event.keyCode>=37 &&	event.keyCode <=40){
			changeStyle();	//改变颜色样式
			var allSmallF = document.getElementsByClassName('smallFrame');
			var score = document.getElementById("scoreCount");
			var intScore = parseInt(score.innerHTML);
			var produceMath24 = Math.floor(Math.random()*10+1);
			var produceMath = 2;	//默认产生2
			if(intScore > 2000 && produceMath24 >=8)	//积分大于2000的时候就开始随机是否是2,4了
				produceMath = 4;
			var haveProduced = false;
			outerloop:
			for(var j = 0; j<2 ;j++){
				for(var i=0;i<allSmallF.length;i++)
					if(allSmallF[i].innerHTML == ""){
						var willProduce = Math.floor(Math.random()*10+1);//1-10的随机数字
						if(willProduce >= 8){
							allSmallF[i].innerHTML = produceMath ;
							haveProduced = true;
							break outerloop;
						}
					}
			}
			if(!haveProduced){
				//如果非常不幸，点不好，两次循环随，都没有出现个数字，那就随便来一个吧
				for(var i=0;i<allSmallF.length;i++)
					if(allSmallF[i].innerHTML == ""){
						allSmallF[i].innerHTML = produceMath ;
						break;
					}
			}
			if(isGameOver()){
				alert("游戏结束");
				for(var i=0;i<allSmallF.length;i++)
					allSmallF[i].innerHTML == "";
				changeStyle();
			}
		}
	}
}
/*在监听到鼠标事件的时候，应该做如下的事：
while(！每一个块都与相邻接的块数字不相同)
{
	监听键盘上下左右键{
		按下键盘:1.移动div:
						1.不能成为新块的也要移动到键盘事件的地方。
						2.判断移动后时候能够成为新块，能够成为则加到一起
						3.只加一个,其余的依次移动
				2.改变总分
		松开键盘:3.产生新的数字	
	}
}
*/