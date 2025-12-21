import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VideoModal from '../VideoModal'

describe('VideoModal', () => {
  const mockOnClose = jest.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<VideoModal {...defaultProps} />)
    
    expect(screen.getByText('DayCare Concierge Demo')).toBeInTheDocument()
    expect(screen.getByText('Loading video...')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<VideoModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('DayCare Concierge Demo')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<VideoModal {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: 'Close video modal' })
    await user.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside modal', async () => {
    const user = userEvent.setup()
    render(<VideoModal {...defaultProps} />)
    
    const modalOverlay = screen.getByRole('dialog')
    await user.click(modalOverlay)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('shows video controls', () => {
    render(<VideoModal {...defaultProps} />)
    
    expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mute video/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /restart video/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /toggle fullscreen/i })).toBeInTheDocument()
  })

  it('shows progress bar', () => {
    render(<VideoModal {...defaultProps} />)
    
    const progressBar = screen.getByRole('slider', { name: /video progress/i })
    expect(progressBar).toBeInTheDocument()
  })

  it('shows video information', () => {
    render(<VideoModal {...defaultProps} />)
    
    expect(screen.getByText('DayCare Concierge Demo')).toBeInTheDocument()
    expect(screen.getByText('Loading video...')).toBeInTheDocument()
  })
})
