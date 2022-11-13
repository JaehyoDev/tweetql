import { ApolloServer, gql } from "apollo-server";
// package.json에서 type: module을 해주면 import 문법 사용가능
// 그렇지 않으면
// const { ApolloServer, gql } = require("apollo-server")
// 을 사용해야한다.

let tweets = [
    {
        id: "1",
        text: "first one!"
    },
    {
        id: "2",
        text: "second one!"
    }
];

let users = [
    {
        id: "1",
        firstName: "nico",
        lastName: "las"
    }
];

const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        tweet(root, { id }) {
            return tweets.find((tweet) => tweet.id == id);
        },
        allUsers() {
            return users;
        }
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, {id}) {
            const tweet = tweets.find(tweet => tweet.id == id);
            if(!tweet) return false;
            tweets = tweets.filter(tweet => tweet.id != id)
            // filter의 조건을 만족하는 것만 tweets에 넣어준다.
            // 삭제하려는 id와 같은 id를 가진 tweet을 제외한 tweet들을 넣어준다.
            return true;
        }
    },
    User: {
        fullName() {
            return "hello!";
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});