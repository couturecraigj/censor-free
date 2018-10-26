export const OBJECT_TYPE_MAP = {
  Product: 'Product',
  Company: 'Company'
};

export const COOKIE_TYPE_MAP = {
  token: 'token',
  cookieNotice: 'cookie-notice',
  resetToken: 'reset-token',
  csurfToken: 'csurf-token'
};

export const POST_TYPE_MAP = {
  Answer: 'Answer',
  Photo: 'Photo',
  Question: 'Question',
  Review: 'Review',
  Story: 'Story',
  Thought: 'Thought',
  Tip: 'Tip',
  Video: 'Video',
  WebPage: 'Web Page'
};

export const FILTER_TYPE_MAP = {
  PoliticallyIncorrect: 'Politically Incorrect',
  HateSpeech: 'Hate Speech',
  Patriotic: 'Patriotic',
  Sex: 'Sex',
  Nudity: 'Nudity',
  Violence: 'Violence',
  Weapons: 'Weapons',
  Frightening: 'Frightening',
  Politics: 'Politics',
  Gross: 'Gross',
  Smoking: 'Smoking',
  Drugs: 'Drugs',
  Alcohol: 'Alcohol',
  Cursing: 'Cursing',
  Privacy: 'Privacy Violation',
  Scam: 'Report a Scam',
  Copyright: 'Copyright Violation'
};
export const FILTER_TYPE_ENUM = Object.keys(FILTER_TYPE_MAP);

export const OBJECT_TYPE_ENUM = Object.keys(OBJECT_TYPE_MAP);

export const POST_TYPE_ENUM = Object.keys(POST_TYPE_MAP);
