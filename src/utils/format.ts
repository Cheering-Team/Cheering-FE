// 12.25 09:11
export const formatDate = (inputDateString: string) => {
  const date = new Date(inputDateString);

  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return formattedDate;
};

// 오후 9:11
export const formatTime = (inputTimeString: string) => {
  const date = new Date(inputTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? '오후' : '오전';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${ampm} ${hours}:${formattedMinutes}`;
};

// 몇분전 or 12.25 09:11
export const formatBeforeDate = (input: string) => {
  const inputDate = new Date(input);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - inputDate.getTime()) / 1000,
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInSeconds < 60) {
    return '방금';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    // 날짜와 시간을 "MM.DD HH:mm" 형식으로 출력
    const formattedDate = formatDate(input);
    return formattedDate.replace(', ', ' ');
  }
};

// 2024-12-25
export const formatBarDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// 2024년 12월 25일 화요일
export const formatDay = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dayOfWeekIndex = date.getDay();
  const daysOfWeek = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];

  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}`;
};

// 오늘이면 시간, 어제, 몇월몇일
export const formatTodayOr = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  // 오늘 여부 확인 (년, 월, 일 비교)
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  // 어제 여부 확인 (년, 월, 일 비교)
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isToday) {
    // 오늘의 경우 (오전/오후 몇시 몇분)
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? '오후' : '오전';
    const formattedHour = hours % 12 || 12; // 12시간제로 변환, 0시를 12시로 처리

    return `${period} ${formattedHour}:${minutes}`;
  } else if (isYesterday) {
    // 어제의 경우
    return '어제';
  } else {
    // 오늘 이전 날짜의 경우 (몇월 몇일)
    const month = (date.getMonth() + 1).toString(); // 월 (0부터 시작하므로 +1)
    const day = date.getDate().toString();

    return `${month}월 ${day}일`;
  }
};

// 12월 25일
export const formatMonthDay = (dateString: string) => {
  const date = new Date(dateString);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}월 ${day}일`;
};

export const formatXDate = date => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const monthNames = [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ];

  return `${monthNames[month - 1]} ${year}`;
};

export const formatComma = inputNumber => {
  if (typeof inputNumber === 'number') {
    inputNumber = inputNumber.toString();
  }

  return inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
