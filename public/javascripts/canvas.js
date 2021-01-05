let canvas = document.getElementById('map');	    //取得 canvas 元素
let WIDTH = canvas.width, HEIGHT = canvas.height;
//定義當被滑鼠選取的狀態
let SELECTED;
let MouseOriginX, MouseOriginY;

    if(canvas && canvas.getContext){
    	let ctx = canvas.getContext('2d');		            //開始繪圖
        // //示意用的底圖格線（請忽略） -------------------------------
        // for(var x = 0; x <= WIDTH; x += 10){
        //     ctx.beginPath();
        //     ctx.moveTo(x, 0);
        //     ctx.lineTo(x, HEIGHT);
        //     if(x % 100 == 0) ctx.strokeStyle = '#ff0000';
        //     else ctx.strokeStyle = '#cceeee';
        //     ctx.stroke();
        // }
        // for(var y = 0; y <= HEIGHT; y += 10){
        //     ctx.beginPath();
        //     ctx.moveTo(0, y);
        //     ctx.lineTo(WIDTH, y);
        //     if(y % 100 == 0) ctx.strokeStyle = '#ff0000';
        //     else ctx.strokeStyle = '#cceeee';
        //     ctx.stroke();
        // }
        // //畫一個矩形 ===============================================
        // ctx.beginPath();
        // ctx.rect(188, 50, 200, 100);
        // ctx.fillStyle = 'yellow';
        // ctx.fill();
        // ctx.lineWidth = 4;
        // ctx.strokeStyle = 'black';
        // ctx.stroke();
        // //標示設定點（請忽略）
        // ctx.beginPath();
        // ctx.arc(188, 50, 3, 0, 2 * Math.PI, false);
        // ctx.fillStyle = 'red';
        // ctx.fill();
        // //畫三個矩形 ===============================================
        // ctx.fillStyle = '#ff0000';
    	// ctx.fillRect(110, 200, 100, 100);
    	// ctx.fillStyle = '#00ff00';
    	// ctx.fillRect(200, 240, 100, 100);
    	// ctx.fillStyle = '#0000ff';
    	// ctx.fillRect(170, 300, 100, 100);
        // //矩形其他方法 ===============================================
        // ctx.fillStyle = '#000000';
        // ctx.fillRect(400, 240, 100, 100);                    //畫出一個黑色 100*100 方形
        // ctx.clearRect(420, 260, 60, 60);                     //清除黑色方形中央 60*60 的方形
        // ctx.strokeRect(425, 265, 50, 50);                    //畫出黑色方形中央 50*50 的邊框矩形
        // //畫圓
        // ctx.beginPath();
        // ctx.arc(100, 100, 25, 0, 2 * Math.PI, false); //arc(x, y, 半徑, 弧形曲線上的起始點, 弧形曲線上的結束點, true 代表逆時針作圖、false 代表順時針作圖)
        // ctx.fillStyle = 'red';
        // ctx.fill();

        //繪製矩形
        draw(0, 0);
        //定義監聽事件
        canvas.addEventListener('mousedown', canvasMouseDownHandler, false);
        canvas.addEventListener('mousemove', canvasMouseMoveHandler, false);
        canvas.addEventListener('mouseup', canvasMouseUpHandler, false);
        canvas.addEventListener('mouseout', canvasMouseUpHandler, false);
        //定義 draw 重繪物件  ===============================================
        function draw(x, y){
           cxt = canvas.getContext('2d');
           cxt.clearRect(0, 0, canvas.width, canvas.height);
           cxt.fillStyle = '#c00';
           cxt.beginPath();
           cxt.rect(x, y, 100, 100);
           DrawOriginX = x;
           DrawOriginY = y;
           cxt.fill();
        }
        //定義 mousedown 事件處理函數  ===============================================
        function canvasMouseDownHandler(evt){
            evt.preventDefault(); //取消預設行為

            //取得滑鼠點擊位置
            var coord = getMousePointerCoord(evt);		

            //記錄滑鼠點擊位置，作為一個原始位置
            MouseOriginX = coord.x;
            MouseOriginY = coord.y;

            //檢測是否點擊在矩形內
            if(ctx.isPointInPath(coord.x, coord.y)){
                SELECTED = true;						//為變數設定值為 true 表示選取了矩形
                canvas.style.cursor = 'move';			//改變鼠標
            }
        }


        //定義 mousemove 事件處理函數  ===============================================
        function canvasMouseMoveHandler(evt){
            evt.preventDefault(); //取消預設行為

            //檢測是否有選取到的物體，然後移動物體到 x、y 座標到滑鼠位置
            if(SELECTED){
                var coord = getMousePointerCoord(evt);	//取得滑鼠點擊位置

                //使用起始的座標繪製一個矩形
                draw(DrawOriginX + coord.x - MouseOriginX, DrawOriginY + coord.y - MouseOriginY);

                //更新滑鼠原始位置
                MouseOriginX = coord.x;
                MouseOriginY = coord.y;
            }
        }


        //定義 mouseup 事件處理函數  ===============================================
        function canvasMouseUpHandler(evt){
            evt.preventDefault(); //取消預設行為

            SELECTED = false;							//為變數設定值為 false 表示沒有選取矩形
            canvas.style.cursor = 'auto';				//還原鼠標
        }


        //用來計算座標位置並傳回 ===============================================
        var getMousePointerCoord = function(e){
            var evt = e || window.event;							//取得相容性 event 物件
            var supportLayer = typeof evt.clientX == 'number';		//確定目前瀏覽器是否支援 layerX
            var target = evt.target ? evt.target : evt.srcElement;	//取得事件物件的 HTML 元素
            var rect = canvas.getBoundingClientRect();              //取得 canvas 實際在網頁上的位置和寬高

            //計算 x 座標，首先確定使用 layerX 還是 x，然後減去目前元素的邊距、邊框、留白
            var x = (supportLayer ? evt.clientX : evt.x) - rect.left;

            //計算 y 座標，首先確定使用 layerY 還是 y，然後減去目前元素的邊框、留白
            var y = (supportLayer ? evt.clientY : evt.y) - rect.top;

            //回傳一個 Object，包含座標屬性
            return {x: x, y: y};				
        };
    }