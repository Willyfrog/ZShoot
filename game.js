window.onload = function () {

    var minimap = [];

    Crafty.init(WIDTH, HEIGHT);
    Crafty.canvas.init();

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
                if (this.x < 0 || this.x > WORLD_WIDTH || this.y < 0 || this.y > WORLD_HEIGHT) {
                    this.destroy();
                }
            });
        }
    });

    Crafty.c("Shooter", {
        init: function () {
            this.addComponent("2D, Mouse");
            this.attr({x: -80, y: -80, w: WORLD_WIDTH + 80, h: WORLD_HEIGHT + 80});
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
    
    Crafty.c("Generator", {
        init: function () {
	    return true;
        }
    });

    Crafty.scene("GameScene");
};