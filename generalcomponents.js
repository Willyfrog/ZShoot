// sacado de http://jsfiddle.net/MmLZr/10/
// posible mejora: comprobar si se ha movido
Crafty.c("ViewportRelative", {
    _viewportPreviousX: 0,
    _viewportPreviousY: 0,
    _viewportStartX: 0,
    _viewportStartY: 0,
    init: function() {    
	this.bind("EnterFrame", this._frame); 
    },
    _frame: function() {
	if(this._viewportPreviousX != Crafty.viewport._x) {
	    this._viewportStartX = Crafty.viewport._x;
	    
	    this.x += this._viewportPreviousX;
	    this.x -= Crafty.viewport._x;
	    
	    this._viewportPreviousX = this._viewportStartX;
	}
        
	if(this._viewportPreviousY != Crafty.viewport._y) {
	    this._viewportStartY = Crafty.viewport._y;
	    
	    this.x += this._viewportPreviousY;
	    this.x -= Crafty.viewport._y;
	    
	    this._viewportPreviousX = this._viewportStartX;
	}
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