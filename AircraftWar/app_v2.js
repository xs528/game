/*********飞机大战************/
var width = window.innerWidth > 480 ? 480 : window.innerWidth,
    height = window.innerHeight > 650 ? 650 : window.innerHeight - 20;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext('2d');
/********定义游戏状态***********/
const PHASE_DOWNLOAD = 1;
const PHASE_READY = 2;
const PHASE_LOADING = 3;
const PHASE_PLAY = 4;
const PHASE_PAUSE = 5;
const PHASE_GAMEOVER = 6;
/**********游戏当前状态************/
var curPhase = PHASE_DOWNLOAD;
var gameScore = 0;
// 所以图片的链接，包括背景图、各种飞机和飞机爆炸图、子弹图等
var imgName = ['background.png', 'game_pause_nor.png', 'm1.png', 'start.png', 
    // 敌机1
    ['enemy1.png', 'enemy1_down1.png', 'enemy1_down2.png', 'enemy1_down3.png', 'enemy1_down4.png'],
    // 敌机2
    ['enemy2.png', 'enemy2_down1.png', 'enemy2_down2.png', 'enemy2_down3.png', 'enemy2_down4.png'],
    // 敌机3
    ['enemy3_n1.png', 'enemy3_n2.png', 'enemy3_hit.png', 'enemy3_down1.png', 'enemy3_down2.png', 'enemy3_down3.png', 'enemy3_down4.png', 'enemy3_down5.png', 'enemy3_down6.png', ],
    // 游戏loading图
    ['game_loading1.png', 'game_loading2.png', 'game_loading3.png', 'game_loading4.png'],
    // 玩家飞机图
    ['hero1.png', 'hero2.png', 'hero_blowup_n1.png', 'hero_blowup_n2.png', 'hero_blowup_n3.png', 'hero_blowup_n4.png']
];
// 存储不同类型的图片
var bg = null,
    pause = null,
    m = null,
    startImg = null,
    enemy1 = [],
    enemy2 = [],
    enemy3 = [],
    gameLoad = [],
    heroImg = [];
// 加载图片的进度
var progress = 1;
/*********加载图片*********/
function download() {
    bg = nImg(imgName[0]);
    pause = nImg(imgName[1]);
    m = nImg(imgName[2]);
    startImg = nImg(imgName[3]);
    for (var i = 0; i < imgName[4].length; i++) {
        enemy1[i] = nImg(imgName[4][i]);
    }
    for (var i = 0; i < imgName[5].length; i++) {
        enemy2[i] = nImg(imgName[5][i]);
    }
    for (var i = 0; i < imgName[6].length; i++) {
        enemy3[i] = nImg(imgName[6][i]);
    }
    for (var i = 0; i < imgName[7].length; i++) {
        gameLoad[i] = nImg(imgName[7][i]);
    }
    for (var i = 0; i < imgName[8].length; i++) {
        heroImg[i] = nImg(imgName[8][i]);
    }

    function nImg(src) {
        var img = new Image();
        img.src = 'img/' + src;
        img.onload = imgLoad;
        return img;
    }
    // 绘制游戏加载进度画面
    function imgLoad() {
        progress += 3;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var text = progress + '%';
        var tw = ctx.measureText(text).width;
        ctx.font = '60px arial';
        ctx.fillStyle = 'red';
        ctx.lineWidth = '0';
        ctx.strokeStyle = '#888';
        //ctx.strokeText(text,(width-tw)/2,height/2);
        ctx.fillText(text, (width - tw) / 2, height / 2);
        if (progress >= 100) {
            start();
        }
    }
}
download();

/*********开始游戏**************/
function start() {
    curPhase = PHASE_READY;
    canvas.onclick = function() {
        curPhase == PHASE_READY && (curPhase = PHASE_LOADING);
    }
    ctx.fillStyle = '#963';
    ctx.font = '24px arial';
    hero = new Hero();
    gameEngine();
}
/********画背景*******/
function paintBg() {
    var y = 0;
    function paintBg() {
        ctx.drawImage(bg, 0, y);
        ctx.drawImage(bg, 0, y - 852);
        y++ == 852 && (y = 0);
    }
    return paintBg;
}

/**********画game开始图*********/
function paintLogo() {
    ctx.drawImage(startImg, 40, 0);
}
/*******************/
function loading() {
    this.index = 0;

    function loading() {
        this.index % 1 == 0 && ctx.drawImage(gameLoad[index], 0, canvas.height - gameLoad[0].height);
        this.index += 0.5;
        if (this.index > 3) {
            curPhase = PHASE_PLAY;
            this.index =0;
        }
    }
    return loading;
}
/*********构造hero************/
var hero = null;

