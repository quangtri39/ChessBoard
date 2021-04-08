const hoverColor = 'green';// Chuyển thành màu xanh khi kéo cờ vào ô
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
var playerTurn = 'white';   // Biến đến lượt người chơi
// Biến lưu thông tin quân cờ khi Dragg
var playerSelect = {
    piece: '',      // Quân cờ
    player: '',     // Người chơi
    row: '',        // Dòng
    column: ''      // Cột
}
// Biến lưu Item Drag để sau khi drag thì add lại vào nơi cuối
var dragged;


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
    // Truyền quân cờ vào biến tạm
    dragged = event.target; 
    // Lấy thông tin của Element cha
    let parentDragg = dragged.parentElement;
    // Thêm thông tin của cờ vào biến toàn cục
    playerSelect = {piece: dragged.getAttribute("piece"), player: dragged.getAttribute("player"), row: parentDragg.getAttribute("row"), column: parentDragg.getAttribute("column")}
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
    // highlight potential drop target when the draggable element enters it
    if (event.target.classList.contains('dropzone')) {
        event.target.style.background = hoverColor;
    }

}, false);

// Hàm khi kéo cờ ra vị trí khác thì trả lại màu nền ban đầu
document.addEventListener("dragleave", function(event) {
    // reset background of potential drop target when the draggable element leaves it
    if (event.target.classList.contains('dropzone')) {
        event.target.style.background = "";
    }

}, false);

// Hàm thả quân cờ
document.addEventListener("drop", function(event) {
    // prevent default action (open as link for some elements)
    event.preventDefault();
    // Kiểm tra xem nơi thả có đúng ô không
    if (!event.target.classList.contains('dropzone')) {
        let parentEle = event.target.parentElement;
        // Nếu kéo 1 quân cờ vào 1 quân cờ khác thì kiểm tra parentElement có phải trùng dropzone không
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
        dragged.parentNode.removeChild( dragged );
        // Thêm cờ của mình vào vị trí mới
        parentEle.appendChild( dragged );
        return;
    }
    // Kiểm tra xem ô đấy đã có quân cờ và là quân cờ của mình thì trở về
    // let destination = event.target.firstChild;
    // console.log(event.target);
    // if(destination){
    //     // && destination.querySelector(''
    //     event.target.style.background = "";
    //     return;
    // }
    // Reset màu background lại như cũ
    event.target.style.background = "";

    event.target.innerText = '';
    event.target.appendChild( dragged );
}, false); 