var bz, by, bx;

function newLevel(){
    bz = 0;
    by = 0;
    bx = 0;
}

function useItem(x, y, z){
    bx = x;
    by = y;
    bz = z;
}

function modTick(){
    var player = {z:getPlayerZ(), x:getPlayerX()};
    var point = {z:bz, x:bx};
    clientMessage(getAngle(player, point)+"");
}

function getAngle(player, point){
    var z = point.z-player.z;
    var x = point.x-player.x;
    var hptn = Math.sqrt((z*z)+(x*x));
    var angle = Math.acos(z/hptn);
    if(z<0){
        if(x>0){
            angle = Math.PI-angle;
        } else {
            angle = ((-1)*Math.PI)-angle;
        }
    }
    return angle;
}