function Hero() {
    this.x = (width - heroImg[0].width) / 2;  // hero的坐标
    this.y = height - heroImg[0].height;
    this.index = 0; // 用于切换hero的图片
    this.count = 0; // 用于控制hero图片切换的频率
    this.hCount = 0; // 用于控制子弹发射的频率
    this.eCount = 0; // 用于控制敌机出现的频率    
    this.n = 0;
    this.life=0;
    this.draw = function() {
	    this.count++;
        this.hit();
        if(this.index>4){
	    curPhase =PHASE_GAMEOVER; 
	    this.index=5;     
	    } 
        if (this.count % 3 == 0&&this.index<=1) { // 切换hero的图片
          	this.index = this.index == 0 ? 1 : 0;
            this.count = 0;
        }
       
        ctx.drawImage(heroImg[this.index], this.x, this.y);
        ctx.fillText('SCORE:' + gameScore, 10, 30);
       
        this.hCount++;
        if (this.hCount % 3 == 0) { // 同时生成三颗子弹
            this.n == 32 && (this.n = 0); 
            hullet.push(new Hullet(this.n));
            this.n == 0 && (this.n = -32);;
            hullet.push(new Hullet(this.n));
            this.n == -32 && (this.n = 32);;
            hullet.push(new Hullet(this.n));
            this.hCount = 0;
        }
        this.eCount++;
        if (this.eCount % 8 == 0) { //生成敌机
            liveEnemy.push(new Enemy());
            this.eCount = 0;
        }
    }
    this.hit = function() { //判断是自己是否被击中
        for (var i = 0; i < liveEnemy.length; i++) {
            var d = liveEnemy[i];
            // 敌机与自己的碰撞检测
            var px, py;  
        	px = this.x <= d.x ? d.x : this.x;  
        	py = this.y <= d.y ? d.y : this.y;  
  
        	// 判断点
       		if (px >= this.x && px <= this.x + heroImg[0].width && py >= this.y && py <= this.y + heroImg[0].height && px >= d.x && px <= d.x + d.width && py >= d.y && py <= d.y + d.height) {  
				this.life++;
            	if(this.life>30){
	            	if(this.index<=2){
		            	this.index=3;
	            	}
					this.index++; 
					this.life=0;
	            } 
        	} 
        }
    }

    function move(e) {
        if (curPhase == PHASE_PLAY || curPhase == PHASE_PAUSE) {
            curPhase = PHASE_PLAY;
            var offsetX = e.offsetX || e.touches[0].pageX;
            var offsetY = e.offsetY || e.touches[0].pageY;
            var w = heroImg[0].width,
                h = heroImg[0].height;
            var nx = offsetX - w / 2,
                ny = offsetY - h / 2;
            nx < 20 - w / 2 ? nx = 20 - w / 2 : nx > (canvas.width - w / 2 - 20) ? nx = (canvas.width - w / 2 - 20) : 0;
            ny < 0 ? ny = 0 : ny > (canvas.height - h / 2) ? ny = (canvas.height - h / 2) : 0;
            hero.x = nx;
            hero.y = ny;
            hero.count = 2;
        }
    }
    // 绑定鼠标移动和手指触摸事件，控制hero移动
    canvas.addEventListener("mousemove", move, false);
    canvas.addEventListener("touchmove", move, false);
    // 鼠标移除时游戏暂停
    canvas.onmouseout = function(e) {
        if (curPhase == PHASE_PLAY) {
            curPhase = PHASE_PAUSE;
        }
    }
}


/**********构造子弹***********/
var hullet = []; // 存储画布中所以子弹的数组

function Hullet(n) {
    this.n = n;  // 用于确定是左中右哪一颗子弹
    // 子弹的坐标
    this.mx = hero.x + (heroImg[0].width - m.width) / 2 + this.n; 
    this.my = this.n == 0 ? hero.y - m.height : hero.y + m.height;
    this.width = m.width;  // 子弹的宽和高
    this.height = m.height;
    this.removable = false; // 标识子弹是否可移除了
}
Hullet.drawHullet = function() {
    for (var i = 0; i < hullet.length; i++) { //在画布上画出所以子弹
        hullet[i].draw();
        if (hullet[i].removable) { // 如果为true就移除这颗子弹
            hullet.splice(i, 1);
        }
    }
}
Hullet.prototype.draw = function() { // 在画布上画子弹
    ctx.drawImage(m, this.mx, this.my);
    this.my -= 20;
    this.mx += this.n == 32 ? 3 : this.n == -32 ? -3 : 0;
    if (this.my < -m.height) {  // 如果子弹飞出画布，就标记为可移除
        this.removable = true;
    };
}


