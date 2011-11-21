window.onload = function() {
    var mapIndex = 1;
    var cd = {
        rects: function(a, b) {
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
    //var size = 96;
    var size = canvas.width/map[0][0].length;
    //var size = canvas.width/map[0]["map"][0].length;
    var houses = [];
    //console.log(size);
    function loadMap(map,mapIndex) {
        console.log(map);
        var hInd = 0;
        //var map1 = map[0]["map"];
        //console.log(map1);
        //for(var i=0;i<map.length;i++) {
        var i = mapIndex;
        console.log(hMap[i]);
            for(var j=0;j<map[i].length;j++) {
                //console.log(map[i][j]);
                //console.log(map[i][j].split(""));
                var split = map[i][j].split("");
                console.log(split);
                for(var k=0;k<split.length;k++) {
                    //console.log(k);
                    if(split[k]=="-") {
                        var g = new Graphics();
                        g.beginStroke("#000");
                        g.beginFill("rgba(255,255,255,1)");
                        g.drawRect(0,0,size,size);
                        var s = new Shape(g);
                        s.x = k*size;
                        s.y = j*size;
                        s.alpha = 0.1;
                        //console.log(s.x,s.y);
                        stage.addChild(s);
                    } else if(split[k]=="b") {
                        var g = new Graphics();
                        g.beginStroke("#000");
                        g.beginFill("rgba(0,0,255,1)");
                        g.drawRect(0,0,size,size);
                        var s = new Shape(g);
                        s.x = k*size;
                        s.y = j*size;
                        s.alpha = 0.1;
                        //console.log(s.x,s.y);
                        stage.addChild(s);
                    } else if(split[k]=="o") {
                        var g = new Graphics();
                        g.beginStroke("#000");
                        g.beginFill("rgba(255,0,0,1)");
                        g.drawRect(0,0,size,size);
                        var s = new Shape(g);
                        s.x = k*size;
                        s.y = j*size;
                        s.width = size;
                        s.height = size;
                        s.mapInd = i;
                        s.hInd = hInd;
                        houses.push(s);
                        hInd += 1;
                        //console.log(s.x,s.y);
                        stage.addChild(s);
                    }
                }
            }
        //}
        stage.update();
    }
    var u,d,l,r = false;
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
    var spd = 3;
    window.inHouse = false;
    window.tick = function() {
        //console.log(playerBit.y+playerBit.height, canvas.height,mapIndex,map.length);
        //console.log(canvas.height-spd);
        if(u && !(mapIndex===0 && playerBit.y<spd)) {
            playerBit.y -= spd;
        } else if(d && !(mapIndex===map.length-1 && playerBit.y+playerBit.height>canvas.height-spd)) {
            playerBit.y += spd;
        }
        if(l && playerBit.x>0) {
            playerBit.x -= spd;
        } else if(r && playerBit.x+playerBit.width<=canvas.width) {
            playerBit.x += spd;
        }
        for(var i=0;i<houses.length;i++) {
            if(cd.rects(playerBit, houses[i])) {
                //console.log("Captain, the Shi'ar have collided into both the Enterprise and the Tardis!");
                house = houses[i];
                houses = [];
                stage.removeAllChildren();
                console.log("derp", house.hInd, hMap[house.mapInd][house.hInd])
                loadMap(hMap[house.mapInd], house.hInd);
                playerBit.x = canvas.width/2-playerBit.width/2;
                playerBit.y = canvas.height/2-playerBit.height/2;
                stage.addChild(playerBit);
                window.inHouse = true;
            }
        }
        if(inHouse) {
            if(playerBit.x<0 || playerBit.y<0 || (playerBit.x+playerBit.width)>canvas.width || (playerBit.y+playerBit.height)>canvas.height) {
                stage.removeAllChildren();
                playerBit.x = canvas.width/2-playerBit.width/2;
                playerBit.y = canvas.height/2-playerBit.height/2;
                loadMap(map,mapIndex);
                stage.addChild(playerBit);
                window.inHouse = false;
            }
        } else {
            if(playerBit.y<0) {
                mapIndex -= 1;
                stage.removeAllChildren();
                playerBit.x = canvas.width/2-playerBit.width/2;
                playerBit.y = canvas.height/2-playerBit.height/2;
                loadMap(map,mapIndex);
                stage.addChild(playerBit);
            } else if(playerBit.y+playerBit.height>canvas.height) {
                mapIndex += 1;
                stage.removeAllChildren();
                playerBit.x = canvas.width/2-playerBit.width/2;
                playerBit.y = canvas.height/2-playerBit.height/2;
                loadMap(map,mapIndex);
                stage.addChild(playerBit);
            }
        }
        stage.update();
    };
    function init() {
        window.stage = new Stage(canvas);
        console.log(stage);
        
        loadMap(map,mapIndex);
        
        //stage.update();
        Ticker.setFPS(16);
        Ticker.addListener(window);
        
        window.playerImg = new Image();
        playerImg.onload = function(e) {
            window.playerBit = new Bitmap(this);
            playerBit.x = canvas.width/2-this.width/2;
            playerBit.y = canvas.height/2-this.height/2;
            playerBit.width = this.width;
            playerBit.height = this.height;
            stage.addChild(playerBit);
            stage.update();
        };
        playerImg.src = "Graphics/botty_0.png";
    }
    init();
};