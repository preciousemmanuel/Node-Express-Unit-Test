import supertest from "supertest";
import createServer from "../utils/server";
import connect from "../utils/connect";
import mongoose from "mongoose";
import config from "config";
import { createProduct } from "../service/product.service";
import { signJwt } from "../utils/jwt.utils";


const app=createServer();

const userId=new mongoose.Types.ObjectId().toString();

const userPayload={
  _id:userId,
  email:"example@gmail.com",
  
  name:"PRecious"
}
const productPayload={
  user:userId,
  title:"Cannon es650 Camera",
  description:"Designed for good view",
  price:100,
  image:"https://i.imur.com/QlR"
}

//appending skip and only ; skips the test or only runs the test Eg: describe.only or describe.skip
describe("product",()=>{

  beforeAll(async ()=>{
  const dbUri = config.get<string>("dbUri");

    await mongoose.connect("mongodb+srv://trybeone:sRKyd4dCU7sP6M6@cluster0.ol4yr.mongodb.net/test-api?retryWrites=true&w=majority");
  });

  afterAll(async ()=>{
   await mongoose.connection.close();
  })




  describe("get a product route",()=>{
    describe("given the product does not exist",()=>{
      it("should return 404",async()=>{
        const productId='product-123';
        await supertest(app).get(`/api/products/${productId}`).expect(404);
      })
    })
  })



  describe("get a product route",()=>{
    describe("given the product exist",()=>{
      it("should return 200 and the product",async()=>{
        const product=await createProduct(productPayload);

       const {body, statusCode}= await supertest(app).get(`/api/products/${product.productId}`);

       expect(statusCode).toBe(200);
       expect(body.productId).toBe(product.productId);
      })
    })
  });



  describe("create a product",()=>{
    describe("given a user is not logged in",()=>{
      it("should return 403",async()=>{

        const {statusCode}=await supertest(app).post("/api/products");

        expect(statusCode).toBe(403);

      })
    })
  })

  describe.only("create a product",()=>{
    describe("given a user is logged in",()=>{
      it("should create product",async()=>{
        const jwt=signJwt(userPayload);
        const {statusCode,body}=await supertest(app).post("/api/products").set("Authorization",`Bearer ${jwt}`)
        .send(productPayload);

        expect(statusCode).toBe(200);
   


      })
    })
  })
})