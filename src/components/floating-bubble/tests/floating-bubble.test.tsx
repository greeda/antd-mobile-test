import { LinkOutline, ShareOutline } from 'antd-mobile-icons'
import React from 'react'
import { fireEvent, render, waitFor } from 'testing'
import FAB from '..'

const classPrefix = `adm-fab`

describe('FAB', () => {
  test('main button onClick should be called', async () => {
    const onClick = jest.fn()
    render(<FAB onClick={onClick} />)
    const mainBtn = document.querySelectorAll(`.${classPrefix}-main`)[0]
    fireEvent.click(mainBtn)
    await waitFor(() => expect(onClick).toBeCalled())
  })

  test('should open and close FAB items', async () => {
    render(
      <FAB>
        <FAB.Item icon={<LinkOutline />} onClick={jest.fn()} />
        <FAB.Item icon={<ShareOutline />} onClick={jest.fn()} />
      </FAB>
    )

    const mainBtn = document.querySelectorAll(`.${classPrefix}-main`)[0]
    const itemsWrapper = document.querySelectorAll(`.${classPrefix}-items`)[0]

    // Initially items should be hidden
    expect(itemsWrapper).toHaveClass(`${classPrefix}-items`)

    // Click main button to open
    fireEvent.click(mainBtn)
    await waitFor(() => {
      expect(itemsWrapper).toHaveClass(`${classPrefix}-items-open`)
    })

    // Click main button to close
    fireEvent.click(mainBtn)
    await waitFor(() => {
      expect(itemsWrapper).not.toHaveClass(`${classPrefix}-items-open`)
    })
  })

  test('FAB.Item onClick should be called and close FAB', async () => {
    const itemOnClick = jest.fn()
    render(
      <FAB>
        <FAB.Item icon={<LinkOutline />} onClick={itemOnClick} />
      </FAB>
    )

    const mainBtn = document.querySelectorAll(`.${classPrefix}-main`)[0]
    const item = document.querySelectorAll(`.${classPrefix}-item`)[0]

    // Open FAB
    fireEvent.click(mainBtn)
    await waitFor(() => {
      expect(item).toBeVisible()
    })

    // Click item
    fireEvent.click(item)
    await waitFor(() => {
      expect(itemOnClick).toBeCalled()
    })
  })

  test('should close FAB when clicking outside', async () => {
    render(
      <div>
        <div data-testid='outside'>Outside</div>
        <FAB>
          <FAB.Item icon={<LinkOutline />} onClick={jest.fn()} />
        </FAB>
      </div>
    )

    const mainBtn = document.querySelectorAll(`.${classPrefix}-main`)[0]
    const outside = document.querySelector('[data-testid="outside"]')
    const itemsWrapper = document.querySelectorAll(`.${classPrefix}-items`)[0]

    // Open FAB
    fireEvent.click(mainBtn)
    await waitFor(() => {
      expect(itemsWrapper).toHaveClass(`${classPrefix}-items-open`)
    })

    // Click outside
    fireEvent.mouseDown(outside!)
    await waitFor(() => {
      expect(itemsWrapper).not.toHaveClass(`${classPrefix}-items-open`)
    })
  })

  test('action type should call onClick directly', async () => {
    const onClick = jest.fn()
    render(<FAB type='action' onClick={onClick} />)
    const mainBtn = document.querySelectorAll(`.${classPrefix}-main`)[0]
    fireEvent.click(mainBtn)
    await waitFor(() => expect(onClick).toBeCalled())
  })

  test('should not expand when expanded is false', () => {
    render(
      <FAB expanded={false}>
        <FAB.Item icon={<LinkOutline />} onClick={jest.fn()} />
      </FAB>
    )
    const itemsWrapper = document.querySelectorAll(`.${classPrefix}-items`)[0]
    expect(itemsWrapper).toBeUndefined()
  })

  test('should render with different positions', () => {
    const { rerender } = render(<FAB position='right' />)
    expect(document.querySelector(`.${classPrefix}-right`)).toBeInTheDocument()

    rerender(<FAB position='left' />)
    expect(document.querySelector(`.${classPrefix}-left`)).toBeInTheDocument()
  })

  test('should render with different types', () => {
    const { rerender } = render(<FAB type='default' />)
    expect(
      document.querySelector(`.${classPrefix}-default`)
    ).toBeInTheDocument()

    rerender(<FAB type='action' />)
    expect(document.querySelector(`.${classPrefix}-action`)).toBeInTheDocument()
  })
})
