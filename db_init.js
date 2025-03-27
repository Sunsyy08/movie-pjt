const sqlite3 = require('sqlite3').verbose();
const xlsx = require('xlsx');
const fs = require('fs');

// 엑셀 파일 읽기
const workbook = xlsx.readFile('movies.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// 엑셀 데이터를 JSON으로 변환
const movies = xlsx.utils.sheet_to_json(sheet);

// SQLite3 데이터베이스 연결
const db = new sqlite3.Database('movies.db');

// 테이블 생성
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_title TEXT,
        overview TEXT,
        release_date TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        popularity REAL,
        vote_average REAL,
        vote_count INTEGER
    )`);

    const stmt = db.prepare(`INSERT INTO movies 
        (original_title, overview, release_date, poster_path, backdrop_path, popularity, vote_average, vote_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    movies.forEach(movie => {
        stmt.run(
            movie['Original Title'] || '',
            movie['Overview'] || '',
            movie['Release Date'] || '',
            movie['Poster Path'] || '',
            movie['Backdrop Path'] || '',
            movie['Popularity'] || 0,
            movie['Vote Average'] || 0,
            movie['Vote Count'] || 0
        );
    });

    stmt.finalize();
});


// comments 테이블 생성
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_id INTEGER,
            username TEXT DEFAULT 'Anonymous',  -- 로그인하지 않은 사용자도 익명으로 댓글 작성
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(movie_id) REFERENCES movies(id)
        )
    `);
});



db.close(() => {
    console.log('데이터 삽입 완료!');
});