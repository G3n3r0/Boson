window.onload = function() {
    var canvas = document.getElementById("c");
    //var size = 96;
    var size = canvas.width/map[0][0].length;
    var houses = [];
    //console.log(size);
    function loadMap(map) {
        for(var i=0;i<map.length;i++) {
            for(var j=0;j<map[i].length;j++) {
                //console.log(map[i][j]);
                //console.log(map[i][j].split(""));
                var split = map[i][j].split("");
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
                    } else if(split[k]=="o") {
                        var g = new Graphics();
                        g.beginStroke("#000");
                        g.beginFill("rgba(255,0,0,1)");
                        g.drawRect(0,0,size,size);
                        var s = new Shape(g);
                        s.x = k*size;
                        s.y = j*size;
                        //console.log(s.x,s.y);
                        stage.addChild(s);
                    }
                }
            }
        }
        stage.update();
    }
    function init() {
        window.stage = new Stage(canvas);
        console.log(stage);
        
        loadMap(map);
        
        //stage.update();
        Ticker.setFPS(16);
        Ticker.addListener(window);
        
        window.playerImg = new Image();
        playerImg.onload = function(e) {
            window.playerBit = new Bitmap(this);
            playerBit.x = canvas.width/2-this.width/2;
            playerBit.y = canvas.height/2-this.height/2;
            stage.addChild(playerBit);
            stage.update();
        };
        playerImg.src = "Graphics/botty_0.png";
    }
    init();
};