var pz, py, px;
var z, y, x;
var lz, ly, lx;
var hptn;
var quadrant;
var angle;

function newLevel(){
    z = 0;
    y = 0;
    x = 0;
}

function modTick(){
    pz = Player.getZ();
    py = player.getY();
    px = Player.getX();
    lz = z-pz;
    ly = y-py;
    lx = x-px;
    hptn = Math.sqrt(lz*lz+lx*lx);
    clientMessage(Math.acos(((lz*lz)+(lx*lx)-(hptn*hptn))/(2*lz*lx)));
}
