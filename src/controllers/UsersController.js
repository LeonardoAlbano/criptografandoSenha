// Importar o criptografar a senha 
const { hash } = require("bcryptjs")


// Importa a classe "AppError" definida no arquivo "../utils/AppError".
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite")

class UsersController {
  /**
   *  Index - GET para listar vários registros
   *  Show - GET para exibir um registro específico 
   *  Create - POST para criar um registro
   *  Update - PUT para atualizar um registro
   *  Delete - DELETE para remover um registro
   */

  async create(request, response) {
    // Extrai os dados do corpo da requisição, que são esperados estar no formato JSON.
    const { name, email, password } = request.body;
  
    // Conecta ao banco de dados SQLite.
    const database = await sqliteConnection();
  
    // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
  
    // Se o usuário já existe, lança um erro.
    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // Hash da senha usando bcrypt (com custo de 8 rounds).
    const hashedPassword = await hash(password, 8);


    // Inserir na tabela de usuários DB
    await database.run("INSERT INTO users(name, email, password) VALUES (?, ?, ?)",
    [ name, email, hashedPassword ]
    );
  
    // Se o usuário não existe, retorna uma resposta de sucesso (status 201).
    return response.status(201).json();
  }
  
}

module.exports = UsersController;
