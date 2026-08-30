import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://192.168.1.16:3000'

const horariosDisponiveis = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
]

const servicos = [
  {
    nome: 'Corte de cabelo',
    preco: 'R$ 35,00'
  },
  {
    nome: 'Barba',
    preco: 'R$ 25,00'
  },
  {
    nome: 'Corte + Barba',
    preco: 'R$ 55,00'
  },
  {
    nome: 'Corte infantil',
    preco: 'R$ 30,00'
  }
]

function App() {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [servico, setServico] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')

  const [horariosOcupados, setHorariosOcupados] = useState([])

  const [carregandoHorarios, setCarregandoHorarios] = useState(false)
  const [enviando, setEnviando] = useState(false)

  const [popup, setPopup] = useState(false)
  const [mensagemErro, setMensagemErro] = useState('')

  function obterDataMinima() {
    const hoje = new Date()

    const ano = hoje.getFullYear()
    const mes = String(hoje.getMonth() + 1).padStart(2, '0')
    const dia = String(hoje.getDate()).padStart(2, '0')

    return `${ano}-${mes}-${dia}`
  }

  useEffect(() => {
    if (!data) {
      setHorariosOcupados([])
      setHorario('')
      return
    }

    async function buscarHorarios() {
      setCarregandoHorarios(true)
      setHorario('')
      setMensagemErro('')

      try {
        const resposta = await fetch(
          `${API_URL}/api/agendamentos/ocupados?data=${data}`
        )

        if (!resposta.ok) {
          throw new Error(
            'Não foi possível consultar os horários.'
          )
        }

        const dados = await resposta.json()

        setHorariosOcupados(dados.horarios || [])
      } catch (error) {
        console.error(error)

        setMensagemErro(
          'Não foi possível carregar os horários. Verifique se o servidor está funcionando.'
        )

        setHorariosOcupados([])
      } finally {
        setCarregandoHorarios(false)
      }
    }

    buscarHorarios()
  }, [data])

  function selecionarHorario(hora) {
    if (horariosOcupados.includes(hora)) {
      return
    }

    setHorario(hora)
    setMensagemErro('')
  }

  async function fazerAgendamento(event) {
    event.preventDefault()

    setMensagemErro('')

    if (!nome.trim()) {
      setMensagemErro('Digite seu nome.')
      return
    }

    if (!telefone.trim()) {
      setMensagemErro('Digite seu telefone.')
      return
    }

    if (!servico) {
      setMensagemErro('Escolha um serviço.')
      return
    }

    if (!data) {
      setMensagemErro('Escolha uma data.')
      return
    }

    if (!horario) {
      setMensagemErro('Escolha um horário.')
      return
    }

    if (horariosOcupados.includes(horario)) {
      setMensagemErro(
        'Esse horário acabou de ser ocupado. Escolha outro.'
      )
      return
    }

    setEnviando(true)

    try {
      const resposta = await fetch(
        `${API_URL}/api/agendamentos`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome,
            telefone,
            servico,
            data,
            horario
          })
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(
          dados.message ||
          'Erro ao realizar o agendamento.'
        )
      }

      setPopup(true)

      setHorariosOcupados((horarios) => [
        ...horarios,
        horario
      ])

      setHorario('')
      setNome('')
      setTelefone('')
      setServico('')
    } catch (error) {
      console.error(error)

      setMensagemErro(
        error.message ||
        'Não foi possível realizar o agendamento.'
      )
    } finally {
      setEnviando(false)
    }
  }

  function fecharPopup() {
    setPopup(false)
  }

  function abrirWhatsApp() {
    const numero = '5500000000000'

    const mensagem =
      'Olá! Gostaria de falar com a Leo Barber.'

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
      '_blank'
    )
  }

  function abrirInstagram() {
    window.open(
      'https://instagram.com/',
      '_blank'
    )
  }

  return (
    <main className="app">

      <header className="header">
        <div className="logo">
          <span>LEO</span>
          <strong>BARBER</strong>
        </div>

        <div className="header-contact">

          <button
            type="button"
            onClick={abrirWhatsApp}
            className="contact-button whatsapp"
            aria-label="Falar pelo WhatsApp"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.8 11.8 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.6 5.92L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.59 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.14-3.44-8.41ZM12.1 21.7h-.01a9.82 9.82 0 0 1-5.01-1.37l-.36-.21-3.77.99 1.01-3.68-.23-.38a9.8 9.8 0 0 1-1.5-5.19C2.23 6.44 6.66 2 12.1 2c2.64 0 5.12 1.03 6.98 2.9a9.8 9.8 0 0 1 2.89 6.97c0 5.44-4.43 9.83-9.87 9.83Zm5.39-7.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={abrirInstagram}
            className="contact-button instagram"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
              />

              <circle
                cx="12"
                cy="12"
                r="4"
              />

              <circle
                cx="17.5"
                cy="6.5"
                r="1"
              />
            </svg>
          </button>

        </div>
      </header>

      <section className="hero-section">

        <div className="hero-content">

          <p className="eyebrow">
            LEO BARBER
          </p>

          <h1>
            Seu estilo.
            <br />
            Seu momento.
          </h1>

          <p className="hero-description">
            Agende seu horário de forma rápida
            e garanta seu atendimento.
          </p>

          <a
            href="#agendamento"
            className="hero-button"
          >
            Agendar agora
          </a>

        </div>

        <div className="hero-decoration">
          <div className="scissors">
            ✂
          </div>
        </div>

      </section>

      <section
        id="agendamento"
        className="booking-section"
      >

        <div className="booking-header">

          <p className="eyebrow">
            AGENDAMENTO
          </p>

          <h2>
            Reserve seu horário
          </h2>

          <p>
            Escolha o serviço, a data e o
            melhor horário para você.
          </p>

        </div>

        <form
          className="booking-form"
          onSubmit={fazerAgendamento}
        >

          <div className="form-group">

            <label htmlFor="nome">
              Seu nome
            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) =>
                setNome(event.target.value)
              }
              placeholder="Digite seu nome"
              autoComplete="name"
            />

          </div>

          <div className="form-group">

            <label htmlFor="telefone">
              WhatsApp
            </label>

            <input
                  id="telefone"
                  type="tel"
                  inputMode="numeric"
                  value={telefone}
                  onChange={(event) => {
                    const apenasNumeros = event.target.value.replace(/\D/g, '')
                    setTelefone(apenasNumeros)
                  }}
                  placeholder="Digite seu número"
                  autoComplete="tel"
