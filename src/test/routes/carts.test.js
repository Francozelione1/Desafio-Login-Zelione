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

describe("Tests de Carts", async function() {

    it('Test endpoint: POST /api/carts/:cid, se espera un 201 de status code por el carrito creado', async () => {
        const response = await requester.post(`/api/carts/`)
        expect(response.statusCode).to.be.equal(201)
    })

})