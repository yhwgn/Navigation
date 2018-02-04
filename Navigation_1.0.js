var PopupWindow = android.widget.PopupWindow;
var LinearLayout = android.widget.LinearLayout;
var ScrollView = android.widget.ScrollView;
var Button = android.widget.Button;
var EditText = android.widget.EditText;
var TextView = android.widget.TextView;
var CheckBox = android.widget.CheckBox;
var Toast = android.widget.Toast;

var Dialog = android.app.Dialog;
var AlertDialog = android.app.AlertDialog;

var View = android.view.View;
var Gravity = android.view.Gravity;

var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var BitmapDrawable = android.graphics.drawable.BitmapDrawable;
var ColorDrawable = android.graphics.drawable.ColorDrawable;

var DialogInterface = android.content.DialogInterface;

const ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var ui = function(func){ctx.runOnUiThread(new java.lang.Runnable(){run: func});};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(mesg){ui(function(){Toast.makeText(ctx,mesg,1).show();});};

var btnWindow = null;
var warpArray = new Array();
var btnColor = [255,50,180,230];
var NV1_x = 8;
var NV1_y = 80;
var bz, by, bx;

function newLevel(){
    bz = 0;
    by = 0;
    bx = 0;
    if(ModPE.readData("NV1_start") != "Navigation_1.0 - 여흥") {
		ModPE.saveData("NV1_start","Navigation_1.0 - 여흥");
		ModPE.saveData("NV1_x",NV1_x);
		ModPE.saveData("NV1_y",NV1_y);
		makeBtn();
	} else {
		NV1_x = parseInt(ModPE.readData("NV1_x"));
		NV1_y = parseInt(ModPE.readData("NV1_y"));
		makeBtn();
	}
}

function leaveGame() {
	ui(function() {
		if(btnWindow != null) {
			btnWindow.dismiss();
			btnWindow = null;
		}
	});
}

/*function useItem(x, y, z){
    bx = x;
    by = y;
    bz = z;
}

function modTick(){
    var player = {z:getPlayerZ(), x:getPlayerX()};
    var point = {z:bz, x:bx};
    clientMessage(getAngle(player, point)+"");
}*/

function getAngle(player, point){
    var z = point.z-player.z;
    var x = point.x-player.x;
    var hptn = Math.sqrt((z*z)+(x*x));
    var angle = Math.acos(z/hptn);   
    if(x>=0){
        angle = Math.PI-angle;
    } else {
        angle = Math.PI+angle;
    }
    return angle;
}

function makeBtn() {
	ui(function() {
		try {
			var btn = new Button(ctx);
			btn.setText("NV");
			btn.setPadding(dp(-5),dp(-5),dp(-5),dp(-5));
			btn.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP,12);
			btn.setTextColor(Color.WHITE);
			var params = new LinearLayout.LayoutParams(-2,-2);
			params.setMargins(dp(5),dp(5),dp(5),dp(5));
			btn.setLayoutParams(params);
			var viewX,viewY,x,y,xx,yy;
			var click = true;
			btn.setOnTouchListener(new android.view.View.OnTouchListener() {
				onTouch: function(v, event) {
					switch(event.action) {
						case android.view.MotionEvent.ACTION_DOWN: 
							viewX = event.getX();
							viewY = event.getY();
							xx = event.getRawX() - viewX;
							yy = event.getRawY() - viewY;
						break;
						case android.view.MotionEvent.ACTION_MOVE:
							x = event.getRawX() - viewX;
							y = event.getRawY() - viewY;
							if(Math.abs(x-xx) > 100 || Math.abs(y-yy) > 100) click = false;
							if(!click) btnWindow.update(x,y,dp(40),dp(30),true);
						break;
						case android.view.MotionEvent.ACTION_UP:
							if(click) {
								//TODO
							} else {
								click = true;
								ModPE.saveData("SW_x",x);
								ModPE.saveData("SW_y",y);
								ts("위치가 변경되었습니다.");
							}
						break;
					}
					return true;
				}
			});
            var paintDrawable = new PaintDrawable(Color.rgb());
            paintDrawable.setCornerRadius(dp(15));
			btnWindow = new PopupWindow(btn,dp(40),dp(30));
            btnWindow.setBackgroundDrawable(paintDrawable);
			btnWindow.showAtLocation(ctx.getWindow().getDecorView(),Gravity.LEFT|Gravity.TOP,SW_x,SW_y);
		} catch(err) {
			print(err);
		}
	});
}
