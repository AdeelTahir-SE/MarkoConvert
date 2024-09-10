import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./authentication.js";
const prisma =new PrismaClient();

export async function createUser(user){
    return await prisma.user.create({
        data:{
            email:user.email,
            password:user.password
        }
    });

}

export async function createMarkdown(markdown,id){
    return await prisma.markdown.create({
        data:{
            content:markdown.content,
            userId:id
        }
    });
}

export async function getMarkdowns(id){
    return await prisma.markdown.findMany({
        where:{
            userId:id
        }
    });
}
export async function getUserByEmail(email){
    console.log(email)
    return await prisma.user.findUnique({
        where:{
            email:email
        }
    });
}

export async function login(user){
    const User =await prisma.user.findUnique({
        where:{
            email:user.email,
        }
    });
    if(User.password == hashPassword(user.password)){
        return true;
    }
    return false;
}