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
  union SavedRecord = Product | Company | Video | Photo | WebPage
  union PostUnion =
      Thought
    | Review
    | Question
    | Answer
    | Photo
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
  type Story implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    excerpt: String!
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
  type Photo implements Node & PostNode & Searchable {
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
    imgs: [Photo]
    img: Photo
    uri: String!
  }
  type WebPage implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    imgs: [Photo]
    img: Photo
    uri: String!
  }
  type Group implements Node & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    img: Photo
    imgs: [Photo]
  }
  type Save implements Node {
    id: ID!
    object: SavedRecord!
    img: Photo
  }
  type Product implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    description: String!
    img: Photo
    imgs: [Photo]
  }
  type Company implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    img: Photo
    imgs: [Photo]
    description: String!
  }
  type User implements Node & Searchable {
    id: ID!
    highlights: [Highlight]!
    userName: String!
    email: String!
    name: String!
    description: String!
    img: Photo
    imgs: [Photo]
  }

  type Authentication {
    token: String!
    user: User!
  }

  type Mutation {
    signUp(
      email: String!
      confirmEmail: String!
      password: String!
      confirmPassword: String!
      userName: String!
    ): Authentication!
    logOut: String!
    forgotPassword(email: String!): String!
    resetPassword(
      token: String!
      password: String!
      confirmPassword: String!
    ): Authentication!
    logIn(nameEmail: String!, password: String!): Authentication!
    addPhoto(title: String!): Photo
    addThought(title: String!): Thought
    addQuestion(title: String!): Question
    addReview(title: String!): Review
    addStory(title: String!): Story
    addTip(title: String!): Tip
    addVideo(title: String!): Video
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
