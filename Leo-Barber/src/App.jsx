import { useState } from 'react'
import './App.css'

function App() {
  const [date, setDate] = useState('')
  const [service, setService] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const services = [
    {
      id: 'corte',
      name: 'Corte de cabelo',
      price: 'R$ 35,00',
      duration: '40 min',
      icon: '✂️',
    },
    {
      id: 'barba',
      name: 'Barba',
      price: 'R$ 25,00',
      duration: '30 min',
      icon: '🪒',
    },
    {
      id: 'combo',
      name: 'Corte + Barba',
      price: 'R$ 55,00',
      duration: '1h',
      icon: '💈',
    },
    {
      id: 'sobrancelha',
      name: 'Sobrancelha',
      price: 'R$ 15,00',
      duration: '15 min',
      icon: '✨',
    },
  ]

  const times = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
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
    '18:00',
  ]

  const selectedService = services.find(
    (item) => item.id === service
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (!date || !service || !time || !name || !phone) {
      return
    }

    setShowSuccess(true)
  }

  function closeSuccess() {
    setShowSuccess(false)
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="brand">
          <div className="brand-icon">
            ✂
          </div>

          <div>
            <h1>
              Leo<span> Barber</span>
            </h1>

            <p>BARBEARIA</p>
          </div>
        </div>

        <div className="header-info">
          <span>📍 São Caetano - R. Fonte da Bica de Cima</span>
          <span>🕐 Seg - Sáb: 09h às 19h</span>
        </div>

        <div className="social-header">

          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.83c0 2.08.54 4.1 1.57 5.89L.14 24l6.43-1.64a11.82 11.82 0 0 0 5.5 1.4h.01c6.52 0 11.83-5.31 11.83-11.83 0-3.16-1.23-6.13-3.41-8.43ZM12.08 21.8a9.92 9.92 0 0 1-5.06-1.38l-.36-.21-3.82.98 1.02-3.72-.23-.38a9.9 9.9 0 1 1 8.45 4.71Z" />
            </svg>
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Z" />
            </svg>
          </a>

        </div>

      </header>

      {/* MAIN */}
      <main className="main">

        <div className="page-title">

          <span>
            AGENDE SEU HORÁRIO
          </span>

          <h2>
            Seu próximo corte
            <br />
            começa aqui.
          </h2>

          <p>
            Escolha o serviço, data e horário que deseja.
          </p>

        </div>

        <form
          className="booking-card"
          onSubmit={handleSubmit}
        >

          <div className="booking-content">

            {/* SERVIÇO */}
            <section className="form-section">

              <div className="section-title">

                <div className="number">
                  01
                </div>

                <div>
                  <h3>
                    Escolha o serviço
                  </h3>

                  <p>
                    Selecione o serviço que deseja realizar.
                  </p>
                </div>

              </div>

              <div className="services">

                {services.map((item) => (

                  <button
                    type="button"
                    key={item.id}
                    className={`service ${
                      service === item.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setService(item.id)
                    }
                  >

                    <div className="service-icon">
                      {item.icon}
                    </div>

                    <div className="service-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        {item.duration}
                      </span>

                    </div>

                    <strong className="price">
                      {item.price}
                    </strong>

                  </button>

                ))}

              </div>

            </section>

            {/* DATA E HORÁRIO */}
            <section className="form-section">

              <div className="section-title">

                <div className="number">
                  02
                </div>

                <div>
                  <h3>
                    Data e horário
                  </h3>

                  <p>
                    Escolha o melhor dia e horário para você.
                  </p>
                </div>

              </div>

              <div className="date-area">

                <label htmlFor="date">
                  Data do atendimento
                </label>

                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  min={
                    new Date()
                      .toISOString()
                      .split('T')[0]
                  }
                />

              </div>

              <div className="time-area">

                <label>
                  Horários disponíveis
                </label>

                <div className="times">

                  {times.map((item) => (

                    <button
                      type="button"
                      key={item}
                      className={
                        time === item
                          ? 'selected'
                          : ''
                      }
                      onClick={() =>
                        setTime(item)
                      }
                    >
                      {item}
                    </button>

                  ))}

                </div>

              </div>

            </section>

            {/* DADOS DO CLIENTE */}
            <section className="form-section">

              <div className="section-title">

                <div className="number">
                  03
                </div>

                <div>
                  <h3>
                    Seus dados
                  </h3>

                  <p>
                    Precisamos dessas informações para confirmar.
                  </p>
                </div>

              </div>

              <div className="customer-form">

                <div className="input-group">

                  <label htmlFor="name">
                    Nome completo
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                  />

                </div>

                <div className="input-group">

                  <label htmlFor="phone">
                    Telefone
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                  />

                </div>

              </div>

            </section>

          </div>

          {/* RESUMO */}
          <aside className="summary">

            <div className="summary-header">

              <span>
                SEU AGENDAMENTO
              </span>

              <h3>
                Resumo
              </h3>

            </div>

            <div className="summary-line">

              <span>
                Serviço
              </span>

              <strong>
                {selectedService?.name ||
                  'Não selecionado'}
              </strong>

            </div>

            <div className="summary-line">

              <span>
                Data
              </span>

              <strong>
                {date || 'Não selecionada'}
              </strong>

            </div>

            <div className="summary-line">

              <span>
                Horário
              </span>

              <strong>
                {time || 'Não selecionado'}
              </strong>

            </div>

            <div className="summary-line">

              <span>
                Cliente
              </span>

              <strong>
                {name || 'Não informado'}
              </strong>

            </div>

            <div className="summary-divider" />

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                {selectedService?.price ||
                  'R$ 0,00'}
              </strong>

            </div>

            <button
              className="submit-button"
              type="submit"
            >
              Confirmar agendamento

              <span>
                →
              </span>

            </button>

            <p className="secure">
              🔒 Seus dados estão seguros
            </p>

          </aside>

        </form>

      </main>

      {/* FOOTER */}
      <footer>

        <div>

          <strong>
            BarberHouse
          </strong>

          <span>
            © 2026 — Todos os direitos reservados.
          </span>

        </div>

        <div className="footer-social">

          <span>
            Fale conosco:
          </span>

          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.83c0 2.08.54 4.1 1.57 5.89L.14 24l6.43-1.64a11.82 11.82 0 0 0 5.5 1.4h.01c6.52 0 11.83-5.31 11.83-11.83 0-3.16-1.23-6.13-3.41-8.43Z" />
            </svg>

            WhatsApp
          </a>

          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Z" />
            </svg>

            Instagram
          </a>

        </div>

      </footer>

      {/* POPUP DE SUCESSO */}
      {showSuccess && (

        <div
          className="success-overlay"
          onClick={closeSuccess}
        >

          <div
            className="success-popup"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="close-popup"
              onClick={closeSuccess}
              aria-label="Fechar"
            >
              ×
            </button>

            <div className="success-icon">
              ✓
            </div>

            <span className="success-label">
              AGENDAMENTO CONFIRMADO
            </span>

            <h2>
              Tudo certo!
            </h2>

            <p>
              Seu horário foi reservado com sucesso.
            </p>

            <div className="success-details">

              <div>
                <span>
                  Serviço
                </span>

                <strong>
                  {selectedService?.name}
                </strong>
              </div>

              <div>
                <span>
                  Data
                </span>

                <strong>
                  {date}
                </strong>
              </div>

              <div>
                <span>
                  Horário
                </span>

                <strong>
                  {time}
                </strong>
              </div>

              <div>
                <span>
                  Cliente
                </span>

                <strong>
                  {name}
                </strong>
              </div>

            </div>

            <div className="success-whatsapp">

              <svg viewBox="0 0 24 24">
                <path d="M20.5 3.5A11.8 11.8 0 0 0 12.08 0C5.55 0 .24 5.3.24 11.83c0 2.08.54 4.1 1.57 5.89L.14 24l6.43-1.64a11.82 11.82 0 0 0 5.5 1.4h.01c6.52 0 11.83-5.31 11.83-11.83 0-3.16-1.23-6.13-3.41-8.43Z" />
              </svg>

              <span>
                Enviaremos a confirmação pelo WhatsApp.
              </span>

            </div>

            <button
              className="success-button"
              onClick={closeSuccess}
            >
              Fechar
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default App