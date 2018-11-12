import { gql } from 'apollo-server';
import {
  FILTER_TYPE_ENUM,
  POST_TYPE_ENUM,
  OBJECT_TYPE_ENUM
} from '../../../common/types';
import { typeDef as User } from '../types/User';
import { typeDef as Product } from '../types/Product';
import { typeDef as Company } from '../types/Company';
import { typeDef as Group } from '../types/Group';
import { typeDef as Authentication } from '../types/Authentication';
import { typeDef as Thought } from '../types/Thought';
import { typeDef as Story } from '../types/Story';
import { typeDef as Review } from '../types/Review';
import { typeDef as Question } from '../types/Question';
import { typeDef as Video } from '../types/Video';
import { typeDef as WebPage } from '../types/WebPage';
import { typeDef as Photo } from '../types/Photo';
import { typeDef as Tip } from '../types/Tip';
import { typeDef as Comment } from '../types/Comment';
import { typeDef as Answer } from '../types/Answer';
import VideoFilterInput from '../inputs/VideoFilterInput';
import CoordinatesInput from '../inputs/CoordinatesInput';

const typeDefs = gql`
  # SCALARS
  scalar Date
  scalar Email

  # DIRECTIVES
  directive @index(type: String) on FIELD_DEFINITION
  directive @unique on FIELD_DEFINITION
  directive @lowerCase on FIELD_DEFINITION
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
  ${Thought} ${Answer} ${Story} ${Review} ${Photo} ${Question}
  ${Product} ${Company} ${User} ${Tip} ${Comment} ${Video}
  ${WebPage} ${Group} ${Authentication}
  type Save implements Node {
    id: ID!
    object: SavedRecord!
    img: Photo
  }
  

  type Me implements Node & UserNode {
    id: ID!
    highlights: [Highlight]!
    userName: String! @index(type: "text") @unique
    email: String! @index(type: "text") @unique @lowerCase
    img: Photo
    imgs: [Photo]
  }
  ${VideoFilterInput}
  ${CoordinatesInput}
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
      imgUri: String!
      string: String
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
      filters: [VideoFilterInput]!
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
