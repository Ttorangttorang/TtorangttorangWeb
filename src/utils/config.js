export function cls(...classnames) {
  return classnames.join(' ');
}

// 1,000 표기
export function formatNumber(number) {
  return number.toLocaleString();
}

// 내 발표문 리스트 content 글자 수 제한
export function reverseData(data) {
  return data && data.reverse();
}

export function sliceMyScript(txt) {
  return txt.slice(0, 60) + '...';
}

export function sliceMyScriptTitle(txt) {
  return txt === null ? '미정' : txt.length > 8 ? txt.slice(0, 8) + '...' : txt;
}

export function sliceMyScriptDateOnly(dateString) {
  return dateString.split('T')[0];
}

export const measureTextWidth = (text, font = '16px NotoSansKR') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
