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
export const formatAmPmTime = (inputTimeString: string) => {
  const date = new Date(inputTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? '오후' : '오전';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${ampm} ${hours}:${formattedMinutes}`;
};

// 9:11
export const formatTime = (inputTimeString: string) => {
  const date = new Date(inputTimeString);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${formattedMinutes}`;
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

// 12월 25일 (화)
export const formatMonthDayDay = (dateString: string) => {
  const date = new Date(dateString);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dayOfWeekIndex = date.getDay();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];

  return `${month}월 ${day}일 (${dayOfWeek})`;
};

// 2024. 11. 29. (금) 오후 8:05
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dayOfWeekIndex = date.getDay();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? '오후' : '오전';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${year}. ${month}. ${day}. (${dayOfWeek}) ${ampm} ${hours}:${formattedMinutes}`;
};

// 오늘 or 12월 17일 (화)
export const formatTodayOrDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return '오늘';
  }

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

// 요일
export const formatDOW = (dataString: string) => {
  const date = new Date(dataString);

  const dayOfWeekIndex = date.getDay();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[dayOfWeekIndex];

  return `(${dayOfWeek})`;
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

// 12/25
export const formatMonthDaySlash = (dateString: string) => {
  const date = new Date(dateString);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${month}/${day}`;
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

// 남은 시간
export const formatRemainingTime = (dateString: string) => {
  const targetDate = new Date(dateString);
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return '마감되었습니다';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // 남은 일수
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 남은 시간
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // 남은 분

  if (days > 0) {
    return `${days}일 후 마감`;
  } else if (hours) {
    return `${String(hours).padStart(2, '0')}시간 ${String(minutes).padStart(2, '0')}분 후 마감`;
  } else {
    return `${String(minutes).padStart(2, '0')}분 후 마감`;
  }
};
