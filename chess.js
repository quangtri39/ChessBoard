const hoverColor = 'green';     // Chuyển thành màu xanh khi kéo cờ vào ô
const hoverKillColor = 'red';   // Chuyển thành màu đỏ khi kéo quân cờ ta vào quân cờ địch
var playerTurn = 'white';       // Biến đến lượt người chơi

const piecesCharWhite = {
    pawn: '♙',
    knight: '♘',
    bishop: '♗',
    rook: '♖',
    king: '♔',
    queen: '♕'
};
const piecesCharBlack = {
    pawn: '♟',
    knight: '♞',
    bishop: '♝',
    rook: '♜',
    king: '♚',
    queen: '♛'
};


// Biến lưu thông tin quân cờ khi Dragg
var playerSelect = {
    dragged: '',    // Biến lưu Item Drag để sau khi drag thì add lại vào nơi cuối
    piece: '',      // Quân cờ
    player: '',     // Người chơi
    row: '',        // Dòng
    column: ''      // Cột
}

// Khởi tạo bàn cờ
document.querySelectorAll(".chess").forEach(target =>{
    let player = target.getAttribute("player");  // Lấy người chơi ở các ô
    let piece = target.getAttribute("piece");   // Lấy quân cờ ở các ô
    if(player == '' || piece == ''){
        return
    }
    target.setAttribute("ismoved", "false");      // Biến kiểm tra đã di chuyển quân cờ lần nào chưa
    let backgroundColorTarget =  target.backgroundColor;
    if(player == 'white'){
        target.innerText = piecesCharWhite[piece];
    } else {
        target.innerText = piecesCharBlack[piece];
    }
});


//====================== Các hàm event drag drop =====================

document.addEventListener('mousedown', function(event) {
    // Kiểm tra xem có đúng lượt của người chơi không
    // if(event.target.getAttribute("player") != playerTurn){
    //     event.preventDefault();
    //     return;
    // }
});

/* events fired on the draggable target */
document.addEventListener("drag", function(event) {
    
}, false);

// Hàm khi bắt đầu quá trình Drag thì quân cờ đang cầm hiển thị như thế nào
document.addEventListener("dragstart", function(event) {
    // Lấy thông tin của Element cha
    let parentDragg = event.target.parentElement;
    // Thêm thông tin của cờ vào biến toàn cục
    playerSelect = {
        dragged: event.target, 
        piece: event.target.getAttribute("piece"), 
        player: event.target.getAttribute("player"), 
        row: parentDragg.getAttribute("row"), 
        column: parentDragg.getAttribute("column")
    }
    switch(playerSelect.piece){
        case "knight":
            showKnightMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        case "rook":
            showRookMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        case "bishop":
            showBishopMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        case "queen":
            showQueenMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        case "king":
            showKingMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        case "pawn":
            showPawnMove(parentDragg.getAttribute("row"),parentDragg.getAttribute("column"));
            break;
        default:
            break;
    }
    // Cho màu cờ nhạt đi
    event.target.style.opacity = .5;
}, false);

