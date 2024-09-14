export const formatDate = (inputDateString: Date) => {
  const date = new Date(inputDateString);

  const formattedDate = `${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return formattedDate;
};

export const formatComma = inputNumber => {
  if (typeof inputNumber === 'number') {
    inputNumber = inputNumber.toString();
  }

  return inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatTime = (inputTimeString: string) => {
  const date = new Date(inputTimeString);
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // 오전/오후 결정
  const ampm = hours >= 12 ? '오후' : '오전';

  // 12시간제로 변환
  hours = hours % 12;
  hours = hours ? hours : 12;

  // 분 형식 맞추기 (예: 02:09 형태)
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${ampm} ${hours}:${formattedMinutes}`;
};

export const formatBeforeDate = (input: Date) => {
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
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(inputDate);

    return formattedDate.replace(', ', ' ');
  }
};
