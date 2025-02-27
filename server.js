require("dotenv").config();
const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const {buildSchema} = require("graphql");
const mongoose = require("mongoose");

//Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.once("open", ()=>console.log("Connected to MongoDB"));

//Mongoose Schema for users
const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    age:Number
})

const User = mongoose.model("User", UserSchema)
// let users = [
//     {id:"1",name:"Jordan", email:"jdubreuil@neit.edu"},
//     {id:"2",name:"Andrew", email:"andrew@neit.edu"},
//     {id:"3",name:"Ian", email:"ian@neit.edu"},
// ];


//Define the build Schema
const schema = buildSchema(`
    type User{
        id:ID!
        name:String!
        email:String!
        age:Int!
    }
    
    type Query{
        user(id:ID!):User
        users:[User]
    }

    type Mutation{
        addUser(name: String!, email:String!, age:Int!):User
        updateUser(id:ID!, name:String, email:String, age:Int):User
        deleteUser(id:ID!):String
    }
`);

//Define Resolvers
const root = {
    user:async({id})=> await User.findById(id),
    users:async()=> await User.find(),
    addUser:async({name,email,age})=>{
        const newUser = new User({name, email, age});
        return await newUser.save();
    },
    updateUser:async({id, name,email,age}) =>{
        return await User.findByIdAndUpdate(id, {name, email,age}, {new:true});
    },
    deleteUser:async({id})=>{
        await User.findByIdAndDelete(id);
        return `User with ID ${id} deleted`;
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