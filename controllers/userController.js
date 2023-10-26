const User = require('../models/User');
const secret = require('../config/auth.json');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');


const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const newpassword = await bcrypt.hash(password, 10);
    await User.create({
        name: name,
        email: email,
        password: newpassword
    }).then(() => {
        res.json('O usuário foi criado');
        console.log('O usuário foi criado');
    }).catch((erro) => {
        res.json('Erro na criação do usuário');
        console.log(`Erro na criação do usuário: ${erro}`);
    })
}
const findUsers = async (req, res) => {
    const users = await User.findAll();
    try {
        res.json(users);
    } catch (error) {
        res.status(404).json("Ocorreu um erro na busca!");
    };
}

const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await User.destroy({
            where: {
                id:id
            }
        }).then(() => {
            res.json("O usuário foi deletado");
        })
    } catch (error) {
        res.status(404).json("Erro ao deletar o usuário");
    }
}
const updateUser = async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;
    try {
        await User.update(
            {
              name: name,
              email: email,
              password: password 
            },
            {
                where: {
                    id: id
                }
            }
        ).then(() => {
            res.json("O usuário foi atualizado");
        })
    } catch (error) {
        res.status(404).json("Erro ao atualizar o usuário");
    }
}
const authenticatedUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUserAuthenticated = await User.findOne({
            where: {
                email:email,
            }
        })
        if(!isUserAuthenticated){
            return res.status(401).send('Email ou senha inválidos');
        }
        const response = await bcrypt.compare(password, newpassword);
        const token = jwt.sign({
            name: isUserAuthenticated.name,
            email: isUserAuthenticated.email
        },
            secret.secret, {
            expiresIn: 86400,
        })
        return res.json({
            name: isUserAuthenticated.name,
            email: isUserAuthenticated.email,
            token: token
        });
    } catch (error) {
        return res.json("Erro de autenticação");
    }
}


module.exports = { createUser, findUsers, deleteUser, updateUser, authenticatedUser };