var PopupWindow = android.widget.PopupWindow;
var LinearLayout = android.widget.LinearLayout;
var EditText = android.widget.EditText;
var ImageView = android.widget.ImageView
var Toast = android.widget.Toast;

var Dialog = android.app.Dialog;
var AlertDialog = android.app.AlertDialog;

var View = android.view.View;
var MotionEvent = android.view.MotionEvent
var Gravity = android.view.Gravity;
var RotateAnimation = android.view.animation.RotateAnimation;

var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;

var TextWatcher = android.text.TextWatcher

var DialogInterface = android.content.DialogInterface;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var Thread = java.lang.Thread;

var File = java.io.File;
var FileWriter = java.io.FileWriter;
var FileReader = java.io.FileReader;
var BufferedWriter = java.io.BufferedWriter
var BufferedReader = java.io.BufferedReader;

var ui = function(func){ctx.runOnUiThread(new java.lang.Runnable(){run: func});};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(mesg){ui(function(){Toast.makeText(ctx,mesg,1).show();});};

var btnWindow = null;
var themeColor = {r:50, g:180, b:230};
var NV1_x = 8;
var NV1_y = 80;
var bz, bx;
var selectNumber = 0;
var pointName = null;
var pointLoc = null;
var navigater = null;
var diaSword = null;
var goldSword = null;
var isRun = false;
var isLongClick = false;
var count = 0;
var path = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/games/com.mojang/navigation";
var world;
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

var colorCode = [Color.parseColor("#000000"),
		 Color.parseColor("#0e3f36"),
		 Color.parseColor("#33ebcb"),
		 Color.parseColor("#2bc7ac"),
		 Color.parseColor("#082025"),
		 Color.parseColor("#1e8a77"),
		 Color.parseColor("#156355"),
		 Color.parseColor("#493615"),
		 Color.parseColor("#281e0b"),
		 Color.parseColor("#684e1e"),
		 Color.parseColor("#896727"),

		 Color.parseColor("#0e3f36"),
		 Color.parseColor("#606038"),
		 Color.parseColor("#eaee57"),
		 Color.parseColor("#cdd050"),
		 Color.parseColor("#4a4b33"),
		 Color.parseColor("#9c9e45"),
	 	 Color.parseColor("#7c7e3e"),
		 Color.parseColor("#493615"),
		 Color.parseColor("#281e0b"),
		 Color.parseColor("#684e1e"),
		 Color.parseColor("#896727")];

var diamond = 0;
var gold =1;
function drawSword(type){
	var result = Bitmap.createBitmap(230, 230, Bitmap.Config.ARGB_8888);
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
	canvas = new Canvas(result);
	canvas.drawBitmap(Bitmap.createScaledBitmap(bitmap, 160, 160, false), 35, 35, new Paint());
	return result;
}

diaSword = drawSword(diamond);
goldSword = drawSword(gold);

function newLevel(){
	pointName = ["길찾기 종료"];
	pointLoc = ["termination"];
	loadData();
	bz = 0;
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
	saveData();
}

function loadData(){
	try{
		world = Level.getWorldDir() + ".txt";
		if(new File(path, world).exists()){
			pointName = [];
			pointLoc = [];
			var data = readFile(new File(path, world));
			for each(var i in data){
				if(!(i.equals(""))){
					var str = i.split(":");
					pointName.push(str[0]);
					pointLoc.push(str[1]);
				}
			}
		}else{
			new File(path).mkdir();
			new File(path, world).createNewFile();
		}
	}catch(err){
		print(err);
	}
}

function saveData(){
	try{
		if(!new File(path, world).exists()){
			new File(path).mkdir();
			new File(path, world).createNewFile();
		}
		var str = "";
		for(var i=0; i<pointLoc.length; i++){
			str += pointName[i] + ":" + pointLoc[i] + "\n";
		}
		writeFile(new File(path, world), str);
	}catch(err){
		print(err);
	}
}

function modTick(){
	if(isRun){
		var player = {z:getPlayerZ(), x:getPlayerX()};
		var point = {z:bz, x:bx};
		var angle = getAngle(player, point)
		if(!isNaN(angle))rotate(angle);
	}
	if(!isRun && count<1){
	 count++;
	 rotate(0);
	}
}

function rotate(angle){
	ui(function(){
		try{
			var an = new RotateAnimation(angle, angle, dp(25), dp(25));
			an.setDuration(0);
			an.setFillAfter(true);
			navigater.startAnimation(an);
		}catch(err){
			print(err);
		}
	});
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
	return (angle*(180/Math.PI))-getYaw()+135;
}

