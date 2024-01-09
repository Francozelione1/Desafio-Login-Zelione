import mongoose from "mongoose";
import supertest from "supertest";
import 'dotenv/config'
import * as chai from "chai";
import assert from "assert";
import { describe, it, beforeEach } from 'mocha';
import userModel from "../../models/users.models.js";
import { generateToken } from "../../utils/jwt.js";

const app = await mongoose.connect("mongodb+srv://fzelionelenzi:coderhousefzelionelenzi@cluster0.z3ja11i.mongodb.net/?retryWrites=true&w=majority")

const {expect} = chai

const requester = supertest('http://localhost:4000')

describe("Tests de Usuarios", async function() {

    const newUser = {
        first_name: "pepe",
        last_name: "perez",
        password: "password",
        email: "pepeperez@gmail.com",
        age: "20",
    }

    it('Test endpoint: POST /api/session/register, se espera un 200 de status code', async () => {
        const response = await requester.post('/api/session/register')
        .send(newUser)
        console.log(response.statusCode)
        await userModel.deleteOne({email: newUser.email})
        expect(response.statusCode).to.be.equal(200)
    })

})