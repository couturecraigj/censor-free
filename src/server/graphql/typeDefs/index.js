const { gql } = require('apollo-server');

const typeDefs = gql`
  # INTERFACES
  interface Node {
    id: ID!
  }
  interface UserNode {
    userName: String!
  }
  interface PostNode {
    id: ID!
    title: String!
    description: String!
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  interface Searchable {
    id: ID!
    highlights: [Highlight]!
  }
  interface CommentNode {
    id: ID!
    description: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  interface Object {
    id: ID!
    name: String!
    description: String!
    created: AlterationStamp!
    modified: AlterationStamp
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
  type AlterationStamp {
    user: User!
    date: Int!
  }
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
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Story implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    comments: [Comment]!
    excerpt: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Review implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]!
    comments: [Comment]!
    score: Float!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Question implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]
    answers: [Answer]!
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Tip implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    products: [Product!]
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Answer implements Node & CommentNode & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    question: Question
    title: String!
    description: String!
    comments: [Comment]!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Comment implements Node & CommentNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    parent: PostUnion!
    description: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Photo implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    comments: [Comment]!
    height: Int
    width: Int
    imgUri: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Video implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    imgs: [Photo]
    comments: [Comment]!
    img: Photo
    uri: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type WebPage implements Node & PostNode & Searchable {
    id: ID!
    highlights: [Highlight]!
    title: String!
    description: String!
    comments: [Comment]!
    imgs: [Photo]
    img: Photo
    uri: String!
    created: AlterationStamp!
    modified: AlterationStamp
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
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Company implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    name: String!
    img: Photo
    imgs: [Photo]
    description: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type User implements Node & Searchable & UserNode {
    id: ID!
    highlights: [Highlight]!
    userName: String!
    email: String!
    img: Photo
    imgs: [Photo]
  }

  type Me implements Node & Searchable & UserNode {
    id: ID!
    highlights: [Highlight]!
    userName: String!
    email: String!
    img: Photo
    imgs: [Photo]
  }

  type Authentication {
    token: String!
    me: Me!
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
    addPhoto(
      title: String!
      description: String!
      height: Int!
      width: Int!
      imgUri: String!
    ): Photo
    addAnswer(title: String!): Answer
    addComment(description: String!): Comment
    addThought(title: String!): Thought
    addQuestion(title: String!): Question
    addReview(title: String!): Review
    addStory(title: String!): Story
    addTip(title: String!): Tip
    addVideo(title: String!, description: String!, videoUri: String!): Video
    addWebPage(title: String!): WebPage
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
    me: Me
    video(id: ID!): Video
    videos: [Video]!
    search: [Searchable]!
  }
`;

export default typeDefs;