// Hàm Khi kết thúc quá trình Drag thì quân cờ đang cầm được hiển thị trở lại như cũ
document.addEventListener("dragend", function(event) {
    // reset the transparency
    event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function(event) {
    // prevent default to allow drop
    event.preventDefault();
}, false);

// Hàm giúp đổi màu nền những vị trí mà kéo vô
document.addEventListener("dragenter", function(event) {   
    let spot = getParentByClass(event.target,'dropzone');
    // Nếu người chơi trỏ không đúng ô thì return
    if(!spot){
        return;
    }
    event.target.style.opacity = .3;
}, false);

// Hàm khi kéo cờ ra vị trí khác thì trả lại màu nền ban đầu
document.addEventListener("dragleave", function(event) {   
    let spot = getParentByClass(event.target,'dropzone');
    // Nếu người chơi trỏ không đúng ô thì return
    if(!spot){
        return;
    }
    event.target.style.opacity = "";
}, false);

// Hàm thả quân cờ
document.addEventListener("drop", function(event) {
    
    // // prevent default action (open as link for some elements)
    // event.preventDefault();
    
    // Lấy ô trêm bàm cờ
    let locationXY = getLocationXY(event.target);
    if(!locationXY){return;}
    if(!isPlaceable(locationXY[0], locationXY[1])){
        event.preventDefault();
        // Xóa background cho bàn cờ cái này không đặt lên trước được 
        // tại vì isPlaceable check xem ô có background thì mới kiểm tra
        clearBoardBackground();
        return;
    }
    // Xóa background cho bàn cờ
    clearBoardBackground();
    // Lấy cha của đối tượng được Drop cờ xuống
    let spot = getParentByClass(event.target,'dropzone');    
    // Xóa cờ đối thủ
    spot.innerText = '';
    // Xóa vị trí cũ cờ của mình
    playerSelect.dragged.parentNode.removeChild( playerSelect.dragged );
    // Thêm cờ của mình vào vị trí mới
    spot.appendChild( playerSelect.dragged );
}, false);

//====================== Các hàm khác =====================

function getLocationXY(target){    
    let spot = getParentByClass(target,'dropzone');
    if(!spot){return;}
    return [parseInt(spot.getAttribute("row")), parseInt(spot.getAttribute("column"))];
}

function clearBoardBackground(){
    // Lấy tất cả các ô trên bàn cờ rồi reset background
    let spots = document.querySelectorAll('div');
    // Reset màu background lại như cũ
    spots.forEach(item =>{
        item.style.background = "";        
        item.style.opacity = "";
    });
}

// Hàm lấy tên quân cờ tại vị trí x,y giúp cho hàm kiểm tra quân check
function getPieceInfo(locationX, locationY){
    let spot = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
    if(!spot){return null;}
    let chess = spot.firstChild;
    if(!chess){return null;}
    let pieceName = chess.getAttribute("piece");
    let player = chess.getAttribute("player");
    let ismoved = (chess.getAttribute("ismoved") == "true") ? true : false;
    return {pieceName: pieceName, player: player, ismoved: ismoved};
}

// Hàm lấy thuộc tính ismoved tại vị trí x,y
// function isChesMoved(locationX, locationY){
//     let target = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
//     if(!target){return null;}
//     if(!target.firstChild){return null;}
//     return (target.firstChild.getAttribute("ismoved") == "true") ? true : fasle;
// }
// function setChesMoved(locationX, locationY){
//     if(isChesMoved(locationX, locationY) == false) {
//         target.setAttribute("ismoved", "true");
//     };
// }


function getParentByClass(element, className){
    // Nếu element đó có tên class thì trả về
    if(element.classList.contains(className)){        
        return element;
    }
    //Vòng lặp từ trong ra ngoài kiểm tra xem có không
    while(element.parentElement){
        if(element.parentElement.classList.contains(className)){
            return element.parentElement;
        }
        element = element.parentElement;
    }
    // Không có thì trả về rỗng
    return null;
}
// Hàm kiểm tra có phải đây là quân cờ của mình không
// Có return 1, Không return 0, Nếu không có cờ return -1
function isMyChess(locationX, locationY){
    let target = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
    if(!target){return -1;}
    if(!target.firstChild){return -1;}
    // Kiểm tra xem ô có textContent là rỗng thì quay lại
    if(target.textContent.trim() == ""){return -1;}
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return false
    if(target.firstChild.getAttribute("player") == playerSelect.player){
        return 1;
    }
    return 0;
}

function isPlaceable(locationX, locationY){    
    let target = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
    // Kiểm tra cờ có phải của mình
    let locationXY = getLocationXY(target)
    if(!locationXY){return false;}
    if(!target || isMyChess(locationXY[0], locationXY[1]) == 1){
        return false;
    }
    // Kiểm tra người dùng có đặt đúng vào ô có background xanh hoặc đỏ
    // if(spot.style.background == ""){
    //     return false;
    // }
    // Các trường hợp còn lại bao gồm: background màu xanh lá hoặc màu đỏ
    return true;
}

// Hàm thay đổi background cho các ô
// Xanh return 1, Đỏ return 2; còn lại return -1
function makeColorBG(locationX, locationY) {
    let target = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
    if(!target){
        return -1;
    }
    if(target.firstChild){
        let locationXY = getLocationXY(target);
        let checkIsMyChess = isMyChess(locationXY[0], locationXY[1]);
        if(checkIsMyChess == 1){
            target.style.background = "";
            return -1;
        } else if(checkIsMyChess == 0){                
            target.style.background = hoverKillColor;
            return 2;
        }
    }
    target.style.background = hoverColor;
    return 1;
}

// Hàm kiểm tra vị trí đã có quân địch chiếm chưa
function checkPosHaveChessLooked(locationX, locationY){
    // Nếu vị trí đó không có
    let target = document.querySelector(`[row="${parseInt(locationX)}"][column="${parseInt(locationY)}"]`);
    if(!target){return -1;}

    let chesses = document.querySelectorAll('.chess');
    let isLooked = false;
    for (i = 0; i < chesses.length; i++){
        let locationXY = getLocationXY(chesses[i]); // Lấy vị trí của quân cờ
        let checkIsMyChess = isMyChess(locationXY[0], locationXY[1]); // Kiểm tra nếu là quân cờ mình thì cho qua
        if(checkIsMyChess == 1){continue;}
        let objPiece = getPieceInfo(locationXY[0], locationXY[1]);
        switch(objPiece.pieceName){
            case "knight":
                let knightMoves = knightMove(locationXY[0], locationXY[1]);
                knightMoves.forEach(([x, y])=>{
                    if(x == locationX && y == locationY){
                        isLooked = true;
                    }
                });
                break;
            case "rook":
                let rookMoves = rookMove(locationXY[0], locationXY[1]);
                rookMoves.forEach(([x, y])=>{
                    if(x == locationX && y == locationY){
                        isLooked = true;
                    }
                });
                break;
            case "bishop":
                let bishopMoves = bishopMove(locationXY[0], locationXY[1]);
                bishopMoves.forEach(([x, y])=>{
                    if(x == locationX && y == locationY){
                        isLooked = true;
                    }
                });
                break;
            case "queen":
                let queenMoves = queenMove(locationXY[0], locationXY[1]);
                queenMoves.forEach(([x, y])=>{
                    if(x == locationX && y == locationY){
                        isLooked = true;
                    }
                });
                break;
            case "king":
                let kingMoves = kingMove(locationXY[0], locationXY[1], false);
                kingMoves.forEach(([x, y])=>{
                    if(x == locationX && y == locationY){
                        isLooked = true;
                    }
                });
                break;
            case "pawn":
                break;
            default:
                break;
        }
        if(isLooked){
            return true;
        }
    }
    return false;
}


//====================== Các hàm kiểm tra nước đi của các quân cờ =====================
function knightMove(posX, posY){
    let arrayLocation = [];
    // Kiểm tra hình vuông bán kính 2 ô có các vị trí đúng để con mã có thể di chuyển
    for(row = -2; row <= 2; row++){
        for(col = -2; col <= 2; col++){
            let x = Math.abs(row);
            let y = Math.abs(col);
            if(x * y == 2){
                let destinationX = parseInt(posX) + parseInt(row);
                let destinationY = parseInt(posY) + parseInt(col);
                arrayLocation.push([destinationX,destinationY]);
            }
        }
    }
    return arrayLocation;
}
function rookMove(posX, posY){
    let arrayLocation = [];
    // Nước đi bên phải
    for(step = 1; step < 8; step++){
        let destinationY = parseInt(posY) - parseInt(step);

        let letIsMyChess = isMyChess(posX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([parseInt(posX),destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([parseInt(posX),destinationY]);
        }
    }

    // Nước đi bên trái
    for(step = 1; step < 8; step++){
        let destinationY = parseInt(posY) + parseInt(step);

        let letIsMyChess = isMyChess(posX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([parseInt(posX),destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([parseInt(posX),destinationY]);
        }
    }

    // Nước đi bên trên
    for(step = 1; step < 8; step++){
        let destinationX = parseInt(posX) + parseInt(step);

        let letIsMyChess = isMyChess(destinationX, posY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,parseInt(posY)]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,parseInt(posY)]);
        }
    }

    // Nước đi bên dưới
    for(step = 1; step < 8; step++){
        let destinationX = parseInt(posX) - parseInt(step);

        let letIsMyChess = isMyChess(destinationX, posY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,parseInt(posY)]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,parseInt(posY)]);
        }
    }
    return arrayLocation;
}

