import { gql } from 'apollo-server';
import {
  FILTER_TYPE_ENUM,
  POST_TYPE_ENUM,
  OBJECT_TYPE_ENUM
} from '../../../common/types';

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
    slug: String!
    description: String!
    created: AlterationStamp!
    modified: AlterationStamp
  }

  # ENUMS
  enum OBJECT_ENUM {
    ${OBJECT_TYPE_ENUM.join('\n')}
  }
  enum FILTER_ENUM {
    ${FILTER_TYPE_ENUM.join('\n')}
  }
  enum POSTNODE_ENUM {
    ${POST_TYPE_ENUM.join('\n')}
  }
  # UNIONS
  union SavedRecord =
      Company
    | Product
    | Story
    | Thought
    | Video
    | Photo
    | WebPage
    | User

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
  type Comment implements Node & CommentNode {
    id: ID!
    highlights: [Highlight]!
    parent: PostNode!
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
    converted: Boolean
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
    slug: String!
    description: String!
    img: Photo
    imgs: [Photo]
    created: AlterationStamp!
    modified: AlterationStamp
  }
  type Company implements Node & Object & Searchable {
    id: ID!
    highlights: [Highlight]!
    slug: String!
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

  type Me implements Node & UserNode {
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

  input CoordinatesInput {
    fromTop: Int!
    fromLeft: Int!
    height: Int!
    width: Int!
    startTimeCode: Int
    endTimeCode: Int
  }

  input VideoFilterInput {
    type: FILTER_ENUM
    startTimeCode: Int!
    endTimeCode: Int!
    width: Int
    height: Int
    coordinates: CoordinatesInput
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
    addProduct(name:String!, imgUri:String!, description:String): Product
    addCompany(name:String!, imgUri:String!, description:String): Company
    addGroup(title:String!, imgUri:String!, description:String): Group
    like(id: ID!, type: POSTNODE_ENUM): PostNode
    dislike(id: ID!, type: POSTNODE_ENUM): PostNode
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
      # id: String
      imgUri: String!
    ): Photo
    addAnswer(title: String!): Answer
    addComment(description: String!): Comment
    addThought(title: String!): Thought
    addQuestion(title: String!): Question
    addReview(title: String!): Review
    addStory(title: String!): Story
    addTip(title: String!): Tip
    addVideo(title: String!, description: String!, uploadToken: String!): Video
    addVideoFilters(
      id: ID!
      sex: [VideoFilterInput]!
      nudity: [VideoFilterInput]!
      violence: [VideoFilterInput]!
      frightening: [VideoFilterInput]!
      weapons: [VideoFilterInput]!
      gross: [VideoFilterInput]!
      smoking: [VideoFilterInput]!
      drugs: [VideoFilterInput]!
      alcohol: [VideoFilterInput]!
      language: [VideoFilterInput]!
    ): Video
    addWebPage(title: String!): WebPage
  }
  type Subscription {
    fileConversionProgress(uploadToken: String!): Float!
  }
  type Query {
    feed: [PostNode]!
    objFeed(id: ID!): [PostNode]!
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
    search(text: String): [Searchable]!
  }
`;

export default typeDefs;
