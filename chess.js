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