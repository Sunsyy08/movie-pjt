const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('movies.db');
const cors = require('cors');
app.use(cors()); // 모든 도메인에서 API 요청 가능하도록 설정
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});



// 영화목록
//


app.get('/movies', (req, res) => {
    db.all(`SELECT id, original_title, poster_path, vote_average FROM movies`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// 영화 상세글
// 대충 다 보여주면 될듯?