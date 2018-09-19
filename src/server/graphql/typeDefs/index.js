const { gql } = require('apollo-server');

const typeDefs = gql`
  interface Node {
    id: ID!
  }
  union SavedRecord = Product | Company | Video | Image | WebPage
  union PostUnion = Post | Review | Question | Answer
  interface PostNode {
    id: ID!
    title: String!
    description: String!
  }
  interface CommentNode {
    id: ID!
    description: String!
  }

  interface Object {
    id: ID!
    name: String!
    description: String!
  }
  type Post implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
  }
  type Review implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
    products: [Product!]!
    score: Float!
  }
  type Question implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
    answers: [Answer]!
  }
  type Answer implements Node & CommentNode & PostNode {
    id: ID!
    question: Question
    title: String!
    description: String!
  }
  type Comment implements Node & CommentNode {
    id: ID!
    parent: PostUnion!
    description: String!
  }
  type Image implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
    uri: String!
  }
  type Video implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
    uri: String!
  }
  type WebPage implements Node & PostNode {
    id: ID!
    title: String!
    description: String!
    uri: String!
  }
  type Group implements Node {
    id: ID!
    title: String!
    description: String!
  }
  type Save implements Node {
    id: ID!
    object: SavedRecord!
    imgUri: String!
  }
  type Product implements Node & Object {
    id: ID!
    name: String!
    description: String!
  }
  type Company implements Node & Object {
    id: ID!
    name: String!
    description: String!
  }
  type User implements Node {
    id: ID!
    name: String!
    description: String!
  }
  type Query {
    hello: String
    feed: [Post]!
    saved: [Save]!
  }
`;

module.exports = typeDefs;
