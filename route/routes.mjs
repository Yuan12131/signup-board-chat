import express from 'express';
// 파일 시스템 관련 작업을 Promise 기반으로 처리할 수 있는 모듈 -> async/await와 함께 보다 간결한 비동기 코드 작성 가능
import fs from 'fs/promises';
import path from 'path'

const router = express.Router();

// GET 요청 처리
router.get('/', async (req, res) => {
  try {
    // index.html 파일의 절대 경로
    // 현재 모듈을 기준으로 상대 경로를 해석하여 절대 경로로 변환
    const indexPath = path.resolve(__dirname, './public/index.html');
    // fs/promises 모듈을 사용하여 파일을 읽어오는 비동기 코드
    const indexData = await fs.readFile(indexPath, 'utf-8');
    // 클라이언트에 읽은 파일 데이터를 응답
    res.send(indexData);
  } catch (error) {
    console.error('Error reading index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

// '/signup' 경로에 대한 POST 요청 처리
router.post('/signup', async (req, res) => {
  // POST 요청에서 속성 : name, password, email을 추출을 위한 비구조화 할당
  const { name, password, email } = req.body;
  const timestamp = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    // signUp.json 파일을 비동기적으로 가져오기
    const data = await fs.readFile('./data/signUp.json', 'utf-8');
    // JSON 데이터로 파싱
    const formData = JSON.parse(data);

    // 새로운 레코드 객체를 생성
    const newRecord = {
      name: name,
      password: password,
      email: email,
      timestamp: timestamp,
    };

    // 기존 데이터 배열에 새 레코드를 추가
    formData.inputRecords.push(newRecord);

    // 업데이트된 JSON 데이터를 파일에 쓰기
    await fs.writeFile('./data/signUp.json', JSON.stringify(formData, null, 2));

    // 성공적인 응답을 클라이언트에 전송
    res.json({
      status: 'success',
      formData: {
        name: name,
        password: password,
        email: email,
      },
    });
  } catch (error) {
    console.error('Error handling signup:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;