
function checkAndAddIntersection (x,y) {
    var found = false;
    if (xings[x] == undefined) {
	xings[x] = [];
	xings[x][y] = Crafty.e("Interseccion").origen(x*UNIT_SIZE,y*UNIT_SIZE);
    }
    else if (xings[x][y]==undefined) {
	xings[x][y] = Crafty.e("Interseccion").origen(x*UNIT_SIZE,y*UNIT_SIZE);
    }
    return xings[x][y];
}

var xings = [];

function divide_square(x1,y1,w,h){
    // si es el tamaño minimo, no dividimos
    if (w< BUILD_MIN_SIZE && h<BUILD_MIN_SIZE)
	return [[x1, y1, w, h]];
    // si no tiene suficiente ancho->en altura fijo
    var divancho = true;
    if (w<BUILD_MIN_SIZE) {
	divancho = false;
    } else if (h>BUILD_MIN_SIZE) {
	divancho = (Crafty.math.randomInt(1,3)>1);
    }
    var v1, v2, tempv,
    cruce_x = (x1 - 10),
    cruce_y = (y1 - 10),
    cruce_x2 = (x1 + w),
    cruce_y2 = (y1 + h);
    
    if (divancho) {
	var w2 = Crafty.math.randomInt(10,w - 20);
	v1 = checkAndAddIntersection((x1+w2), (y1 -10));
	v2 = checkAndAddIntersection((x1+w2), (y1 + h));
	v1.south(v2);
	v2.north(v1);
	console.log('ancho');
	tempv = getCloser2Intersection(v1.ox, xings[cruce_x][cruce_y], 'x');
	tempv.paths['E'] = v1;
	v1.paths['W'] = tempv;
	
	tempv = getCloser2Intersection(v1.ox, xings[cruce_x2][cruce_y], 'x');
	tempv.paths['W'] = v1;
	v1.paths['E'] = tempv;
	
	tempv = getCloser2Intersection(v2.ox, xings[cruce_x][cruce_y2], 'x');
	tempv.paths['E'] = v2;
	v2.paths['W'] = tempv;
	
	tempv = getCloser2Intersection(v2.ox, xings[cruce_x2][cruce_y2], 'x');
	tempv.paths['W'] = v2;
	v2.paths['E'] = tempv;
	//add east-west para cada uno
	console.log("para: (" + v1.ox/UNIT_SIZE +"," + v1.oy/UNIT_SIZE + "), (" + v2.ox/UNIT_SIZE + "," + v2.oy/UNIT_SIZE +")");
	return [[x1,y1, w2, h], [x1+w2+10, y1, w-w2-10, h]];
    }
    else {
	var h2 = Crafty.math.randomInt(10,h - 20);
	v1 = checkAndAddIntersection((x1-10), (y1 + h2));
	v2 = checkAndAddIntersection((x1+w), (y1 + h2));
	v1.paths['E']=v2;
	v2.paths['W']=v1;
	console.log('largo');
	tempv = getCloser2Intersection(v1.oy, xings[cruce_x][cruce_y], 'y');
	tempv.paths['N'] = v1;
	v1.paths['S'] = tempv;
	
	tempv = getCloser2Intersection(v1.oy, xings[cruce_x2][cruce_y], 'y');
	tempv.paths['S'] = v1;
	v1.paths['N'] = tempv;
	
	tempv = getCloser2Intersection(v2.oy, xings[cruce_x][cruce_y2], 'y');
	tempv.paths['N'] = v2;
	v2.paths['S'] = tempv;
	
	tempv = getCloser2Intersection(v2.oy, xings[cruce_x2][cruce_y2], 'y');
	tempv.paths['S'] = v2;
	v2.paths['N'] = tempv;

	//add north-south para cada uno
	console.log("para: (" + v1.ox/UNIT_SIZE +"," + v1.oy/UNIT_SIZE + "), (" + v2.ox/UNIT_SIZE + "," + v2.oy/UNIT_SIZE +")");
	return [[x1,y1, w, h2],[x1, y1+h2+10, w, h-h2-10]];
    }
}

function getCloser2Intersection(reference, intersection, axis) {
    //buscar la interseccion mas cercana sin pasarse al lado contrario
    var a = 'ox';
    if (axis != undefined && (axis == 'x' || axis == 'y')) {
	a = 'o' + axis;
    }
    var direction; //funciona al reves ya que es hacia donde queremos acortar
    if (a=='ox') {
	direction = 'E';
	if (intersection[a] > reference) {
	    direction = 'W';
	}
    } else {
	direction = 'S';
	if (intersection[a] > reference) {
	    direction = 'N';
	}
    }
    var v = intersection;
    while ((v.paths[direction] != undefined) && (
	(intersection[a] > reference && intersection.paths[direction][a] > reference) ||
	    (intersection[a] < reference && intersection.paths[direction][a] < reference))) 
	   {
	       v = v.paths[direction];
    }
    return v;

}

function gen_map(maxx, maxy){
    var pasadas = 4;
    var city = [[10,10,maxx - 10,maxy - 10]];
    xings[0] = [];
    xings[0][0] = Crafty.e("Interseccion").origen(0, 0);
    xings[maxx] = [];
    xings[maxx][0] = Crafty.e("Interseccion").origen(maxx * UNIT_SIZE, 0);
    xings[maxx][maxy] = Crafty.e("Interseccion").origen(maxx*UNIT_SIZE, maxy * UNIT_SIZE);
    xings[0][maxy] = Crafty.e("Interseccion").origen(0, maxy*UNIT_SIZE);
    console.log("city inicial: " + city);
    for (var i=0; i<pasadas; i++) {
	//debugger;
	var nucity = [];
	for(var s=0; s<city.length; s++){
	    nucity = nucity.concat(divide_square(city[s][0],city[s][1],city[s][2],city[s][3]));
	}
	city = nucity;
    }
    console.log(xings);
    console.log("#edificios: " + city.length);
    console.log("#intersecciones: " + Crafty("Interseccion").length);
    return city;
}

function build_map(maxx, maxy){
    //generate terrain
    var minimap = gen_map(maxx,maxy);
    //build terrain
    var b = null;
    for (var i=0; i<minimap.length; i++){
	Crafty.e("Building").build(minimap[i][0]*UNIT_SIZE, minimap[i][1]*UNIT_SIZE, minimap[i][2]*UNIT_SIZE, minimap[i][3]*UNIT_SIZE);
    }
}
