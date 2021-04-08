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
    // Nếu ô có class dropzone thì đổi màu
    if (event.target.classList.contains('dropzone')) {
        event.target.style.background = hoverColor;
        return;
    }
    // Lấy ra cha của element
    let parentEle = event.target.parentElement;
    // Nếu cha Element không có class dropzone thì quay lại
    if(!parentEle.classList.contains('dropzone')){
        // Reset lại background      
        event.target.style.background = "";
        return;
    }
    // Kiểm tra đó có phải quân cờ của mình không, nếu trùng thì return
    if( playerSelect.player == event.target.getAttribute("player")){
        event.target.style.background = "";
        return;
    }
    event.target.style.background = hoverKillColor;
}, false);

// Hàm khi kéo cờ ra vị trí khác thì trả lại màu nền ban đầu
document.addEventListener("dragleave", function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.classList.contains('dropzone')) { 
        // Reset lại background       
        event.target.style.background = "";
        return;
    }         
    // Lấy ra cha của element
    let parentEle = event.target.parentElement;
    // Nếu cha element có class dropzone thì trả về
    if(parentEle.classList.contains('dropzone')){  
        // Reset lại background   
        event.target.style.background = ""; 
    }

}, false);

// Hàm thả quân cờ
document.addEventListener("drop", function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // Kiểm tra xem nơi thả có đúng ô không
    if (!event.target.classList.contains('dropzone')) {
        // Lấy ra cha của element không có class dropzone
        let parentEle = event.target.parentElement;
        // Nếu cha Element không có class dropzone thì quay lại
        if(!parentEle.classList.contains('dropzone')){
            event.target.style.background = "";
            return;
        }
        // Kiểm tra đó có phải quân cờ của mình không, nếu trùng thì return
        if( playerSelect.player == event.target.getAttribute("player")){
            event.target.style.background = "";
            return;
        }
        // Nếu là quân cờ của đối thủ thì
        
        // Xóa cờ đối thủ
        parentEle.innerText = '';
        // Xóa vị trí cũ cờ của mình
        playerSelect.dragged.parentNode.removeChild( playerSelect.dragged );
        // Thêm cờ của mình vào vị trí mới
        parentEle.appendChild( playerSelect.dragged );
        return;
    }
    // Nếu là ô không có con cờ nào

    // Reset màu background lại như cũ
    event.target.style.background = "";
    
    // Xóa vị trí cũ cờ của mình
    playerSelect.dragged.parentNode.removeChild( playerSelect.dragged );
    // Thêm cờ của mình vào vị trí mới
    event.target.appendChild( playerSelect.dragged );
    
}, false);