/>

          </div>

          <div className="form-group">

            <label htmlFor="servico">
              Serviço
            </label>

            <select
              id="servico"
              value={servico}
              onChange={(event) =>
                setServico(event.target.value)
              }
            >

              <option value="">
                Selecione um serviço
              </option>

              {servicos.map((item) => (
                <option
                  key={item.nome}
                  value={item.nome}
                >
                  {item.nome} — {item.preco}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label htmlFor="data">
              Data
            </label>

            <input
              id="data"
              type="date"
              min={obterDataMinima()}
              value={data}
              onChange={(event) =>
                setData(event.target.value)
              }
            />

          </div>

          <div className="form-group time-group">

            <label>
              Horário
            </label>

            {!data && (
              <div className="empty-message">
                Escolha uma data primeiro.
              </div>
            )}

            {data && carregandoHorarios && (
              <div className="empty-message">
                Carregando horários...
              </div>
            )}

            {data && !carregandoHorarios && (
              <div className="time-grid">

                {horariosDisponiveis.map((hora) => {

                  const ocupado =
                    horariosOcupados.includes(hora)

                  const selecionado =
                    horario === hora

                  return (
                    <button
                      key={hora}
                      type="button"
                      disabled={ocupado}
                      className={
                        `time-button ${
                          ocupado
                            ? 'occupied'
                            : ''
                        } ${
                          selecionado
                            ? 'selected'
                            : ''
                        }`
                      }
                      onClick={() =>
                        selecionarHorario(hora)
                      }
                    >
                      {hora}
                    </button>
                  )
                })}

              </div>
            )}

          </div>

          {mensagemErro && (
            <div className="error-message">
              {mensagemErro}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={enviando}
          >
            {enviando
              ? 'Agendando...'
              : 'Confirmar agendamento'}
          </button>

        </form>

      </section>

      <section className="contact-section">

        <div>

          <p className="eyebrow">
            FALE CONOSCO
          </p>

          <h2>
            Ficou com alguma dúvida?
          </h2>

          <p>
            Entre em contato pelas nossas
            redes sociais.
          </p>

        </div>

        <div className="social-buttons">

          <button
            type="button"
            onClick={abrirWhatsApp}
            className="social-button"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={abrirInstagram}
            className="social-button"
          >
            Instagram
          </button>

        </div>

      </section>

      <footer className="footer">

        <div className="logo">
          <span>LEO</span>
          <strong>BARBER</strong>
        </div>

        <p>
          © {new Date().getFullYear()}
          {' '}
          Leo Barber. Todos os direitos
          reservados.
        </p>

      </footer>

      {popup && (
        <div
          className="popup-overlay"
          onClick={fecharPopup}
        >

          <div
            className="success-popup"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Agendamento confirmado!
            </h2>

            <p>
              Seu horário foi reservado
              com sucesso.
            </p>

            <button
              type="button"
              onClick={fecharPopup}
              className="popup-button"
            >
              Fechar
            </button>

          </div>

        </div>
      )}

    </main>
  )
}

export default App