'use strict';

// This is a mock data for testing, and is not associated with any real information.

const bcrypt = require('bcryptjs');

const koreanNames = [
  '김민준', '이서연', '박지호', '최수아', '정도윤', '강지원', '조하은', '윤서준', 
  '임지유', '한예준', '신아린', '권현우', '오서진', '송민서', '류지민', '노현준',
  '홍서영', '유준호', '백지안', '남도현', '곽서윤', '문준서', '양하린', '구민재',
  '황지우', '천수빈', '고은서', '배현준', '전지훈', '안서현', '이주원', '박하은',
  '김서준', '최민지', '정윤서', '강준우', '조하윤', '윤민서', '임지호', '한서아',
  '신준호', '권하린', '오지원', '송현우', '류서연', '노지안', '홍준서', '유하은',
  '백현준', '남서영'
];

const englishNames = [
  'Emma Johnson', 'Noah Smith', 'Olivia Brown', 'Liam Davis', 'Ava Wilson',
  'Mason Taylor', 'Sophia Anderson', 'William Thomas', 'Isabella Jackson', 'James White',
  'Charlotte Lee', 'Benjamin Harris', 'Amelia Clark', 'Lucas King', 'Mia Scott',
  'Henry Green', 'Harper Baker', 'Alexander Hill', 'Evelyn Adams', 'Daniel Nelson',
  'Abigail Campbell', 'Sebastian Carter', 'Emily Mitchell', 'David Roberts', 'Elizabeth Turner',
  'Joseph Phillips', 'Sofia Cooper', 'Michael Morgan', 'Victoria Rogers', 'Matthew Reed',
  'Grace Cook', 'Christopher Bailey', 'Chloe Murphy', 'Andrew Rivera', 'Zoe Brooks',
  'Joshua Coleman', 'Lily Richardson', 'John Cox', 'Hannah Howard', 'Samuel Ward',
  'Aria Torres', 'Gabriel Peterson', 'Layla Gray', 'Dylan Ross', 'Nora Watson',
  'Christopher Hayes', 'Scarlett Bennett', 'Anthony Powell', 'Aurora Foster', 'Ryan Hughes'
];

function generateRandomPhone() {
  const randomNum = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `010${randomNum}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const guardianUsers = [];

    for (let i = 0; i < 50; i++) {
      guardianUsers.push({
        username: `user${i + 1}`,
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: englishNames[i],
        kor_name: koreanNames[i],
        phone: generateRandomPhone(),
        email: `user${i + 1}@example.com`,
        role: 'guardian',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const adminManagerUsers = [
      {
        username: 'admin1',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'James Wilson',
        kor_name: '최준호',
        phone: '0101000001',
        email: 'admin1@example.com',
        role: 'admin',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'admin2',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Emily Wang',
        kor_name: '왕미란',
        phone: '0101000002',
        email: 'admin2@example.com',
        role: 'admin',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'admin3',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Daniel Choi',
        kor_name: '최현우',
        phone: '0101000003',
        email: 'admin3@example.com',
        role: 'admin',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager1',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Jessica Zhang',
        kor_name: '장수빈',
        phone: '0102000001',
        email: 'manager1@example.com',
        role: 'manager',
        locationId: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager2',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Ryan Kang',
        kor_name: '강동현',
        phone: '0102000002',
        email: 'manager2@example.com',
        role: 'manager',
        locationId: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager3',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Olivia Yoon',
        kor_name: '윤서아',
        phone: '0102000003',
        email: 'manager3@example.com',
        role: 'manager',
        locationId: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager4',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'William Jeong',
        kor_name: '정우진',
        phone: '0102000004',
        email: 'manager4@example.com',
        role: 'manager',
        locationId: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'manager5',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'Isabella Han',
        kor_name: '한지원',
        phone: '0102000005',
        email: 'manager5@example.com',
        role: 'manager',
        locationId: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const allUsers = [...guardianUsers, ...adminManagerUsers];

    await queryInterface.bulkInsert('User', allUsers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  },
};