function makeBtn(){
	ui(function(){
		try{
			navigater = new ImageView(ctx);
			navigater.setImageBitmap(goldSword);
			var viewX,viewY,x,y,xx,yy;
			var click = true;
			navigater.setOnTouchListener(new View.OnTouchListener({
				onTouch: function(v, event) {
					switch(event.action) {
						case MotionEvent.ACTION_DOWN:
							viewX = event.getX();
							viewY = event.getY();
							xx = event.getRawX() - viewX;
							yy = event.getRawY() - viewY;
							break;
						case MotionEvent.ACTION_MOVE:
							x = event.getRawX() - viewX;
							y = event.getRawY() - viewY;
							if(Math.abs(x-xx) > 100 || Math.abs(y-yy) > 100) click = false;
							if(!click) btnWindow.update(x,y,dp(50),dp(50),true);
							break;
						case MotionEvent.ACTION_UP:
							if(!isLongClick){
								if(click) {
									openList();
								} else {
									click = true;
									ModPE.saveData("NV1_x",x);
									ModPE.saveData("NV1_y",y);
									ts("위치가 변경되었습니다.");
								}
							} else isLongClick = false;
							break;
					}
					return false;
				}
			}));
			navigater.setOnLongClickListener(new View.OnLongClickListener({
				onLongClick: function(v){
					try{
						isLongClick = true;
						ts("ⓒ 2018. 여흥 All rights reserved.");
						return true;
					}catch(err){
						print(err);
					}
				}
			}));
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
			builder.setSingleChoiceItems(pointName, selectNumber, new DialogInterface.OnClickListener({
				onClick: function(d, i){
					selectNumber = i;
					if(i==0){
						d.getButton(AlertDialog.BUTTON_NEGATIVE).setEnabled(false);
						navigater.setImageBitmap(goldSword);
						count = 0;
						isRun = false;
					}else{
						d.getButton(AlertDialog.BUTTON_NEGATIVE).setEnabled(true);
						navigater.setImageBitmap(diaSword)
						isRun = true;
						var point = pointLoc[i].split(",");
						bx = point[0];
						bz = point[1];
					}
				}
			}));
			builder.setNegativeButton("삭제", new DialogInterface.OnClickListener({
				onClick: function(d){
					if(selectNumber!=0){
						count = 0;
					isRun = false;
						pointName.splice(selectNumber, 1);
						pointLoc.splice(selectNumber, 1);
						selectNumber = 0;
						navigater.setImageBitmap(goldSword);
					}
				}
			}));
			builder.setPositiveButton("닫기", null);
			builder.setNeutralButton("추가", new DialogInterface.OnClickListener({
				onClick: function(d){
					try{
						var layout = new LinearLayout(ctx);
						var name = new EditText(ctx);
						var add = new AlertDialog.Builder(ctx);
						var params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,LinearLayout.LayoutParams.WRAP_CONTENT)
						params.setMargins(dp(20), dp(20), dp(20), dp(20));
						name.setLayoutParams(params);
						layout.addView(name);
						add.setTitle("목적지 이름");
						add.setView(layout);
						add.setNegativeButton("취소", null);
						add.setPositiveButton("저장", new DialogInterface.OnClickListener({
							onClick: function(d){
								try{
									pointName.push(name.getText().toString());
									pointLoc.push(getPlayerX() + "," + getPlayerZ());
								}catch(err){
									print(err.lineNumber + "\n" + err);
								}
							}
						}));
						var addDialog = add.create();
						addDialog.show();
						var save = addDialog.getButton(AlertDialog.BUTTON_POSITIVE);
						save.setEnabled(false);
						name.addTextChangedListener(new TextWatcher({
							onTextChanged: function(s, start, before, count){},
							beforeTextChanged: function(s, start, count, after){},
							afterTextChanged: function(s){
								if(name.getText().toString().equals("") || name.getText().toString().indexOf(":")!=-1 || name.getText().toString().indexOf(",")!=-1) save.setEnabled(false);
								else save.setEnabled(true);
							}
						}));
					}catch(err){
						print(err);
					}
				}
			}));
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

function readFile(file){
	try{
		if(file.exists()){
			var fis = new java.io.FileInputStream(file);
			var isr = new java.io.InputStreamReader(fis);
			var br = new java.io.BufferedReader(isr);
			var result=[];
			while(true){
				var str = br.readLine();
				if(str==null) break;
				result.push(str);
			}
			fis.close();
			isr.close();
			br.close();
			return result;
		} else return ["길찾기 종료:termination"];
	}catch(err){
		print(err);
	}
}

function writeFile(file, content){
	try{
		if(file.exists()){
			var fw = new FileWriter(file);
			var bufwr = new BufferedWriter(fw);
			bufwr.write(content);
			bufwr.close();
			fw.close();
		} else print("no file");
	}catch(err){
		print(err);
	}
}
