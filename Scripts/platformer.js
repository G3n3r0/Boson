window.onload = function() {
    function findIndex(arr,val) {
        for(var i in arr) {
            if(arr[i] == val) {
                return i;
            }
        }
        return false;
    }
    Array.prototype.removeIt = function(val) {
        var s = findIndex(this,val);
        if(s!==false) {
            this.splice(s,1);
        }
    };
    
    var cd = {
        rects: function(a, b) {
            //console.log(a.x, a.y, b.x, b.y);
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
        },
        circs: function(a, b) {
            var r2 = Math.pow(a.centerX-b.centerX,2)+Math.pow(a.centerY-b.centerY,2);
            if(r2<Math.pow(a.rad+b.rad, 2)) {
                return true;
            } else {
                return false;
            }
        }
    };
    
    var canvas = document.getElementById("c");
    window.stage = new Stage(canvas);
    
    function Player(x,y,imgSrc) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.t = this;
        this.imgSrc = imgSrc;
        this.img.onload = function(e) {
            //console.log(t);
            //t.imgLoaded = true;
            var w = 56;
            var h = 80;
            this.t.fdata = {
                i1: 0,
                i2: 1,
                i3: 2,
                r1: 3,
                r2: 4,
                r3: 5
            };
            this.t.sheet = new SpriteSheet(this, w, h, this.t.fdata);
            this.t.bit = new BitmapSequence(this.t.sheet);
            this.t.bit.gotoAndStop("i1");
            this.t.bit.x = this.t.x;
            this.t.bit.y = this.t.y;
            this.t.bit.scaleX = this.t.bit.scaleY = 0.75*(canvas.width/480);
            //this.t.spd[0] *= this.t.bit.scaleX;
            //this.t.spd[1] *= this.t.bit.scaleY;
            
            /*this.t.width = this.width*this.t.bit.scaleX;
            this.t.height = this.height*this.t.bit.scaleX;*/
            this.t.width = w*this.t.bit.scaleX;
            this.t.height = h*this.t.bit.scaleX;
            
            stage.addChild(this.t.bit);
            stage.update();
            
            Ticker.setFPS(16);
            Ticker.setPaused(false);
            Ticker.addListener(window);
        };
        this.img.src = imgSrc;
        this.xvel = 0;
        this.yvel = 0;
        this.onGround = false;
        this.spd = [16, 25];
        this.stepNum = 1;
        
        this.update = function(u,d,l,r) {
            this.stepNum += 0.25;
            if(this.stepNum>3) {
                this.stepNum = 1;
            }
            var stp = Math.floor(this.stepNum);
            if(!this.onGround) {
                this.yvel -= 2;
            }
            if(this.onGround && u) {
                this.yvel = this.spd[1];
                this.onGround = false;
            }
            if(r) {
                this.xvel = this.spd[0];
                this.bit.gotoAndStop("r"+stp);
            }
            if(l) {
                this.xvel = -this.spd[0];
            }
            if(!(l||r)) {
                this.xvel = 0;
                this.bit.gotoAndStop("i"+stp);
            }
            /*this.y -= this.yvel;
            this.onGround = false;
            this.collideY();
            this.x += this.xvel;
            this.collideX();*/
            
            this.x += this.xvel;
            if(this.x<=-this.width) {
                this.x = canvas.width;
            } else if(this.x>=canvas.width) {
                this.x = 0;
            }
            this.collideX();
            this.y -= this.yvel;
            this.onGround = false;
            this.collideY();
            
            //this.onGround = false;
            
            if(this.y>=canvas.height-this.height) {
                this.onGround = true;
                this.yvel = 0;
                this.y = canvas.height-this.height;
            }
            /*for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.yvel>0) {
                        this.y = p.y+p.height;
                    }
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        this.onGround = true;
                        this.yvel = 0;
                    }
                }
            }*/
            //console.log(this.y);
            //console.log(this, t);
            if(this.bit) {
                this.bit.x = this.x;
                this.bit.y = this.y;
            }
            stage.addChild(this.bit);
        };
        this.collideX = function() {
            //for(var i=0;i<enems.length;i++) {
                if(cd.rects(this, enem) && enem.loaded) {
                    //console.log("derp");
                    var p = enem;
                    //console.log(this, p);
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                }
            //}
        };
        this.collideY = function() {
            //for(var i=0;i<enems.length;i++) {
                if(cd.rects(this, enem) && enem.loaded) {
                    //console.log("derp");
                    var p = enem;
                    //console.log(this, p);
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        //this.onGround = true;
                        stage.removeChild(p.bit);
                        //enems.removeIt(p);
                        //window.enem = new Enemy(0.75*canvas.width,canvas.height-81,enemSrc);
                        window.enem = new Enemy(enemStrt[0],enemStrt[1],enemSrc);
                        //window.player = new Player(pStrt[0],pStrt[1],pSrc);
                        window.enemHealth -= 1;
                        if(enemHealth<=0) {
                            window.player = null;
                            window.enem = null;
                            stage.removeAllChildren();
                            console.log(stage.children);
                            stage.update();
                            alert("You win!");
                            init();
                        }
                        player.x = pStrt[0];
                        player.y = pStrt[1];
                        Ticker.setPaused(true);
                        this.yvel = 0;
                    }
                    if(this.yvel>0) {
                        //this.y = p.y+p.height;
                    }
                }
            //}
        };
    }
    
    function Platform(x,y,imgSrc) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.t = this;
        this.imgSrc = imgSrc;
        this.img.onload = function(e) {
            //console.log(t);
            //t.imgLoaded = true;
            this.t.bit = new Bitmap(this);
            this.t.bit.x = this.t.x;
            this.t.bit.y = this.t.y;
            this.t.bit.scaleX = this.t.bit.scaleY = 0.75*(canvas.width/480);
            
            this.t.width = this.width*this.t.bit.scaleX;
            this.t.height = this.height*this.t.bit.scaleX;
            stage.addChild(this.t.bit);
            stage.update();
        };
        this.img.src = imgSrc;
        this.xvel = 0;
        this.yvel = 0;
        this.onGround = false;
        
        this.update = function() {
            if(!this.onGround) {
                this.yvel -= 2;
            }
            /*if(this.onGround && u) {
                this.yvel = 20;
                this.onGround = false;
            }
            if(r) {
                this.xvel = 10;
            }
            if(l) {
                this.xvel = -10;
            }
            if(!(l||r)) {
                this.xvel = 0;
            }*/
            /*this.y -= this.yvel;
            this.onGround = false;
            //this.collideY();
            this.x += this.xvel;
            //this.collideX();*/
            
            this.x += this.xvel;
            //this.collideX();
            this.y -= this.yvel;
            this.onGround = false;
            //this.collideY();
            
            //this.onGround = false;
            
            if(this.y>=canvas.height-this.height) {
                this.onGround = true;
                this.yvel = 0;
                this.y = canvas.height-this.height;
            }
            /*for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.yvel>0) {
                        this.y = p.y+p.height;
                    }
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        this.onGround = true;
                        this.yvel = 0;
                    }
                }
            }*/
            //console.log(this.y);
            //console.log(this, t);
            if(this.bit) {
                this.bit.x = this.x;
                this.bit.y = this.y;
            }
        };
        /*this.collideX = function() {
            for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                }
            }
        };
        this.collideY = function() {
            for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        //this.onGround = true;
                        stage.removeChild(p.bit);
                        platforms.removeIt(p);
                        this.yvel = 0;
                    }
                    if(this.yvel>0) {
                        this.y = p.y+p.height;
                    }
                }
            }
        };*/
    }
    function Enemy(x,y,imgSrc) {
        this.x = x;
        this.y = y;
        this.img = new Image();
        this.img.t = this;
        this.imgSrc = imgSrc;
        this.img.onload = function(e) {
            //console.log(t);
            //t.imgLoaded = true;
            //var w = 56;
            //var h = 80;
            /*this.t.fdata = {
                i1: 0,
                i2: 1,
                i3: 2,
                r1: 3,
                r2: 4,
                r3: 5
            };*/
            //this.t.sheet = new SpriteSheet(this, w, h, this.t.fdata);
            this.t.bit = new Bitmap(this);
            this.t.bit.x = this.t.x;
            this.t.bit.y = this.t.y;
            this.t.bit.scaleX = this.t.bit.scaleY = 0.75*(canvas.width/480);
            //this.t.spd[0] *= this.t.bit.scaleX;
            //this.t.spd[1] *= this.t.bit.scaleY;
            
            this.t.width = this.width*this.t.bit.scaleX;
            this.t.height = this.height*this.t.bit.scaleX;
            
            stage.addChild(this.t.bit);
            this.t.loaded = true;
            Ticker.setPaused(false);
            stage.update();
            
            //Ticker.setFPS(16);
            //Ticker.addListener(window);
        };
        this.img.src = imgSrc;
        this.xvel = 0;
        this.yvel = 0;
        this.onGround = false;
        this.spd = [16, 25];
        this.stepNum = 1;
        
        this.update = function() {
            var u2,l2,r2,d2;
            this.stepNum += 0.25;
            if(this.stepNum>3) {
                this.stepNum = 1;
            }
            var stp = Math.floor(this.stepNum);
            if(!this.onGround) {
                this.yvel -= 2;
            }
            
            if(this.onGround) {
                u2 = true;
            }
            if(player.y<this.y && player.x==this.x) {
                var m = parseInt(Math.random()*2, 10);
                if(m===0) {
                    l2 = true;
                } else {
                    r2 = true;
                }
            }
            if(player.x<this.x) {
                l2 = true;
            }
            if(player.x>this.x) {
                r2 = true;
            }
            
            if(this.onGround && u2) {
                this.yvel = this.spd[1];
                this.onGround = false;
            }
            if(r2) {
                this.xvel = this.spd[0];
            }
            if(l2) {
                this.xvel = -this.spd[0];
            }
            if(!(l2||r2)) {
                this.xvel = 0;
            }
            if(d2) {
            }
            /*this.y -= this.yvel;
            this.onGround = false;
            this.collideY();
            this.x += this.xvel;
            this.collideX();*/
            
            this.x += this.xvel;
            if(this.x<=-this.width) {
                this.x = canvas.width;
            } else if(this.x>=canvas.width) {
                this.x = 0;
            }
            this.collideX();
            this.y -= this.yvel;
            this.onGround = false;
            this.collideY();
            
            //this.onGround = false;
            
            if(this.y>=canvas.height-this.height) {
                this.onGround = true;
                this.yvel = 0;
                this.y = canvas.height-this.height;
            }
            /*for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.yvel>0) {
                        this.y = p.y+p.height;
                    }
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        this.onGround = true;
                        this.yvel = 0;
                    }
                }
            }*/
            //console.log(this.y);
            //console.log(this, t);
            if(this.bit) {
                this.bit.x = this.x;
                this.bit.y = this.y;
            }
            stage.addChild(this.bit);
        };
        this.collideX = function() {
            /*for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.xvel>0) {
                        this.x = p.x-this.width;
                    }
                    if(this.xvel<0) {
                        this.x = p.x+p.width;
                    }
                }
            }*/
        };
        this.collideY = function() {
            /*for(var i=0;i<platforms.length;i++) {
                if(cd.rects(this, platforms[i])) {
                    //console.log("derp");
                    var p = platforms[i];
                    //console.log(this, p);
                    if(this.yvel<0) {
                        this.y = p.y-this.height;
                        //this.onGround = true;
                        stage.removeChild(p.bit);
                        platforms.removeIt(p);
                        this.yvel = 0;
                    }
                    if(this.yvel>0) {
                        this.y = p.y+p.height;
                    }
                }
            }*/
            if(cd.rects(this, player)) {
                if(this.yvel<0) {
                    this.y = player.y-this.height;
                    stage.removeChild(player.bit);
                    //window.player = new Player(0,0,pSrc);
                    window.player = new Player(pStrt[0],pStrt[1],pSrc);
                    window.enem.x = enemStrt[0];
                    window.enem.y = enemStrt[1];
                    window.pHealth -= 1;
                    if(pHealth<=0) {
                        window.player = null;
                        window.enem = null;
                        stage.removeAllChildren();
                        console.log(stage.children);
                        stage.update();
                        alert("You lose!");
                        init();
                    }
                    Ticker.setPaused(true);
                    this.yvel = 0;
                }
            }
        };
    }
    
    //var u,d,l,r = false;
    var spd = 3;
    document.onkeydown = function(e) {
        if(e.which===38) {
            //playerBit.y -= 2;
            u = true;
        } else if(e.which===40) {
            //playerBit.y += 2;
            d = true;
        } else if(e.which===39) {
            r = true;
        } else if(e.which===37) {
            l = true;
        } else if(e.which===16) {
            spd = 9;
        }
    };
    document.onkeyup = function(e) {
        //console.log(e.which)
        if(e.which===38) {
            //playerBit.y -= 2;
            u = false;
        } else if(e.which===40) {
            //playerBit.y += 2;
            d = false;
        } else if(e.which===39) {
            r = false;
        } else if(e.which===37) {
            l = false;
        } else if(e.which===16) {
            spd = 3;
        }
    };
    
    window.tick = function() {
        stage.removeAllChildren();
        console.log(stage.children);
        player.update(u,d,l,r);
        /*for(var i=0;i<enems.length;i++) {
            enems[i].update();
        }*/
        enem.update();
        
        stage.update();
    };
    
    function titleScreen() {
        var img = new Image();
        var bit;
        img.onload = function(e) {
            bit = new Bitmap(this);
            bit.x = 0;
            bit.y = 0;
            bit.scaleX = bit.scaleY = canvas.width/this.width;
            stage.addChild(bit);
            stage.update();
        };
        img.src = "Graphics/boson_bg.png";
    }
    
    function init() {
        //window.u,window.d,window.l,window.r = false;
        window.u= false;
        window.d = false;
        window.l = false;
        window.r = false;
        if(!!window.stage) {
            stage.removeAllChildren();
        }
        console.log(stage.children);
        
        //loadMap(map,mapIndex);
        
        //stage.update();
        
        //window.playerImg = new Image();
        //playerImg.onload = function(e) {
            /*window.playerBit = new Bitmap(this);
            playerBit.x = canvas.width/2-this.width/2;
            playerBit.y = canvas.height/2-this.height/2;
            playerBit.width = this.width;
            playerBit.height = this.height;
            stage.addChild(playerBit);*/
        window.pSrc = "Graphics/kit_from_firefox.png";
        window.pStrt = [0.25*canvas.width, canvas.height-81];
        window.pHealth = 5;
        window.player = new Player(pStrt[0],pStrt[1],pSrc);
        //window.enems = [];
        window.enemSrc = "Graphics/wilber_idle_2.png";
        window.enemStrt = [0.75*canvas.width, canvas.height-81];
        window.enemHealth = 5;
        window.enem = new Enemy(enemStrt[0],enemStrt[1],enemSrc);
        //var p = new Enemy(0.75*canvas.width,canvas.height-81,enemSrc);
        //enems.push(p);
            //stage.update();
        //};
        //playerImg.src = "Graphics/botty_0.png";
        stage.mouseEnabled = true;
        stage.onMouseDown = function(e) {
            //console.log(e);
            //enems.push(new Enemy(e.stageX,e.stageY,enemSrc));
        };
        /*setTimeout(function() {
            Ticker.setFPS(16);
            Ticker.addListener(window);
        }, 1000);*/
    }
    //init();
    titleScreen();
    
    document.getElementById("info").onclick = function(e) {
        alert("Boson: A GNU Fight to the Finish.");
    };
};