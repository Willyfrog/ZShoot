window.onload = function () {
    var WIDTH = 800,
        HEIGHT = 600,
        PLAYER_SPEED = 5,
        BULLET_SPEED = 10,
        Z_SPEED = 3,
        Z_DISTANCE_INI = 200,
        Z_DISTANCE_END = 300,
        DEBUG = true;

    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas.init();
    Crafty.scene("LoadingScene", function () {
        console.log("Loading Assets");
        //Crafty.load("sprites.png", function (){})

    });

    Crafty.c("Building", {
        init: function () {
            this.addComponent("2D, Canvas, Color, Collision");
            this.color("grey");
            this.onHit("Bullet", function (hitters) {
                // TODO: sonido disparo a edificio
                hitters[0].obj.destroy();
            });
        },

        square: function (px, py, side) {

            this.attr({x: px, y: py, w: side, h: side});
            this.collision(
                //new Crafty.polygon([this.x, this.y], [this.x + side, this.y], [this.x + side, this.y + side], [this.x, this.y + side])
                new Crafty.polygon([2, 2], [side-2, 2], [side-2, side-2], [2, side-2])
            );

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
            this.bind("onClick", function (e) {
                console.log("ouch");
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
            // TODO: collision contra Zs
            this.color('white');
        },
        sayhi: function () {
            console.log("hi!");
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
            console.log("I'll shoot from x" + this.x);
            this.bind('Click', function (e) {
                console.log("fire, exclamation mark");
                var b = Crafty.e("Bullet");
                b.firebullet(this.shooter.x + 16, this.shooter.y + 16, Crafty.mousePos.x, Crafty.mousePos.y);
            });
        },
        set_shooter: function (p) {
            this.shooter = p;
        }
    });

    function entityDistance(e1, e2){
        return Crafty.math.distance(e1.x, e1.y, e2.x, e2.y);
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
                        var v = new Crafty.math.Vector2D(this.target.x - this.x, this.target.y - this.y);
                        v = v.scaleToMagnitude(Z_SPEED);
                        this.x += v.x;
                        this.y += v.y;
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

        }
    });

    Crafty.scene("GameScene", function () {



        console.log("Now on GameScene");
        Crafty.background("#222");
        var b = Crafty.e("Building");
        b.square(30, 30, 30);
        //marcadores
        var s = Crafty.e("Shooter"),
            p1 = Crafty.e("Player");
        s.set_shooter(p1);
        p1.multiway_config(PLAYER_SPEED, "W", "S", "A", "D").color_config("blue").position_config(WIDTH / 2 - 10, HEIGHT / 2);
        //Crafty.viewport.clampToEntities = DEBUG;
        Crafty.viewport.follow(p1, 0, 0);


        this.bind("EndGame", function () {
            Crafty.scene("GameOver");
        });

        spawnZ(80, 40, p1);
        spawnZ(500, 480, p1);

    });

    Crafty.scene("GameScene");
};