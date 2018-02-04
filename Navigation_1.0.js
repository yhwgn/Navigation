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
var PaintDrawable = android.graphics.drawable.PaintDrawable;
var ColorDrawable = android.graphics.drawable.ColorDrawable;

var DialogInterface = android.content.DialogInterface;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var ui = function(func){ctx.runOnUiThread(new java.lang.Runnable(){run: func});};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(mesg){ui(function(){Toast.makeText(ctx,mesg,1).show();});};

var btnWindow = null;
var themeColor = {r:50, g:180, b:230};
var NV1_x = 8;
var NV1_y = 80;
var bz, by, bx;
var navigater;
var sword = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0,
	0, 0, 4, 4, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0,
	0, 0, 4, 6, 4, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0,
	0, 0, 0, 4, 5, 4, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 4, 5, 4, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 7, 9, 4, 5, 6, 4, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 7,10, 8, 0, 4, 4, 6, 4, 0, 0, 0, 0, 0, 0,
	4, 4, 9, 8, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0,
	4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var colorCode = [Color.rgb(14, 63, 54),
		 Color.rgb(51, 235, 203),
		 Color.rgb(43, 199, 172),
		 Color.rgb(8, 37, 32),
		 Color.rgb(30, 138, 119),
		 Color.rgb(21, 99, 85),
		 Color.rgb(73, 54, 21),
		 Color.rgb(40, 30, 11),
		 Color.rgb(104, 78, 30),
		 Color.rgb(137, 103, 39)];

try{
	var bitmap = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
	var canvas = new Canvas(bitmap);
	var paint = new Paint();
	var i=0;
	for(var x=0; x<16; x++){
		for(var y=0; y<16; y++){
			if(sword[i] != 0){
				var color = colorCode[sword[i]-1];
				var paint = new Paint(color);
				canvas.drawPoint(x, y, paint);
			}
			i++;
		}
	}
	navigater = bitmap;
	ts("로딩 완료");
} catch(err) {
	print("load img" + err.lineNumber + "\n" + err);
}

function newLevel(){
	bz = 0;
	by = 0;
	bx = 0;
	if(ModPE.readData("NV1_start") != "Navigation_1.0 - 여흥"){
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

function leaveGame(){
	ui(function(){
		if(btnWindow != null){
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

function makeBtn(){
	ui(function(){
		try{
			var btn = new Button(ctx);
			var paintDrawable = new PaintDrawable(Color.rgb(themeColor.r, themeColor.g, themeColor.b));
            		paintDrawable.setCornerRadius(dp(15));
            		btn.setBackgroundDrawable(new android.graphics.drawable.BitmapDrawable(navigater));
			btn.setText("NV");
			btn.setPadding(dp(-5), dp(-5), dp(-5), dp(-5));
			btn.setTextSize(android.util.TypedValue.COMPLEX_UNIT_DIP, 12);
			btn.setTextColor(Color.WHITE);
			var viewX,viewY,x,y,xx,yy;
			var click = true;
			btn.setOnTouchListener(new android.view.View.OnTouchListener(){
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
								ModPE.saveData("NV1_x",x);
								ModPE.saveData("NV1_y",y);
								ts("위치가 변경되었습니다.");
							}
							break;
					}
					return true;
				}
			});
			btnWindow = new PopupWindow(btn, dp(70), dp(70));
			btnWindow.showAtLocation(ctx.getWindow().getDecorView(),Gravity.LEFT|Gravity.TOP,NV1_x,NV1_y);
		} catch(err) {
			print("load btn" + err.lineNumber + "\n" + err);
		}
	});
}
