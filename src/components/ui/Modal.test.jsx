import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, onClick, className, ...props }) => (
            <div
                className={className}
                onClick={onClick}
                data-testid="motion-div"
                {...props}
            >
                {children}
            </div>
        ),
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Modal Component', () => {
    it('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={() => { }} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.queryByText('Test Modal')).toBeNull();
        expect(screen.queryByText('Modal Content')).toBeNull();
    });

    it('renders correctly when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={() => { }} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const onCloseMock = vi.fn();
        render(
            <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        // The close button is the one with the XMarkIcon. 
        // Since we don't have aria-label on the button in the component, we can find by role button.
        // There is only one button in the header.
        const buttons = screen.getAllByRole('button');
        const closeButton = buttons[0]; // The header button comes first

        fireEvent.click(closeButton);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when clicking the backdrop', () => {
        const onCloseMock = vi.fn();
        render(
            <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
                <p>Modal Content</p>
            </Modal>
        );

        // In the mock, the first motion.div is the backdrop (fixed inset-0 bg-black/70)
        // We assigned data-testid="motion-div" to all mocks.
        // The first one in the DOM order inside the root div is the backdrop.
        const motionDivs = screen.getAllByTestId('motion-div');
        const backdrop = motionDivs[0];

        fireEvent.click(backdrop);
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
});