/***********构造敌机********/
var liveEnemy = []; // 用于存储画布上的所有敌机

function Enemy() {
    this.n = Math.random() * 20;
    this.enemy = null; // 保存敌机图片的数组
    this.speed = 0; // 敌机的速度
    this.lifes = 2; // 敌机的生命值
    if (this.n < 1) { // 不同大小的敌机随机出现
        this.enemy = enemy3[0]; 
        this.speed = 2;
        this.lifes = 50;
    } else if (this.n < 6) {
        this.enemy = enemy2[0];
        this.speed = 4;
        this.lifes = 10;
    } else {
        this.enemy = enemy1[0];
        this.speed = 6;
    }
    this.x = parseInt(Math.random() * (canvas.width - this.enemy.width));
    this.y = -this.enemy.height;
    this.width = this.enemy.width;
    this.height = this.enemy.height;
    this.index = 0;
    this.removable = false;
    // 标识敌机是否狗带，若狗带就画它的爆炸图(也就是遗像啦)
    this.die = false;
    this.draw = function() {
        // 处理不同敌机的爆炸图轮番上阵
        if (this.speed == 2) {
            if (this.die) {
                if (this.index < 2) { this.index = 3; }
                if (this.index < enemy3.length) {
                    this.enemy = enemy3[this.index++];
                } else {
                    this.removable = true;
                }
            } else {
                this.enemy = enemy3[this.index];
                this.index == 0 ? this.index = 1 : this.index = 0;
            }
        } else if (this.die) {
            if (this.index < enemy1.length) {
                if (this.speed == 6) {
                    this.enemy = enemy1[this.index++];
                } else {
                    this.enemy = enemy2[this.index++];
                }
            } else {
                this.removable = true;
            }
        }
        ctx.drawImage(this.enemy, this.x, this.y);
        this.y += this.speed; // 移动敌机
        this.hit(); //判断是否击中敌机
        if (this.y > canvas.height) { // 若敌机飞出画布，就标识可移除(让你不长眼！)
            this.removable = true;
        }
    }
    this.hit = function() { //判断是否击中敌机
        for (var i = 0; i < hullet.length; i++) {
            var h = hullet[i];
            // 敌机与子弹的碰撞检测，自己体会吧
            if (this.x + this.width >= h.mx && h.mx + h.width >= this.x &&
                h.my + h.height >= this.y && this.height + this.y >= h.my) {
                if (--this.lifes == 0) { // 若生命值为零，标识为死亡
                    this.die = true;
                    // 计分
                    gameScore += this.speed == 6 ? 10 : this.speed == 4 ? 20 : 100;
                }
                h.removable = true; // 碰撞后的子弹标识为可移除
            }
        }
    }
}

function drawEnemy() {
    for (var i = 0; i < liveEnemy.length; i++) {
        if (liveEnemy[i].removable) {
            liveEnemy.splice(i, 1);
        }
    }
    for (var i = 0; i < liveEnemy.length; i++) {
        liveEnemy[i].draw();
    }
}
/*******游戏暂停*******/
function drawPause() {
    ctx.drawImage(pause, (width - pause.width) / 2, (height - pause.height) / 2);
}
//游戏结束
function gameover(){
	alert("游戏结束，成绩"+gameScore); 
	gameScore=0;  
	curPhase =PHASE_READY;  
	hero = null;
	hero = new Hero();  	    
}
/**********游戏主引擎*********/
var pBg = paintBg();
var load = loading();

function gameEngine() {
    switch (curPhase) {
        case PHASE_READY:
            pBg();
            paintLogo();
            break;
        case PHASE_LOADING:
            pBg();
            load();
            break;
        case PHASE_PLAY:
            pBg();
            drawEnemy();
            Hullet.drawHullet();
            hero.draw();
            break;
        case PHASE_PAUSE:
            drawPause();
            break;
        case PHASE_GAMEOVER:
            gameover();
            break;    
    }
    //requestAnimationFrame(gameEngine);
}
setInterval(gameEngine, 50);
