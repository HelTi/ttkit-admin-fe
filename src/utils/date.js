import moment from 'moment';

moment.locale('zh-cn');

function formatDate(val) {
  return moment(val).format('MM-DD');
}

/**
 * 相邻的一天，前一天或者后一天
 * @param {*} d
 */
export const adjacentDay = d => {
  const currentDate = new Date().getTime();
  const dayOffsetTime = 24 * 60 * 60 * 1000;

  console.log(formatDate(currentDate + dayOffsetTime * d));

  return formatDate(currentDate + dayOffsetTime * d);
};

/**
 * 获取相邻的改天的前七天
 * @param {} tag
 */
export const get7day = (tag = 1) => {
  const resultArr = []
  const days = 7
  if (tag === 1) {
    for (let i = 0; i < days; i += 1) {
      resultArr.push(adjacentDay(i))
    }
  }
  if (tag === -1) {
    for (let i = days - 1; i >= 0; i -= 1) {
      resultArr.push(adjacentDay(-i))
    }
  }

  console.log(resultArr)

  return resultArr
}
