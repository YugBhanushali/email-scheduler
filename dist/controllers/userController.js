"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
// import { PrismaClient } from "@prisma/client";
const getUsers = async (req, res) => {
    try {
        // const users = await prisma.user.findMany();
        res.status(200).json({ test: "hello world 12345" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getUsers = getUsers;
