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
// 특정 영화 상세 정보 API
app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id; // URL에서 ID 추출

    db.get('SELECT * FROM movies WHERE id = ?', [movieId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: '영화를 찾을 수 없습니다.' });
        }
        res.json(row); // 영화 상세 정보 반환
    });
});

// 댓글 작성 API
// 댓글 작성 API
app.post('/comments', express.json(), (req, res) => {
    const { movie_id, content, username = 'Anonymous' } = req.body;

    if (!movie_id || !content) {
        return res.status(400).json({ error: '영화 ID와 댓글 내용을 입력해야 합니다.' });
    }

    const query = 'INSERT INTO comments (movie_id, content, username) VALUES (?, ?, ?)';
    db.run(query, [movie_id, content, username], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: '댓글이 성공적으로 작성되었습니다.', commentId: this.lastID });
    });
});


// 댓글 불러오기 API
app.get('/comments/:movie_id', (req, res) => {
    const movieId = req.params.movie_id;

    const query = 'SELECT * FROM comments WHERE movie_id = ? ORDER BY created_at DESC';
    db.all(query, [movieId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // 영화에 대한 모든 댓글을 반환
    });
});
