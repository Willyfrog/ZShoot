window.onload = function () {
    var WIDTH = 800,
        HEIGHT = 600,
        PLAYER_SPEED = 5,
        BULLET_SPEED = 10,
        Z_SPEED = 3,
        Z_DISTANCE_INI = 200,
        Z_DISTANCE_END = 300,
        DEBUG = true,
	ROAD_SIZE = 80,
	BUILD_MIN_SIZE = ROAD_SIZE*3;

    var minimap = [];

    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas.init();
    Crafty.scene("LoadingScene", function () {
        console.log("Loading Assets");
        //Crafty.load("sprites.png", function (){})

    });

    function divide_square(x1,y1,w,h){
	console.log('diviendo');
	// si es el tamaño minimo, no dividimos
	if (w< BUILD_MIN_SIZE && h<BUILD_MIN_SIZE)
	    return [[x1, y1, w, h]];
	// si no tiene suficiente ancho->en altura fijo
	var divancho = true;
	if (w<BUILD_MIN_SIZE){
	    divancho = false;
	} else if (h>BUILD_MIN_SIZE){
	    divancho = (Crafty.math.randomInt(1,3)>1);
	}
	
	console.log("divancho: " + divancho);  
	if (divancho){
	    var w2 = Crafty.math.randomInt(ROAD_SIZE,w - ROAD_SIZE*2);
	    return [[x1,y1, w2, h], [x1+w2+ROAD_SIZE, y1, w-w2-ROAD_SIZE, h]];
	}
	else {
	    var h2 = Crafty.math.randomInt(ROAD_SIZE,h - ROAD_SIZE);
	    return [[x1,y1, w, h2],[x1, y1+h2+ROAD_SIZE, w, h-h2-ROAD_SIZE]];
	}
    }

    function gen_map(maxx, maxy){
	var pasadas = 5;
	var city = [[ROAD_SIZE,ROAD_SIZE,maxx-ROAD_SIZE,maxy - ROAD_SIZE]];
	console.log("city inicial: " + city);
	for (var i=0; i<pasadas; i++){
	    var nucity = [];
	    for(var s=0; s<city.length; s++){
		nucity = nucity.concat(divide_square(city[s][0],city[s][1],city[s][2],city[s][3]));
	    }
	    city = nucity;
	}
	console.log("ciudad: " + city);
	return city;
    }
    
    Crafty.c("Building", {
        init: function () {
            this.addComponent("2D, Canvas, Color, Collision");
            this.color("grey");
            this.onHit("Bullet", function (hitters) {
                // TODO: sonido disparo a edificio
                hitters[0].obj.destroy();
            });
        },

       // square: function (px, py, side) {
       //
       //     this.attr({x: px, y: py, w: side, h: side});
       //     this.collision( new Crafty.polygon([[2, 2], [this._w - 2, 2], [this._w - 2, this._h - 2], [2, this._h - 2]]));
       //     //this.collision( [0, 0], [this.w , 0], [this.w , this.h ], [0, this.h]);
       //
       //     return this;
       // },
        build: function (px, py, sidex, sidey) {
	    if (sidey==undefined) {
		sidey = sidex;
	    }
            this.attr({x: px, y: py, w: sidex, h: sidey});
            this.collision( new Crafty.polygon([[2, 2], [this._w - 2, 2], [this._w - 2, this._h - 2], [2, this._h - 2]]));
            //this.collision( [0, 0], [this.w , 0], [this.w , this.h ], [0, this.h]);

            return this;
        }
    });

    Crafty.scene("GameOver", function () {
        Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 40, y: HEIGHT / 3 }).text("GAME OVER");
        Crafty.background("#555");
        console.log("GameOver");
    });

    Crafty.c("Player", {
        init: function () {
            this.addComponent("2D, Canvas, Multiway, Collision, Color, Mouse");
            this.attr({h: 32, w: 32});
            //TODO: collision contra Zs
            this.collision(new Crafty.polygon([0,0],[this._w, 0],[this._w, this._h], [0, this._h]));
            this.bind("onClick", function (e) {
                console.log("ouch");
            });
            this.bind("Moved", function (old) {
                if (this.hit("Building")) {
                    this.attr({x:old.x, y:old.y});
                }
            });
            this.onHit('Z', function (){
                this.destroy();
                Crafty.scene("GameOver");
            });
        },
        //configuracion de controles
        multiway_config: function (speed, up_key, down_key, left_key, right_key) {
            var keys = {};
            keys[up_key] = -90;
            keys[left_key] = 180;
            keys[down_key] = 90;
            keys[right_key] = 0;
            this.multiway(speed, keys);
            return this;
        },
        //establece el color del pj (TODO: sustituir por sprite)
        color_config: function (color) {
            this.color(color);
            return this;
        },
        //establece la posicion inicial
        position_config: function(xpos, ypos) {
            this.attr({x: xpos, y: ypos});
            return this;
        }
    });

    Crafty.c("Bullet", {
        init: function() {
            this.addComponent("2D, Canvas, Collision, Color");
            this.attr({h: 2, w: 2, dmg: 1});
            this.color('white');
        },
        firebullet: function (ox, oy, dx, dy) {
            this.attr({x: ox, y: oy,
                dir: new Crafty.math.Vector2D(dx, dy)});
            this.dir = this.dir.subtract(new Crafty.math.Vector2D(ox, oy));
            this.dir = this.dir.scaleToMagnitude(BULLET_SPEED);
            this.bind("EnterFrame", function() {
                this.x += this.dir.x;
                this.y += this.dir.y;
                if (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT) {
                    this.destroy();
                }
            });
        }
    });

    Crafty.c("Shooter", {
        init: function () {
            this.addComponent("2D, Mouse");
            this.attr({x: 0, y: 0, w: WIDTH, h: HEIGHT});
            console.log("I'll shoot from x" + this._x);
            this.bind('Click', function (e) {
                console.log("fire, exclamation mark");
                var b = Crafty.e("Bullet");
                b.firebullet(this.shooter._x + 16, this.shooter._y + 16, Crafty.mousePos.x, Crafty.mousePos.y);
            });
        },
        set_shooter: function (p) {
            this.shooter = p;
        }
    });

    function entityDistance(e1, e2){
        return Crafty.math.distance(e1._x, e1._y, e2._x, e2._y);
    }

    function closerOne(e1, listEntities){
        var p = null,
            d = 0,
            d2 = 0;

        if (listEntities.length>0){
            p = listEntities[0];
            d = entityDistance(e1, p);
            for (var i=1; i<listEntities.length; i++){
                d2 = entityDistance(e1, listEntities[i]);
                if (d2 < d){
                    d = d2;
                    p = listEntities[i];
                }
            }
        }
        return p;
    }
    
    Crafty.c("Z", {
        init: function () {
            this.addComponent("2D, Canvas, Color, Collision");
            this.attr({w: 32, h: 32, life: 2, chaseafter:[], target: null}).color("green");
            this.collision(new Crafty.polygon([0,0],[this._w, 0],[this._w, this._h], [0, this._h]));
            this.onHit("Bullet", function (hitters) {
                var b = hitters[0].obj;
                this.life -= b.dmg;
                b.destroy();
                console.log("ow! damage!");
                if (this.life <= 0) {
                    this.destroy();
                }
            });

            this.bind("EnterFrame", function () {
                // check for new target

                if (this.chaseafter.length!==0){
                    var p = null,
                        dist = 0;

                    if (this.chaseafter.length===1)
                        p = this.chaseafter[0];
                    else {
                        p = closerOne(this, this.chaseafter);
                    }
                    
                    dist =  entityDistance(this, p);
                    if (entityDistance(this, p) < Z_DISTANCE_INI){ //within smell distance?
                        if (this.target != p) {
                            console.log("oh! hi, nice brains!");
                            this.target = p;
                        }
                    }

                    if (this.target != null) {
                        if (dist > Z_DISTANCE_END) {
                            this.target = null; //ran away
                        }

                    }
                    if (this.target != null){
                        var v = new Crafty.math.Vector2D(this.target._x - this._x, this.target._y - this._y);
                        v = v.scaleToMagnitude(Z_SPEED);
                        var old = this._x;
                        this.x += v.x;
                        if (this.hit('Building') || this.hit('Z')){
                            this.x = old;
                        }
                        old = this._y;
                        this.y += v.y;
                        if (this.hit('Building') || this.hit(' Z')){
                            this.y = old;
                        }
                    }
                }
            });
        },
        position: function (ox, oy) {
            this.attr({x: ox, y: oy});
            return this;
        },
        chase: function (players) {
            if (players instanceof Array){
                this.chaseafter.concat(players);
            } else {
                this.chaseafter.push(players);
            }
            console.log("chasing after " + this.chaseafter.length + " players");
        }
    });

    function spawnZ(x, y, chaselist){
        console.log("spawning a Z in " + x + ", " + y);
        var z = Crafty.e("Z");
        z.chase(chaselist);
        return z.position(x, y);

    }

    Crafty.c("Generator", {
        init: function () {
	    return true;
        }
    });

    Crafty.scene("GameScene", function () {
        console.log("Now on GameScene");
	minimap = gen_map(1280,800);
	var b = null;
	for (var i=0; i<minimap.length; i++){
	    b = Crafty.e("Building");
            b.build(minimap[i][0], minimap[i][1], minimap[i][2], minimap[i][3]);
	}
        Crafty.background("#222");


        //marcadores
        var s = Crafty.e("Shooter"),
            p1 = Crafty.e("Player");
        s.set_shooter(p1);
        p1.multiway_config(PLAYER_SPEED, "W", "S", "A", "D").color_config("blue").position_config(0, 10);
        //Crafty.viewport.clampToEntities = DEBUG;
        Crafty.viewport.follow(p1, 0, 0);


        this.bind("EndGame", function () {
            Crafty.scene("GameOver");
        });

        spawnZ(180, 40, p1);
        spawnZ(500, 480, p1);

    });

    Crafty.scene("GameScene");
};