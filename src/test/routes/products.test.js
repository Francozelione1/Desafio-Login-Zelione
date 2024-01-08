import mongoose from "mongoose";
import supertest from "supertest";
import 'dotenv/config'
import * as chai from "chai";
import assert from "assert";
import { describe, it, beforeEach } from 'mocha';

const app = await mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")

const {expect} = chai

const requester = supertest('http://localhost:4000')

describe("Test de usuarios", async function() {

    const newUser={
        first_name: "Candelita",
        last_name: "Arrua",
        email: "holanda2@gmail.com",
        age: "20",
        password: "hola"
    }

    it("Crea a un usuario", async function(){

        const {_body, statusCode, ok }= await requester.post("/api/users/register").send(newUser)
        console.log(_body)
        expect(statusCode).to.be.equal(200)
        this.timeout(8000);
    })

})