window.onload = function () {
    var WIDTH = 800,
        HEIGHT = 600,
        PLAYER_SPEED = 5,
        BULLET_SPEED = 10,
        Z_SPEED = 3;
    
    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas.init();
    Crafty.scene("LoadingScene", function () {
        console.log("Loading Assets");
        //Crafty.load("sprites.png", function (){})
        
    });
    
    Crafty.scene("GameOver", function () {
        Crafty.e("2D, Text, DOM").attr({x: WIDTH / 2 - 40, y: HEIGHT / 3 }).text("GAME OVER");
        Crafty.background("#555");
        console.log("GameOver");
    });
    
    Crafty.c("Player", {
        init:function() {
            this.addComponent("2D, Canvas, Multiway, Collision, Color, Mouse");
            this.attr({h:32, w:32});
            //TODO: collision contra Zs
            this.bind("onClick", function (e) {
                console.log("ouch");
            });
        },
        //configuracion de controles
        multiway_config: function(speed, up_key, down_key, left_key, right_key){
            var keys = {};
            keys[up_key] = -90;
            keys[left_key] = 180;
            keys[down_key] = 90;
            keys[right_key] = 0;
            this.multiway(speed, keys);
            return this;
        },
        //establece el color del pj (TODO: sustituir por sprite)
        color_config: function(color) {
            this.color(color);
            return this;
        },
        //establece la posicion inicial
        position_config: function(xpos, ypos) {
            this.attr({x:xpos, y:ypos});
            return this;
        }
    });

    Crafty.c("Bullet", {
        init: function() {
            this.addComponent("2D, Canvas, Collision, Color");
            this.attr({h:2, w:2});
            //TODO: collision contra Zs
            this.color('white');
        },

        firebullet: function(ox, oy, dx, dy) {
            this.attr({x: ox, y: oy,
                dir: new Crafty.math.Vector2D(dx, dy)});
            this.dir = this.dir.subtract(new Crafty.math.Vector2D(ox, oy));
            this.dir = this.dir.scaleToMagnitude(BULLET_SPEED);
            this.bind("EnterFrame", function() {
                this.x += this.dir.x;
                this.y += this.dir.y;
                if (this.x < 0 || this.x > WIDTH || this.y < 0 || this.y > HEIGHT){
                    this.destroy();
                }
            });
        }
    });
    Crafty.c("Shooter", {
        init: function() {
            this.addComponent("2D, Mouse");
            this.attr({x: 0, y: 0, w:WIDTH, h:HEIGHT});
            console.log("I'll shoot from x" + this.x);
            this.bind('Click', function(e) {
                console.log("fire, exclamation mark");
                var b = Crafty.e("Bullet");
                b.firebullet(this.shooter.x+16, this.shooter.y +16, Crafty.mousePos.x, Crafty.mousePos.y);
            });
        },
        set_shooter: function(p) {
            this.shooter = p;
        }
    });

    Crafty.scene("GameScene", function () {
        console.log("Now on GameScene");
        Crafty.background("#222");
        //marcadores
        var s = Crafty.e("Shooter");
        var p1 = Crafty.e("Player");
        s.set_shooter(p1);
        p1.multiway_config(PLAYER_SPEED, "W", "S", "A", "D").color_config("blue").position_config(WIDTH/2 - 10, HEIGHT/2);
       
        //p1.addComponent("Shooter");

        this.bind("EndGame", function () {
            Crafty.scene("GameOver");
        });

    });

    Crafty.scene("GameScene");
};