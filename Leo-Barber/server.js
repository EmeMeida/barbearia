import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'barbearia',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

async function testarBanco() {
  try {
    const connection = await pool.getConnection()

    console.log('MySQL conectado com sucesso!')
    console.log(`Banco: ${process.env.DB_NAME || 'barbearia'}`)

    connection.release()
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:')
    console.error(error.message)
  }
}

app.get('/api/status', async (req, res) => {
  try {
    await pool.query('SELECT 1')

    res.json({
      online: true,
      mysql: true,
      message: 'Servidor e MySQL funcionando!'
    })
  } catch (error) {
    console.error('Erro no MySQL:')
    console.error(error.message)

    res.status(500).json({
      online: true,
      mysql: false,
      message: 'Servidor funcionando, mas MySQL com erro.',
      error: error.message
    })
  }
})

app.get('/api/agendamentos/ocupados', async (req, res) => {
  const { data } = req.query

  if (!data) {
    return res.status(400).json({
      message: 'Data não informada.'
    })
  }

  try {
    const [resultados] = await pool.query(
      `
      SELECT horario
      FROM agendamentos
      WHERE data_agendamento = ?
      ORDER BY horario ASC
      `,
      [data]
    )

    const horarios = resultados.map(
      agendamento => {
        if (agendamento.horario instanceof Date) {
          return agendamento.horario
            .toTimeString()
            .slice(0, 5)
        }

        return String(agendamento.horario).slice(0, 5)
      }
    )

    res.json({
      data,
      horarios
    })
  } catch (error) {
    console.error('Erro ao buscar horários:')
    console.error(error)

    res.status(500).json({
      message: 'Erro ao buscar horários.',
      error: error.message
    })
  }
})

app.post('/api/agendamentos', async (req, res) => {
  const {
    nome,
    telefone,
    servico,
    data,
    horario
  } = req.body

  if (
    !nome ||
    !telefone ||
    !servico ||
    !data ||
    !horario
  ) {
    return res.status(400).json({
      message: 'Todos os campos são obrigatórios.'
    })
  }

  try {
    const [horarioExistente] = await pool.query(
      `
      SELECT id
      FROM agendamentos
      WHERE data_agendamento = ?
      AND horario = ?
      LIMIT 1
      `,
      [data, horario]
    )

    if (horarioExistente.length > 0) {
      return res.status(409).json({
        message: 'Esse horário já está ocupado.'
      })
    }

    const [resultado] = await pool.query(
      `
      INSERT INTO agendamentos
      (
        nome,
        telefone,
        servico,
        data_agendamento,
        horario
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        nome,
        telefone,
        servico,
        data,
        horario
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Agendamento realizado com sucesso!',
      id: resultado.insertId
    })
  } catch (error) {
    console.error('Erro ao salvar agendamento:')
    console.error(error)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Esse horário já está ocupado.'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao salvar o agendamento.',
      error: error.message
    })
  }
})

app.get('/api/agendamentos', async (req, res) => {
  try {
    const [agendamentos] = await pool.query(
      `
      SELECT
        id,
        nome,
        telefone,
        servico,
        data_agendamento,
        horario,
        criado_em
      FROM agendamentos
      ORDER BY data_agendamento ASC, horario ASC
      `
    )

    res.json(agendamentos)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:')
    console.error(error)

    res.status(500).json({
      message: 'Erro ao buscar agendamentos.',
      error: error.message
    })
  }
})

app.delete('/api/agendamentos/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [resultado] = await pool.query(
      `
      DELETE FROM agendamentos
      WHERE id = ?
      `,
      [id]
    )

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Agendamento não encontrado.'
      })
    }

    res.json({
      success: true,
      message: 'Agendamento excluído com sucesso.'
    })
  } catch (error) {
    console.error('Erro ao excluir agendamento:')
    console.error(error)

    res.status(500).json({
      message: 'Erro ao excluir agendamento.',
      error: error.message
    })
  }
})

app.listen(PORT, '0.0.0.0', async () => {
  console.log('')
  console.log('======================================')
  console.log('           LEO BARBER')
  console.log('======================================')
  console.log(`Servidor: http://localhost:${PORT}`)
  console.log(`Rede: http://0.0.0.0:${PORT}`)
  console.log(`Status: http://localhost:${PORT}/api/status`)
  console.log(`Banco: ${process.env.DB_NAME || 'barbearia'}`)
  console.log('======================================')
  console.log('')

  await testarBanco()
})