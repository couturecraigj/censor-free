const { gql } = require('apollo-server');

const typeDefs = gql`
  # INTERFACES
  interface Node {
    id: ID!
  }
  interface PostNode {
    id: ID!
    title: String!
    description: String!
  }
  interface Searchable {
    id: ID!
    highlights: [Highlight]!
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

  # UNIONS
  union SavedRecord = Product | Company | Video | Image | WebPage
  union PostUnion =
      Thought
    | Review
    | Question
    | Answer
    | Image
    | Video
    | WebPage
    | Tip

  # TYPES
  type Highlight {
    text: String!
    ranges: [RangeInt]!
  }
  type RangeInt {
    start: Int!
    end: Int!
  }
  type Thought implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
  }
  type Review implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]!
    comments: [Comment]!
    score: Float!
  }
  type Question implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]
    answers: [Answer]!
    comments: [Comment]!
  }
  type Tip implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]
  }
  type Answer implements Node & CommentNode & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    question: Question
    title: String!
    description: String!
    comments: [Comment]!
  }
  type Comment implements Node & CommentNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    parent: PostUnion!
    description: String!
  }
  type Image implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    height: Int
    width: Int
    imgUri: String!
  }
  type Video implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    imgs: [Image]
    img: Image
    uri: String!
  }
  type WebPage implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    imgs: [Image]
    img: Image
    uri: String!
  }
  type Group implements Node & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    img: Image
    imgs: [Image]
  }
  type Save implements Node {
    id: ID!
    object: SavedRecord!
    img: Image
  }
  type Product implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    description: String!
    img: Image
    imgs: [Image]
  }
  type Company implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    img: Image
    imgs: [Image]
    description: String!
  }
  type User implements Node & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    description: String!
    img: Image
    imgs: [Image]
  }

  type Query {
    feed: [PostNode]!
    saved: [Save]!
    company(id: ID!): Company
    companies: [Company]!
    product(id: ID!): Product
    products: [Product]!
    group(id: ID!): Group
    groups: [Group]!
    user(id: ID!): User
    users: [User]!
    video(id: ID!): Video
    videos: [Video]!
    search: [Searchable]!
  }
`;

module.exports = typeDefs;
