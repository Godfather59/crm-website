import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

// Implementation test component to consume context
const TestComponent = () => {
    const { user, login, logout } = useContext(AuthContext);
    return (
        <div>
            <div data-testid="user-email">{user ? user.email : 'No User'}</div>
            <button onClick={() => login('test@example.com')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('should provide default null user', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });

    it('should login user', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });

        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });

    it('should logout user', () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login').click();
        });
        expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');

        act(() => {
            screen.getByText('Logout').click();
        });
        expect(screen.getByTestId('user-email')).toHaveTextContent('No User');
    });
});