function bishopMove(posX, posY){
    let arrayLocation = [];
    // Nước đi bên trên trái
    for(step = 1; step < 8; step++){        
        let destinationX = parseInt(posX) - parseInt(step);
        let destinationY = parseInt(posY) + parseInt(step);

        let letIsMyChess = isMyChess(destinationX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,destinationY]);
        }
    }

    // Nước đi bên trên phải
    for(step = 1; step < 8; step++){
        let destinationX = parseInt(posX) + parseInt(step);
        let destinationY = parseInt(posY) + parseInt(step);

        let letIsMyChess = isMyChess(destinationX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,destinationY]);
        }
    }

    // Nước đi bên dưới phải
    for(step = 1; step < 8; step++){
        let destinationX = parseInt(posX) + parseInt(step);
        let destinationY = parseInt(posY) - parseInt(step);

        let letIsMyChess = isMyChess(destinationX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,destinationY]);
        }
    }

    // Nước đi bên dưới trái
    for(step = 1; step < 8; step++){
        let destinationX = parseInt(posX) - parseInt(step);
        let destinationY = parseInt(posY) - parseInt(step);

        let letIsMyChess = isMyChess(destinationX, destinationY);
        // Ô có cờ ta và cờ địch thoát khỏi vòng lặp phía sau
        if(letIsMyChess == 1 || letIsMyChess == 0){
            arrayLocation.push([destinationX,destinationY]);
            break;
        }
        // Ô không có cờ
        if(letIsMyChess == -1){
            arrayLocation.push([destinationX,destinationY]);
        }
    }
    return arrayLocation;
}
// Là code của xe và sĩ gộp lại
function queenMove(posX, posY){    
    let rookMoves = rookMove(posX, posY);
    let bishopMoves = bishopMove(posX, posY);
    return [...rookMoves, ...bishopMoves]
}
function kingMove(posX, posY, checkcastling = true){
    let arrayLocation = [];
    // Kiểm tra hình vuông bán kính 1 ô có các vị trí đúng để vua có thể di chuyển
    for(row = -1; row <= 1; row++){
        for(col = -1; col <= 1; col++){
            let x = Math.abs(row);
            let y = Math.abs(col);
            if(x + y <= 2){
                let destinationX = parseInt(posX) + parseInt(row);
                let destinationY = parseInt(posY) + parseInt(col);
                arrayLocation.push([destinationX,destinationY]);
            }
        }
    }
    // Nếu hàm không yêu cầu castling thì khỏi kiểm tra
    if(!checkcastling){return arrayLocation;}
    // Kiểm tra castling

    // Nếu vua đang bị chiếu thì không được casling
    if(checkPosHaveChessLooked(parseInt(posX), parseInt(posY))){return arrayLocation;}
    // Nếu vua đã di chuyển thì không cho nữa
    if(getPieceInfo(posX, posY).ismoved == true){return arrayLocation;}

    let rooks = document.querySelectorAll('[piece="rook"]');
    console.log(rooks)
    for (i = 0; i <= rooks.length; i++){     
        console.log(rooks[i], i, rooks.length)
        let arrLocationRook = getLocationXY(rooks[i]);   
        // Nếu con xe không phải quân của mình thì không cho
        if(!isMyChess(arrLocationRook[0], arrLocationRook[1])){continue;}
        // Nếu xe đã di chuyển thì không cho
        if(rooks[i].getAttribute("ismoved") == "true"){continue;}    
        // Nếu xe ở bên trái 
            
        if(parseInt(posY) - arrLocationRook[1] > 0){
            //Nếu 2 vị trí bên trái đã có quân địch chiếu vào rồi thì không cho
            if(checkPosHaveChessLooked(parseInt(posX), parseInt(posY) - 1)){continue;}
            if(checkPosHaveChessLooked(parseInt(posX), parseInt(posY) - 2)){continue;}
            arrayLocation.push([parseInt(posX), posY - 2]);
        } else {
            //Nếu 2 vị trí bên phải đã có quân địch chiếu vào rồi thì không cho
            if(checkPosHaveChessLooked(parseInt(posX), parseInt(posY) + 1)){continue;}
            if(checkPosHaveChessLooked(parseInt(posX), parseInt(posY) + 2)){continue;}
            arrayLocation.push([parseInt(posX), parseInt(posY) + 2]);
        }
    }
    return arrayLocation;
}



function showKnightMove(posX, posY){    
    let knightMoves = knightMove(posX, posY);
    knightMoves.forEach(([x, y])=>{
        makeColorBG(x,y);
    });
}
function showRookMove(posX, posY){
    let rookMoves = rookMove(posX, posY);
    rookMoves.forEach(([x, y])=>{
        makeColorBG(x,y);
    });
}
function showBishopMove(posX, posY){
    let bishopMoves = bishopMove(posX, posY);
    bishopMoves.forEach(([x, y])=>{
        makeColorBG(x,y);
    });   
}
// Là code của xe và sĩ gộp lại
function showQueenMove(posX, posY){
    let queenMoves = queenMove(posX, posY);
    queenMoves.forEach(([x, y])=>{
        makeColorBG(x,y);
    });     
}
function showKingMove(posX, posY){
    let kingMoves = kingMove(posX, posY);
    kingMoves.forEach(([x, y])=>{
        if(!checkPosHaveChessLooked(x, y)){
            makeColorBG(x,y);
        }        
    }); 
}
function showPawnMove(posX, posY){

}