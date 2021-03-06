/**
 * Add isYearLast property to allAritcles response data.
 */
exports.addYearLastPost = (allArticles) => {
  const years = [];
  const result = allArticles.map((item, index) => {
    const year = new Date(item.created_time).getFullYear();
    const isYearLast = !exports.hasInArr(year, years);
    years.push(year);
    return Object.assign({ isYearLast }, item);
  });
  return result;
};


exports.hasInArr = (target, arr) =>
  new Set(arr).size === new Set([...arr, target]).size;


/**
 * 根据传入参数类型的不同，函数会作出不同的反应：
 *
 * Number: 会被作为 code 值。例如:
 *    0，函数会返回 { code: 0, data: {}, message: '成功' }
 *    1，函数会返回 { code: 1, data: {}, message: '无效参数' }
 *    2，函数会返回 { code: 2, data: {}, message: '数据查询异常' }
 *
 * String: 会被作为 message 值。返回 { code: 0, data: {}, message: String }
 *
 * Object: 会被作为整个 res 对象，但是不需要传入所有 res 应有的属性，
 * 比如传入 { data: 1 } 回返回 { code: 0, message: '成功', data: 1 }
 * 自动补全了 code 和 message 属性。
 */
/**
 * code 码所代表的含义应该一致，这样便于在客户端快速定位服务端问题。
 * 因此在此处定义一下 code 码及其对应的含义。
 *
 * code           means
 *  0             成功
 *  -1            所有的未知错误都应默认为 -1
 *  1             缺少参数，或者传入的参数不正确
 *  2             操作数据库失败
 */
exports.Res = function Res(p) {
  const r = p === undefined ? 0 : p;

  if (!exports.hasInArr(typeof r, ['string', 'number', 'object'])) {
    throw new Error('[utils >>> Res] Got an incorrect type param');
  }

  let code;
  let data;
  let message;
  const typeDo = {
    number() {
      code = r;
    },
    string() {
      message = r;
    },
    object() {
      code = r.code;
      data = r.data;
      message = r.message;
    },
  };

  typeDo[typeof r]();

  const res = {
    code: 0,
    message: '成功',
    data: {},
  };

  const codeStrategies = {
    '-1': '未知错误',
    0: '成功',
    1: '无效参数',
    2: '数据查询异常',
  };

  if (typeof data !== 'undefined') {
    Object.assign(res, { data });
  }

  if (typeof code !== 'undefined') {
    Object.assign(res, { code });
  }

  if (typeof message !== 'undefined') {
    Object.assign(res, { message });
  } else if (res.code in codeStrategies) {
    Object.assign(res, { message: codeStrategies[res.code] });
  } else {
    Object.assign(res, { message: 'Unknown Error Code' });
  }

  return res;
};

/**
 * easy to log
 */
exports.Log = function (scope) {
  this.scope = scope;
  this.log = function (...p) {
    console.log(`[${scope} >>> ${p.shift()}] `, ...p, '\n');
  };
};


exports.reformatArticlesList = function (rowList) {
  const list = {};
  rowList.forEach((item) => {
    const date = item.created_time;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) < 10
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1;

    item.created_time = item.created_time.toLocaleDateString();
    item.last_modified_time = item.last_modified_time.toLocaleDateString();

    if (!list[year]) {
      list[year] = {};
    }
    if (!list[year][month]) {
      list[year][month] = [item];
      return;
    }
    list[year][month].push(item);
  });
  return list;
};
