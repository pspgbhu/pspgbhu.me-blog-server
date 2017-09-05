const querystring = require('querystring');
const mysql = require('mysql');
const db = require('../../db');
const { addYearLastPost } = require('../../utils');


/**
 * To get all article
 */

exports.getAllArticles = async () => {
  const data = await db('SELECT * FROM articles');
  return addYearLastPost(data);
};

/**
 * To get Articles List
 */

exports.getArticlesList = async () => {
  const data = await db('SELECT id, title, created_time FROM articles');
  return addYearLastPost(data);
};

/**
 * To get Article single or multiple
 */

exports.getArticle = async (...ids) => {
  if (ids.length === 0) {
    return false;
  }
  const escapedIds = ids.map(item => mysql.escape(item));
  const sql = `SELECT * FROM articles
    WHERE id in (${ids.join(',')})`;

  const data = await db(sql);
  return data;
};

/**
 * To update article views number
 */

exports.updateViews = async (...ids) => {
  const sql = `UPDATE articles SET views = views + 1 WHERE id IN (${ids.join(',')})`;
  await db(sql);
};

/**
 * To post an article
 */

exports.createArticle = async ({ title, content, categories }) => {
  const sql = `
  INSERT INTO articles
    (title, content, categories)
    VALUES
    (${title}, ${content}, ${categories});
  `;
  await db(sql);
};

/**
 * To Update an article
 */

exports.UpdateArticle = async (param) => {
  const { id, title, content, categories } = param;
  const setSQL = [];

  for (const key in param) {
    if (Object.prototype.hasOwnProperty.call(param)) {
      const value = param[key];
      setSQL.push(`SET ${key} = ${value}`);
    }
  }

  const sql = `UPDATE articles ${setSQL.join(',')};`;
  await db(sql);
};