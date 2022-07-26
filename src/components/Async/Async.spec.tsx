import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import { Async } from '.'

// https://testing-library.com/docs/dom-testing-library/api-async

test('it renders correctly', async () => {
  render(<Async />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()
  // Existe três formas para mostrar componentes async no jest
  //1) expect(await screen.findByText('Button', {}, {timeout: 3000})).toBeInTheDocument()

  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument()
  })

  // waitForElementToBeRemoved vai verificar se o item 'Button' foi removido da tela corretamente
  // await waitForElementToBeRemoved(screen.queryByText('Button'))
})
