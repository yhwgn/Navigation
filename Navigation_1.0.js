var PopupWindow = android.widget.PopupWindow;
var LinearLayout = android.widget.LinearLayout;
var ScrollView = android.widget.ScrollView;
var ListView = android.widget.ListView;
var Button = android.widget.Button;
var EditText = android.widget.EditText;
var TextView = android.widget.TextView;
var CheckBox = android.widget.CheckBox;
var ImageView = android.widget.ImageView
var Toast = android.widget.Toast;

var Dialog = android.app.Dialog;
var AlertDialog = android.app.AlertDialog;

var View = android.view.View;
var Gravity = android.view.Gravity;
var RotateAnimation = android.view.animation.RotateAnimation;

var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;
var Matrix = android.graphics.Matrix;
var PaintDrawable = android.graphics.drawable.PaintDrawable;
var ColorDrawable = android.graphics.drawable.ColorDrawable;

var TextWatcher = android.text.TextWatcher
var TextUtils = android.text.TextUtils;

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
var selectNumber = 0;
var pointName = ["길찾기 종료"];
var pointLoc = ["termination"];
var navigater = null;
var diaSword = null;
var goldSword = null;
var isRun = false;
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
	0, 0, 0, 4, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 4, 5, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 7, 9, 4, 5, 6, 4, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 7,10, 8, 0, 4, 4, 6, 4, 0, 0, 0, 0, 0, 0,
	4, 4, 9, 8, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0,
	4, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var colorCode = [Color.argb(0, 0, 0, 0),
		 Color.argb(255, 14, 63, 54),
		 Color.argb(255, 51, 235, 203),
		 Color.argb(255, 43, 199, 172),
		 Color.argb(255, 8, 37, 32),
		 Color.argb(255, 30, 138, 119),
		 Color.argb(255, 21, 99, 85),
		 Color.argb(255, 73, 54, 21),
		 Color.argb(255, 40, 30, 11),
		 Color.argb(255, 104, 78, 30),
		 Color.argb(255, 137, 103, 39),

		 Color.rgb(0, 0, 0),
		 Color.rgb(96, 96, 56),
		 Color.rgb(234, 238, 87),
		 Color.rgb(205, 208, 80),
		 Color.rgb(74, 75, 51),
		 Color.rgb(156, 158, 69),
		 Color.rgb(124, 126, 62),
		 Color.rgb(73, 54, 21),
		 Color.rgb(40, 30, 11),
		 Color.rgb(104, 78, 30),
		 Color.rgb(137, 103, 39)];

var diamond = 0;
var gold =1;
function drawSword(type){
	var bitmap = Bitmap.createBitmap(16, 16, Bitmap.Config.ARGB_8888);
	var canvas = new Canvas(bitmap);
	var i=0;
	for(var y=0; y<16; y++){
		for(var x=0; x<16; x++){
			if(sword[i] != 0){
				var color = colorCode[sword[i]+(type*11)];
				var paint = new Paint();
				paint.setColor(color);
				canvas.drawPoint(x, y, paint);
			}
			i++;
		}
	}
	return bitmap;
}

diaSword = Bitmap.createScaledBitmap(drawSword(diamond), 160, 160, false);
goldSword = Bitmap.createScaledBitmap(drawSword(gold), 160, 160, false);

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

function modTick(){
	if(isRun){
		var player = {z:getPlayerZ(), x:getPlayerX()};
    	var point = {z:bz, x:bx};
		clientMessage(getAngle(player, point) + " : " + getYaw());
		ui(function(){
			try{
				var matrix = new Matrix();
				navigater.setScaleType(ImageView.ScaleType.MATRIX);   //required
				matrix.postRotate(getAngle(player, point), 80, 80);
				navigater.setImageMatrix(matrix);
				/*var angle = getAngle(player, point);
				var an = new RotateAnimation(0, angle, 25, 25);
				an.setDuration(0);
				an.setFillAfter(true);
				navigater.setAnimation(an);*/
			}catch(err){
				print(err);
			}
		});
	}
}

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
	return (angle*(180/Math.PI));
}

function makeBtn(){
	ui(function(){
		try{
			navigater = new ImageView(ctx);
			navigater.setImageBitmap(goldSword);
			var viewX,viewY,x,y,xx,yy;
			var click = true;
			navigater.setOnTouchListener(new android.view.View.OnTouchListener(){
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
							if(!click) btnWindow.update(x,y,dp(50),dp(50),true);
							break;
						case android.view.MotionEvent.ACTION_UP:
							if(click) {
								openList();
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
			btnWindow = new PopupWindow(navigater, dp(50), dp(50));
			btnWindow.showAtLocation(ctx.getWindow().getDecorView(),Gravity.LEFT|Gravity.TOP,NV1_x,NV1_y);
		} catch(err) {
			print("load btn " + err.lineNumber + "\n" + err);
		}
	});
}

function openList(){
	ui(function(){
		try{
			var builder = new AlertDialog.Builder(ctx);
			builder.setTitle("Navigation_1.0");
			builder.setSingleChoiceItems(pointName, selectNumber, new DialogInterface.OnClickListener(){
				onClick: function(d, i){
					selectNumber = i;
					if(i==0){
						d.getButton(AlertDialog.BUTTON_NEGATIVE).setEnabled(false);
						navigater.setImageBitmap(goldSword);
						isRun = false;
					}else{
						d.getButton(AlertDialog.BUTTON_NEGATIVE).setEnabled(true);
						navigater.setImageBitmap(diaSword)
						isRun = true;
						var point = pointLoc[i].split(",");
						bx = point[0];
						by = point[1];
						bz = point[2];
					}
				}
			});
			builder.setNegativeButton("삭제", null);
			builder.setPositiveButton("닫기", null);
			builder.setNeutralButton("추가", new DialogInterface.OnClickListener(){
				onClick: function(d){
					var name = new EditText(ctx);
					var add = new AlertDialog.Builder(ctx);
					add.setView(name);
					add.setTitle("목적지 이름");
					add.setNegativeButton("취소", null);
					add.setPositiveButton("저장", new DialogInterface.OnClickListener(){
						onClick: function(d){
							try{
								pointName.push(name.getText().toString());
								pointLoc.push(getPlayerX() + "," + getPlayerY() + "," + getPlayerZ());
							}catch(err){
								print(err.lineNumber + "\n" + err);
							}
						}
					});
					var addDialog = add.create();
					addDialog.show();
					var save = addDialog.getButton(AlertDialog.BUTTON_POSITIVE);
					save.setEnabled(false);
					name.addTextChangedListener(new TextWatcher(){
						onTextChanged: function(s, start, before, count){},
						beforeTextChanged: function(s, start, count, after){},
						afterTextChanged: function(s){
							if(name.getText().toString().equals("") || name.getText().toString().indexOf(":")!=-1 || name.getText().toString().indexOf(",")!=-1) save.setEnabled(false);
							else save.setEnabled(true);
						}
					});
				}
			});
			var dialog = builder.create();
			dialog.show();
			var delet = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
			if(selectNumber==0) delet.setEnabled(false);
			else delet.setEnabled(true);
		}catch(err){
			print("openList " + err.lineNumber + "\n" + err);
		}
	});
}
