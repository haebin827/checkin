'use strict';

// This is a mock data for testing, and is not associated with any real information.

const koreanLastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전', '홍', '고', '문', '양', '손', '배', '조', '백', '허', '유', '남', '심', '노', '정', '하', '곽', '성', '차', '주', '우', '구', '신', '임', '나', '전', '민', '유', '진', '지', '엄', '채', '원', '천', '방', '공', '강', '현', '함', '변', '염', '양', '변', '여', '추', '도', '소', '신', '석', '선', '설', '마', '길', '주', '연', '방', '위', '표', '명', '기', '반', '왕', '금', '옥', '육', '인', '맹', '제', '모', '장', '남', '탁', '국', '여', '진', '어', '은', '편', '구', '용'];
const koreanFirstNames = ['서준', '서윤', '도윤', '지우', '예준', '주원', '지호', '지후', '준우', '준서', '도현', '지훈', '현우', '준혁', '선우', '시우', '민준', '서진', '연우', '은우', '민서', '민지', '서연', '서영', '민주', '지민', '은지', '예진', '수빈', '지원', '지윤', '지현', '채원', '예원', '다은', '수민', '예은', '지은', '민경', '소윤', '소율', '서율', '하율', '하윤', '하진', '하린', '은서', '은채', '은호', '은성'];
const englishLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const englishFirstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Paul', 'Steven', 'Andrew', 'Kenneth', 'Joshua', 'Kevin', 'Brian', 'George', 'Edward', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy', 'Carol', 'Amanda', 'Melissa', 'Deborah'];

function generateRandomBirthDate() {
  const start = new Date(2010, 0, 1);
  const end = new Date(2018, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0];
}

function generateRandomPhone() {
  if (Math.random() < 0.2) {
    return null;
  }
  const randomNum = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `010${randomNum}`;
}

function generateRandomKoreanName() {
  const lastName = koreanLastNames[Math.floor(Math.random() * koreanLastNames.length)];
  const firstName = koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
  return lastName + firstName;
}

function generateRandomEnglishName() {
  const firstName = englishFirstNames[Math.floor(Math.random() * englishFirstNames.length)];
  const lastName = englishLastNames[Math.floor(Math.random() * englishLastNames.length)];
  return `${firstName} ${lastName}`;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const children = [];
    const childrenPerLocation = 40; // 각 location당 40명

    for (let locationId = 1; locationId <= 5; locationId++) {
      for (let i = 0; i < childrenPerLocation; i++) {
        children.push({
          eng_name: generateRandomEnglishName(),
          kor_name: generateRandomKoreanName(),
          birth: generateRandomBirthDate(),
          phone: generateRandomPhone(),
          locationId: locationId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert('child', children, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('child', null, {});
  },
};
