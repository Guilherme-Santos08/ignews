import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/',
      }
    },
  }
})

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    },
  }
})

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />)

    // Podemos descobrir probriedades que possar ser usada em nossos teste usando o link que o código abaixo vai gerar no nosso terminal
    screen.logTestingPlaygroundURL()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})
