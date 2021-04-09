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
document.querySelectorAll("[piece]").forEach(target =>{
    let player = target.getAttribute("player");  // Lấy người chơi ở các ô
    let piece = target.getAttribute("piece");   // Lấy quân cờ ở các ô
    if(player == '' || piece == ''){
        return
    }
    target.setAttribute("empty", "false");
    let backgroundColorTarget =  target.backgroundColor;
    if(player == 'white'){
        target.innerText = piecesCharWhite[piece];
    } else {
        target.innerText = piecesCharBlack[piece];
    }
});



document.addEventListener('mousedown', function(event) {
    // Kiểm tra xem có đúng lượt của người chơi không
    if(event.target.getAttribute("player") != playerTurn){
        event.preventDefault();
        return;
    }
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
        default:
            console.log(playerSelect.piece);
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
    
    event.target.style.opacity = .3;
    
    // // Lấy ô trêm bàm cờ
    // let spot = getParentByClass(event.target,'dropzone');
    // // Nếu người chơi trỏ không đúng ô thì return
    // if(!spot){
    //     return;
    // }
    // // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return
    // if(spot.firstChild?.getAttribute("player") == playerSelect.player){
    //     return;
    // }
    // // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu không thì chuyển background thành màu hoverKillColor
    // if(spot.firstChild && spot.firstChild?.getAttribute("player") != playerSelect.player) {        
    //     event.target.style.background = hoverKillColor;
    //     return;
    // }
    // event.target.style.background = hoverColor;
}, false);

// Hàm khi kéo cờ ra vị trí khác thì trả lại màu nền ban đầu
document.addEventListener("dragleave", function(event) {   
    
    event.target.style.opacity = "";
    // // Lấy ô trêm bàm cờ
    // let spot = getParentByClass(event.target,'dropzone');
    // // Nếu người chơi trỏ không đúng ô thì return
    // if(!spot){
    //     return;
    // }
    // event.target.style.background = "";
}, false);

// Hàm thả quân cờ
document.addEventListener("drop", function(event) {
    
    // // prevent default action (open as link for some elements)
    // event.preventDefault();
    
    // Lấy ô trêm bàm cờ
    if(!isPlaceable(event.target)){
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

function clearBoardBackground(){
    // Lấy tất cả các ô trên bàn cờ rồi reset background
    let spots = document.querySelectorAll('[row]');
    // Reset màu background lại như cũ
    spots.forEach(item =>{
        item.style.background = "";        
        item.style.opacity = "";
    });
    
    spots = document.querySelectorAll('.chess');
    spots.forEach(item =>{
        item.style.background = "";        
        item.style.opacity = "";
    });
}

function isMyChess(target){
    let spot = getParentByClass(target,'dropzone');
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return false
    if(spot.firstChild?.getAttribute("player") == playerSelect.player){
        return true;
    }
    return false;
}

function isPlaceable(target){
    let spot = getParentByClass(target,'dropzone');
    if(!spot){
        return;
    }
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return false
    if(isMyChess(target)){
        return false;
    }
    // Kiểm tra người dùng có đặt đúng vào ô không
    if(spot.style.background == ""){
        return;
    }
    return true;
}

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

function showKnightMove(posX, posY){    
    // Lấy bàn cờ
    let board = document.querySelector('#board');
    for(row = -2; row <= 2; row++){
        for(col = -2; col <= 2; col++){
            let x = Math.abs(row);
            let y = Math.abs(col);
            if(x * y == 2){
                let destinationX = parseInt(posX) + parseInt(row);
                let destinationY = parseInt(posY) + parseInt(col);
                var spot = document.querySelector(`[row="${destinationX}"][column="${destinationY}"]`);
                if(!spot){
                    continue;
                }
                if(spot.firstChild){
                    if(isMyChess(spot.firstChild)){
                        spot.style.background = "";
                        continue;
                    } else {                
                        spot.style.background = hoverKillColor;
                        continue;      
                    }
                }
                spot.style.background = hoverColor;
            }
        }
    }
}