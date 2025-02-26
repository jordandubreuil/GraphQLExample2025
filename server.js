const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");

let users = [
    {id:"1",name:"Jordan", email:"jdubreuil@neit.edu"},
    {id:"2",name:"Andrew", email:"andrew@neit.edu"},
    {id:"3",name:"Ian", email:"ian@neit.edu"},
];


//Define the build Schema
const schema = buildSchema(`
    type User{
        id:ID!
        name:String!
        email:String!
    }
    
    type Query{
        user(id:ID!):User
        users:[User]
    }

    type Mutation{
        addUser(name: String!, email:String!):User
    }
`);

//Define Resolvers
const root = {
    user:({id})=> users.find(user => user.id == id),
    users:()=>users,
    addUser:({name,email})=>{
        const newUser = {id:String(users.length + 1), name, email};
        users.push(newUser);
        return newUser;
    }
}

//Setting up Express server to work with GraphQL
const app = express();
app.use("/graphql", graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true //Enable GraphQL Playground
}));

//Start Server
app.listen(3000, ()=>{
    console.log("Server is running on port 3000/graphql")
})