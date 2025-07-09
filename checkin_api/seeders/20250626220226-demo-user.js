'use strict';

// This is a mock data for testing, and is not associated with any real information.

const bcrypt = require('bcryptjs');

const koreanNames = [
  '김민준',
  '이서연',
  '박지호',
  '최수아',
  '정도윤',
  '강지원',
  '조하은',
  '윤서준',
  '임지유',
  '한예준',
  '신아린',
  '권현우',
  '오서진',
  '송민서',
  '류지민',
  '노현준',
  '홍서영',
  '유준호',
  '백지안',
  '남도현',
  '곽서윤',
  '문준서',
  '양하린',
  '구민재',
  '황지우',
  '천수빈',
  '고은서',
  '배현준',
  '전지훈',
  '안서현',
  '이주원',
  '박하은',
  '김서준',
  '최민지',
  '정윤서',
  '강준우',
  '조하윤',
  '윤민서',
  '임지호',
  '한서아',
  '신준호',
  '권하린',
  '오지원',
  '송현우',
  '류서연',
  '노지안',
  '홍준서',
  '유하은',
  '백현준',
  '남서영',
];

const englishNames = [
  'Emma Johnson',
  'Noah Smith',
  'Olivia Brown',
  'Liam Davis',
  'Ava Wilson',
  'Mason Taylor',
  'Sophia Anderson',
  'William Thomas',
  'Isabella Jackson',
  'James White',
  'Charlotte Lee',
  'Benjamin Harris',
  'Amelia Clark',
  'Lucas King',
  'Mia Scott',
  'Henry Green',
  'Harper Baker',
  'Alexander Hill',
  'Evelyn Adams',
  'Daniel Nelson',
  'Abigail Campbell',
  'Sebastian Carter',
  'Emily Mitchell',
  'David Roberts',
  'Elizabeth Turner',
  'Joseph Phillips',
  'Sofia Cooper',
  'Michael Morgan',
  'Victoria Rogers',
  'Matthew Reed',
  'Grace Cook',
  'Christopher Bailey',
  'Chloe Murphy',
  'Andrew Rivera',
  'Zoe Brooks',
  'Joshua Coleman',
  'Lily Richardson',
  'John Cox',
  'Hannah Howard',
  'Samuel Ward',
  'Aria Torres',
  'Gabriel Peterson',
  'Layla Gray',
  'Dylan Ross',
  'Nora Watson',
  'Christopher Hayes',
  'Scarlett Bennett',
  'Anthony Powell',
  'Aurora Foster',
  'Ryan Hughes',
];

function generateRandomPhone(role) {
  const randomNum = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  switch (role) {
    case 'guardian':
      return `0101${randomNum}`;
    case 'manager':
      return `0102${randomNum}`;
    case 'admin':
      return `0103${randomNum}`;
    default:
      return `0101${randomNum}`;
  }
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
        phone: generateRandomPhone('guardian'),
        email: `user${i + 1}@example.com`,
        role: 'guardian',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    const managerUsers = [];
    for (let locationId = 1; locationId <= 5; locationId++) {
      for (let i = 0; i < 5; i++) {
        const managerIndex = (locationId - 1) * 5 + i + 1;
        managerUsers.push({
          username: `manager${managerIndex}`,
          password: await bcrypt.hash('1234', saltRounds),
          eng_name: `Manager ${managerIndex}`,
          kor_name: `매니저 ${managerIndex}`,
          phone: generateRandomPhone('manager'),
          email: `manager${managerIndex}@example.com`,
          role: 'manager',
          locationId: locationId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    const adminUsers = [
      {
        username: 'admin1',
        password: await bcrypt.hash('1234', saltRounds),
        eng_name: 'James Wilson',
        kor_name: '최준호',
        phone: generateRandomPhone('admin'),
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
        phone: generateRandomPhone('admin'),
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
        phone: generateRandomPhone('admin'),
        email: 'admin3@example.com',
        role: 'admin',
        locationId: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const allUsers = [...guardianUsers, ...managerUsers, ...adminUsers];

    await queryInterface.bulkInsert('User', allUsers, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  },
};
