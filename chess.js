const hoverColor = 'green';     // Chuyển thành màu xanh khi kéo cờ vào ô
const hoverKillColor = 'red';   // Chuyển thành màu đỏ khi kéo quân cờ ta vào quân cờ địch
var playerTurn = 'black';       // Biến đến lượt người chơi

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
    // Lấy ô trêm bàm cờ
    let spot = getParentByClass(event.target,'dropzone');
    // Nếu người chơi trỏ không đúng ô thì return
    if(!spot){
        return;
    }
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return
    if(spot.firstChild?.getAttribute("player") == playerSelect.player){
        return;
    }
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu không thì chuyển background thành màu hoverKillColor
    if(spot.firstChild && spot.firstChild?.getAttribute("player") != playerSelect.player) {        
        event.target.style.background = hoverKillColor;
        return;
    }
    event.target.style.background = hoverColor;
}, false);

// Hàm khi kéo cờ ra vị trí khác thì trả lại màu nền ban đầu
document.addEventListener("dragleave", function(event) {    
    // Lấy ô trêm bàm cờ
    let spot = getParentByClass(event.target,'dropzone');
    // Nếu người chơi trỏ không đúng ô thì return
    if(!spot){
        return;
    }
    event.target.style.background = "";
}, false);

// Hàm thả quân cờ
document.addEventListener("drop", function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // Lấy ô trêm bàm cờ
    let spot = getParentByClass(event.target,'dropzone');
    // Nếu người chơi trỏ không đúng ô thì return
    if(!spot){
        return;
    }
    // kiểm tra quân cờ ở ô đó có phải quân cờ của mình không, nếu trùng thì return
    if(spot.firstChild?.getAttribute("player") == playerSelect.player){
        return;
    }
    // Nếu đến được đây nghĩa là người chơi kéo cờ vào ô trống hoặc ô đã có quân cờ đối thủ
    
    // Reset màu background lại như cũ
    event.target.style.background = "";
    // Xóa cờ đối thủ
    spot.innerText = '';
    // Xóa vị trí cũ cờ của mình
    playerSelect.dragged.parentNode.removeChild( playerSelect.dragged );
    // Thêm cờ của mình vào vị trí mới
    spot.appendChild( playerSelect.dragged );
}, false);

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